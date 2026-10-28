import { createHmac, timingSafeEqual } from 'node:crypto';

// Signed, non-expiring links for one-click email preferences (unsubscribe from follow-ups, morning digest).
// The token only carries what the link may change; it never grants account access.
const MIN_SECRET=24;
const secretOrThrow=(secret)=>{
  if(!secret||String(secret).length<MIN_SECRET)throw new Error('EMAIL_LINK_SECRET_MISSING');
  return String(secret);
};
const mac=(body,secret)=>createHmac('sha256',secret).update(body).digest('base64url');

export function signEmailLink(purpose,data={},secret=process.env.EMAIL_LINK_SECRET){
  const key=secretOrThrow(secret);
  const body=Buffer.from(JSON.stringify({p:purpose,...data})).toString('base64url');
  return `${body}.${mac(body,key)}`;
}

export function verifyEmailLink(token,purpose,secret=process.env.EMAIL_LINK_SECRET){
  const key=secretOrThrow(secret);
  const [body,sig]=String(token||'').split('.');
  if(!body||!sig)return null;
  const expected=Buffer.from(mac(body,key)),given=Buffer.from(sig);
  if(expected.length!==given.length||!timingSafeEqual(expected,given))return null;
  try{
    const data=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
    return data?.p===purpose?data:null;
  }catch{return null;}
}

export function emailLinkUrl(token,appUrl=process.env.APP_URL){
  return `${String(appUrl||'').replace(/\/$/,'')}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}

// Footer appended to every client follow-up sent through Relanzio: who sends, why, and how to stop.
export function followupFooter({companyName,quoteTitle,unsubscribeUrl}){
  return `\n\n—\nMessage envoyé par ${companyName||'votre prestataire'} via Relanzio, au sujet du devis « ${quoteTitle} ».\nVous pouvez répondre directement à cet email.\nNe plus recevoir de relances de ${companyName||'ce prestataire'} : ${unsubscribeUrl}`;
}
