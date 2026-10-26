import test from 'node:test';
import assert from 'node:assert/strict';
import {parseImapReply,deterministicReplyCategory,normalizeReplyCategory,resolveProspectIdentity} from '../server/imap-reply-parser.js';

test('parses headers and body without sending or marking',()=>{
 const raw='Message-ID: <reply-1@example.com>\r\nIn-Reply-To: <j0@brevo>\r\nReferences: <older@x> <j0@brevo>\r\nFrom: Client <client@example.com>\r\nTo: contact@relanzio.com\r\nSubject: =?UTF-8?Q?Re=3A_Test?=\r\nDate: Fri, 16 Oct 2026 10:00:00 +0200\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nNon merci, nous ne sommes pas int=C3=A9ress=C3=A9s.';
 const p=parseImapReply(raw);
 assert.equal(p.messageId,'<reply-1@example.com>');
 assert.equal(p.from,'client@example.com');
 assert.deepEqual(p.inReplyTo,['<j0@brevo>']);
 assert.match(p.text,/intéressés/);
 assert.equal(deterministicReplyCategory(p.text),'not_interested');
});

test('STOP always wins',()=>assert.equal(deterministicReplyCategory('STOP'),'opt_out'));
test('preserves actionable reply categories',()=>{assert.equal(normalizeReplyCategory({category:'pricing'}),'pricing');assert.equal(normalizeReplyCategory({category:'feature_request'}),'feature_request');assert.equal(normalizeReplyCategory({category:'auto_reply'}),'auto_reply');assert.equal(normalizeReplyCategory({category:'interested'}),'interested')});
test('exact provider and sender matches',()=>{
 const result=resolveProspectIdentity({from:'client@example.com',inReplyTo:['<j0>'],references:[]},{prospectByEmail:new Map([['client@example.com','p1']]),providerToProspect:new Map([['<j0>','p1']])});
 assert.deepEqual(result,{status:'matched',prospectId:'p1',matchedBy:'provider_message_id',inReplyTo:'<j0>'});
});
test('conflict requires manual review',()=>{
 const result=resolveProspectIdentity({from:'other@example.com',inReplyTo:['<j0>'],references:[]},{prospectByEmail:new Map([['other@example.com','p2']]),providerToProspect:new Map([['<j0>','p1']])});
 assert.equal(result.status,'MANUAL_REVIEW_REQUIRED');
});
