import fs from "node:fs/promises";
import crypto from "node:crypto";

const CONFIG_URL = new URL("../pure-activities-config.json", import.meta.url);
const OUTPUT_URL = new URL("../activities.json", import.meta.url);

const config = JSON.parse(await fs.readFile(CONFIG_URL, "utf8"));

const PORTAL_ORIGIN = new URL(config.portalBaseUrl).origin;
const PERSON_NAME = config.personName;
const PERSON_SLUG = config.personSlug;
const LANGUAGE_PATH = config.languagePath || "en";
const REQUEST_DELAY_MS = Number(config.requestDelayMs || 1200);
const MAX_ACTIVITY_PAGES = Number(config.maxActivityPages || 250);
const USER_AGENT =
  config.userAgent ||
  "EricSpieringsActivitiesSync/1.0 (+https://espierin.github.io/cv/)";

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

async function fetchText(url, { accept = "text/html,*/*;q=0.8", retries = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          Accept: accept,
          "Accept-Language": "en-GB,en;q=0.9",
          "User-Agent": USER_AGENT
        }
      });

      if (response.status === 404) return null;

      if (response.status === 403) {
        console.warn(`Access denied (403), not bypassed: ${url}`);
        return null;
      }

      if (response.status === 429 || response.status >= 500) {
        await sleep(1000 * attempt);
        continue;
      }

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(1000 * attempt);
    }
  }

  console.warn(`Request failed: ${url}: ${lastError?.message || lastError}`);
  return null;
}

function robotsAllows(robotsText, pathname) {
  if (!robotsText) return true;

  const lines = robotsText
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);

  let applies = false;
  const disallowed = [];

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      applies = value === "*";
    } else if (applies && key === "disallow" && value) {
      disallowed.push(value);
    }
  }

  return !disallowed.some((rule) => pathname.startsWith(rule));
}

function extractSitemapLocations(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
}

async function discoverSitemaps() {
  const robotsUrl = `${PORTAL_ORIGIN}/robots.txt`;
  const robots = await fetchText(robotsUrl, { accept: "text/plain,*/*;q=0.8" });

  if (!robotsAllows(robots, `/${LANGUAGE_PATH}/activities/`)) {
    throw new Error(
      "robots.txt disallows automated access to activity pages. Sync stopped."
    );
  }

  const declared = robots
    ? [...robots.matchAll(/^sitemap:\s*(.+)$/gim)].map((match) => match[1].trim())
    : [];

  return unique([
    ...declared,
    `${PORTAL_ORIGIN}/sitemap.xml`,
    `${PORTAL_ORIGIN}/sitemap_index.xml`,
    `${PORTAL_ORIGIN}/sitemap-index.xml`
  ]);
}

async function activityUrlsFromSitemaps() {
  const queue = await discoverSitemaps();
  const visited = new Set();
  const activities = new Set();

  while (queue.length && visited.size < 50) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);

    const xml = await fetchText(sitemapUrl, {
      accept: "application/xml,text/xml,*/*;q=0.8",
      retries: 2
    });

    if (!xml) continue;

    for (const location of extractSitemapLocations(xml)) {
      const url = absoluteUrl(location);
      if (!url) continue;

      if (/sitemap/i.test(url) && !visited.has(url)) {
        queue.push(url);
      } else if (
        new URL(url).origin === PORTAL_ORIGIN &&
        new URL(url).pathname.includes(`/${LANGUAGE_PATH}/activities/`)
      ) {
        activities.add(url);
      }
    }

    await sleep(REQUEST_DELAY_MS);
  }

  return [...activities];
}

