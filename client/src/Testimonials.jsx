import React from 'react';

// Real customer quotes only, each with written consent (first name, trade, town, quote, consent date).
// Empty on purpose until such quotes exist: nothing is rendered, no placeholder, no invented logo.
export const TESTIMONIALS=[];

export default function Testimonials({items=TESTIMONIALS}){
  const list=items.filter(t=>t.firstName&&t.trade&&t.city&&t.quote&&t.consentDate);
  if(!list.length)return null;
  return <section className="section container testimonials" aria-labelledby="testimonials-title">
    <div className="section-head"><span>ILS L’UTILISENT</span><h2 id="testimonials-title">Ce qu’en disent des artisans.</h2></div>
    <div className="testimonial-grid">{list.map(t=><figure key={t.firstName+t.city}><blockquote>« {t.quote} »</blockquote><figcaption>{t.firstName}, {t.trade} à {t.city}</figcaption></figure>)}</div>
  </section>;
}
