import fs from "node:fs/promises";
import process from "node:process";

const config = JSON.parse(
  await fs.readFile(new URL("../publication-config.json", import.meta.url), "utf8")
);

const ORCID = config.orcid;
const CLIENT_ID = process.env.ORCID_CLIENT_ID;
const CLIENT_SECRET = process.env.ORCID_CLIENT_SECRET;
const OPENALEX_MAILTO = config.openAlexMailto || "e.spierings@umcutrecht.nl";

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "ORCID_CLIENT_ID and ORCID_CLIENT_SECRET must be configured as GitHub repository secrets."
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeHtmlEntities(value = "") {
  const namedEntities = {
    amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"',
    ndash: "–", mdash: "—", hellip: "…", alpha: "α", beta: "β",
    gamma: "γ", delta: "δ", mu: "μ"
  };

  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16))
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10))
    )
    .replace(/&([a-z]+);/gi, (match, entity) =>
      namedEntities[entity.toLowerCase()] ?? match
    );
}

function cleanText(value = "") {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value = "") {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function textValue(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "value" in value) return value.value || "";
  return "";
}

function dateParts(publicationDate) {
  const year = textValue(publicationDate?.year);
  const month = textValue(publicationDate?.month).padStart(2, "0") || "00";
  const day = textValue(publicationDate?.day).padStart(2, "0") || "00";
  return {
    year: year ? Number(year) : null,
    sortDate: year ? `${year}-${month}-${day}` : "0000-00-00"
  };
}

function normalizeDoi(value = "") {
  return String(value)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .toLowerCase();
}

function normalizePmcid(value = "") {
  const cleaned = String(value).trim().toUpperCase();
  if (!cleaned) return "";
  return cleaned.startsWith("PMC") ? cleaned : `PMC${cleaned}`;
}

function externalIds(work) {
  const ids = work?.["external-ids"]?.["external-id"] || [];
  const result = {};
  for (const id of ids) {
    const type = String(id["external-id-type"] || "").toLowerCase();
    const value = cleanText(textValue(id["external-id-value"]));
    if (type && value && !result[type]) result[type] = value;
  }
  return result;
}

function categoryFor(title, journal, type, keywords = []) {
  const text = cleanText(`${title} ${journal} ${type} ${keywords.join(" ")}`).toLowerCase();
  const categories = [];
  if (/(pirche|epitope|molecular mismatch|hla matching|compatibility)/.test(text)) categories.push("matching");
  if (/(graft failure|rejection|survival|outcome|mortality|relapse|graft-versus-host)/.test(text)) categories.push("outcome");
  if (/(diagnostic|typing|antibod|assay|screening|genetic|sequencing|laboratory)/.test(text)) categories.push("diagnostics");
  if (/(standard|guideline|reporting|hla-ml|hml|haml|gl string|data exchange|interoperab)/.test(text)) categories.push("standards");
  if (/(t cell|minor histocompatibility|cellular|single-cell|nk cell|immune monitoring)/.test(text)) categories.push("cellular");
  return [...new Set(categories.length ? categories : ["other"])];
}

function categoryLabel(category) {
  return {
    matching: "Epitope matching",
    outcome: "Outcome",
    diagnostics: "Diagnostics",
    standards: "Standards",
    cellular: "Cellular immunology",
    other: "Other"
  }[category] || "Other";
}

async function fetchJson(url, options = {}, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response.json();
      if (response.status === 404) return null;
      if (response.status === 429 || response.status >= 500) {
        await sleep(500 * attempt);
        continue;
      }
      throw new Error(`${response.status} ${await response.text()}`);
    } catch (error) {
      lastError = error;
      await sleep(500 * attempt);
    }
  }
  console.warn(`Request failed: ${url}`, lastError?.message || lastError);
  return null;
}

async function getToken() {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "/read-public"
  });

  const response = await fetch("https://orcid.org/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`ORCID token request failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()).access_token;
}

