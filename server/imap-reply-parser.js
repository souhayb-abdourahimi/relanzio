function unfoldHeaders(block='') {
  return String(block).replace(/\r?\n[ \t]+/g, ' ');
}

export function parseHeaders(block='') {
  const headers = new Map();
  for (const line of unfoldHeaders(block).split(/\r?\n/)) {
    const i=line.indexOf(':');
    if(i<=0)continue;
    const key=line.slice(0,i).trim().toLowerCase();
    const value=line.slice(i+1).trim();
    if(!headers.has(key))headers.set(key,[]);
    headers.get(key).push(value);
  }
  return headers;
}

function decodeCharset(buffer, charset='utf-8') {
  const cs=String(charset||'utf-8').toLowerCase();
  if(/^(iso-8859-1|latin1|windows-1252)$/.test(cs))return buffer.toString('latin1');
  return buffer.toString('utf8');
}

function decodeQuotedPrintableToBuffer(value='') {
  const cleaned=String(value).replace(/=\r?\n/g,'');
  const bytes=[];
  for(let i=0;i<cleaned.length;i++){
    if(cleaned[i]==='='&&/^[0-9a-f]{2}$/i.test(cleaned.slice(i+1,i+3))){bytes.push(parseInt(cleaned.slice(i+1,i+3),16));i+=2;}
    else bytes.push(cleaned.charCodeAt(i)&255);
  }
  return Buffer.from(bytes);
}

export function decodeMimeWords(value='') {
  return String(value).replace(/=\?([^?]+)\?([bq])\?([^?]*)\?=/gi,(_m,charset,enc,data)=>{
    try{
      const buf=enc.toLowerCase()==='b'?Buffer.from(data,'base64'):decodeQuotedPrintableToBuffer(data.replace(/_/g,' '));
      return decodeCharset(buf,charset);
    }catch{return _m;}
  });
}

export function extractEmail(value='') {
  const decoded=decodeMimeWords(value);
  const angle=decoded.match(/<([^<>\s]+@[^<>\s]+)>/);
  if(angle)return angle[1].trim().toLowerCase();
  const plain=decoded.match(/\b[^\s<>,;]+@[^\s<>,;]+\b/);
  return plain?plain[0].trim().toLowerCase():'';
}

export function extractMessageIds(value='') {
  const ids=String(value||'').match(/<[^<>\r\n]+>/g)||[];
  return [...new Set(ids.map(x=>x.trim()).filter(Boolean))];
}

function headerValue(headers,key){return headers.get(key)?.[0]||'';}

function parseContentType(value='') {
  const [typePart,...params]=String(value||'text/plain').split(';');
  const type=typePart.trim().toLowerCase()||'text/plain';
  const map={};
  for(const p of params){
    const i=p.indexOf('='); if(i<1)continue;
    const k=p.slice(0,i).trim().toLowerCase();
    const v=p.slice(i+1).trim().replace(/^"|"$/g,'');
    map[k]=v;
  }
  return {type,params:map};
}

function decodeBody(body,headers){
  const transfer=headerValue(headers,'content-transfer-encoding').toLowerCase();
  const {params}=parseContentType(headerValue(headers,'content-type'));
  try{
    if(transfer==='base64')return decodeCharset(Buffer.from(String(body).replace(/\s/g,''),'base64'),params.charset);
    if(transfer==='quoted-printable')return decodeCharset(decodeQuotedPrintableToBuffer(body),params.charset);
  }catch{}
  return String(body||'');
}

function stripHtml(html='') {
  return String(html).replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<script[\s\S]*?<\/script>/gi,' ')
    .replace(/<br\s*\/?\s*>/gi,'\n').replace(/<\/p>/gi,'\n').replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
    .replace(/[ \t]+/g,' ').replace(/\n\s*\n\s*\n+/g,'\n\n').trim();
}

function splitHeaderBody(raw='') {
  const m=String(raw).match(/\r?\n\r?\n/);
  if(!m)return {headerBlock:String(raw),body:''};
  const i=m.index;
  return {headerBlock:String(raw).slice(0,i),body:String(raw).slice(i+m[0].length)};
}

export function extractTextBody(raw='',depth=0) {
  if(depth>5)return '';
  const {headerBlock,body}=splitHeaderBody(raw);
  const headers=parseHeaders(headerBlock);
  const {type,params}=parseContentType(headerValue(headers,'content-type'));
  if(type.startsWith('multipart/')&&params.boundary){
    const marker=`--${params.boundary}`;
    const chunks=body.split(marker).slice(1).map(x=>x.replace(/^\r?\n/,'').replace(/\r?\n--\s*$/,'')).filter(Boolean);
    let htmlFallback='';
    for(const chunk of chunks){
      const {headerBlock:partHeaders}=splitHeaderBody(chunk);
      const ph=parseHeaders(partHeaders);
      const pt=parseContentType(headerValue(ph,'content-type')).type;
      const text=extractTextBody(chunk,depth+1);
      if(pt==='text/plain'&&text.trim())return text.trim();
      if(pt==='text/html'&&text.trim()&&!htmlFallback)htmlFallback=text.trim();
      if(!htmlFallback&&text.trim())htmlFallback=text.trim();
    }
    return htmlFallback;
  }
  const decoded=decodeBody(body,headers).trim();
  return type==='text/html'?stripHtml(decoded):decoded;
}

