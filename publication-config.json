import fs from "node:fs/promises";
import process from "node:process";

const config = JSON.parse(
  await fs.readFile(new URL("../publication-config.json", import.meta.url), "utf8")
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

function normalizeTitle(value = "") {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
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
  return value
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .toLowerCase();
}

function externalIds(work) {
  const ids = work?.["external-ids"]?.["external-id"] || [];
  const result = {};

  for (const id of ids) {
    const type = String(id["external-id-type"] || "").toLowerCase();
    const value = textValue(id["external-id-value"]);
    if (type && value && !result[type]) result[type] = value;
  }

  return result;
}

function categoryFor(title, journal, type) {
  const text = `${title} ${journal} ${type}`.toLowerCase();
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
  } catch {
    return null;
  }
}

function crossrefAuthors(message) {
  return (message?.author || []).map((author) => {
    const given = author.given || "";
    const family = author.family || "";
    return [given, family].filter(Boolean).join(" ");
  }).filter(Boolean);
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
    sortDate: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
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
  const normalized = journal.trim().toLowerCase();

  for (const [name, value] of Object.entries(config.journalImpactFactors || {})) {
    if (normalized === name.toLowerCase()) return value;
  }

  return null;
}

const token = await getToken();
const summary = await orcidGet("works", token);
const groups = summary.group || [];
const records = [];

for (let index = 0; index < groups.length; index += 1) {
  const group = groups[index];
  const summaries = group["work-summary"] || [];
  if (!summaries.length) continue;

  const preferred =
    summaries.find((item) => item["source"]?.["source-orcid"]?.path === ORCID) ||
    summaries[0];

  const putCode = preferred["put-code"];
  const fullWork = await orcidGet(`work/${putCode}`, token);
  const ids = externalIds(fullWork);
  const doi = normalizeDoi(ids.doi || "");
  const crossref = await crossrefMetadata(doi);

  const orcidTitle = textValue(fullWork?.title?.title);
  const title = crossref?.title?.[0] || orcidTitle || "Untitled work";
  const journal =
    crossref?.["container-title"]?.[0] ||
    textValue(fullWork?.["journal-title"]) ||
    "";
  const orcidDate = dateParts(fullWork?.["publication-date"]);
  const crDate = crossrefDate(crossref);
  const date = crDate || orcidDate;
  const authors = crossrefAuthors(crossref);
  const categories = categoryFor(title, journal, fullWork.type);
  const keyConfig = findKeyConfig(title);
  const impactFactor =
    keyConfig?.impactFactor ??
    journalImpactFactor(journal) ??
    null;

  const volume = crossref?.volume || "";
  const issue = crossref?.issue || "";
  const pages = crossref?.page || crossref?.["article-number"] || "";
  const volumeIssuePages = [
    volume ? `vol. ${volume}` : "",
    issue ? `no. ${issue}` : "",
    pages ? `pp. ${pages}` : ""
  ].filter(Boolean).join(", ");

  records.push({
    putCode,
    title,
    year: date.year,
    sortDate: date.sortDate,
    journal,
    type: fullWork.type || "",
    typeLabel: String(fullWork.type || "")
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    doi: doi || null,
    pmid: ids.pmid || null,
    url:
      textValue(fullWork?.url) ||
      crossref?.URL ||
      null,
    authors,
    volumeIssuePages,
    categories,
    primaryCategoryLabel: categoryLabel(categories[0]),
    key: Boolean(keyConfig),
    impactFactor,
    impactFactorSource: keyConfig?.impactFactorSource || null
  });

  // Be polite to ORCID and Crossref.
  if ((index + 1) % 10 === 0) await sleep(250);
}

// De-duplicate ORCID groups by DOI where possible, otherwise by normalized title.
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

// General ordering is reverse chronological. The browser applies IF ordering
// only when the "Key publications" view is selected.
deduplicated.sort((a, b) =>
  String(b.sortDate).localeCompare(String(a.sortDate))
);

const output = {
  orcid: ORCID,
  generatedAt: new Date().toISOString(),
  source: "ORCID Public API v3.0, enriched with Crossref metadata",
  count: deduplicated.length,
  publications: deduplicated
};

await fs.writeFile(
  new URL("../publications.json", import.meta.url),
  JSON.stringify(output, null, 2) + "\n",
  "utf8"
);

console.log(`Wrote ${deduplicated.length} publications to publications.json`);
