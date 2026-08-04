import fs from "node:fs/promises";
import crypto from "node:crypto";

const CONFIG_URL = new URL("../pure-activities-config.json", import.meta.url);
const OUTPUT_URL = new URL("../activities.json", import.meta.url);

const config = JSON.parse(await fs.readFile(CONFIG_URL, "utf8"));

const PORTAL_ORIGIN = new URL(config.portalBaseUrl).origin;
const PERSON_NAME = config.personName;
const PERSON_SLUG = config.personSlug;
const LANGUAGE_PATH = config.languagePath || "en";

const MAX_NEW_PAGES = Number(config.maxNewPages || 30);
const REQUEST_DELAY_MS = Number(config.requestDelayMs || 500);
const REQUEST_TIMEOUT_MS = Number(config.requestTimeoutMs || 12000);

const USER_AGENT =
  config.userAgent ||
  "EricSpieringsActivitiesSync/2.0 (+https://espierin.github.io/cv/)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function cleanText(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, dec) =>
      String.fromCodePoint(Number.parseInt(dec, 10))
    )
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(value, base = config.portalBaseUrl) {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function fetchText(url, accept = "text/html,*/*;q=0.8") {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Accept: accept,
        "Accept-Language": "en-GB,en;q=0.9",
        "User-Agent": USER_AGENT
      }
    });

    if (response.status === 403) {
      console.warn(`403 - skipped: ${url}`);
      return null;
    }

    if (response.status === 404) return null;

    if (!response.ok) {
      console.warn(`${response.status} - skipped: ${url}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.warn(`Request failed - skipped: ${url} (${error.message})`);
    return null;
  }
}

function extractRssLinks(xml) {
  const candidates = [
    ...[...xml.matchAll(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/gis)]
      .map((match) => cleanText(match[1])),
    ...[...xml.matchAll(/<guid[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/guid>/gis)]
      .map((match) => cleanText(match[1]))
  ];

  return unique(
    candidates
      .map((value) => absoluteUrl(value))
      .filter((url) => {
        if (!url) return false;
        const parsed = new URL(url);

        return (
          parsed.origin === PORTAL_ORIGIN &&
          parsed.pathname.includes(`/${LANGUAGE_PATH}/activities/`)
        );
      })
  );
}

async function discoverActivityUrls() {
  const links = new Set(config.seedActivityUrls || []);

  for (const query of config.searchQueries || []) {
    const rssUrl =
      `https://www.bing.com/search?format=rss&q=${encodeURIComponent(query)}`;

    const rss = await fetchText(
      rssUrl,
      "application/rss+xml,application/xml,text/xml,*/*;q=0.8"
    );

    if (rss) {
      extractRssLinks(rss).forEach((url) => links.add(url));
    }

    await sleep(REQUEST_DELAY_MS);
  }

  return [...links];
}

function extractMeta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,
      "i"
    )
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return cleanText(match[1]);
  }

  return "";
}

function extractJsonLd(html) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    )
  ];

  const output = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());

      if (Array.isArray(parsed)) {
        output.push(...parsed);
      } else if (parsed?.["@graph"]) {
        output.push(...parsed["@graph"]);
      } else {
        output.push(parsed);
      }
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return output;
}

function valueAfterLabel(html, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `<(?:dt|th|div|span)[^>]*>\\s*${escaped}\\s*<\\/(?:dt|th|div|span)>` +
      `\\s*<(?:dd|td|div|span)[^>]*>([\\s\\S]*?)<\\/(?:dd|td|div|span)>`,
      "i"
    );

    const match = html.match(pattern);

    if (match) {
      const value = cleanText(match[1]);
      if (value) return value;
    }
  }

  return "";
}

function parseDate(value) {
  const text = String(value || "");

  const isoDates = [
    ...text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)
  ].map((match) => match[0]);

  if (isoDates.length) {
    return {
      startDate: isoDates[0],
      endDate: isoDates[1] || null,
      year: Number(isoDates[0].slice(0, 4))
    };
  }

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);

  return {
    startDate: null,
    endDate: null,
    year: yearMatch ? Number(yearMatch[0]) : null
  };
}

function classifyActivity(text) {
  const lower = text.toLowerCase();

  if (lower.includes("keynote")) return "Keynote lecture";
  if (lower.includes("invited talk")) return "Invited talk";
  if (lower.includes("invited lecture")) return "Invited lecture";
  if (lower.includes("workshop")) return "Workshop";
  if (lower.includes("seminar")) return "Seminar";
  if (lower.includes("conference contribution")) return "Conference contribution";
  if (lower.includes("lecture")) return "Lecture";

  return "Activity";
}

