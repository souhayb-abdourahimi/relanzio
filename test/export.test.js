import test from 'node:test';
import assert from 'node:assert/strict';
import {csvCell,rowsToSemicolonCsv} from '../server/export.js';

test('CSV keeps French accents quotes apostrophes and Unicode',()=>{
  const csv=rowsToSemicolonCsv([{client_name:"Élodie d’Azur",title:'Fenêtres "premium" 🪟',amount:'1234,56'}],['client_name','title','amount']);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv,/Élodie d’Azur/);
  assert.match(csv,/Fenêtres ""premium"" 🪟/);
  assert.match(csv,/1234,56/);
});

test('CSV neutralizes spreadsheet formula injection',()=>{
  for(const value of ['=1+1','+SUM(A1:A2)','-2+3','@cmd'])assert.ok(csvCell(value).startsWith('"\''));
});

test('CSV handles an empty export and large volumes',()=>{
  assert.equal(rowsToSemicolonCsv([],['client_name','amount']),'\uFEFFclient_name;amount');
  const rows=Array.from({length:5000},(_,i)=>({client_name:'Client '+i,amount:i}));
  const csv=rowsToSemicolonCsv(rows,['client_name','amount']);
  assert.equal(csv.split('\n').length,5001);
});
