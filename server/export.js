export function csvCell(value){
  let s=String(value??'');
  if(/^[=+\-@]/.test(s))s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
}

export function rowsToSemicolonCsv(rows=[],fields=[]){
  const header=fields.join(';');
  const body=rows.map(row=>fields.map(field=>csvCell(row[field])).join(';'));
  return '\uFEFF'+[header,...body].join('\n');
}
