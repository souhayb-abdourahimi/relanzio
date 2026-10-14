import React,{useEffect}from'react';

export default function LegalPage({page,contactEmail,supportEmail}){
  const notice=page==='legal',privacy=page==='privacy',dpa=page==='dpa';
  const legal={
    entityType:import.meta.env.VITE_LEGAL_ENTITY_TYPE||'',
    name:import.meta.env.VITE_LEGAL_NAME||'',
    form:import.meta.env.VITE_LEGAL_FORM||'',
    capital:import.meta.env.VITE_LEGAL_CAPITAL||'',
    address:import.meta.env.VITE_LEGAL_ADDRESS||'',
    registration:import.meta.env.VITE_LEGAL_REGISTRATION||'',
    vat:import.meta.env.VITE_LEGAL_VAT||'',
    phone:import.meta.env.VITE_LEGAL_PHONE||'',
    publisher:import.meta.env.VITE_PUBLICATION_DIRECTOR||''
  };
  const companyFieldsOk=legal.entityType==='individual'||(legal.entityType==='company'&&legal.form&&legal.capital);
  const identityComplete=Boolean(['individual','company'].includes(legal.entityType)&&companyFieldsOk&&legal.name&&legal.address&&legal.registration&&legal.phone&&legal.publisher);
  const title=notice?'Mentions légales':privacy?'Politique de confidentialité':dpa?'Accord de traitement des données (DPA)':'Conditions générales B2B';
  useEffect(()=>{
    document.title=title+' — Relanzio';
    const robots=document.querySelector('meta[name="robots"]')||document.head.appendChild(document.createElement('meta'));
    robots.setAttribute('name','robots');robots.setAttribute('content','index,follow');
  },[title]);

  return <main className="legal container">
    <span className="eyebrow">INFORMATIONS CONTRACTUELLES</span>
    <h1>{title}</h1>
    {!identityComplete&&<div className="warning"><b>Informations éditeur à compléter avant ouverture de la facturation :</b> statut de l’éditeur, identité/dénomination, adresse, immatriculation pertinente, téléphone professionnel et directeur de publication ; si société, forme juridique et capital.</div>}
    <div className="legal-identity">
      <p><b>Éditeur :</b> {legal.name||'À compléter'}{legal.entityType==='company'&&legal.form?' · '+legal.form:''}{legal.entityType==='company'&&legal.capital?' · capital '+legal.capital:''}{legal.registration?' · '+legal.registration:''}{legal.vat?' · TVA '+legal.vat:''}</p>
      <p><b>Adresse :</b> {legal.address||'À compléter'}</p>
      <p><b>Contact :</b> <a href={'mailto:'+contactEmail}>{contactEmail}</a> · <b>Support :</b> <a href={'mailto:'+supportEmail}>{supportEmail}</a>{legal.phone?<> · <b>Téléphone :</b> {legal.phone}</>:null}</p>
      {legal.publisher&&<p><b>Directeur de publication :</b> {legal.publisher}</p>}
    </div>

    {notice&&<>
      <h2>Hébergement</h2><p>Railway Corporation, 548 Market St Suite 68956, San Francisco, California 94104, États-Unis · +1 415 707 7675.</p>
      <h2>Propriété intellectuelle</h2><p>Les textes, éléments graphiques, logiciels et contenus originaux de Relanzio sont protégés par les droits applicables. Toute réutilisation non autorisée reste interdite sauf disposition légale contraire.</p>
    </>}

    {privacy&&<>
      <h2>Qui traite les données ?</h2><p>Relanzio agit comme responsable de traitement pour les données nécessaires à la création et à la gestion du compte, la sécurité, le support, la facturation et ses propres obligations. Pour les coordonnées et informations des clients que l’entreprise utilisatrice saisit dans ses devis, l’entreprise utilisatrice détermine la finalité du suivi commercial et Relanzio traite ces données pour son compte : la relation de sous-traitance est décrite dans le <a href="/dpa">DPA</a>.</p>
      <h2>Données et finalités</h2><p>Relanzio traite les données de compte, les informations de devis saisies par l’utilisateur, l’historique des relances, les événements nécessaires au fonctionnement et à la sécurité, les tickets support et les références de facturation nécessaires au service.</p>
      <h2>Bases juridiques</h2><p>La gestion du compte, du support, des fonctions demandées et de la facturation repose principalement sur l’exécution du contrat. La sécurité et certaines mesures de prévention des abus peuvent relever de l’intérêt légitime. Les communications marketing facultatives destinées aux utilisateurs reposent sur leur choix lorsqu’un consentement est requis. La prospection B2B ciblée, lorsqu’elle est utilisée, est gérée séparément avec droit d’opposition.</p>
      <h2>Prospects professionnels</h2><p>Pour une prospection B2B ciblée, Relanzio peut conserver des coordonnées professionnelles publiquement accessibles, l’entreprise, le rôle, la source et l’URL source, ainsi que l’historique minimal des échanges. L’opposition est simple, gratuite et peut être exercée à tout moment. Les données de prospection sont supprimées au plus tard trois ans après leur collecte ou le dernier contact émanant du prospect ; les informations strictement nécessaires au respect d’une opposition peuvent être conservées dans une liste repoussoir.</p>
      <h2>Prestataires</h2><p>Relanzio utilise notamment Supabase pour la base de données et l’authentification, Railway pour l’hébergement, Brevo pour les emails, Stripe pour le paiement lorsque la facturation est activée et OpenAI lorsque les fonctions IA concernées sont utilisées. Leur rôle exact dépend du traitement concerné.</p>
      <h2>Transferts internationaux</h2><p>Certains prestataires peuvent traiter des données hors de l’Espace économique européen. Relanzio s’appuie alors sur les mécanismes de transfert et garanties contractuelles applicables proposés pour le service concerné.</p>
      <h2>Durées</h2><p>Les données du compte et du service sont conservées pendant la durée nécessaire à l’exécution du contrat puis supprimées, anonymisées ou conservées de façon limitée lorsque la loi, la sécurité ou la preuve l’exigent. Les durées spécifiques de prospection sont décrites ci-dessus.</p>
      <h2>Cookies et stockage local</h2><p>Relanzio n’intègre pas de publicité comportementale. Les mécanismes nécessaires à l’authentification et à la sécurité peuvent utiliser le stockage du navigateur. Tout outil de mesure d’audience éventuellement ajouté doit respecter les règles de consentement ou les conditions strictes d’exemption applicables.</p>
      <h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité lorsqu’elle s’applique ou exercer votre droit d’opposition en écrivant à <a href={'mailto:'+contactEmail}>{contactEmail}</a>. Vous pouvez également introduire une réclamation auprès de la CNIL.</p>
    </>}

    {dpa&&<>
      <h2>1. Objet et rôles</h2><p>Le présent accord encadre les traitements réalisés par Relanzio pour le compte du client professionnel lorsque celui-ci saisit dans Relanzio les coordonnées et informations relatives à ses propres prospects ou clients. Pour ces données, le client est responsable de traitement et Relanzio agit en qualité de sous-traitant.</p>
      <h2>2. Instructions et finalités</h2><p>Relanzio traite ces données uniquement pour fournir le suivi des devis, préparer ou envoyer les relances autorisées, afficher l’historique, assurer le support, la sécurité, la maintenance et les fonctions expressément utilisées par le client. Le client reste responsable de la licéité de ses instructions, de ses bases légales et des informations fournies aux personnes concernées.</p>
      <h2>3. Données et personnes concernées</h2><p>Les données peuvent inclure identité, coordonnées communiquées par le client, objet et montant d’un devis, dates, statut du dossier et contenu des relances. Les personnes concernées sont principalement les clients et prospects de l’entreprise utilisatrice.</p>
      <h2>4. Confidentialité et sécurité</h2><p>Relanzio limite l’accès aux données aux personnes et systèmes nécessaires, utilise des contrôles d’accès, l’authentification, des communications chiffrées en transit, des mesures de journalisation et des mécanismes visant à prévenir les accès non autorisés.</p>
      <h2>5. Sous-traitants ultérieurs</h2><p>Le service peut s’appuyer notamment sur Supabase, Railway, Brevo et, lorsque la fonctionnalité correspondante est utilisée, OpenAI. Stripe traite les informations de paiement selon le rôle et les conditions applicables à ses services. Relanzio reste responsable de l’encadrement de ses sous-traitants ultérieurs lorsqu’ils agissent pour son compte.</p>
      <h2>6. Assistance</h2><p>Relanzio apporte une assistance raisonnable au client pour répondre aux demandes d’exercice de droits, gérer les incidents de sécurité et fournir les informations nécessaires à ses obligations RGPD, dans la mesure où les traitements confiés sont concernés.</p>
      <h2>7. Violation de données</h2><p>Lorsqu’une violation de données personnelles concernant les traitements confiés est confirmée, Relanzio informe le client sans délai indu avec les informations disponibles utiles à l’évaluation et aux obligations de notification.</p>
      <h2>8. Sort des données</h2><p>À la fin du service, le client peut exporter ses données avant suppression. Sous réserve des obligations légales de conservation et des sauvegardes techniques à cycle de rétention limité, les données confiées sont supprimées lorsque le compte est supprimé.</p>
      <h2>9. Transferts</h2><p>Lorsqu’un traitement implique un transfert hors de l’EEE, Relanzio veille à l’existence d’un mécanisme juridique approprié et des garanties applicables au prestataire concerné.</p>
      <h2>10. Documentation et audit</h2><p>Relanzio met à disposition les informations raisonnablement nécessaires pour démontrer le respect des obligations de sous-traitance. Les modalités d’un audit doivent préserver la sécurité, la confidentialité des autres clients et la continuité du service.</p>
    </>}

    {!notice&&!privacy&&!dpa&&<>
      <h2>1. Champ d’application</h2><p>Relanzio est un service SaaS réservé aux professionnels. Il organise le suivi des devis après leur envoi et ne garantit ni réponse, ni signature, ni chiffre d’affaires.</p>
      <h2>2. Offres</h2><p>La formule Découverte est gratuite et permet jusqu’à 5 devis actifs. La formule Pro coûte 29 € par mois et permet jusqu’à 100 devis actifs. Un devis en attente ou en pause est considéré comme actif. Aucun dépassement de quota n’entraîne la suppression automatique des données existantes.</p>
      <h2>3. Essai Pro</h2><p>Un compte éligible peut activer une fois un essai Pro de 7 jours, sans carte bancaire et sans débit automatique. À l’expiration, le compte revient à la formule gratuite sauf abonnement Pro actif. Les données restent conservées ; si plus de 5 devis sont actifs, l’utilisateur peut les consulter et les clôturer mais ne peut pas en créer de nouveaux jusqu’au retour sous la limite ou au passage à Pro.</p>
      <h2>4. Abonnement et paiement</h2><p>Pro est un abonnement mensuel récurrent de 29 €. Le prix, la fréquence et les taxes applicables sont présentés avant confirmation du paiement. Le paiement est traité par Stripe. L’abonnement se renouvelle mensuellement jusqu’à résiliation.</p>
      <h2>5. Résiliation</h2><p>Lorsqu’un abonnement est actif, le portail client Stripe permet notamment de consulter les factures, mettre à jour le moyen de paiement et demander la résiliation. La résiliation prend effet à la fin de la période déjà payée lorsqu’elle est programmée en fin de période.</p>
      <h2>6. Retard de paiement B2B</h2><p>Les sommes dues sont exigibles à l’échéance indiquée. En cas de retard entre professionnels, des pénalités sont exigibles sans rappel ; leur taux est fixé à trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement lorsque les conditions légales sont réunies, sans préjudice d’une indemnisation complémentaire justifiée.</p>
      <h2>7. Utilisation du service</h2><p>Le client reste responsable des données saisies, de la licéité de ses communications et du caractère approprié des relances adressées à ses propres clients. Les envois automatiques, lorsqu’ils sont disponibles, nécessitent une activation explicite et restent contrôlés au niveau du devis.</p>
      <h2>8. Disponibilité et maintenance</h2><p>Relanzio met en œuvre des moyens raisonnables pour assurer la disponibilité et la sécurité du service. Des opérations de maintenance, incidents techniques ou dépendances à des prestataires peuvent affecter temporairement l’accès. Aucun niveau de disponibilité chiffré n’est garanti sauf engagement écrit distinct.</p>
      <h2>9. Données personnelles</h2><p>Les traitements sont décrits dans la <a href="/privacy">politique de confidentialité</a>. Lorsque Relanzio traite les données des clients ou prospects de l’entreprise utilisatrice pour son compte, le <a href="/dpa">DPA</a> s’applique.</p>
      <h2>10. Propriété intellectuelle</h2><p>Relanzio et ses éléments logiciels, textes, interfaces et contenus originaux restent protégés par les droits applicables. Le client conserve ses droits sur les données et contenus qu’il fournit.</p>
      <h2>11. Responsabilité</h2><p>Chaque partie répond des dommages directs qui lui sont imputables dans les limites autorisées par la loi. Relanzio n’est pas responsable d’une décision commerciale du client, de la véracité des données saisies, ni d’un résultat commercial attendu mais non garanti.</p>
      <h2>12. Évolution du service</h2><p>Relanzio peut faire évoluer les fonctionnalités pour des raisons de sécurité, de conformité ou d’amélioration du produit. Une modification substantielle affectant le prix ou les conditions de l’abonnement est portée à la connaissance du client avant son application à une période future.</p>
      <h2>13. Support et droit applicable</h2><p>Le support est joignable à <a href={'mailto:'+supportEmail}>{supportEmail}</a>. Le contrat est soumis au droit français. En cas de litige entre professionnels, les juridictions compétentes sont déterminées selon les règles légales applicables.</p>
    </>}
  </main>;
}
