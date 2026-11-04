// Minimal IMAP4rev1 server over TLS for tests: the subset the product reply poller uses (LOGIN, EXAMINE, UID SEARCH,
// UID FETCH of header fields / full body, LOGOUT). Any other command is answered BAD and logged, so a test can prove
// the poller never writes to the mailbox (no STORE, COPY, MOVE, EXPUNGE, SELECT, APPEND, DELETE).
import tls from 'node:tls';
import { readFileSync } from 'node:fs';

const fixture=name=>readFileSync(new URL(`../fixtures/${name}`,import.meta.url));

function unquote(token=''){return token.startsWith('"')?token.slice(1,-1).replace(/\\(["\\])/g,'$1'):token;}

// Header fields of a raw message, keeping folded lines, in the order they appear.
function headerFields(raw,names){
  const head=raw.split(/\r\n\r\n/)[0];
  const lines=head.split('\r\n'),out=[];let keep=false;
  for(const line of lines){
    if(/^[ \t]/.test(line)){if(keep)out.push(line);continue;}
    const name=line.slice(0,line.indexOf(':')).toLowerCase();
    keep=names.includes(name);if(keep)out.push(line);
  }
  return out.join('\r\n')+'\r\n\r\n';
}

export async function startFakeImap({user,password,mailboxes={INBOX:[]},uidValidity=4242}={}){
  const commands=[];
  const server=tls.createServer({key:fixture('imap-localhost.key'),cert:fixture('imap-localhost.crt'),minVersion:'TLSv1.2'},socket=>{
    let buffer='',selected=null;
    const send=s=>socket.write(Buffer.isBuffer(s)?s:Buffer.from(s,'utf8'));
    send('* OK [CAPABILITY IMAP4rev1] Relanzio test IMAP ready\r\n');
    socket.on('data',chunk=>{
      buffer+=chunk.toString('utf8');
      let i;
      while((i=buffer.indexOf('\r\n'))>=0){
        const line=buffer.slice(0,i);buffer=buffer.slice(i+2);
        const [tag,...rest]=line.match(/"(?:[^"\\]|\\.)*"|\S+/g)||[];
        const verb=(rest[0]||'').toUpperCase(),sub=(rest[1]||'').toUpperCase();
        commands.push(verb==='LOGIN'?'LOGIN':`${verb}${verb==='UID'?' '+sub:''} ${rest.slice(verb==='UID'?2:1).join(' ')}`.trim());
        if(verb==='LOGIN'){
          if(unquote(rest[1])===user&&unquote(rest[2])===password)send(`${tag} OK LOGIN completed\r\n`);
          else send(`${tag} NO [AUTHENTICATIONFAILED] Invalid credentials\r\n`);
        }else if(verb==='EXAMINE'){
          const name=unquote(rest[1]);
          if(!mailboxes[name]){send(`${tag} NO Mailbox does not exist\r\n`);continue;}
          selected=name;
          send(`* ${mailboxes[name].length} EXISTS\r\n* OK [UIDVALIDITY ${uidValidity}] UIDs valid\r\n${tag} OK [READ-ONLY] EXAMINE completed\r\n`);
        }else if(verb==='UID'&&sub==='SEARCH'){
          const uids=(mailboxes[selected]||[]).map(m=>m.uid);
          send(`* SEARCH${uids.length?' '+uids.join(' '):''}\r\n${tag} OK SEARCH completed\r\n`);
        }else if(verb==='UID'&&sub==='FETCH'){
          const uid=Number(rest[2]);
          const list=mailboxes[selected]||[];
          const seq=list.findIndex(m=>m.uid===uid)+1;
          const msg=list[seq-1];
          if(!msg){send(`${tag} OK FETCH completed\r\n`);continue;}
          const raw=Buffer.from(msg.raw,'utf8');
          const spec=rest.slice(3).join(' ');
          const fields=spec.match(/HEADER\.FIELDS \(([^)]*)\)/i);
          if(fields){
            const names=fields[1].toLowerCase().split(/\s+/);
            const part=Buffer.from(headerFields(msg.raw,names),'utf8');
            send(Buffer.concat([Buffer.from(`* ${seq} FETCH (UID ${uid} RFC822.SIZE ${raw.length} BODY[HEADER.FIELDS (${fields[1]})] {${part.length}}\r\n`),part,Buffer.from(`)\r\n${tag} OK FETCH completed\r\n`)]));
          }else{
            send(Buffer.concat([Buffer.from(`* ${seq} FETCH (UID ${uid} BODY[] {${raw.length}}\r\n`),raw,Buffer.from(`)\r\n${tag} OK FETCH completed\r\n`)]));
          }
        }else if(verb==='LOGOUT'){
          send(`* BYE logging out\r\n${tag} OK LOGOUT completed\r\n`);socket.end();
        }else{
          send(`${tag} BAD Command not supported by the test server\r\n`);
        }
      }
    });
    socket.on('error',()=>{});
  });
  await new Promise(resolve=>server.listen(0,resolve));
  let nextUid=1;
  return {
    port:server.address().port,
    commands,
    deliver(raw,mailbox='INBOX'){(mailboxes[mailbox]||(mailboxes[mailbox]=[])).push({uid:nextUid,raw});return nextUid++;},
    close:()=>new Promise(resolve=>server.close(resolve))
  };
}