function dispositionFilename(headers){
  const disp=headerValue(headers,'content-disposition');
  const fromDisp=disp.match(/filename\*?=(?:"([^"]+)"|([^;\s]+))/i);
  const {params}=parseContentType(headerValue(headers,'content-type'));
  const raw=fromDisp?(fromDisp[1]||fromDisp[2]):(params.name||'');
  const value=decodeMimeWords(String(raw).replace(/^utf-8''/i,'')).trim();
  try{return {filename:decodeURIComponent(value),attachment:/^\s*attachment/i.test(disp)};}catch{return {filename:value,attachment:/^\s*attachment/i.test(disp)};}
}

// Files attached to a reply (base64 parts with a filename), for forwarding to the artisan.
export function extractAttachments(raw='',depth=0,out=[]) {
  if(depth>5||out.length>=20)return out;
  const {headerBlock,body}=splitHeaderBody(raw);
  const headers=parseHeaders(headerBlock);
  const {type,params}=parseContentType(headerValue(headers,'content-type'));
  if(type.startsWith('multipart/')&&params.boundary){
    for(const chunk of body.split(`--${params.boundary}`).slice(1)){
      if(/^--\s*$/.test(chunk.trim())||!chunk.trim())continue;
      extractAttachments(chunk.replace(/^\r?\n/,''),depth+1,out);
    }
    return out;
  }
  const {filename,attachment}=dispositionFilename(headers);
  if(!filename&&!attachment)return out;
  const transfer=headerValue(headers,'content-transfer-encoding').toLowerCase();
  const content=transfer==='base64'?String(body).replace(/[^A-Za-z0-9+/=]/g,''):Buffer.from(transfer==='quoted-printable'?decodeQuotedPrintableToBuffer(body):Buffer.from(String(body),'latin1')).toString('base64');
  out.push({filename:filename||'piece-jointe',contentType:type,size:Math.floor(content.length*3/4),content});
  return out;
}

export function parseImapReply(raw='') {
  const {headerBlock}=splitHeaderBody(raw);
  const headers=parseHeaders(headerBlock);
  const messageId=extractMessageIds(headerValue(headers,'message-id'))[0]||'';
  const inReplyTo=extractMessageIds(headerValue(headers,'in-reply-to'));
  const references=extractMessageIds(headerValue(headers,'references'));
  const dateRaw=headerValue(headers,'date');
  const date=new Date(dateRaw);
  return {
    messageId,
    inReplyTo,
    references,
    from:extractEmail(headerValue(headers,'from')),
    to:[...(headers.get('to')||[]),...(headers.get('x-original-to')||[]),...(headers.get('delivered-to')||[])].flatMap(extractEmail).filter(Boolean),
    subject:decodeMimeWords(headerValue(headers,'subject')).trim(),
    receivedAt:Number.isNaN(date.getTime())?null:date.toISOString(),
    contentType:headerValue(headers,'content-type'),
    headers,
    text:extractTextBody(raw).trim()
  };
}

export function deterministicReplyCategory(text='') {
  const t=String(text||'').toLowerCase();
  if(/(^|\b)(stop|unsubscribe)(\b|$)|désinscri|retirez[- ]?moi|retirer de votre liste|ne me contactez plus|supprimez mon email/i.test(t))return 'opt_out';
  if(/pas intéress|non merci|nous n['’]en avons pas besoin|merci de ne pas donner suite|aucun besoin|déjà équipé|déjà un outil/i.test(t))return 'not_interested';
  return null;
}

export function normalizeReplyCategory(analysis={}) {
  if(['interested','auto_reply','opt_out','not_interested','not_now','pricing','feature_request','other'].includes(analysis.category))return analysis.category;
  if(analysis.category==='neutral')return 'neutral';
  return 'other';
}

export function resolveProspectIdentity(parsed,{prospectByEmail=new Map(),providerToProspect=new Map()}={}) {
  const refs=[...parsed.inReplyTo,...parsed.references];
  const byMessage=[...new Set(refs.map(id=>providerToProspect.get(id)).filter(Boolean))];
  if(byMessage.length>1)return {status:'MANUAL_REVIEW_REQUIRED',reason:'multiple_provider_matches'};
  const bySender=prospectByEmail.get(String(parsed.from||'').toLowerCase())||null;
  if(byMessage.length===1&&bySender&&byMessage[0]!==bySender)return {status:'MANUAL_REVIEW_REQUIRED',reason:'identity_conflict'};
  if(byMessage.length===1&&!bySender)return {status:'MANUAL_REVIEW_REQUIRED',reason:'sender_not_exact'};
  if(byMessage.length===1&&bySender)return {status:'matched',prospectId:byMessage[0],matchedBy:'provider_message_id',inReplyTo:refs.find(id=>providerToProspect.get(id)===byMessage[0])||null};
  if(bySender)return {status:'matched',prospectId:bySender,matchedBy:'sender',inReplyTo:null};
  return {status:'unmatched',reason:'no_exact_match'};
}