function extractRssLinks(xml) {
  const links = [
    ...[...xml.matchAll(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/gis)]
      .map((match) => cleanText(match[1])),
    ...[...xml.matchAll(/<guid[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/guid>/gis)]
      .map((match) => cleanText(match[1]))
  ];

  return unique(
    links
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

async function activityUrlsFromSearchRss() {
  if (config.enableSearchRssFallback !== true) return [];

  const queries = config.searchQueries || [
    `site:${new URL(PORTAL_ORIGIN).hostname}/${LANGUAGE_PATH}/activities "${PERSON_NAME}"`,
    `site:${new URL(PORTAL_ORIGIN).hostname}/${LANGUAGE_PATH}/activities "Spierings" "Invited talk"`
  ];

  const links = new Set();

  for (const query of queries) {
    const rssUrl = `https://www.bing.com/search?format=rss&q=${encodeURIComponent(query)}`;
    const rss = await fetchText(rssUrl, {
      accept: "application/rss+xml,application/xml,text/xml,*/*;q=0.8",
      retries: 2
    });

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
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i")
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return cleanText(match[1]);
  }
  return "";
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )];

  const results = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      if (Array.isArray(parsed)) results.push(...parsed);
      else if (parsed?.["@graph"]) results.push(...parsed["@graph"]);
      else results.push(parsed);
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }

  return results;
}

function valueAfterLabel(html, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(
        `<(?:dt|th|div|span)[^>]*>\\s*${escaped}\\s*<\\/(?:dt|th|div|span)>\\s*<(?:dd|td|div|span)[^>]*>([\\s\\S]*?)<\\/(?:dd|td|div|span)>`,
        "i"
      ),
      new RegExp(
        `<[^>]+[^>]*>\\s*${escaped}\\s*<\\/[^>]+>\\s*<[^>]+>([\\s\\S]*?)<\\/[^>]+>`,
        "i"
      )
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const value = cleanText(match[1]);
        if (value) return value;
      }
    }
  }
  return "";
}

function parseDate(value) {
  if (!value) return { startDate: null, endDate: null, year: null };

  const isoMatches = [...String(value).matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)]
    .map((match) => match[0]);

  if (isoMatches.length) {
    return {
      startDate: isoMatches[0],
      endDate: isoMatches[1] || null,
      year: Number(isoMatches[0].slice(0, 4))
    };
  }

  const yearMatch = String(value).match(/\b(19|20)\d{2}\b/);
  return {
    startDate: null,
    endDate: null,
    year: yearMatch ? Number(yearMatch[0]) : null
  };
}

function activityTypeFromText(text) {
  const lower = text.toLowerCase();
  if (lower.includes("keynote")) return "Keynote lecture";
  if (lower.includes("invited talk")) return "Invited talk";
  if (lower.includes("invited lecture")) return "Invited lecture";
  if (lower.includes("conference contribution")) return "Conference contribution";
  if (lower.includes("workshop")) return "Workshop";
  if (lower.includes("seminar")) return "Seminar";
  if (lower.includes("lecture")) return "Lecture";
  return "Activity";
}

function isAssociatedWithPerson(html, jsonLd) {
  const text = cleanText(html).toLowerCase();
  const person = PERSON_NAME.toLowerCase();
  const surname = PERSON_NAME.split(/\s+/).at(-1).toLowerCase();

  if (text.includes(person)) return true;

  const serialized = JSON.stringify(jsonLd).toLowerCase();
  if (serialized.includes(person)) return true;

  const personUrlFragment = `/${LANGUAGE_PATH}/persons/${PERSON_SLUG}`.toLowerCase();
  if (html.toLowerCase().includes(personUrlFragment)) return true;

  return text.includes(surname) && /\b(speaker|participant|organiser|organizer)\b/i.test(text);
}

