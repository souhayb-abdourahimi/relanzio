import test from 'node:test';
import assert from 'node:assert/strict';
import { createSingleFlight } from '../client/src/single-flight.js';

test('single-flight prevents duplicate checkout calls while one is pending',async()=>{
  const flight=createSingleFlight();
  let calls=0;
  let release;
  const gate=new Promise(resolve=>{release=resolve});
  const task=()=>{calls+=1;return gate};
  const first=flight.run(task);
  const second=await flight.run(task);
  assert.equal(second,false);
  assert.equal(calls,1);
  assert.equal(flight.active,true);
  release();
  assert.equal(await first,true);
  assert.equal(flight.active,false);
});
