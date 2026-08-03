import fs from "node:fs/promises";
import process from "node:process";

const config = JSON.parse(
  await fs.readFile(
    new URL("../publication-config.json", import.meta.url),
    "utf8"
  )
);

const ORCID = config.orcid;
const CLIENT_ID = process.env.ORCID_CLIENT_ID;
const CLIENT_SECRET = process.env.ORCID_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "ORCID_CLIENT_ID and ORCID_CLIENT_SECRET must be configured as GitHub repository secrets."
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeHtmlEntities(value = "") {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
    ndash: "–",
    mdash: "—",
    hellip: "…",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    mu: "μ"
  };

  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16))
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10))
    )
    .replace(/&([a-z]+);/gi, (match, entity) => {
      const replacement = namedEntities[entity.toLowerCase()];
      return replacement ?? match;
    });
}

function cleanText(value = "") {
  return decodeHtmlEntities(value)
    .replace(/<scp\b[^>]*>/gi, "")
    .replace(/<\/scp>/gi, "")
    .replace(/<sub\b[^>]*>/gi, "")
    .replace(/<\/sub>/gi, "")
    .replace(/<sup\b[^>]*>/gi, "")
    .replace(/<\/sup>/gi, "")
    .replace(/<i\b[^>]*>/gi, "")
    .replace(/<\/i>/gi, "")
    .replace(/<em\b[^>]*>/gi, "")
    .replace(/<\/em>/gi, "")
    .replace(/<b\b[^>]*>/gi, "")
    .replace(/<\/b>/gi, "")
    .replace(/<strong\b[^>]*>/gi, "")
    .replace(/<\/strong>/gi, "")
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

    if (type && value && !result[type]) {
      result[type] = value;
    }
  }

  return result;
}

function categoryFor(title, journal, type) {
  const text = cleanText(`${title} ${journal} ${type}`).toLowerCase();
  const categories = [];

  if (/(pirche|epitope|molecular mismatch|hla matching|compatibility)/.test(text)) {
    categories.push("matching");
  }

  if (/(graft failure|rejection|survival|outcome|mortality|relapse|graft-versus-host)/.test(text)) {
    categories.push("outcome");
  }

  if (/(diagnostic|typing|antibod|assay|screening|genetic|sequencing|laboratory)/.test(text)) {
    categories.push("diagnostics");
  }

  if (/(standard|guideline|reporting|hla-ml|hml|haml|gl string|data exchange|interoperab)/.test(text)) {
    categories.push("standards");
  }

  if (/(t cell|minor histocompatibility|cellular|single-cell|nk cell|immune monitoring)/.test(text)) {
    categories.push("cellular");
  }

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
    throw new Error(
      `ORCID token request failed: ${response.status} ${await response.text()}`
    );
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

  if (!response.ok) {
    throw new Error(`ORCID request failed for ${path}: ${response.status}`);
  }

  return response.json();
}

async function crossrefMetadata(doi) {
  if (!doi) return null;

  try {
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
      {
        headers: {
          "User-Agent":
            "EricSpieringsPublications/1.0 (mailto:e.spierings@umcutrecht.nl)"
        }
      }
    );

    if (!response.ok) return null;
    return (await response.json()).message;
  } catch (error) {
    console.warn(`Crossref lookup failed for DOI ${doi}:`, error.message);
    return null;
  }
}

