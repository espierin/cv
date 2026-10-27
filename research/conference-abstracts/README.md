# Conference abstract research — Eric Spierings

Reviewed 27 October 2026. Identity anchor: [ORCID 0000-0001-9441-1019](https://orcid.org/0000-0001-9441-1019), Leiden/UMC Utrecht immunology, histocompatibility and transplantation.

## Result and interpretation

The curated registry contains **126 verified conference abstracts (2001–2026)**. Eight were already separated in the original ORCID dataset; six more were present but misclassified as scientific publications; **112 are newly recovered records for the website**. The website therefore contains 135 scientific publications and 126 conference abstracts. The abstract category increases by 118. Two unresolved older candidates remain outside the verified abstract list.

The additional Web of Science pass supplied 119 profile records explicitly classified as Meeting Abstract: 44 enriched existing entries, 74 added distinct congress contributions immediately; the remaining Brazilian contribution was subsequently corroborated by an independent coauthor CV and added with its author-list limitation recorded. The claimed profile is tied to the exact ORCID. Direct profile attribution is corroborated against displayed coauthors, explicit E. Spierings author entries and research context. WoS sometimes shows abbreviated author lists; those are explicitly labelled and missing authors/order are not invented.

These are bibliographic congress contributions, not 126 distinct studies or claims that Eric personally presented each contribution. The same study presented at different documented meetings remains separate. A later full article remains a separate publication. Only bibliographic metadata, attribution evidence and source links are published here; publisher abstract books and full texts are not redistributed.

## Search coverage

| Source | Work performed | Limits |
| --- | --- | --- |
| Crossref | Author query `Spierings`; two pages, 1,376 publisher-deposited records harvested. Initial Eric/E candidates were reviewed against given names, coauthors, journal and abstract identifiers. Individual DOI lookups used for cross-checks. | Initial-only names and missing conference classifications require manual decisions. Some individual lookups were rate-limited; broad-query metadata remained available. |
| OpenAlex | ORCID-resolved author A5039868432; 199 work records retrieved and screened, including repository locations. | Author clustering is discovery evidence, not proof. Provider counts differed between author summary and works endpoint. |
| American Transplant Congress | Author search plus PIRCHE, epitope and histocompatibility archive searches, pagination, and detail pages. Crawl log records 211 URL fetch entries, including 192 unique abstract detail URLs. Five pages explicitly list the target author. | Site search mainly indexes titles/text; absence from search results is not proof of absence. [Crawl log](atc-crawl.json). |
| EFI 2022 and 2023 | Official EasyChair indexes and full dated programme pages; author blocks, affiliations and abstract bodies checked. Five scientific contributions recovered. | Programme talks without a scientific abstract were not automatically counted. |
| EFI / ASHI supplements | Human Immunology, HLA/Tissue Antigens, official programmes, and institutional repositories checked. EFI 2013, 2017, 2018, 2024 and 2025 records recovered. | Several old PDFs redirect to current homepages, return access errors, or require member access. EFI 2024/2025 collection DOIs identify books, not individual abstracts. |
| ASH / ASTCT / EBMT | Blood annual-meeting items, BBMT supplements and Utrecht institutional classifications reviewed. | Older non-DOI meeting material is incompletely indexed. |
| Other congresses | ERA-EDTA/NDT, ASN Kidney Week, ISHLT, ISBT/Vox Sanguinis, ARVO/IOVS, Acta Ophthalmologica, ESHRE/Human Reproduction, Clinical and Experimental Rheumatology and Aichi Medical University bibliography checked. | A Japanese title is retained with an explicitly labelled English translation. |
| ASHI 2018 official programme | Public PDF downloaded and text extracted; Spierings appears as workshop speaker. | A speaker mention alone was not counted as a published scientific abstract. |
| Institutional repositories | UMC Utrecht, Erasmus, Aalborg, Groningen and Aichi; coauthor bibliography in Istanbul used to recover a 2007 lead. | Some record/list pages return 403; indexed bibliographic extracts were cross-checked where possible and access limitations recorded per source. |
| Web of Science | User signed in. Claimed profile **AAU-5138-2021**, explicitly linked to the target ORCID, lists 246 records. Profile pages yielded 243 records; the CV JSON export supplied 222 records including the three remaining full articles, so the union covers all 246. All **119 Meeting Abstract** records were reviewed. [Decision log](wos-review.json). | Free View does not expose an unrestricted Core Collection author search/full-record workflow. CV JSON export omits 24 profile records and abbreviates authors; changing document-type selection did not change its JSON contents. These limits were detected by comparing the UI with the export. No claim of complete WoS-wide coverage. |

Web searches included full-name and initial variants, congress names, minor histocompatibility antigens, HA-1/HA-3, PIRCHE, coauthors, and older 1990s/2000s material. Awards and invited lectures are search leads, not substitutes for a recovered abstract. The WoS pass recovered older minor-H contributions back to 2001. Material before 2001 and records outside the claimed profile may still be missing. This is a deep public-source search, **not a claim that every historical abstract has been found**.

## Attribution rules

1. An explicit Eric Spierings / E. Spierings author entry in publisher, institutional or official congress metadata, or direct work attribution in the claimed WoS profile tied to the exact ORCID, establishes the identity anchor. Affiliation and established coauthors corroborate it. Uncorroborated profile items remain for review.
2. A numbered abstract, meeting classification, annual-meeting issue or documented supplement establishes the work type. A normal article's abstract text does not turn the article into a conference abstract.
3. Similar content or a related publication alone never establishes authorship. Suggested related papers are labelled as possible connections, not identical studies.
4. Eric L. H. Spierings (headache/migraine), Julia Spierings (rheumatology) and other namesakes are excluded. Loose surname overlap was insufficient: the hand-hygiene and headache candidates were explicitly rejected during review.
5. A DOI for an entire abstract book is stored as `collectionDoi`; it is never treated as an individual abstract DOI. Missing individual DOIs are left blank.
6. DOI duplicates merge. The same study at different meetings is retained. Duplicate author entries in publisher metadata are collapsed without inventing missing authors. Abbreviated WoS author lists retain their source summary and are marked `authorsComplete: false`; a separate `verifiedProfileAuthor` attributes Eric without assigning an unknown position. Publisher title errors are retained unless a source supports a correction.

## Files and maintenance

- [`../../conference-abstracts-manual.json`](../../conference-abstracts-manual.json): authoritative curated metadata, sources, verification, related-publication suggestions, unresolved leads and rejected candidates.
- [`../../publication-audit.json`](../../publication-audit.json): current merged classification audit.
- [`../../scripts/conference-abstracts.mjs`](../../scripts/conference-abstracts.mjs): validates and merges the curated registry into every automated ORCID refresh. It moves DOI-confirmed abstracts out of the scientific-publication metrics while preserving ORCID provenance.
- `node scripts/apply-conference-abstracts.mjs`: apply registry changes locally without ORCID credentials.
- `node --test scripts/conference-abstracts.test.mjs`: check deduplication, provenance preservation, separation from full papers, attribution rejection and refresh idempotence.
- `build_registry.py`: optional discovery **draft** builder requiring local source cache and BeautifulSoup. It does not overwrite the authoritative registry. Drafts require source review and subsequent curated enrichment before inclusion.

Raw HTML/PDF/API caches remain local and are ignored by Git. New verified records belong in the curated registry; uncertain leads belong in `needsReview`. The daily ORCID workflow preserves this distinction.

## Further Web of Science work

With full institutional Core Collection access (beyond the signed-in Free View profile), search author `Spierings E*` and exact full name `Spierings, Eric`; combine ORCID/ResearcherID where available; filter **Meeting Abstract** and **Proceedings Paper** separately. Review affiliations (Leiden/LUMC, Utrecht/UMCU), coauthors (including Goulmy, Claas, Roelen, Boelens, Kuball, Geneugelijk, Niemann, Otten and Peereboom), and older minor-H/leprosy material. Do not restrict the entire search to Utrecht or PIRCHE because that would omit early career work.

Export Full Record with all authors, affiliations, document type, meeting details, DOI and WoS accession. Match accession/DOI first; then meeting, year, abstract number and title. Validate identity before promoting any record. An institutional Full Record export can extend and enrich this registry without changing the website architecture. The local CV JSON exports and raw profile captures are retained in the ignored source cache; only reviewed bibliographic facts and the decision log are published.

## Outstanding source questions

- 2005 skin-homing CD4 T-cell abstract: old Surrey repository is inaccessible; original congress citation not yet recovered.
- 1997 Schwann-cell item: two conflicting DOI registrations and uncertain meeting classification; not counted twice and not promoted without the original source.
- The 2019 Brazilian B*35 contribution was resolved using the exact title in an independent coauthor CV naming E. Spierings; full ordered authors remain unavailable and are not asserted.
- The pre-existing Leprosy Review supplement question was resolved as a nine-page full proceedings article (WoS Article; Proceedings Paper), so it remains among scientific publications.

These candidates are deliberately excluded from ORCID import and from the verified abstract count. Review decisions are explicit; uncertainty is not silently converted into a positive attribution.

## ORCID synchronization comparison

The public ORCID record was fetched after user sign-in: 313 work groups. The first identifier/title comparison produced 120 candidate matches. Checking the identical-title Krog full article against its separate congress contribution corrects this to **119 of the 126 verified abstracts already represented**, generally under `journal-article`, and **seven absent abstracts**. New-to-website discoveries must not be confused with new-to-ORCID works. A synchronization plan is retained locally; source-provided versions must be preserved and new editable versions grouped by their actual DOI/WoS UID. No collective book DOI may serve as an individual-work identifier.

ORCID replaced the manually selectable Conference abstract type with Conference output: [official type guidance](https://info.orcid.org/ufaqs/what-work-types-does-orcid-support/). Abstract identity remains explicit in the description and website registry. The two unresolved candidates are excluded.

## Completed ORCID synchronization

All **126 verified abstracts** now have an editable, public **Conference output** version, selected as the preferred source. This corrects 119 already represented abstracts and adds seven previously absent abstracts. The same true individual DOI, WoS UID or existing Lens ID links the versions; collective abstract-book DOIs are excluded. Citations retain the available author evidence and explicitly label abbreviated lists. No author order or contribution roles were invented.

The final public-API audit matched all 126 titles, years and identifiers, confirmed all 126 preferred versions, and read all 126 complete work records. Citation, conference and description metadata matched the prepared data exactly for 125 records; the first manually entered record has an equivalent, individually reviewed concise citation. The [synchronization audit](orcid-sync.json) records every registry ID and ORCID put code.

Seven older self-entered source versions incorrectly combined identifiers from different conference years, different congresses, or full articles with abstracts. Their unrelated identifiers were removed while retaining the correct identifiers and all source work records. This restored nine previously merged work groups. Together with the seven new abstracts, the public ORCID record grew from **313 to 329 work groups**. This count includes all ORCID work categories and must not be confused with the website's scientific-publication or abstract counts. The two full articles involved remain separate publications.

The registry now stores each synchronized ORCID put code, so automatic refreshes preserve record identity even if an enrichment provider varies a title or URL. Two unresolved historical candidates remain excluded. No credentials, private profile data or raw publisher documents are included in the public audit.
