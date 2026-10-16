import { problem } from './config.js';
async function result(query) { const {data,error}=await query;if(error)throw problem('PILOT_STORAGE_UNAVAILABLE',503);return data; }
export function pilotRepository(db) {
 return {
  async submit(row){
   const {data,error}=await db.from('maintenance_pilot_cases').insert(row).select('id').single();
   if(!error)return data;
   if(error.code!=='23505')throw problem('PILOT_STORAGE_UNAVAILABLE',503);
   const previous=await result(db.from('maintenance_pilot_cases').select('id,payload_hash').eq('request_key',row.request_key).single());
   if(previous.payload_hash!==row.payload_hash)throw problem('REQUEST_CONFLICT',409);
   return {id:previous.id};
  },
  async list(operator){return result(db.from('maintenance_pilot_cases').select('id,company,created_at,operator_id').or(`operator_id.is.null,operator_id.eq.${operator}`).order('created_at',{ascending:false}).limit(100));},
  async claim(id,operator){const r=await result(db.from('maintenance_pilot_cases').update({operator_id:operator}).eq('id',id).is('operator_id',null).select('id').maybeSingle());if(!r)throw problem('CASE_CONFLICT',409);return r;},
  async get(id,operator){const r=await result(db.from('maintenance_pilot_cases').select('*').eq('id',id).eq('operator_id',operator).maybeSingle());if(!r)throw problem('CASE_NOT_FOUND',404);return r;},
  async update(record,operator,state){const {data,error}=await db.rpc('maintenance_pilot_update',{p_id:record.id,p_operator:operator,p_revision:record.revision,p_state:state});if(error)throw problem(error.message?.includes('CASE_CONFLICT')?'CASE_CONFLICT':'PILOT_STORAGE_UNAVAILABLE',error.message?.includes('CASE_CONFLICT')?409:503);return data;},
  async session(id){return result(db.from('maintenance_pilot_payments').select('session_id,paid,version').eq('case_id',id).maybeSingle());},
  async reserve(record){return result(db.rpc('maintenance_pilot_checkout',{p_id:record.id,p_operator:record.operator_id,p_revision:record.revision}));},
  async saveSession(id,version,session){await result(db.from('maintenance_pilot_payments').update({session_id:session}).eq('case_id',id).eq('version',version).is('session_id',null));const saved=await this.session(id,version);if(saved?.session_id!==session)throw problem('CHECKOUT_CONFLICT',409);},
  async paid(p){return result(db.rpc('maintenance_pilot_paid',{p_event:p.eventId,p_session:p.sessionId,p_case:p.caseId}));},
  async purge(){return result(db.rpc('maintenance_pilot_purge'));}
 };
}
