// Follow-up cadence: days after the quote was sent for relance 1, 2 and 3.
// Relance 1 is planned from the sent date; each next relance from the day the previous one was done.
export const DEFAULT_FOLLOWUP_OFFSETS=Object.freeze([2,5,10]);

export function normalizeFollowupOffsets(value){
  const v=Array.isArray(value)?value.map(Number):null;
  if(!v||v.length!==3||!v.every(Number.isInteger))return null;
  const [a,b,c]=v;
  return a>=1&&a<=60&&b>a&&b<=90&&c>b&&c<=120?v:null;
}

export function effectiveOffsets(profile){return normalizeFollowupOffsets(profile?.followup_offsets)||[...DEFAULT_FOLLOWUP_OFFSETS];}

// Days between relance `doneStep` (1 or 2) and the next one.
export function gapAfterStep(offsets,doneStep){
  const o=normalizeFollowupOffsets(offsets)||DEFAULT_FOLLOWUP_OFFSETS;
  return doneStep>=1&&doneStep<=2?o[doneStep]-o[doneStep-1]:null;
}

export function cadenceLabel(offsets){return (normalizeFollowupOffsets(offsets)||DEFAULT_FOLLOWUP_OFFSETS).map(d=>`J+${d}`).join(' / ');}
