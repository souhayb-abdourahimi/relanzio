import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { salutation, followupMessage } from '../shared/followup-templates.js';
import { classifyReply } from '../server/reply-classifier.js';

test('salutation never produces "Bonjour M.," and always ends cleanly',()=>{
  const cases={
    'M. Durand':'Bonjour Monsieur Durand,','M Durand':'Bonjour Monsieur Durand,','Mr Durand':'Bonjour Monsieur Durand,','Mr. Durand':'Bonjour Monsieur Durand,',
    'Monsieur Durand':'Bonjour Monsieur Durand,','Mme Benali':'Bonjour Madame Benali,','Madame Benali':'Bonjour Madame Benali,','Mlle Petit':'Bonjour Madame Petit,',
    'Dr Martin':'Bonjour Docteur Martin,','Me Lefort':'Bonjour Maître Lefort,','M. et Mme Durand':'Bonjour Madame, Monsieur,',
    'Jean Moreau':'Bonjour Jean Moreau,','jean-paul de la tour':'Bonjour Jean-Paul de la Tour,','DURAND Jean':'Bonjour Durand Jean,','Zoë Noël':'Bonjour Zoë Noël,',
    'SARL Bâti Sud':'Bonjour,','Société Générale du Bâtiment':'Bonjour,','Dupont Toitures':'Bonjour,','Électricité Garnier':'Bonjour,','Lefèvre & Fils':'Bonjour,',
    'Durand':'Bonjour,','M.':'Bonjour,','Mme':'Bonjour,','Monsieur':'Bonjour,','':'Bonjour,','   ':'Bonjour,','  M.   Durand  ':'Bonjour Monsieur Durand,',
    'contact@durand.fr':'Bonjour,','Client 42':'Bonjour,','Jean\tMoreau':'Bonjour Jean Moreau,','<script>':'Bonjour,'
  };
  for(const [name,expected] of Object.entries(cases))assert.equal(salutation(name),expected,JSON.stringify(name));
  assert.equal(salutation(null),'Bonjour,');assert.equal(salutation(undefined),'Bonjour,');assert.equal(salutation('A'.repeat(80)),'Bonjour,');
  for(const name of Object.keys(cases))assert.doesNotMatch(salutation(name),/^Bonjour (M|Mme|Mr|Dr|Me)\.?,/);
});

test('three distinct, short templates; the artisan signs; no amount, no pressure',()=>{
  const q={clientName:'M. Durand',title:'Réfection toiture',companyName:'Toitures Martin'};
  const msgs=[0,1,2].map(i=>followupMessage(q,i));
  assert.deepEqual(msgs.map(m=>m.step),[1,2,3]);
  assert.equal(new Set(msgs.map(m=>m.body)).size,3);assert.equal(new Set(msgs.map(m=>m.subject)).size,3);
  for(const m of msgs){
    assert.match(m.body,/^Bonjour Monsieur Durand,\n\n/);
    assert.match(m.body,/« Réfection toiture »/);
    assert.match(m.body,/Bien cordialement,\nToitures Martin$/);
    assert.ok(m.body.length<420,`short: ${m.body.length}`);
    assert.doesNotMatch(m.body,/€|urgent|dernière chance|offre|remise/i);assert.doesNotMatch(m.body,/\bIA\b/);
  }
  assert.match(msgs[2].subject,/dernier message/);
  assert.equal(followupMessage(q,7).step,3,'clamped');
  assert.doesNotMatch(followupMessage({clientName:'X Y',title:'T',companyName:''},0).body,/cordialement,\n$/,'no empty signature line');
  assert.equal(followupMessage({clientName:'',title:'   ',companyName:'A'},0).subject,'Votre devis « votre projet »');
});

test('preview and send use the same template, with no AI call',()=>{
  const email=readFileSync(new URL('../server/email.js',import.meta.url),'utf8');
  const followups=readFileSync(new URL('../server/followups.js',import.meta.url),'utf8');
  assert.match(email,/followupMessage\(\{clientName:quote\.client_name,title:quote\.title,companyName\},step\)/);
  assert.doesNotMatch(email+followups,/openai|responses\.create/i);
  assert.match(followups,/const generated = createFollowupPreview\(claimed, profile\);/);
});

