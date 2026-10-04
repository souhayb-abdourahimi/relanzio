import { db } from './db.js';
import { sendEmail } from './email.js';

async function already(userId,type){const{data}=await db.from('lifecycle_messages').select('id').eq('user_id',userId).eq('type',type).maybeSingle();return Boolean(data)}
async function mark(userId,type){await db.from('lifecycle_messages').insert({user_id:userId,type,status:'sent',sent_at:new Date().toISOString()})}
export async function runLifecycleEmails(){
  if(process.env.LIFECYCLE_EMAILS_ENABLED!=='true')return [{skipped:'lifecycle_disabled'}];
  const {data:profiles,error}=await db.from('profiles').select('id,email,company_name,marketing_opt_in,activated_at,created_at').eq('marketing_opt_in',true).limit(500);if(error)throw error;
  const now=Date.now(),results=[];
  for(const p of profiles||[]){
    try{
      if(!p.activated_at&&now-new Date(p.created_at).getTime()>24*3600e3&&!await already(p.id,'onboarding_help')){
        await sendEmail({to:p.email,subject:'Votre premier devis dans Relanzio',text:`Bonjour,\n\nRelanzio devient utile dès qu’un vrai devis est ajouté. Commencez par un dossier encore sans réponse : client, montant, objet et date d’envoi. Le compte démarre en mode revue, donc rien ne part automatiquement.\n\n— Relanzio`,replyTo:process.env.SUPPORT_EMAIL||'support@relanzio.com'});await mark(p.id,'onboarding_help');results.push({user:p.id,type:'onboarding_help'});continue;
      }
      if(p.activated_at&&!await already(p.id,'activation_congrats')){await sendEmail({to:p.email,subject:'Votre premier suivi est actif',text:`Bonjour,\n\nVotre premier devis est maintenant suivi. Le prochain objectif n’est pas d’ajouter des fonctionnalités : c’est de fermer la boucle en marquant le dossier gagné, perdu ou en pause lorsqu’une décision arrive.\n\n— Relanzio`,replyTo:process.env.SUPPORT_EMAIL||'support@relanzio.com'});await mark(p.id,'activation_congrats');results.push({user:p.id,type:'activation_congrats'});}
      if(p.activated_at&&now-new Date(p.activated_at).getTime()>21*86400e3&&!await already(p.id,'winback_21d')){const{data:last}=await db.from('product_events').select('created_at').eq('user_id',p.id).eq('event','quote_created').order('created_at',{ascending:false}).limit(1).maybeSingle();if(last&&now-new Date(last.created_at).getTime()>21*86400e3){await sendEmail({to:p.email,subject:'Relanzio vous est-il encore utile ?',text:`Bonjour,\n\nVous n’avez pas ajouté de nouveau devis depuis quelque temps. Si Relanzio ne correspond pas à votre façon de travailler, répondez simplement à cet email : ce retour nous aide davantage qu’une relance automatique.\n\n— Relanzio`,replyTo:process.env.SUPPORT_EMAIL||'support@relanzio.com'});await mark(p.id,'winback_21d');results.push({user:p.id,type:'winback_21d'});}}
    }catch(e){results.push({user:p.id,error:String(e.message||e)})}
  }
  return results;
}
