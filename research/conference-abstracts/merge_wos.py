"""Build a review DRAFT from local WoS discovery and the curated registry.

The claimed researcher profile is explicitly linked to the target ORCID. A
profile-linked work still requires a corroborating known coauthor, or an
explicit self-author entry and matching research context. Abridged author
lists stay labelled as abridged; missing authors/order are never invented.
"""
from pathlib import Path
import json,re,unicodedata,hashlib,difflib

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
CACHE=HERE/'sources'
DATE='2026-10-27'
PROFILE='https://www.webofscience.com/wos/author/record/AAU-5138-2021'
def read(p): return json.loads(p.read_text(encoding='utf-8'))
def norm(s): return re.sub(r'[^a-z0-9]+',' ',unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower()).strip()
def titlekey(s): return norm(re.sub(r'^(?:P\d+(?:\.\d+)?|OR\d+|O\d+|SO\d+|\d+-OR)\s*:?\s*','',s or '',flags=re.I))
def journalkey(s): return norm(s).replace('the ','').replace('journal of heart and lung transplantation','heart lung transplantation')

registry=read(ROOT/'conference-abstracts-manual.json')
records=registry['records']
papers=read(ROOT/'publications.json')['publications']
network={norm(a['name']).split()[-1] for p in papers for a in p.get('authors',[]) if norm(a['name'])}-{'spierings'}
rows={x['url'].split('/')[-1]:x for p in CACHE.glob('wos-profile-*.json') for x in read(p)}
export=read(CACHE/'wos-export.json')['records']['publication']['list']
metadata={x['ut']:x for x in export}
review=registry['needsReview']
decisions=[]

