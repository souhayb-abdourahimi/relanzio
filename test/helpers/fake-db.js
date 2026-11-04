// Tiny in-memory stand-in for the subset of the supabase-js query builder used by server modules
// under test (insert / update / delete / select with eq, in, is, lte, gt, or, maybeSingle, single, count/head).
export function createFakeDb(seed={},uniqueKeys={}){
  const tables=Object.fromEntries(Object.entries(seed).map(([k,v])=>[k,v.map(r=>({...r}))]));
  const rows=t=>tables[t]||(tables[t]=[]);
  function query(table){
    const filters=[];let op='select',payload=null,want='many',returning=false,limit=Infinity,count=false;
    const api={
      select(_cols,opts={}){if(op!=='select')returning=true;if(opts.count)count=Boolean(opts.head)?'head':true;return api;},
      insert(v){op='insert';payload=v;return api;},
      update(v){op='update';payload=v;return api;},
      upsert(v){op='upsert';payload=v;return api;},
      delete(){op='delete';return api;},
      eq(k,v){filters.push(r=>r[k]===v);return api;},
      neq(k,v){filters.push(r=>r[k]!==v);return api;},
      in(k,v){filters.push(r=>v.includes(r[k]));return api;},
      is(k,v){filters.push(r=>(r[k]??null)===v);return api;},
      lte(k,v){filters.push(r=>r[k]<=v);return api;},
      lt(k,v){filters.push(r=>r[k]<v);return api;},
      gt(k,v){filters.push(r=>r[k]>v);return api;},
      gte(k,v){filters.push(r=>r[k]>=v);return api;},
      not(){return api;},
      // PostgREST or-filter, e.g. "send_claimed_at.is.null,send_claimed_at.lt.2026-01-01T00:00:00Z".
      or(expr){
        const tests=String(expr).split(',').map(part=>{
          const [k,o,...rest]=part.split('.');const v=rest.join('.');
          if(o==='is')return r=>(r[k]??null)===(v==='null'?null:v);
          if(o==='eq')return r=>String(r[k])===v;
          if(o==='lt')return r=>r[k]!=null&&r[k]<v;
          if(o==='gt')return r=>r[k]!=null&&r[k]>v;
          throw new Error('fake-db or(): unsupported '+part);
        });
        filters.push(r=>tests.some(t=>t(r)));return api;
      },
      order(){return api;},
      limit(n){limit=n;return api;},
      maybeSingle(){want='maybe';return api;},
      single(){want='single';return api;},
      then(resolve,reject){return Promise.resolve().then(run).then(resolve,reject);}
    };
    const match=r=>filters.every(f=>f(r));
    function out(found){
      const list=found.map(r=>({...r})); // callers get copies, like rows fetched over the network
      if(want==='maybe')return {data:list[0]||null,error:null};
      if(want==='single')return list.length===1?{data:list[0],error:null}:{data:null,error:{message:'not single'}};
      return {data:list,error:null};
    }
    function run(){
      const t=rows(table);
      if(op==='insert'||op==='upsert'){
        const items=(Array.isArray(payload)?payload:[payload]).map(x=>({...x}));
        for(const item of items){
          const keys=uniqueKeys[table];
          const clash=keys&&t.find(r=>keys.every(k=>r[k]===item[k]));
          if(clash){if(op==='upsert'){Object.assign(clash,item);continue;}return {data:null,error:{code:'23505',message:'duplicate key'}};}
          t.push(item);
        }
        return out(items);
      }
      if(op==='update'){const hit=t.filter(match);hit.forEach(r=>Object.assign(r,payload));return returning?out(hit):{data:null,error:null};}
      if(op==='delete'){tables[table]=t.filter(r=>!match(r));return {data:null,error:null};}
      const found=t.filter(match);
      if(count)return {data:count==='head'?null:found.slice(0,limit).map(r=>({...r})),count:found.length,error:null};
      return out(found.slice(0,limit));
    }
    return api;
  }
  return {from:query,tables};
}
