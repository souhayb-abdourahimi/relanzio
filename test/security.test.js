import test from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit, safeEqual } from '../server/security.js';

function call(middleware,ip='127.0.0.1'){
  return new Promise(resolve=>{
    const headers={};
    const req={ip,socket:{remoteAddress:ip}};
    const res={
      statusCode:200,
      body:null,
      setHeader:(k,v)=>{headers[k]=v},
      status(n){this.statusCode=n;return this},
      json(body){this.body=body;resolve({allowed:false,status:this.statusCode,headers,body})}
    };
    middleware(req,res,()=>resolve({allowed:true,status:200,headers,body:null}));
  });
}

test('rate limiters are isolated per middleware rule',async()=>{
  const global=rateLimit({windowMs:60_000,max:180});
  const trial=rateLimit({windowMs:60_000,max:5});
  for(let i=0;i<30;i++)assert.equal((await call(global)).allowed,true);
  assert.equal((await call(trial)).allowed,true);
  for(let i=0;i<4;i++)assert.equal((await call(trial)).allowed,true);
  const blocked=await call(trial);
  assert.equal(blocked.status,429);
  assert.ok(Number(blocked.headers['Retry-After'])>=1);
  assert.equal((await call(global)).allowed,true);
});

test('different client IPs have independent buckets',async()=>{
  const limiter=rateLimit({windowMs:60_000,max:1});
  assert.equal((await call(limiter,'1.1.1.1')).allowed,true);
  assert.equal((await call(limiter,'1.1.1.1')).status,429);
  assert.equal((await call(limiter,'2.2.2.2')).allowed,true);
});

test('safeEqual rejects empty and mismatched secrets',()=>{
  assert.equal(safeEqual('abc','abc'),true);
  assert.equal(safeEqual('abc','abd'),false);
  assert.equal(safeEqual('',''),false);
});