async function orcidGet(path, token) {
  const response = await fetch(`https://pub.orcid.org/v3.0/${ORCID}/${path}`, {
    headers: {
      Accept: "application/vnd.orcid+json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`ORCID request failed for ${path}: ${response.status}`);
  return response.json();
}

async function crossrefMetadata(doi) {
  if (!doi) return null;
  return fetchJson(
    `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
    {
      headers: {
        "User-Agent": `EricSpieringsPublications/2.0 (mailto:${OPENALEX_MAILTO})`
      }
    }
  ).then((data) => data?.message || null);
}

async function europePmcMetadata({ pmid, doi }) {
  if (!pmid && !doi) return null;
  const query = pmid ? `EXT_ID:${pmid}` : `DOI:"${doi}"`;
  const url =
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}` +
    `&format=json&pageSize=1&resultType=core`;
  const data = await fetchJson(url, {
    headers: {
      "User-Agent": `EricSpieringsPublications/2.0 (mailto:${OPENALEX_MAILTO})`
    }
  });
  return data?.resultList?.result?.[0] || null;
}

async function openAlexMetadata(doi) {
  if (!doi) return null;
  const url =
    `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}` +
    `?mailto=${encodeURIComponent(OPENALEX_MAILTO)}`;
  return fetchJson(url, {
    headers: {
      "User-Agent": `EricSpieringsPublications/2.0 (mailto:${OPENALEX_MAILTO})`
    }
  });
}

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) words[position] = word;
  }
  return cleanText(words.filter(Boolean).join(" "));
}

function crossrefAuthors(message) {
  return (message?.author || []).map((author) => ({
    name: [cleanText(author.given || ""), cleanText(author.family || "")]
      .filter(Boolean).join(" "),
    orcid: cleanText(author.ORCID || ""),
    corresponding: Boolean(author.sequence === "first" && author.authenticated_orcid)
  })).filter((author) => author.name);
}

function europePmcAuthors(record) {
  const authorString = cleanText(record?.authorString || "");
  if (!authorString) return [];
  return authorString.split(/\s*,\s*/).map((name) => ({ name: cleanText(name) })).filter((a) => a.name);
}

function openAlexAuthors(record) {
  return (record?.authorships || []).map((authorship) => ({
    name: cleanText(authorship.author?.display_name || ""),
    orcid: cleanText(authorship.author?.orcid || ""),
    position: authorship.author_position || "",
    corresponding: Boolean(authorship.is_corresponding),
    institutions: (authorship.institutions || []).map((i) => cleanText(i.display_name)).filter(Boolean)
  })).filter((author) => author.name);
}

function crossrefDate(message) {
  const parts =
    message?.["published-print"]?.["date-parts"]?.[0] ||
    message?.["published-online"]?.["date-parts"]?.[0] ||
    message?.issued?.["date-parts"]?.[0] || [];
  if (!parts.length) return null;
  const [year, month = 0, day = 0] = parts;
  return {
    year,
    sortDate: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  };
}

function findKeyConfig(title) {
  const normalized = normalizeTitle(title);
  return (config.keyWorks || []).find((item) =>
    normalized.includes(normalizeTitle(item.titleContains))
  );
}

function journalImpactFactor(journal) {
  if (!journal) return null;
  const normalized = cleanText(journal).toLowerCase();
  for (const [name, value] of Object.entries(config.journalImpactFactors || {})) {
    if (normalized === cleanText(name).toLowerCase()) return value;
  }
  return null;
}

function detectSelfAuthorPositions(authors) {
  const positions = new Set();
  authors.forEach((author, index) => {
    const isSelf =
      /0000-0001-9441-1019/.test(author.orcid || "") ||
      /\b(eric\s+spierings|spierings\s+e(?:ric)?|e\.?\s*spierings)\b/i.test(author.name || "");
    if (!isSelf) return;
    if (author.position) positions.add(author.position);
    else if (index === 0) positions.add("first");
    else if (index === authors.length - 1) positions.add("last");
    else positions.add("middle");
    if (author.corresponding) positions.add("corresponding");
  });
  return [...positions];
}

console.log(`Loading ORCID works for ${ORCID}...`);
const token = await getToken();
const summary = await orcidGet("works", token);
const groups = summary.group || [];
const records = [];
console.log(`ORCID returned ${groups.length} work groups.`);

for (let index = 0; index < groups.length; index += 1) {
  const summaries = groups[index]["work-summary"] || [];
  if (!summaries.length) continue;

  const preferred =
    summaries.find((item) => item["source"]?.["source-orcid"]?.path === ORCID) ||
    summaries[0];

  const putCode = preferred["put-code"];
  const fullWork = await orcidGet(`work/${putCode}`, token);
  const ids = externalIds(fullWork);
  const doi = normalizeDoi(ids.doi || "");
  const initialPmid = cleanText(ids.pmid || "");

  const [crossref, europePmc, openAlex] = await Promise.all([
    crossrefMetadata(doi),
    europePmcMetadata({ pmid: initialPmid, doi }),
    openAlexMetadata(doi)
  ]);

  const orcidTitle = cleanText(textValue(fullWork?.title?.title));
  const title = cleanText(
    crossref?.title?.[0] ||
    europePmc?.title ||
    openAlex?.title ||
    orcidTitle ||
    "Untitled work"
  );

  const journal = cleanText(
    crossref?.["container-title"]?.[0] ||
    europePmc?.journalTitle ||
    openAlex?.primary_location?.source?.display_name ||
    textValue(fullWork?.["journal-title"]) ||
    ""
  );

  const orcidDate = dateParts(fullWork?.["publication-date"]);
  const crDate = crossrefDate(crossref);
  const date = crDate || orcidDate;

  const oaAuthors = openAlexAuthors(openAlex);
  const crAuthors = crossrefAuthors(crossref);
  const epmcAuthors = europePmcAuthors(europePmc);
  const authors = oaAuthors.length ? oaAuthors : crAuthors.length ? crAuthors : epmcAuthors;

  const pmid = initialPmid || cleanText(europePmc?.pmid || "");
  const pmcid = normalizePmcid(europePmc?.pmcid || "");
  const abstract = cleanText(
    europePmc?.abstractText ||
    reconstructAbstract(openAlex?.abstract_inverted_index) ||
    ""
  );

  const meshTerms = (europePmc?.meshHeadingList?.meshHeading || [])
    .map((entry) => cleanText(entry.descriptorName || entry.majorTopic_YN || ""))
    .filter(Boolean);

  const openAlexTopics = (openAlex?.topics || [])
    .slice(0, 10)
    .map((topic) => ({
      name: cleanText(topic.display_name || ""),
      score: Number(topic.score || 0)
    }))
    .filter((topic) => topic.name);

  const keywords = (openAlex?.keywords || [])
    .slice(0, 15)
    .map((keyword) => cleanText(keyword.display_name || keyword.keyword || ""))
    .filter(Boolean);

  const categoryTerms = [...keywords, ...meshTerms, ...openAlexTopics.map((x) => x.name)];
  const categories = categoryFor(title, journal, fullWork.type, categoryTerms);
  const keyConfig = findKeyConfig(title);
  const impactFactor =
    keyConfig?.impactFactor ??
    journalImpactFactor(journal) ??
    null;

  const volume = cleanText(crossref?.volume || europePmc?.journalVolume || openAlex?.biblio?.volume || "");
  const issue = cleanText(crossref?.issue || europePmc?.issue || openAlex?.biblio?.issue || "");
  const pages = cleanText(
    crossref?.page ||
    crossref?.["article-number"] ||
    europePmc?.pageInfo ||
    [openAlex?.biblio?.first_page, openAlex?.biblio?.last_page].filter(Boolean).join("-") ||
    ""
  );

  const volumeIssuePages = [
    volume ? `vol. ${volume}` : "",
    issue ? `no. ${issue}` : "",
    pages ? `pp. ${pages}` : ""
  ].filter(Boolean).join(", ");

  const workUrl = cleanText(textValue(fullWork?.url) || crossref?.URL || "");
  const bestOpenAccessUrl = cleanText(
    openAlex?.best_oa_location?.landing_page_url ||
    openAlex?.best_oa_location?.pdf_url ||
    ""
  );
  const fullTextUrl = pmcid ? `https://europepmc.org/articles/${pmcid}` : "";
  const citedByCount = Number(openAlex?.cited_by_count || 0);
  const countsByYear = openAlex?.counts_by_year || [];
  const isOpenAccess = Boolean(openAlex?.open_access?.is_oa || pmcid);
  const openAccessStatus = cleanText(openAlex?.open_access?.oa_status || "");
  const selfAuthorPositions = detectSelfAuthorPositions(authors);

  records.push({
    putCode,
    title,
    year: date.year,
    sortDate: date.sortDate,
    journal,
    type: fullWork.type || openAlex?.type || "",
    typeLabel: cleanText(
      String(fullWork.type || openAlex?.type || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    ),
    doi: doi || null,
    pmid: pmid || null,
    pmcid: pmcid || null,
    url: workUrl || null,
    fullTextUrl: fullTextUrl || null,
    bestOpenAccessUrl: bestOpenAccessUrl || null,
    openAlexId: openAlex?.id || null,
    openAlexUrl: openAlex?.id || null,
    abstract: abstract || null,
    authors,
    selfAuthorPositions,
    volumeIssuePages,
    categories,
    primaryCategoryLabel: categoryLabel(categories[0]),
    key: Boolean(keyConfig),
    impactFactor,
    impactFactorSource: keyConfig?.impactFactorSource || null,
    meshTerms,
    keywords,
    openAlexTopics,
    citedByCount,
    countsByYear,
    isOpenAccess,
    openAccessStatus: openAccessStatus || null,
    relatedOpenAlexWorks: openAlex?.related_works || []
  });

  if ((index + 1) % 10 === 0) {
    console.log(`Processed ${index + 1} of ${groups.length} work groups.`);
    await sleep(250);
  }
}

const deduplicated = [];
const seen = new Set();
for (const record of records) {
  const key = record.doi
    ? `doi:${record.doi}`
    : `title:${normalizeTitle(record.title)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduplicated.push(record);
}

deduplicated.sort((a, b) =>
  String(b.sortDate).localeCompare(String(a.sortDate))
);

const output = {
  orcid: ORCID,
  generatedAt: new Date().toISOString(),
  source: "ORCID Public API v3.0, enriched with Crossref, Europe PMC and OpenAlex metadata",
  count: deduplicated.length,
  publications: deduplicated
};

await fs.writeFile(
  new URL("../publications.json", import.meta.url),
  JSON.stringify(output, null, 2) + "\n",
  "utf8"
);

console.log(`Wrote ${deduplicated.length} publications to publications.json`);
