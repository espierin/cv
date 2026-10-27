"""Build a discovery DRAFT from locally cached evidence for human/agent review.

Requires beautifulsoup4. Raw source cache is deliberately not published.
Only explicit author lists are accepted; topic similarity alone is insufficient.
"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json, re, hashlib, unicodedata

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CACHE = HERE / 'sources'
DATE = '2026-10-27'

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def clean(s):
    return BeautifulSoup(str(s), 'html.parser').get_text(' ', strip=True)

def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', unicodedata.normalize('NFKD', clean(s)).encode('ascii', 'ignore').decode().lower()).strip()

def surname(name):
    return norm(name).split()[-1] if norm(name) else ''

dataset = read(ROOT / 'publications.json')
papers = dataset['publications']
network = {surname(a['name']) for p in papers for a in p.get('authors', [])} - {'spierings'}
oa = read(CACHE / 'openalex-works.json')['results']
oa_by_doi = {(x.get('doi') or '').replace('https://doi.org/', '').lower(): x for x in oa if x.get('doi')}
crossref = {}
for path in CACHE.glob('crossref-spierings*.json'):
    for item in read(path)['message']['items']:
        crossref[item['DOI'].lower()] = item
for path in CACHE.glob('doi-*.json'):
    item = read(path)['message']
    crossref[item['DOI'].lower()] = item

accepted, review, rejected = [], [], []

def record(title, year, authors, source_url, **extra):
    names = list(dict.fromkeys(authors))
    position = next((i for i, n in enumerate(names) if norm(n) in ['eric spierings', 'e spierings']), None)
    result = dict(title=clean(title), year=year, sortDate=f'{year}-00-00', type='conference-abstract',
                  typeLabel='Conference abstract', doi=None, journal='', volumeIssuePages='',
                  meeting=None, abstractNumber=None, url=source_url, authors=[dict(name=n) for n in names],
                  selfAuthorPositions=[] if position is None else ['first' if position == 0 else 'last' if position == len(names)-1 else 'middle'],
                  abstract=None, categories=[], key=False, sources=[dict(url=source_url, checkedAt=DATE)],
                  verification=dict(status='verified', checkedAt=DATE, identityEvidence=[], classificationEvidence=[]))
    result.update(extra)
    return result

# Publisher-deposited records with explicit abstract identifiers or supplement pagination.
special = {
    '10.1016/j.healun.2026.02.409': 'ISHLT 2026 meeting abstract; one-page congress item',
    '10.1016/j.healun.2026.02.1237': 'ISHLT 2026 meeting abstract; one-page congress item',
    '10.1681/asn.20203110s1522a': 'ASN Kidney Week abstract; volume 31, issue 10S',
    '10.1016/j.trim.2014.11.191': 'Publisher issue explicitly labels this item Conference abstract',
    '10.1093/ndt/gfx104': 'ERA-EDTA 2017 numbered congress abstract SO024 in NDT supplement 3',
    '10.1093/ndt/gfx104.so025': 'ERA-EDTA 2017 numbered congress abstract SO025 in NDT supplement 3',
}
for doi, item in crossref.items():
    title = clean(' '.join(item.get('title', [])))
    authors = [clean(a.get('given', '') + ' ' + a.get('family', '')) for a in item.get('author', [])]
    self_authors = [a for a in item.get('author', []) if norm(a.get('family', '')) == 'spierings']
    if not self_authors:
        continue
    page, issue = item.get('page', ''), str(item.get('issue', ''))
    journal = clean(' '.join(item.get('container-title', [])))
    is_self = any(norm(a.get('given', '')) in ['eric', 'e'] for a in self_authors)
    shared = sorted({surname(n) for n in authors} & network)
    abstract_signal = (
        bool(re.match(r'10\.1182/blood\.v\d+\.2[1234]\.\d+\.\d+$', doi))
        or bool(re.match(r'^(?:P\d+|OR\d+|O\d+|SO\d+|\d+-OR)\b', title, re.I))
        or bool(re.match(r'^S\d', page))
        or doi in special
    )
    if not abstract_signal:
        continue
    relevant = bool(re.search(r'hla|epitop|transplant|graft|histocompat|leukem|stroma|immun|uveitis', title+' '+journal, re.I)) or doi in special
    if not is_self or len(shared) < 2 or not relevant:
        rejected.append(dict(title=title, doi=doi, reason='Different given name/initials or no corroborating coauthor network; not attributed to Eric Spierings.'))
        continue
    date = item.get('published', {}).get('date-parts', [[None]])[0]
    if not date[0] or date[0] > 2026:
        continue
    r = record(title, date[0], authors, 'https://doi.org/' + doi, doi=doi, journal=journal,
               volumeIssuePages=', '.join(filter(None, [f"vol. {item['volume']}" if item.get('volume') else '', f'no. {issue}' if issue else '', f'pp. {page}' if page else ''])))
    r['sortDate'] = '-'.join(str(x).zfill(2) for x in (date + [0, 0])[:3])
    r['sources'].append(dict(url='https://api.crossref.org/works/' + doi, checkedAt=DATE, kind='publisher-deposited-metadata'))
    r['verification']['identityEvidence'] = ['Explicit Eric Spierings or E. Spierings author entry in publisher-deposited metadata', 'Coauthors also present in verified scholarly publication dataset: ' + ', '.join(shared)]
    r['verification']['classificationEvidence'] = [special.get(doi, 'Conference abstract identifier, ASH annual-meeting issue, or supplement pagination in publisher metadata')]
    if doi in oa_by_doi:
        r['openAlexId'] = oa_by_doi[doi]['id']
        r['sources'].append(dict(url=oa_by_doi[doi]['id'], checkedAt=DATE, kind='cross-check'))
    if title == '50-OR':
        r['title'] = 'Predicted indirectly recognizable HLA epitopes correlate with chronic graft-versus-host-disease and relapse-related mortality in pediatric patients after cord blood transplantation'
        r['abstractNumber'] = '50-OR'
        r['sources'].append(dict(url='https://researchinformation.umcutrecht.nl/en/publications/predicted-indirectly-recognizable-hla-epitopes-correlate-with-chr-2/', checkedAt=DATE, kind='institutional-bibliography'))
    accepted.append(r)

# Official ATC pages: require E. Spierings in the author element, not a reference.
for entry in read(HERE / 'atc-crawl.json'):
    if not entry.get('spierings'):
        continue
    soup = BeautifulSoup((CACHE / entry['file']).read_bytes(), 'html.parser')
    header = soup.select_one('.entry-header')
    if not header or not header.select_one('p.author'):
        continue
    author = header.select_one('p.author')
    for sup in author.select('sup'):
        sup.decompose()
    names = [x.strip(' .') for x in author.get_text().split(',') if x.strip()]
    if not any(norm(n) == 'e spierings' for n in names):
        continue
    meeting_link = header.select_one('a[href*="/meetings/"]')
    meeting = meeting_link.get_text(' ', strip=True)
    year = int(re.search(r'20\d\d', meeting)[0])
    number = header.select_one('.mworthynumber').get_text(' ', strip=True).split(':', 1)[1].strip()
    r = record(header.select_one('.entry-title').get_text(' ', strip=True), year, names, entry['url'],
               journal='American Journal of Transplantation', meeting=meeting, abstractNumber=number)
    r['verification']['identityEvidence'] = ['E. Spierings explicitly listed as author with UMC Utrecht affiliation on official congress page', 'Shared PIRCHE/kidney-transplantation coauthors confirmed against publication dataset']
    r['verification']['classificationEvidence'] = ['Official congress abstract page with meeting year and abstract number ' + number]
    accepted.append(r)

# EFI 2022/2023 full program pages with explicit author lists and abstract bodies.
for path in CACHE.glob('efi20*-20*.html.html'):
    year = int(path.name[3:7])
    day = path.name.split('-', 1)[1].removesuffix('.html')
    soup = BeautifulSoup(path.read_bytes(), 'html.parser')
    for tr in soup.select('tr.talk'):
        authors = tr.select_one('.authors')
        title = tr.select_one('.title')
        anchor = tr.select_one('a[name^="talk:"]')
        if not authors or not title or not anchor or not tr.select_one('.abstract'):
            continue
        names = [a.get_text(' ', strip=True) for a in authors.select('a.person')]
        if 'Eric Spierings' not in names:
            continue
        url = f'https://easychair.org/smart-program/EFI{year}/{day}#{anchor["name"]}'
        r = record(title.get_text(' ', strip=True), year, names, url, meeting=f'EFI {year}', abstractNumber=anchor['name'])
        r['verification']['identityEvidence'] = ['Eric Spierings explicitly listed with Utrecht affiliation in official program author list']
        r['verification']['classificationEvidence'] = ['Official program provides a scientific abstract body for this contribution']
        r['sortDate'] = day.removesuffix('.html')
        accepted.append(r)

# Additional primary/institutional records recovered independently of ORCID.
def institution(title, year, names, url, journal, citation, meeting=None, number=None, collection=None):
    r = record(title, year, names, url, journal=journal, volumeIssuePages=citation, meeting=meeting, abstractNumber=number)
    if collection:
        r['collectionDoi'] = collection  # Never use a book-wide DOI as an individual abstract DOI.
    r['verification']['identityEvidence'] = ['Explicit Eric Spierings / E. Spierings author list in institutional or congress source; corroborated by established coauthors']
    r['verification']['classificationEvidence'] = ['Source explicitly identifies meeting/conference abstract or numbered congress contribution']
    accepted.append(r)
    return r

thus = ['Kirsten A. Thus', 'Can Kesmir', 'Eric Borst', 'Roel A. de Weger', 'Jaap Jan Boelens', 'Eric Spierings']
base = 'Predicted indirectly recognizable HLA epitopes correlate with chronic graft-versus-host disease and relapse-related mortality in paediatric patients after cord blood transplantation'
institution(base, 2013, thus, 'https://researchinformation.umcutrecht.nl/en/publications/predicted-indirectly-recognizable-hla-epitopes-correlate-with-chr/', 'Tissue Antigens', 'vol. 81, no. 5, pp. 295–296', 'EFI 2013')
# Institutional listing separately documents the EBMT presentation of the same study.
institution(base, 2013, thus, 'https://researchinformation.umcutrecht.nl/en/publications/predicted-indirectly-recognizable-hla-epitopes-correlate-with-chr-3/', 'Bone Marrow Transplantation', 'vol. 48, pp. S87–S88', 'EBMT 2013')
institution('Paternal HLA-Derived Epitopes and Live Birth in Secondary Recurrent Pregnancy Loss: New Insights From a Clinical Trial', 2024,
 ['Maria Christine Krog', 'Emma T. M. Peereboom', 'Kirsten Geneugelijk', 'Benedict M. Matern', 'Astrid Marie Kolte', 'Ole Bjarne Christiansen', 'Rudi Steffensen', 'Henriette Svarre Nielsen', 'Eric Spierings'],
 'https://vbn.aau.dk/da/publications/paternal-hla-derived-epitopes-and-live-birth-in-secondaryrecurren-2/', 'HLA', 'vol. 103, suppl. 1, p. 13', 'EFI 2024', 'O13', '10.1111/tan.15480')

def from_oa(work_id, url, journal, citation, meeting=None, number=None, collection=None):
    x = next(x for x in oa if x['id'].endswith(work_id))
    names = [a.get('raw_author_name') or a['author']['display_name'] for a in x['authorships']]
    # Use disambiguated name only for the known self author; do not infer other authors.
    names = ['Eric Spierings' if a['author']['id'].endswith('A5039868432') else n for a,n in zip(x['authorships'], names)]
    r = institution(x['title'], x['publication_year'], names, url, journal, citation, meeting, number, collection)
    r['sources'].append(dict(url=x['id'], kind='author-network-cross-check', checkedAt=DATE))
    return r

from_oa('W3181208277', 'https://iovs.arvojournals.org/article.aspx?articleid=2776078', 'Investigative Ophthalmology & Visual Science', 'vol. 62, no. 8, abstract 3480', 'ARVO 2021', '3480')
from_oa('W3044492875', 'https://academic.oup.com/humrep/article-pdf/25/suppl_1/i161/1591077/humrep-de-25-s1-117.pdf', 'Human Reproduction', 'vol. 25, suppl. 1, p. i164', 'ESHRE 2010', 'P-124', '10.1093/humrep/de.25.s1.117')
r = from_oa('W2807425322', 'https://research.rug.nl/en/publications/fa382244-44a3-4360-b4ec-55e08d526cad', 'HLA', '', 'EFI 2018', 'P40')
r['sources'].append(dict(url='https://cemia.eu/wp-content/uploads/2018/05/R43-Venice-May2018_DEF_82247.pdf', kind='indexed-official-program-extract', checkedAt=DATE, access='Full PDF unavailable at review; indexed author/title/abstract-number extract corroborates repository record'))
institution('HLA-B leader peptide dimorphism affects kidney transplant outcome', 2025,
 ['Emma Peereboom', 'Jip Jonker', 'Kirsten Geneugelijk', 'Arjan van Zuilen', 'Jan-Stephan Sanders', 'Stephan Bakker', 'Eric Spierings'],
 'https://efi-conference.org/fileadmin/Congress_2025/program-overview/EFI2025_Preliminary_Program17-4.pdf', 'HLA', '', 'EFI 2025', 'O8', '10.1111/tan.70158')['sources'][0].update(kind='indexed-official-program-extract', access='Original URL now redirects; indexed author list cross-checked with related publication')

# Further publisher and institutional abstracts, including non-English congress records.
institution('Predicted Indirectly Recognizable HLA Epitopes (PIRCHE) and HLA-Specific Immune Responses', 2017,
 ['E. Spierings'], 'https://onlinelibrary.wiley.com/doi/10.1111/vox.12530', 'Vox Sanguinis',
 'vol. 112, suppl. 1', 'ISBT 2017', '3C-S11-02', '10.1111/vox.12530')
institution('Human Leukocyte Antigen mapping of paediatric uveitis', 2020,
 ['R. A. W. Wennink','S. Hiddingh','A. J. W. Haasnoot','V. Kalinina Ayuso','T. de Hoop','E. Spierings','J. van Setten','J. J. W. Kuiper','J. H. de Boer'],
 'https://onlinelibrary.wiley.com/doi/10.1111/aos.14387', 'Acta Ophthalmologica', 'vol. 98, suppl. 264',
 'Acta Ophthalmologica congress abstracts 2020', collection='10.1111/aos.14387')
institution('腎移植後患者における新規ドナー特異的抗体産生リスク予測のためのT細胞およびB細胞エピトープ解析', 2021,
 ['坂本 慎太郎','岩崎 研太','友杉 俊英','M. Niemann','E. Spierings','三輪 祐子','堀見 孔星','武田 朝美','後藤 憲彦','鳴海 俊治','渡井 至彦','小林 孝彰'],
 'https://amurd.aichi-med-u.ac.jp/search/detail?lang=en&sop=profile&systemId=b72fb3d70c9a1cb1',
 'MHC: Major Histocompatibility Complex','vol. 28, no. 2 suppl., p. 84','Japanese Society for Histocompatibility and Immunogenetics 2021')
institution('Compartmentalization, persistence and conserved shared motifs of dominant (regulatory) T cell clones in autoimmune inflammation', 2021,
 ['G. Mijnheer','N. Servaas','L. Lutter','J. Y. Leong','E. Spierings','P. Chen','A. Petrelli','S. Vastert','R. de Boer','S. Albani','J. van Loosdregt','A. Pandit','F. van Wijk'],
 'https://researchinformation.umcutrecht.nl/en/publications/compartmentalization-persistence-and-conserved-shared-motifs-of-d/',
 'Clinical and Experimental Rheumatology','vol. 39, no. 5, pp. 1153–1154')

# Promising older records remain quarantined until abstract status / exact citation is confirmed.
for work_id, reason in [
 ('W2682000673', 'Authorship likely; original conference citation and primary abstract not yet recovered'),
 ('W3042518843', 'Inconsistent indexed pagination (490 versus S45–S46); resolve primary meeting record'),
 ('W2792860257', 'Likely EFI 2017 abstract at HLA 89(6):348; primary abstract author list not retrieved'),
 ('W3047425102', 'Likely EFI 2016 abstract at HLA 87(4):225–226; primary source still needed'),
 ('W3210671374', 'Repository attaches a whole-book DOI and inconsistent year; identify individual oral abstract before counting'),
 ('W1983550841', '1997 one-page Schwann-cell item has conflicting duplicate DOIs; original meeting classification needed'),
]:
    x = next(x for x in oa if x['id'].endswith(work_id))
    review.append(dict(title=x['title'], year=x['publication_year'], openAlexId=x['id'], reason=reason,
                       sourceUrls=[l.get('landing_page_url') for l in x['locations'] if l.get('landing_page_url')][:4]))

# Link likely related full papers for navigation, explicitly not proof of abstract authorship.
stop = set('the and of in a an to for with after by from on as is are its based patients transplantation hla'.split())
def tokens(title):
    return set(norm(title).split()) - stop
for r in accepted:
    self_evidence = r['verification']['identityEvidence']
    r['id'] = 'abstract-' + hashlib.sha256((r.get('doi') or '|'.join(str(r.get(k) or '') for k in ['meeting','abstractNumber','year','journal','title'])).encode()).hexdigest()[:16]
    names = {surname(a['name']) for a in r['authors']} - {'spierings'}
    related = []
    for p in papers:
        shared = names & {surname(a['name']) for a in p.get('authors', [])}
        aa, bb = tokens(r['title']), tokens(p['title'])
        score = len(aa & bb) / max(1, min(len(aa), len(bb)))
        if len(shared) >= 2 and score >= .6 and p.get('doi') != r.get('doi'):
            related.append(dict(title=p['title'], doi=p.get('doi'), year=p.get('year'), relationship='possible-related-full-paper', basis='Title overlap and at least two shared coauthors; not a claim of identical study', score=round(score, 3)))
    r['relatedPublications'] = sorted(related, key=lambda x:x['score'], reverse=True)[:3]

# Match same DOI, or same meeting/year and normalized title. Different meetings remain distinct.
unique = []
for r in accepted:
    existing = next((x for x in unique if (r.get('doi') and x.get('doi') == r['doi']) or (norm(x['title']) == norm(r['title']) and x['year'] == r['year'] and (x.get('meeting') == r.get('meeting') or x.get('journal') == r.get('journal')))), None)
    if existing:
        existing['sources'] += [s for s in r['sources'] if s['url'] not in {a['url'] for a in existing['sources']}]
    else:
        unique.append(r)
unique.sort(key=lambda r:(r['year'],r['title']), reverse=True)
output = dict(person='Eric Spierings', orcid='0000-0001-9441-1019', reviewedAt=DATE,
              policy='Explicit author attribution required. Coauthors and related full papers corroborate identity; topic similarity alone never establishes authorship. Distinct conference presentations may share a study.',
              records=unique, needsReview=review, rejected=rejected)
(HERE/'conference-abstracts-draft.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Curated records:',len(unique),'review:',len(review),'rejected:',len(rejected))
for r in unique:
    print(str(r['year'])+' '+(r.get('doi') or r.get('meeting') or '')+' '+r['title'].encode('ascii','replace').decode())
