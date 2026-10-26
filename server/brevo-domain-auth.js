function isRecord(value){
  return Boolean(value&&typeof value==='object'&&!Array.isArray(value));
}

function normalizeRecord(key,record){
  return {
    key:String(key||''),
    status:record?.status===true,
    type:String(record?.type||'').toUpperCase(),
    host_name:String(record?.host_name||record?.hostName||'').trim(),
    value:String(record?.value||'').trim()
  };
}

export function brevoDomainRoot(payload={}){
  if(payload&&typeof payload.domain==='object'&&payload.domain!==null)return payload.domain;
  return payload||{};
}

export function selectCurrentBrevoDkimRecords(payload={}){
  const root=brevoDomainRoot(payload);
  const dns=root?.dns_records||payload?.dns_records||{};

  const numbered=Object.entries(dns)
    .filter(([key,value])=>isRecord(value)&&(
      /^dkim\d+Record$/i.test(key) ||
      /^dkim_?\d+_?record$/i.test(key)
    ))
    .map(([key,value])=>normalizeRecord(key,value));

  if(numbered.length)return numbered.sort((a,b)=>a.key.localeCompare(b.key,undefined,{numeric:true}));

  const collection=dns?.dkimRecords||dns?.dkim_records;
  if(Array.isArray(collection)){
    const records=collection.filter(isRecord).map((value,index)=>normalizeRecord(`dkimRecords[${index}]`,value));
    if(records.length)return records;
  }

  for(const key of ['dkim_record','dkimRecord']){
    if(isRecord(dns?.[key]))return [normalizeRecord(key,dns[key])];
  }

  return [];
}

export function evaluateBrevoDomainAuth(payload={}){
  const root=brevoDomainRoot(payload);
  const dns=root?.dns_records||payload?.dns_records||{};
  const dkimRecords=selectCurrentBrevoDkimRecords(payload);
  return {
    verified:root?.verified===true,
    authenticated:root?.authenticated===true,
    brevo_code_ok:dns?.brevo_code?.status===true || dns?.brevoCode?.status===true,
    dmarc_ok:dns?.dmarc_record?.status===true || dns?.dmarcRecord?.status===true,
    dkim_records:dkimRecords,
    dkim_ok:dkimRecords.length>0&&dkimRecords.every(record=>record.status===true)
  };
}