function parseActivityPage(url, html) {
  const jsonLd = extractJsonLd(html);

  if (!isAssociatedWithPerson(html, jsonLd)) return null;

  const primary =
    jsonLd.find((item) =>
      ["Event", "EducationEvent", "PublicationEvent"].includes(item?.["@type"])
    ) || {};

  const title =
    cleanText(primary.name || "") ||
    extractMeta(html, "og:title") ||
    cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "") ||
    cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");

  const description =
    cleanText(primary.description || "") ||
    extractMeta(html, "og:description") ||
    extractMeta(html, "description");

  const dateText =
    cleanText(primary.startDate || "") ||
    valueAfterLabel(html, ["Date", "Period", "Activity date"]);
  const parsedDate = parseDate(
    [primary.startDate, primary.endDate, dateText].filter(Boolean).join(" ")
  );

  const eventName =
    valueAfterLabel(html, ["Event title", "Event", "Conference", "Meeting"]) ||
    cleanText(primary.superEvent?.name || "");

  const location =
    valueAfterLabel(html, ["Location", "Place", "City", "Country"]) ||
    cleanText(
      primary.location?.name ||
      primary.location?.address?.addressLocality ||
      primary.location?.address?.addressCountry ||
      ""
    );

  const visibleText = cleanText(html);
  const activityType =
    valueAfterLabel(html, ["Activity type", "Type of activity", "Type"]) ||
    activityTypeFromText(`${visibleText} ${description}`);

  const role =
    valueAfterLabel(html, ["Role", "Role in activity"]) ||
    (/\bSpeaker\b/i.test(visibleText) ? "Speaker" : "");

  const recognition =
    valueAfterLabel(html, ["Degree of recognition", "Recognition"]);

  const academic =
    valueAfterLabel(html, ["Academic", "Nature of activity"]);

  const canonical =
    extractMeta(html, "og:url") ||
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    url;

  const record = {
    id: sha256(canonical).slice(0, 16),
    title,
    startDate: parsedDate.startDate,
    endDate: parsedDate.endDate,
    year: parsedDate.year,
    activityType,
    role: role || null,
    event: eventName || null,
    location: location || null,
    recognition: recognition || null,
    academic: academic || null,
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
    return Array.isArray(parsed.activities) ? parsed.activities : [];
  } catch {
    return [];
  }
}

async function main() {
  console.log("Discovering public Pure activity pages...");

  const existing = await loadExisting();
  const knownUrls = existing.map((item) => item.url);
  const seedUrls = config.seedActivityUrls || [];

  let sitemapUrls = [];
  try {
    sitemapUrls = await activityUrlsFromSitemaps();
  } catch (error) {
    console.warn(error.message);
  }

  const searchUrls = await activityUrlsFromSearchRss();

  const candidateUrls = unique([
    ...knownUrls,
    ...seedUrls,
    ...sitemapUrls,
    ...searchUrls
  ])
    .filter((url) => {
      try {
        const parsed = new URL(url);
        return (
          parsed.origin === PORTAL_ORIGIN &&
          parsed.pathname.includes(`/${LANGUAGE_PATH}/activities/`)
        );
      } catch {
        return false;
      }
    })
    .slice(0, MAX_ACTIVITY_PAGES);

  console.log(
    `Candidates: ${candidateUrls.length} ` +
    `(existing ${knownUrls.length}, seeds ${seedUrls.length}, ` +
    `sitemaps ${sitemapUrls.length}, search RSS ${searchUrls.length})`
  );

  const records = [];

  for (let index = 0; index < candidateUrls.length; index += 1) {
    const url = candidateUrls[index];
    const html = await fetchText(url);

    if (html) {
      const activity = parseActivityPage(url, html);
      if (activity?.title) records.push(activity);
    }

    console.log(`Checked ${index + 1}/${candidateUrls.length}`);
    await sleep(REQUEST_DELAY_MS);
  }

  const deduplicated = [];
  const seen = new Set();

  for (const activity of records) {
    const key = activity.url || `${activity.title}|${activity.startDate || activity.year || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduplicated.push(activity);
  }

  deduplicated.sort((a, b) => {
    const dateA = a.startDate || `${a.year || 0}-00-00`;
    const dateB = b.startDate || `${b.year || 0}-00-00`;
    return dateB.localeCompare(dateA) || a.title.localeCompare(b.title);
  });

  const output = {
    person: PERSON_NAME,
    generatedAt: new Date().toISOString(),
    source: "Public UMC Utrecht Pure Portal activity pages",
    completeness:
      "Best-effort reconstruction. Completeness depends on public sitemap and search-engine indexing.",
    count: deduplicated.length,
    activities: deduplicated
  };

  await fs.writeFile(
    OUTPUT_URL,
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );

  console.log(`Wrote ${deduplicated.length} activities to activities.json`);
}

await main();
