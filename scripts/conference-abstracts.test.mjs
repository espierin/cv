import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeConferenceAbstracts, abstractKey, loadConferenceRegistry} from './conference-abstracts.mjs';
const make = (extra={}) => ({id:'a',title:'Epitope matching study',year:2020,meeting:'EFI',doi:'10.123/a',
  authors:[{name:'E. Spierings'}],sources:[{url:'https://example.org/abstract'}],
  verification:{status:'verified',identityEvidence:['Author and affiliation'],classificationEvidence:['Numbered abstract']},...extra});
const registry = records => ({orcid:'self',records,needsReview:[{title:'Unresolved candidate',year:1998}]});
const data = {orcid:'self',source:'ORCID',publications:[{title:'Full paper',doi:'10.123/full'},{title:'Previously misclassified abstract',doi:'10.123/a',putCode:1}],conferenceAbstracts:[]};
test('moves confirmed abstracts, preserves full paper and provenance; repeated refresh is idempotent',()=>{
  const first = mergeConferenceAbstracts(data, registry([make()]));
  assert.equal(first.count,1); assert.equal(first.publications[0].doi,'10.123/full');
  assert.equal(first.conferenceAbstracts[0].putCode,1); assert.equal(first.conferenceAbstractCount,1);
  assert.deepEqual(mergeConferenceAbstracts(first,registry([make()])),first);
  assert.equal(first.abstractReviewCount,1);
});
test('distinct meetings with the same title and shared book DOI remain separate',()=>{
  const a=make({id:'a',doi:null,collectionDoi:'10.123/book'});
  const b=make({id:'b',doi:null,meeting:'ASHI',collectionDoi:'10.123/book'});
  assert.notEqual(abstractKey(a),abstractKey(b));
  assert.equal(mergeConferenceAbstracts(data,registry([a,b])).conferenceAbstractCount,2);
});
test('invalid attribution and individual/book DOI confusion fail closed',()=>{
  assert.throws(()=>mergeConferenceAbstracts(data,registry([make({authors:[{name:'E. L. H. Spierings'}]})])));
  assert.throws(()=>mergeConferenceAbstracts(data,registry([make({collectionDoi:'10.123/a'})])));
  assert.throws(()=>mergeConferenceAbstracts(data,{...registry([]),orcid:'wrong'}));
});
test('curated dataset contains sufficient verification and no known false positives', async()=>{
  const r=await loadConferenceRegistry();
  const out=mergeConferenceAbstracts({...data,orcid:r.orcid},r);
  assert.equal(out.conferenceAbstractCount,r.records.length);
  for (const bad of ['10.1016/j.jpain.2006.01.216','10.1186/2047-2994-2-s1-p141']) assert.ok(!r.records.some(x=>x.doi===bad));
  assert.equal(new Set(r.records.map(abstractKey)).size,r.records.length);
});