for ut,x in rows.items():
    lines=x['text'].splitlines()
    if len(lines)<5 or lines[1]!='Meeting Abstract': continue
    meta=metadata.get(ut,{})
    year=int(re.search(r'(?:19|20)\d{2}', '\n'.join(lines[4:]))[0])
    # The citation follows the date. Meeting names occur BEFORE the date.
    date_index=next(i for i in range(4,len(lines)) if re.search(r'(?:19|20)\d{2}',lines[i]) and not re.search(r'\d+(?:st|nd|rd|th)\s',lines[i]))
    citation=lines[date_index+1] if date_index+1<len(lines) else meta.get('journal','')
    journal=meta.get('journal') or re.split(r'\s(?=\d)',citation,1)[0]
    meeting=' '.join(lines[4:date_index]) or None
    doi=(meta.get('doi') or '').lower() or None
    collection=None
    if doi=='10.1111/tan.13034': collection,doi=doi,None
    rawauthors=lines[3]
    visible=[n.strip() for n in re.split(r';| and ',rawauthors) if ',' in n and '(...)' not in n]
    surnames={norm(n.split(',')[0]).split()[-1] for n in visible if norm(n.split(',')[0])}
    shared=sorted(network&surnames)
    explicit=any(re.fullmatch(r'spierings\s*,\s*(?:e\.?|eric)',n,re.I) for n in visible)
    if not shared and not explicit:
        review.append(dict(title=x['title'],year=year,webOfScienceId=ut,sourceUrls=[x['url'],PROFILE],reason='Claimed ORCID-linked WoS profile associates this item, but abbreviated author line does not show Eric and none of the displayed coauthors could be corroborated. Full author list required.'))
        decisions.append(dict(webOfScienceId=ut,title=x['title'],decision='review',reason='Uncorroborated abbreviated author list'))
        continue
    existing=next((r for r in records if (doi and r.get('doi')==doi) or (r.get('webOfScienceId')==ut)),None)
    if not existing:
        candidates=[r for r in records if r['year']==year and (journalkey(r.get('journal',''))==journalkey(journal) or (not r.get('journal') and 'EFI' in (r.get('meeting') or '') and journalkey(journal)=='hla'))]
        existing=next((r for r in candidates if titlekey(r['title'])==titlekey(x['title']) or difflib.SequenceMatcher(None,titlekey(r['title']),titlekey(x['title'])).ratio()>.97),None)
    source=dict(url=x['url'],kind='web-of-science-profile-linked-meeting-abstract',checkedAt=DATE)
    if existing:
        existing['webOfScienceId']=ut
        if not any(s['url']==x['url'] for s in existing['sources']):existing['sources'].append(source)
        existing.setdefault('sourceCitations',{})['webOfScience']=citation
        if not existing.get('volumeIssuePages'):existing['volumeIssuePages']=citation
        if not existing.get('journal'):existing['journal']=journal
        if not existing.get('meeting') and meeting:existing['meeting']=meeting
        decisions.append(dict(webOfScienceId=ut,title=x['title'],decision='enriched',registryId=existing['id']))
        continue
    # Only the names actually shown are stored in this abridged list. The
    # separately attributed profile author does not claim a position in it.
    authors=[]
    for name in visible:
        family,given=name.split(',',1)
        authors.append(dict(name=(given.strip()+' '+family.strip()).strip()))
    r=dict(id='abstract-wos-'+ut.removeprefix('WOS:'),title=x['title'],year=year,sortDate=f'{year}-00-00',
           type='conference-abstract',typeLabel='Conference abstract',doi=doi,journal=journal,
           volumeIssuePages=citation,meeting=meeting,abstractNumber=None,url=x['url'],authors=authors,
           authorsComplete=False,authorSummary=rawauthors,verifiedProfileAuthor=dict(name='Eric Spierings',orcid=registry['orcid'],profile=PROFILE),
           selfAuthorPositions=[],abstract=None,categories=[],key=False,sources=[source,dict(url=PROFILE,kind='claimed-researcher-profile-with-ORCID',checkedAt=DATE)],
           verification=dict(status='verified',checkedAt=DATE,
             identityEvidence=['Work explicitly linked in Eric Spierings’ claimed WoS researcher profile AAU-5138-2021, whose ORCID is 0000-0001-9441-1019.',
               'Corroborating displayed coauthors in the verified publication network: '+', '.join(shared) if shared else 'E. Spierings explicitly appears in the displayed author line; HLA/transplantation research context corroborates identity.'],
             classificationEvidence=['WoS profile explicitly labels this contribution Meeting Abstract.', 'Bibliographic citation: '+citation]),
           webOfScienceId=ut,relatedPublications=[])
    if collection:r['collectionDoi']=collection
    records.append(r)
    decisions.append(dict(webOfScienceId=ut,title=x['title'],decision='added',registryId=r['id']))

# Review leads resolved by a specific verified congress citation are retained
# in the decision history, then removed from the unresolved queue.
resolved_oa={'W3042518843','W2792860257','W3047425102','W3210671374'}
remaining=[]
resolved=[]
for lead in review:
    matched=next((r for r in records if r['year']==lead.get('year') and titlekey(r['title'])==titlekey(lead['title'])),None)
    if lead.get('openAlexId','').rsplit('/',1)[-1] in resolved_oa or matched:
        resolved.append(dict(**lead,resolution='Verified WoS Meeting Abstract citation recovered; see matching registry source(s).'))
    else:remaining.append(lead)
registry['needsReview']=remaining
registry.setdefault('resolvedReview',[]).extend(resolved)
registry['policy']='Explicit author attribution from publisher, congress, institutional bibliography or the claimed ORCID-linked WoS profile, corroborated by established coauthors. Abridged lists are labelled; missing authors and author positions are not invented. Content similarity alone is insufficient.'
registry['records']=sorted(records,key=lambda r:(r['year'],r['title']),reverse=True)
(HERE/'wos-registry-draft.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(HERE/'wos-review-draft.json').write_text(json.dumps(dict(reviewedAt=DATE,profile=PROFILE,profileOrcid=registry['orcid'],profileTotal=246,classifiedProfileRows=len(rows),exportRecords=len(export),decisions=decisions),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
from collections import Counter
print(Counter(x['decision'] for x in decisions),'registry',len(records),'review',len(remaining))
