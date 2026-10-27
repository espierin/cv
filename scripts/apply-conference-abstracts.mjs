import fs from 'node:fs/promises';
import {mergeConferenceAbstracts, loadConferenceRegistry, conferenceAudit} from './conference-abstracts.mjs';
const path = new URL('../publications.json', import.meta.url);
const dataset = mergeConferenceAbstracts(JSON.parse(await fs.readFile(path,'utf8')), await loadConferenceRegistry());
await fs.writeFile(path, JSON.stringify(dataset,null,2)+'\n');
await fs.writeFile(new URL('../publication-audit.json', import.meta.url), JSON.stringify(conferenceAudit(dataset),null,2)+'\n');
console.log(`${dataset.count} scientific publications; ${dataset.conferenceAbstractCount} conference abstracts; ${dataset.abstractReviewCount} review candidates`);