async function europePmcMetadata({ pmid, doi }) {
  if (!pmid && !doi) return null;

  const query = pmid
    ? `EXT_ID:${pmid}`
    : `DOI:"${doi}"`;

  try {
    const response = await fetch(
      `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=1`,
      {
        headers: {
          "User-Agent":
            "EricSpieringsPublications/1.0 (mailto:e.spierings@umcutrecht.nl)"
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data?.resultList?.result?.[0] || null;
  } catch (error) {
    console.warn(
      `Europe PMC lookup failed for ${pmid || doi}:`,
      error.message
    );
    return null;
  }
}

function crossrefAuthors(message) {
  return (message?.author || [])
    .map((author) => {
      const given = cleanText(author.given || "");
      const family = cleanText(author.family || "");
      return [given, family].filter(Boolean).join(" ");
    })
    .filter(Boolean);
}

function europePmcAuthors(record) {
  const authorString = cleanText(record?.authorString || "");
  if (!authorString) return [];

  return authorString
    .split(/\s*,\s*/)
    .map(cleanText)
    .filter(Boolean);
}

function crossrefDate(message) {
  const parts =
    message?.["published-print"]?.["date-parts"]?.[0] ||
    message?.["published-online"]?.["date-parts"]?.[0] ||
    message?.issued?.["date-parts"]?.[0] ||
    [];

  if (!parts.length) return null;

  const [year, month = 0, day = 0] = parts;

  return {
    year,
    sortDate:
      `${String(year).padStart(4, "0")}-` +
      `${String(month).padStart(2, "0")}-` +
      `${String(day).padStart(2, "0")}`
  };
}

function findKeyConfig(title) {
  const normalized = normalizeTitle(title);

  return config.keyWorks.find((item) =>
    normalized.includes(normalizeTitle(item.titleContains))
  );
}

function journalImpactFactor(journal) {
  if (!journal) return null;

  const normalized = cleanText(journal).trim().toLowerCase();

  for (const [name, value] of Object.entries(
    config.journalImpactFactors || {}
  )) {
    if (normalized === cleanText(name).toLowerCase()) {
      return value;
    }
  }

  return null;
}

console.log(`Loading ORCID works for ${ORCID}...`);

const token = await getToken();
const summary = await orcidGet("works", token);
const groups = summary.group || [];
const records = [];

console.log(`ORCID returned ${groups.length} work groups.`);

for (let index = 0; index < groups.length; index += 1) {
  const group = groups[index];
  const summaries = group["work-summary"] || [];

  if (!summaries.length) continue;

  const preferred =
    summaries.find(
      (item) => item["source"]?.["source-orcid"]?.path === ORCID
    ) || summaries[0];

  const putCode = preferred["put-code"];
  const fullWork = await orcidGet(`work/${putCode}`, token);

  const ids = externalIds(fullWork);
  const doi = normalizeDoi(ids.doi || "");
  const initialPmid = cleanText(ids.pmid || "");

  const [crossref, europePmc] = await Promise.all([
    crossrefMetadata(doi),
    europePmcMetadata({ pmid: initialPmid, doi })
  ]);

  const orcidTitle = cleanText(textValue(fullWork?.title?.title));

  const title = cleanText(
    crossref?.title?.[0] ||
    europePmc?.title ||
    orcidTitle ||
    "Untitled work"
  );

  const journal = cleanText(
    crossref?.["container-title"]?.[0] ||
    europePmc?.journalTitle ||
    textValue(fullWork?.["journal-title"]) ||
    ""
  );

  const orcidDate = dateParts(fullWork?.["publication-date"]);
  const crDate = crossrefDate(crossref);
  const date = crDate || orcidDate;

  const crossrefAuthorList = crossrefAuthors(crossref);
  const europePmcAuthorList = europePmcAuthors(europePmc);
  const authors = crossrefAuthorList.length
    ? crossrefAuthorList
    : europePmcAuthorList;

  const pmid = initialPmid || cleanText(europePmc?.pmid || "");
  const pmcid = normalizePmcid(europePmc?.pmcid || "");
  const abstract = cleanText(europePmc?.abstractText || "");

  const categories = categoryFor(title, journal, fullWork.type);
  const keyConfig = findKeyConfig(title);

  const impactFactor =
    keyConfig?.impactFactor ??
    journalImpactFactor(journal) ??
    null;

  const volume = cleanText(crossref?.volume || europePmc?.journalVolume || "");
  const issue = cleanText(crossref?.issue || europePmc?.issue || "");
  const pages = cleanText(
    crossref?.page ||
    crossref?.["article-number"] ||
    europePmc?.pageInfo ||
    ""
  );

  const volumeIssuePages = [
    volume ? `vol. ${volume}` : "",
    issue ? `no. ${issue}` : "",
    pages ? `pp. ${pages}` : ""
  ]
    .filter(Boolean)
    .join(", ");

  const workUrl = cleanText(
    textValue(fullWork?.url) ||
    crossref?.URL ||
    ""
  );

  const fullTextUrl = pmcid
    ? `https://europepmc.org/articles/${pmcid}`
    : "";

  records.push({
    putCode,
    title,
    year: date.year,
    sortDate: date.sortDate,
    journal,
    type: fullWork.type || "",
    typeLabel: cleanText(
      String(fullWork.type || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    ),
    doi: doi || null,
    pmid: pmid || null,
    pmcid: pmcid || null,
    url: workUrl || null,
    fullTextUrl: fullTextUrl || null,
    abstract: abstract || null,
    authors,
    volumeIssuePages,
    categories,
    primaryCategoryLabel: categoryLabel(categories[0]),
    key: Boolean(keyConfig),
    impactFactor,
    impactFactorSource: keyConfig?.impactFactorSource || null
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
  source:
    "ORCID Public API v3.0, enriched with Crossref and Europe PMC metadata",
  count: deduplicated.length,
  publications: deduplicated
};

await fs.writeFile(
  new URL("../publications.json", import.meta.url),
  JSON.stringify(output, null, 2) + "\n",
  "utf8"
);

console.log(
  `Wrote ${deduplicated.length} publications to publications.json`
);