// The words the client reads, without greeting and signature.
const core=m=>m.body.split('\n\n').slice(1,-1).join(' ');
const words=t=>new Set(t.toLowerCase().normalize('NFC').match(/\p{L}{4,}/gu).filter(w=>!['devis','réfection','toiture'].includes(w)));

test('each follow-up is written for its step: first nudge, reference to the first one, explicit last message',()=>{
  const q={clientName:'Mme Benali',title:'Réfection toiture',companyName:'Toitures Martin'};
  const [r1,r2,r3]=[0,1,2].map(i=>followupMessage(q,i));
  // 1: light, did you see it, offer to answer a question or adjust; nothing about a previous message or an end.
  assert.match(core(r1),/Avez-vous pu en prendre connaissance \?/);
  assert.match(core(r1),/question/);assert.match(core(r1),/ajusté/);
  assert.doesNotMatch(core(r1),/précédent|dernier|déjà|encore/i);
  assert.equal(r1.subject,'Votre devis « Réfection toiture »');
  // 2: says a first follow-up was made, asks if still relevant, makes a one-word answer easy; not the last one.
  assert.match(core(r2),/^Suite à mon précédent message/);
  assert.match(core(r2),/toujours d’actualité/);assert.match(core(r2),/Un mot en réponse me suffit/);
  assert.doesNotMatch(core(r2),/dernier/i);
  assert.equal(r2.subject,'Devis « Réfection toiture » : toujours d’actualité ?');
  // 3: explicitly the last message, simple oui / plus tard / non.
  assert.match(core(r3),/^Ce sera mon dernier message/);
  assert.match(core(r3),/« oui », « plus tard » ou « non »/);
  assert.match(core(r3),/ne souhaite pas vous solliciter inutilement/);
  assert.equal(r3.subject,'Devis « Réfection toiture » : dernier message de ma part');
  // Same greeting and signature on all three.
  for(const m of [r1,r2,r3]){assert.match(m.body,/^Bonjour Madame Benali,\n\n/);assert.match(m.body,/\n\nBien cordialement,\nToitures Martin$/);}
});

test('the three follow-ups are really different messages, not the same text with a few words changed',()=>{
  const msgs=[0,1,2].map(i=>followupMessage({clientName:'Jean Moreau',title:'Réfection toiture',companyName:'Toitures Martin'},i));
  for(const [a,b] of [[0,1],[0,2],[1,2]]){
    const A=words(core(msgs[a])),B=words(core(msgs[b]));
    const shared=[...A].filter(w=>B.has(w)).length,jaccard=shared/new Set([...A,...B]).size;
    assert.ok(jaccard<0.25,`relances ${a+1} et ${b+1} trop proches : ${jaccard.toFixed(2)} (${[...A].filter(w=>B.has(w)).join(', ')})`);
    assert.notEqual(core(msgs[a]).slice(0,25),core(msgs[b]).slice(0,25),'different openings');
  }
});

test('never more than 3, and every step stays safe whatever the name or title',()=>{
  for(const step of [-1,0,1,2,3,10,'x',null]){const m=followupMessage({clientName:'M.',title:'T',companyName:'A'},step);assert.ok(m.step>=1&&m.step<=3);}
  for(const name of ['M.','SARL Bâti Sud','Durand','',null,'Mme','contact@x.fr'])for(const i of [0,1,2]){
    const m=followupMessage({clientName:name,title:'Cuisine',companyName:'Plomberie B'},i);
    assert.match(m.body,/^Bonjour,\n\n/,`${name} step ${i+1}`);assert.doesNotMatch(m.body,/Bonjour M\.,/);
  }
});

test('a client answering any of our subjects is a real answer, never taken for an auto-reply or a bounce',()=>{
  for(const i of [0,1,2]){
    const {subject}=followupMessage({clientName:'M. Durand',title:'Travaux pendant les congés',companyName:'T'},i);
    for(const prefix of ['Re: ','RE : ','TR: ',''])
      assert.equal(classifyReply({text:'Oui merci, on en parle demain.',subject:prefix+subject,title:'Travaux pendant les congés'}).effect,'stop',prefix+subject);
  }
});
