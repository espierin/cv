# Conference abstract research — Eric Spierings

Reviewed 27 October 2026. Identity anchor: [ORCID 0000-0001-9441-1019](https://orcid.org/0000-0001-9441-1019), Leiden/UMC Utrecht immunology, histocompatibility and transplantation.

## Result and interpretation

The curated registry contains **51 verified conference abstracts (2009–2026)**. Eight were already separated in the ORCID dataset; five more were present but misclassified as scientific publications; **38 are newly recovered records**. The final website therefore contains 136 scientific publications and 51 conference abstracts. The abstract category increases by 43. Eight unresolved candidates remain for review (seven from discovery and one pre-existing ORCID classification query).

These are bibliographic congress contributions, not 51 distinct studies or claims that Eric personally presented each contribution. The same study presented at different documented meetings remains separate. A later full article remains a separate publication. Only bibliographic metadata, attribution evidence and source links are published here; publisher abstract books and full texts are not redistributed.

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
| Web of Science | Direct access attempted; redirected to Clarivate institutional/profile sign-in. Erasmus repository independently supplies **WOS:001082837700010** for the 2023 IHIWS epitope-project abstract. | **Full WoS search/export remains pending institutional login.** No claim of complete WoS coverage. |

Web searches included full-name and initial variants, congress names, minor histocompatibility antigens, HA-1/HA-3, PIRCHE, coauthors, and older 1990s/2000s material. Awards and invited lectures are search leads, not substitutes for a recovered abstract. Coverage before 2009 remains especially incomplete. This is a deep public-source search, **not a claim that every historical abstract has been found**.

## Attribution rules

1. An explicit Eric Spierings / E. Spierings author entry must be present in publisher, institutional or official congress metadata. Affiliation and established coauthors corroborate identity.
2. A numbered abstract, meeting classification, annual-meeting issue or documented supplement establishes the work type. A normal article's abstract text does not turn the article into a conference abstract.
3. Similar content or a related publication alone never establishes authorship. Suggested related papers are labelled as possible connections, not identical studies.
4. Eric L. H. Spierings (headache/migraine), Julia Spierings (rheumatology) and other namesakes are excluded. Loose surname overlap was insufficient: the hand-hygiene and headache candidates were explicitly rejected during review.
5. A DOI for an entire abstract book is stored as `collectionDoi`; it is never treated as an individual abstract DOI. Missing individual DOIs are left blank.
6. DOI duplicates merge. The same study at different meetings is retained. Duplicate author entries in publisher metadata are collapsed without inventing missing authors. Publisher title errors are retained unless a source supports a correction.

## Files and maintenance

- [`../../conference-abstracts-manual.json`](../../conference-abstracts-manual.json): authoritative curated metadata, sources, verification, related-publication suggestions, unresolved leads and rejected candidates.
- [`../../publication-audit.json`](../../publication-audit.json): current merged classification audit.
- [`../../scripts/conference-abstracts.mjs`](../../scripts/conference-abstracts.mjs): validates and merges the curated registry into every automated ORCID refresh. It moves DOI-confirmed abstracts out of the scientific-publication metrics while preserving ORCID provenance.
- `node scripts/apply-conference-abstracts.mjs`: apply registry changes locally without ORCID credentials.
- `node --test scripts/conference-abstracts.test.mjs`: check deduplication, provenance preservation, separation from full papers, attribution rejection and refresh idempotence.
- `build_registry.py`: optional discovery **draft** builder requiring local source cache and BeautifulSoup. It does not overwrite the authoritative registry. Drafts require source review and subsequent curated enrichment before inclusion.

Raw HTML/PDF/API caches remain local and are ignored by Git. New verified records belong in the curated registry; uncertain leads belong in `needsReview`. The daily ORCID workflow preserves this distinction.

## Next Web of Science pass

After institutional sign-in: search author `Spierings E*` and exact full name `Spierings, Eric`; combine ORCID/ResearcherID where available; filter **Meeting Abstract** and **Proceedings Paper** separately. Review affiliations (Leiden/LUMC, Utrecht/UMCU), coauthors (including Goulmy, Claas, Roelen, Boelens, Kuball, Geneugelijk, Niemann, Otten and Peereboom), and older minor-H/leprosy material. Do not restrict the entire search to Utrecht or PIRCHE because that would omit early career work.

Export Full Record with all authors, affiliations, document type, meeting details, DOI and WoS accession. Match accession/DOI first; then meeting, year, abstract number and title. Validate identity before promoting any record. An institutional WoS export can extend this registry without changing the website architecture.
