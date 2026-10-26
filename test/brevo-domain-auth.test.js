import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBrevoDomainAuth, selectCurrentBrevoDkimRecords } from '../server/brevo-domain-auth.js';

test('dual Brevo DKIM CNAME records take precedence over null legacy field',()=>{
  const payload={
    domain:'relanzio.com',
    verified:true,
    authenticated:true,
    dns_records:{
      dkim_record:null,
      dkim1Record:{status:true,type:'CNAME',host_name:'brevo1._domainkey',value:'a.example.net.'},
      dkim2Record:{status:true,type:'CNAME',host_name:'brevo2._domainkey',value:'b.example.net.'},
      brevo_code:{status:true},
      dmarc_record:{status:true}
    }
  };
  const result=evaluateBrevoDomainAuth(payload);
  assert.equal(result.dkim_ok,true);
  assert.equal(result.dkim_records.length,2);
  assert.deepEqual(result.dkim_records.map(x=>x.key),['dkim1Record','dkim2Record']);
});

test('dual Brevo DKIM fails when one required record is not validated',()=>{
  const payload={
    verified:true,
    authenticated:true,
    dns_records:{
      dkim1Record:{status:true,type:'CNAME',host_name:'brevo1._domainkey'},
      dkim2Record:{status:false,type:'CNAME',host_name:'brevo2._domainkey'}
    }
  };
  assert.equal(evaluateBrevoDomainAuth(payload).dkim_ok,false);
});

test('legacy singular DKIM remains supported',()=>{
  const payload={
    verified:true,
    authenticated:true,
    dns_records:{dkim_record:{status:true,type:'TXT',host_name:'mail._domainkey'}}
  };
  const records=selectCurrentBrevoDkimRecords(payload);
  assert.equal(records.length,1);
  assert.equal(records[0].key,'dkim_record');
  assert.equal(evaluateBrevoDomainAuth(payload).dkim_ok,true);
});

test('numbered current DKIM records override stale legacy record',()=>{
  const payload={
    verified:true,
    authenticated:true,
    dns_records:{
      dkim_record:{status:false,type:'TXT',host_name:'old._domainkey'},
      dkim1Record:{status:true,type:'CNAME',host_name:'brevo1._domainkey'},
      dkim2Record:{status:true,type:'CNAME',host_name:'brevo2._domainkey'}
    }
  };
  const records=selectCurrentBrevoDkimRecords(payload);
  assert.deepEqual(records.map(x=>x.key),['dkim1Record','dkim2Record']);
  assert.equal(evaluateBrevoDomainAuth(payload).dkim_ok,true);
});

test('missing DKIM records never hardcode a pass',()=>{
  const payload={verified:true,authenticated:true,dns_records:{dmarc_record:{status:true}}};
  assert.equal(evaluateBrevoDomainAuth(payload).dkim_ok,false);
});
