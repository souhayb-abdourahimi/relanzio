export function shouldPauseOutreach({sent=0,bounced=0,spam=0,blocked=0}={}){
  if(spam>0)return {pause:true,reason:'spam_complaint'};
  if(blocked>=2)return {pause:true,reason:'provider_blocking'};
  if(bounced>=2)return {pause:true,reason:'multiple_bounces'};
  if(sent>=5 && bounced/sent>=0.10)return {pause:true,reason:'bounce_rate'};
  return {pause:false,reason:null};
}
