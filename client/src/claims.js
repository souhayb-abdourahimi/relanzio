// Promises that depend on a feature verified in production. VITE_REPLY_DETECTION_LIVE is a build-time switch:
// set it to "true" only after a real client reply has stopped a real sequence end to end (docs/DECISIONS_PRODUIT.md).
// Until then, public pages promise only what already works: the manual "Le client a répondu" stop.
export const REPLY_STOP_LIVE=import.meta.env?.VITE_REPLY_DETECTION_LIVE==='true';
