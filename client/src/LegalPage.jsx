import React,{useEffect}from'react';
import { FREE_ACTIVE_QUOTES_LIMIT,FREE_LIMIT_TEXT,PRO_LIMIT_TEXT,PRO_PRICE_TEXT,TRIAL_DAYS,VAT_NOTICE } from '../../shared/plans.js';
import { COMPANY,SUBPROCESSORS } from '../../shared/company.js';
import { routeMeta } from './public-meta.js';

export const LEGAL_VERSION='28 octobre 2026';
export const DPA_PDF='/relanzio-dpa.pdf';

function Processors(){
  return <div className="table-scroll"><table className="legal-table"><thead><tr><th>Sous-traitant</th><th>Rôle</th><th>Localisation</th></tr></thead><tbody>
    {SUBPROCESSORS.map(p=><tr key={p.name}><td><b>{p.name}</b><small>{p.entity}</small></td><td>{p.role}</td><td>{p.region}</td></tr>)}
  </tbody></table></div>;
}

export default function LegalPage({page,contactEmail,supportEmail}){
  const notice=page==='legal',privacy=page==='privacy',dpa=page==='dpa';
  // Optional, set at build time when available (LCEN: phone of a natural-person publisher).
  const phone=import.meta.env.VITE_LEGAL_PHONE||'';
  const title=notice?'Mentions légales':privacy?'Politique de confidentialité':dpa?'Accord de traitement des données (DPA)':'Conditions générales d’utilisation et de vente';
  useEffect(()=>{routeMeta('/'+(page||'terms'));},[page]);

  return <main className="legal container">
    <span className="eyebrow">INFORMATIONS CONTRACTUELLES · VERSION DU {LEGAL_VERSION.toUpperCase()}</span>
    <h1>{title}</h1>
    <div className="legal-identity">
      <p><b>Éditeur :</b> {COMPANY.publisherName}, {COMPANY.legalForm} · SIREN {COMPANY.siren} · {VAT_NOTICE}</p>
      <p><b>Adresse :</b> {COMPANY.address}</p>
      <p><b>Contact :</b> <a href={'mailto:'+supportEmail}>{supportEmail}</a>{contactEmail&&contactEmail!==supportEmail?<> · <a href={'mailto:'+contactEmail}>{contactEmail}</a></>:null}{phone?<> · <b>Téléphone :</b> {phone}</>:null}</p>
      <p><b>Directeur de la publication :</b> {COMPANY.publicationDirector}</p>
    </div>

    {notice&&<>
      <h2>Hébergement</h2>
      <p><b>Application :</b> Railway Corporation, 548 Market St Suite 68956, San Francisco, California 94104, États-Unis · +1 415 707 7675 (région de production « sfo »).</p>
      <p><b>Base de données et authentification :</b> Supabase, Inc. — données hébergées dans l’Union européenne, à Paris (AWS eu-west-3).</p>
      <h2>Propriété intellectuelle</h2><p>Les textes, éléments graphiques, logiciels et contenus originaux de Relanzio sont protégés par les droits applicables. Toute réutilisation non autorisée reste interdite sauf disposition légale contraire.</p>
      <h2>Données personnelles</h2><p>Voir la <a href="/privacy">politique de confidentialité</a> et l’<a href="/dpa">accord de traitement des données</a>.</p>
    </>}

    {privacy&&<>
      <h2>Qui traite les données ?</h2><p>{COMPANY.publisherName} ({COMPANY.brand}) est responsable de traitement pour les données nécessaires à la création et à la gestion du compte, la sécurité, le support et la facturation. Pour les coordonnées et informations des clients que l’entreprise utilisatrice saisit dans ses devis, l’entreprise utilisatrice est responsable de traitement et Relanzio agit pour son compte, comme sous-traitant : voir le <a href="/dpa">DPA</a>.</p>
      <h2>Données et finalités</h2><p>Données de compte (email, entreprise, rôle), informations de devis saisies par l’utilisateur (client, email ou téléphone, objet, montant, dates, note), historique des relances, réglages, événements nécessaires au fonctionnement et à la sécurité, tickets support et références de facturation Stripe. Le rappel du matin et les emails liés à l’abonnement sont des emails de service ; les conseils produit facultatifs ne sont envoyés qu’avec votre accord.</p>
      <h2>Bases juridiques</h2><p>Exécution du contrat (compte, fonctions demandées, rappels de service, facturation) ; intérêt légitime (sécurité, prévention des abus, statistiques internes) ; consentement pour les communications marketing facultatives ; obligations légales (comptabilité). La prospection B2B ciblée, lorsqu’elle est utilisée, est gérée séparément avec droit d’opposition.</p>
      <h2>Prospects professionnels</h2><p>Pour une prospection B2B ciblée, Relanzio peut conserver des coordonnées professionnelles publiquement accessibles, l’entreprise, le rôle, la source et l’URL source, ainsi que l’historique minimal des échanges. L’opposition est simple, gratuite et peut être exercée à tout moment. Les données de prospection sont supprimées au plus tard trois ans après leur collecte ou le dernier contact émanant du prospect ; les informations strictement nécessaires au respect d’une opposition peuvent être conservées dans une liste repoussoir.</p>
      <h2>Sous-traitants</h2><Processors/>
      <h2>Transferts hors de l’Union européenne</h2><p>Railway (hébergement de l’application) et, le cas échéant, OpenAI et Stripe peuvent traiter des données aux États-Unis. Ces transferts s’appuient sur les garanties proposées par chaque prestataire (clauses contractuelles types de la Commission européenne et, lorsqu’il s’applique, le cadre de protection des données UE–États-Unis).</p>
      <h2>Durées</h2><p>Données du compte et des devis : pendant la durée du compte, puis supprimées à la suppression du compte (sauvegardes techniques à rotation limitée). Factures et pièces comptables : 10 ans (obligation légale). Journaux techniques et de sécurité : durée limitée nécessaire à la sécurité. Prospection : voir ci-dessus.</p>
      <h2>Cookies et stockage local</h2><p>Relanzio n’utilise ni cookie publicitaire, ni outil de mesure d’audience tiers. Le stockage local du navigateur sert uniquement à maintenir votre session de connexion, ce qui est strictement nécessaire : aucun bandeau de consentement n’est donc affiché. Les statistiques de fréquentation sont internes et ne reposent sur aucun identifiant persistant.</p>
      <h2>Vos droits</h2><p>Accès, rectification, effacement, limitation, portabilité lorsqu’elle s’applique et opposition : écrivez à <a href={'mailto:'+supportEmail}>{supportEmail}</a>. Vous pouvez exporter vos données et supprimer votre compte depuis Paramètres. Vous pouvez aussi introduire une réclamation auprès de la CNIL. Le droit d’opposition est simple et gratuit.</p>
    </>}

    {dpa&&<>
      <p className="legal-download"><a className="btn ghost" href={DPA_PDF} download>Télécharger le DPA (PDF)</a> <span className="muted">Version du {LEGAL_VERSION}. L’accord s’applique dès la création du compte ; aucune signature séparée n’est nécessaire.</span></p>
      <h2>1. Objet et rôles</h2><p>Le présent accord encadre, conformément à l’article 28 du RGPD, les traitements réalisés par Relanzio pour le compte du client professionnel lorsque celui-ci saisit dans Relanzio les coordonnées et informations relatives à ses propres clients ou prospects. Pour ces données, le client est responsable de traitement et {COMPANY.publisherName} ({COMPANY.brand}, SIREN {COMPANY.siren}) agit en qualité de sous-traitant.</p>
      <h2>2. Instructions et finalités</h2><p>Relanzio traite ces données uniquement pour fournir le suivi des devis, préparer ou envoyer les relances autorisées par le client, afficher l’historique, envoyer les rappels de service, assurer le support, la sécurité et la maintenance. Le client reste responsable de la licéité de ses instructions, de ses bases légales, des règles de prospection applicables à son activité et de l’information des personnes concernées.</p>
      <h2>3. Données et personnes concernées</h2><p>Identité, email et/ou téléphone communiqués par le client, objet et montant du devis, dates, statut, note libre et contenu des relances. Personnes concernées : clients et prospects du client. Durée : pendant la durée du compte.</p>
      <h2>4. Confidentialité et sécurité</h2><p>Accès limité aux personnes et systèmes nécessaires, authentification, isolation des données par compte, chiffrement des communications en transit, journalisation, sauvegardes, et engagement de confidentialité des personnes autorisées.</p>
      <h2>5. Sous-traitants ultérieurs</h2><p>Le client autorise le recours aux sous-traitants ultérieurs suivants ; toute modification de cette liste est annoncée sur cette page, le client pouvant s’y opposer en résiliant son abonnement.</p><Processors/>
      <h2>6. Assistance</h2><p>Relanzio aide le client, dans la mesure raisonnable, à répondre aux demandes d’exercice de droits (export et suppression disponibles dans l’application), à gérer les incidents de sécurité et à réaliser ses analyses d’impact lorsque les traitements confiés sont concernés.</p>
      <h2>7. Violation de données</h2><p>Relanzio notifie au client toute violation de données personnelles concernant les traitements confiés dans les meilleurs délais et au plus tard 48 heures après en avoir pris connaissance, avec les informations disponibles utiles à ses propres obligations de notification.</p>
      <h2>8. Sort des données</h2><p>Le client peut exporter ses données à tout moment. À la suppression du compte, les données confiées sont supprimées, sous réserve des sauvegardes techniques à rotation limitée et des obligations légales.</p>
      <h2>9. Transferts</h2><p>Lorsqu’un traitement implique un transfert hors de l’EEE (voir la liste ci-dessus), Relanzio s’appuie sur les garanties proposées par le prestataire concerné (clauses contractuelles types et, le cas échéant, cadre UE–États-Unis).</p>
      <h2>10. Documentation et audit</h2><p>Relanzio met à disposition les informations nécessaires pour démontrer le respect du présent accord. Un audit peut être demandé par écrit à <a href={'mailto:'+supportEmail}>{supportEmail}</a>, selon des modalités préservant la sécurité et la confidentialité des autres clients.</p>
    </>}

    {!notice&&!privacy&&!dpa&&<>
      <h2>1. Champ d’application</h2><p>Relanzio est un service en ligne réservé aux professionnels (artisans, entreprises, indépendants), édité par {COMPANY.publisherName}. Il organise le suivi des devis après leur envoi. Il ne crée pas de devis, ne facture pas les clients de l’utilisateur et ne garantit ni réponse, ni signature, ni chiffre d’affaires. En créant un compte, l’utilisateur accepte les présentes conditions.</p>
      <h2>2. Offres</h2><p>La formule Découverte est gratuite et permet jusqu’à {FREE_LIMIT_TEXT}. La formule Pro coûte {PRO_PRICE_TEXT} et permet jusqu’à {PRO_LIMIT_TEXT}. {VAT_NOTICE}. Un devis en attente ou en pause est considéré comme actif.</p>
      <h2>3. Essai Pro</h2><p>L’essai Pro de {TRIAL_DAYS} jours démarre automatiquement à l’ajout du premier devis, une seule fois par compte, sans carte bancaire et sans débit automatique. À son terme, sans abonnement, le compte revient à la formule gratuite. Aucune donnée n’est supprimée : si plus de {FREE_ACTIVE_QUOTES_LIMIT} devis sont actifs, les {FREE_ACTIVE_QUOTES_LIMIT} plus récemment ajoutés restent modifiables et les autres passent en lecture seule (consultation, marquage gagné ou perdu, suppression), jusqu’au retour sous la limite ou au passage à Pro.</p>
      <h2>4. Abonnement et paiement</h2><p>Pro est un abonnement mensuel récurrent de {PRO_PRICE_TEXT}, sans engagement de durée minimale. {VAT_NOTICE}. Le paiement par carte est traité par Stripe, exigible à la souscription puis à chaque échéance mensuelle. Les factures sont disponibles dans le portail client. En cas d’échec de paiement, l’envoi automatique est suspendu jusqu’à régularisation. Escompte pour paiement anticipé : néant.</p>
      <h2>5. Résiliation et remboursement</h2><p>L’abonnement peut être résilié à tout moment depuis le portail client (« Gérer mon abonnement »). La résiliation prend effet à la fin de la période mensuelle en cours, déjà payée : Pro reste actif jusqu’à cette date, puis le compte revient à la formule gratuite, sans perte de données. La période entamée n’est pas remboursée au prorata, sauf erreur de facturation ou disposition légale contraire. Le service étant réservé aux professionnels, le droit de rétractation des consommateurs ne s’applique pas.</p>
      <h2>6. Retard de paiement</h2><p>En cas de retard de paiement entre professionnels, des pénalités sont exigibles de plein droit, sans rappel, à compter du jour suivant la date de règlement figurant sur la facture, au taux de trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement.</p>
      <h2>7. Utilisation du service et règles de prospection</h2><p>L’utilisateur reste seul responsable des données qu’il saisit, du contenu et de l’opportunité des relances adressées à ses propres clients, et du respect des règles de prospection et de démarchage applicables à son activité (notamment le RGPD, le Code des postes et des communications électroniques et le Code de la consommation). À titre d’exemple, depuis le 2 juillet 2025, l’article L223-8 du Code de la consommation interdit la prospection commerciale de consommateurs par voie électronique (email, SMS, réseaux sociaux) pour des travaux ou équipements de rénovation énergétique ou de production d’énergie renouvelable, sauf contrat en cours. Relanzio fournit un outil ; il ne vérifie pas la licéité de chaque relance. Les envois automatiques nécessitent une activation explicite, devis par devis, et chaque email envoyé via Relanzio comporte un lien de désinscription.</p>
      <h2>8. Disponibilité</h2><p>Relanzio met en œuvre des moyens raisonnables pour assurer la disponibilité et la sécurité du service (obligation de moyens). Maintenance, incidents ou dépendances à des prestataires peuvent affecter temporairement l’accès. Aucun niveau de disponibilité chiffré n’est garanti.</p>
      <h2>9. Données personnelles</h2><p>Voir la <a href="/privacy">politique de confidentialité</a>. Pour les données des clients de l’utilisateur, le <a href="/dpa">DPA</a> s’applique. L’utilisateur peut exporter ses données et supprimer son compte à tout moment depuis Paramètres.</p>
      <h2>10. Propriété intellectuelle</h2><p>Relanzio, ses logiciels, textes et interfaces restent protégés par les droits applicables. L’utilisateur conserve ses droits sur les données et contenus qu’il fournit.</p>
      <h2>11. Responsabilité</h2><p>Chaque partie répond des dommages directs qui lui sont imputables. La responsabilité totale de Relanzio, tous dommages confondus, est limitée aux sommes payées par l’utilisateur au titre des douze derniers mois. Relanzio n’est pas responsable des décisions commerciales de l’utilisateur, de l’exactitude des données saisies, ni d’un résultat commercial non obtenu. Ces limites ne s’appliquent pas en cas de faute lourde ou intentionnelle.</p>
      <h2>12. Évolution des conditions</h2><p>Relanzio peut faire évoluer le service et les présentes conditions. Toute modification du prix ou des conditions de l’abonnement est annoncée au moins 30 jours avant de s’appliquer à une période future ; l’utilisateur peut résilier avant cette date.</p>
      <h2>13. Droit applicable et litiges</h2><p>Les présentes conditions sont soumises au droit français. Avant toute action, les parties recherchent une solution amiable en écrivant à <a href={'mailto:'+supportEmail}>{supportEmail}</a>. À défaut, et entre professionnels, les tribunaux du ressort de Montpellier sont compétents, sous réserve des règles impératives.</p>
    </>}
  </main>;
}
