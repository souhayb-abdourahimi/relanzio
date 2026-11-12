// Records every request it receives; GET /__requests returns them. Used only inside the isolated Docker network
// of scripts/rescue/verify-image.sh (no Internet access). Answers like an empty Supabase.
import { createServer } from 'node:http';
const seen = [];
createServer((req, res) => {
  if (req.url === '/__requests') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(seen)); }
  seen.push(`${req.method} ${req.url.split('?')[0]}`);
  res.setHeader('Content-Type', 'application/json'); res.end('[]');
}).listen(8080, '0.0.0.0');