function belongsToPerson(html, jsonLd) {
  const lowerHtml = html.toLowerCase();
  const lowerJson = JSON.stringify(jsonLd).toLowerCase();
  const fullName = PERSON_NAME.toLowerCase();
  const personPath =
    `/${LANGUAGE_PATH}/persons/${PERSON_SLUG}`.toLowerCase();

  return (
    lowerHtml.includes(fullName) ||
    lowerJson.includes(fullName) ||
    lowerHtml.includes(personPath)
  );
}

function parseActivity(url, html) {
  const jsonLd = extractJsonLd(html);

  if (!belongsToPerson(html, jsonLd)) return null;

  const event =
    jsonLd.find((item) =>
      ["Event", "EducationEvent", "PublicationEvent"].includes(item?.["@type"])
    ) || {};

  const title =
    cleanText(event.name || "") ||
    extractMeta(html, "og:title") ||
    cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");

  if (!title) return null;

  const description =
    cleanText(event.description || "") ||
    extractMeta(html, "og:description") ||
    extractMeta(html, "description");

  const dateText =
    cleanText(event.startDate || "") ||
    valueAfterLabel(html, ["Date", "Period", "Activity date"]);

  const date = parseDate(
    [event.startDate, event.endDate, dateText].filter(Boolean).join(" ")
  );

  const eventName =
    valueAfterLabel(html, ["Event title", "Event", "Conference", "Meeting"]) ||
    cleanText(event.superEvent?.name || "");

  const location =
    valueAfterLabel(html, ["Location", "Place", "City", "Country"]) ||
    cleanText(
      event.location?.name ||
      event.location?.address?.addressLocality ||
      event.location?.address?.addressCountry ||
      ""
    );

  const pageText = cleanText(html);

  const activityType =
    valueAfterLabel(html, ["Activity type", "Type of activity", "Type"]) ||
    classifyActivity(`${pageText} ${description}`);

  const role =
    valueAfterLabel(html, ["Role", "Role in activity"]) ||
    (/\bSpeaker\b/i.test(pageText) ? "Speaker" : "");

  const canonical =
    extractMeta(html, "og:url") ||
    html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
    )?.[1] ||
    url;

  const record = {
    id: sha256(canonical).slice(0, 16),
    title,
    startDate: date.startDate,
    endDate: date.endDate,
    year: date.year,
    activityType,
    role: role || null,
    event: eventName || null,
    location: location || null,
    description: description || null,
    url: canonical,
    source: "UMC Utrecht Pure Portal public activity page"
  };

  record.hash = sha256(JSON.stringify(record));

  return record;
}

async function loadExisting() {
  try {
    const parsed = JSON.parse(await fs.readFile(OUTPUT_URL, "utf8"));

    return Array.isArray(parsed.activities)
      ? parsed.activities
      : [];
  } catch {
    return [];
  }
}

async function main() {
  const existing = await loadExisting();
  const knownUrls = new Set(existing.map((item) => item.url).filter(Boolean));

  console.log(`Existing activities: ${existing.length}`);
  console.log("Searching for new public activity URLs...");

  const discovered = await discoverActivityUrls();

  const newUrls = discovered
    .filter((url) => !knownUrls.has(url))
    .slice(0, MAX_NEW_PAGES);

  console.log(`New candidate URLs: ${newUrls.length}`);

  const newActivities = [];

  for (let index = 0; index < newUrls.length; index += 1) {
    const url = newUrls[index];
    const html = await fetchText(url);

    if (html) {
      const activity = parseActivity(url, html);
      if (activity) newActivities.push(activity);
    }

    console.log(`Checked ${index + 1}/${newUrls.length}`);
    await sleep(REQUEST_DELAY_MS);
  }

  const merged = [...existing, ...newActivities];
  const deduplicated = [];
  const seen = new Set();

  for (const activity of merged) {
    const key =
      activity.url ||
      `${activity.title}|${activity.startDate || activity.year || ""}`;

    if (seen.has(key)) continue;

    seen.add(key);
    deduplicated.push(activity);
  }

  deduplicated.sort((a, b) => {
    const dateA = a.startDate || `${a.year || 0}-00-00`;
    const dateB = b.startDate || `${b.year || 0}-00-00`;

    return (
      dateB.localeCompare(dateA) ||
      a.title.localeCompare(b.title)
    );
  });

  const output = {
    person: PERSON_NAME,
    generatedAt: new Date().toISOString(),
    source: "Public UMC Utrecht Pure Portal activity pages",
    completeness:
      "Best-effort reconstruction based on known URLs and search-engine indexing.",
    count: deduplicated.length,
    activities: deduplicated
  };

  await fs.writeFile(
    OUTPUT_URL,
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );

  console.log(
    `Added ${newActivities.length} new activities. ` +
    `Total: ${deduplicated.length}.`
  );
}

await main();
