import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeLogValue} from '../server/log-redaction.js';

test('observability metadata redacts explicit secret fields and common secret formats',()=>{
  const safe=sanitizeLogValue({
    request_id:'req_123',
    stripe_customer_id:'cus_123',
    authorization:'Bearer abc.def.ghi',
    api_key:'xkeysib-very-secret-value',
    nested:{password:'secret',message:'failure whsec_supersecret'}
  });
  assert.equal(safe.request_id,'req_123');
  assert.equal(safe.stripe_customer_id,'cus_123');
  assert.equal(safe.authorization,'[REDACTED]');
  assert.equal(safe.api_key,'[REDACTED]');
  assert.equal(safe.nested.password,'[REDACTED]');
  assert.equal(safe.nested.message,'failure [REDACTED]');
});
