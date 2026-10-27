import fs from 'node:fs/promises';

const normal = (value) => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const doi = (value) => String(value || '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').toLowerCase().trim();
const sourceList = (records) => [...new Map(records.filter(s => /^https?:\/\//.test(s?.url)).map(s => [s.url, s])).values()];

// A DOI for an entire abstract book must never be used as an individual work ID.
export function abstractKey(record) {
  if (record.doi && doi(record.doi) !== doi(record.collectionDoi)) return `doi:${doi(record.doi)}`;
  if (record.id) return record.id;
  return [record.year, normal(record.meeting || record.journal), normal(record.abstractNumber), normal(record.title)].join('|');
}

function validate(record) {
  if (record.verification?.status !== 'verified' || !record.title || !record.year ||
      !record.verification.identityEvidence?.length || !record.verification.classificationEvidence?.length ||
      !record.authors?.some(a => /^(eric|e) spierings$/.test(normal(a.name))) ||
      !sourceList(record.sources || []).length) {
    throw new Error(`Incomplete conference abstract verification: ${record.title || record.id}`);
  }
  if (record.doi && doi(record.doi) === doi(record.collectionDoi)) throw new Error(`Book DOI used as individual DOI: ${record.title}`);
}

export function mergeConferenceAbstracts(dataset, registry) {
  if (registry.orcid !== dataset.orcid) throw new Error('Conference abstract registry ORCID does not match dataset');
  const records = registry.records || [];
  records.forEach(validate);
  const curatedDois = new Set(records.map(r => doi(r.doi)).filter(Boolean));
  const moved = (dataset.publications || []).filter(r => curatedDois.has(doi(r.doi)));
  const publications = (dataset.publications || []).filter(r => !curatedDois.has(doi(r.doi)));
  const byKey = new Map();
  for (const r of [...(dataset.conferenceAbstracts || []), ...moved, ...records]) {
    const key = abstractKey(r);
    const previous = byKey.get(key);
    byKey.set(key, {
      ...previous, ...r,
      abstract: r.abstract || previous?.abstract || null,
      sources: sourceList([...(previous?.sources || []), ...(r.sources || [])]),
      abstractClassification: {decision: 'exclude', reasons: r.verification?.classificationEvidence || r.abstractClassification?.reasons || previous?.abstractClassification?.reasons || []}
    });
  }
  const conferenceAbstracts = [...byKey.values()].sort((a,b) => Number(b.year)-Number(a.year) || a.title.localeCompare(b.title));
  const review = [...new Map([...(dataset.abstractsNeedingReview || []), ...(registry.needsReview || [])]
    .filter(r => !curatedDois.has(doi(r.doi)))
    .map(r => [r.openAlexId || r.doi || normal(r.title), r])).values()];
  return {...dataset, publications, count: publications.length, conferenceAbstracts,
    conferenceAbstractCount: conferenceAbstracts.length, abstractsNeedingReview: review, abstractReviewCount: review.length,
    conferenceAbstractResearch: {reviewedAt: registry.reviewedAt, curatedCount: records.length, policy: registry.policy,
      registry: 'conference-abstracts-manual.json', report: 'research/conference-abstracts/README.md'},
    source: dataset.source.includes('curated conference') ? dataset.source : `${dataset.source}; curated conference abstracts verified against publisher, congress and institutional sources`};
}

export async function loadConferenceRegistry() {
  return JSON.parse(await fs.readFile(new URL('../conference-abstracts-manual.json', import.meta.url), 'utf8'));
}

export function conferenceAudit(dataset) {
  return {generatedAt: dataset.generatedAt, source: dataset.source,
    policy: 'Verified conference abstracts are separate from scientific publications. Unresolved candidates are recorded for review.',
    counts: {scientificPublications: dataset.count, conferenceAbstracts: dataset.conferenceAbstractCount, abstractsNeedingReview: dataset.abstractReviewCount},
    research: dataset.conferenceAbstractResearch,
    abstracts: dataset.conferenceAbstracts.map(r => ({id: r.id, title:r.title, year:r.year, journal:r.journal,
      volumeIssuePages:r.volumeIssuePages, doi:r.doi, collectionDoi:r.collectionDoi, meeting:r.meeting,
      abstractNumber:r.abstractNumber, openAlexId:r.openAlexId, orcidPutCode:r.putCode,
      reasons:r.abstractClassification?.reasons, verification:r.verification, sources:r.sources})),
    needsReview: dataset.abstractsNeedingReview};
}
