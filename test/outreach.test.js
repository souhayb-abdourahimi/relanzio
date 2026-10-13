import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPauseOutreach } from '../server/outreach-health.js';

test('outreach deliverability guard pauses on spam',()=>{
  assert.deepEqual(shouldPauseOutreach({sent:1,bounced:1,spam:1,blocked:0}),{pause:true,reason:'spam_complaint'});
});
test('outreach deliverability guard pauses on abnormal bounces',()=>{
  assert.deepEqual(shouldPauseOutreach({sent:10,bounced:2,spam:0,blocked:0}),{pause:true,reason:'multiple_bounces'});
  assert.deepEqual(shouldPauseOutreach({sent:5,bounced:1,spam:0,blocked:0}),{pause:true,reason:'bounce_rate'});
});
test('outreach deliverability guard permits healthy low-volume sending',()=>{
  assert.deepEqual(shouldPauseOutreach({sent:4,bounced:0,spam:0,blocked:0}),{pause:false,reason:null});
});
