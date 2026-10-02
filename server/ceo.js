import { safePercentage, prioritizeProductIdeas } from './logic.js';
export function buildCeoMetrics({ visitors=0, signups=0, activated=0, paying=0, canceled=0, mrr=0, prospects=0, outreachSent=0, replies=0, meetings=0, quotes=0, wonQuotes=0 } = {}) {
  return {
    visitors, signups, activated, paying, canceled, mrr, prospects, outreachSent, replies, meetings, quotes, wonQuotes,
    signupRate:safePercentage(signups, visitors), activationRate:safePercentage(activated, signups), paidConversion:safePercentage(paying, activated), replyRate:safePercentage(replies, outreachSent), meetingRate:safePercentage(meetings, replies)
  };
}
export function weeklyRecommendations(metrics, insights=[]) {
  const actions=[];
  if (metrics.signups >= 5 && metrics.activationRate < 50) actions.push('Priorité onboarding : moins de la moitié des inscrits activent le produit.');
  if (metrics.activated >= 5 && metrics.paidConversion < 20) actions.push('Interviewer les utilisateurs activés non payants avant de modifier le prix.');
  if (metrics.outreachSent >= 20 && metrics.replyRate < 10) actions.push('Revoir ciblage et message de prospection avant d’augmenter le volume.');
  if (metrics.replies >= 5 && metrics.meetingRate < 20) actions.push('Simplifier le CTA : proposer un créneau ou un pilote de 10 minutes.');
  const ideas=prioritizeProductIdeas(insights).filter(x=>x.requests>=3).slice(0,3);
  for (const idea of ideas) actions.push(`Évaluer « ${idea.feature} » : demandée ${idea.requests} fois.`);
  if (!actions.length) actions.push('Continuer la validation : collecter davantage de données avant une décision produit majeure.');
  return actions;
}
