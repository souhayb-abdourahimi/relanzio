import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { salutation, followupMessage } from '../shared/followup-templates.js';

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
  assert.match(msgs[2].subject,/dernier suivi/);
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
