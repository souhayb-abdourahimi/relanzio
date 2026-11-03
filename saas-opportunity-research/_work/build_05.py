"""Construit 05-concurrents-et-prix.md à partir des _work/DD-*-concurrents.csv.
Usage : python3 -I build_05.py <dossier _work> <sortie>"""
import csv, glob, os, sys
src, dst = sys.argv[1], sys.argv[2]
titres = {
    "A23": "A-23 — Rapprochement MFP, pharmacies indépendantes (US)",
    "A39": "A-39 — Devoir de conseil, petits courtiers (FR)",
    "B09": "B-09/B-10 — Registres fluides frigorigènes (US/FR)",
    "B11": "B-11 — Testeurs backflow (US)",
    "D20": "D-20 — Impayés + statut « encaissée » e-facture (FR)",
    "D37": "D-37 — Preuves Qualiopi, petits OF (FR)",
    "E01": "E-01 — Questionnaires de sécurité, petits éditeurs SaaS (UE/US)",
    "E13": "E-13 — Relance de devis TPE (FR) — produit existant Relanzio",
}
def cell(s):
    return (s or "").replace("|", "/").replace("\n", " ").strip()
L = ["# 05 — Concurrents et prix vérifiés", "",
     "Date : 2026-10-29. Sources : fichiers `_work/DD-*-concurrents.csv` des due diligences.",
     "**Statut des prix** : aucune page tarifaire n'a pu être ouverte (WebFetch bloqué). Un prix est « VÉRIFIÉ-extrait » quand il apparaît dans un extrait de moteur de recherche, souvent issu d'un comparatif tiers. Il doit être contrôlé sur la page officielle avant toute décision de prix. « INCONNU » = non trouvé.", ""]
n = 0
for f in sorted(glob.glob(os.path.join(src, "DD-*-concurrents.csv"))):
    key = os.path.basename(f)[3:6]
    with open(f, newline="", encoding="utf-8") as h:
        rows = list(csv.DictReader(h))
    n += len(rows)
    L += [f"## {titres.get(key, key)}", "", f"{len(rows)} entrées.", "",
          "| Nom | Type | Marché | Prix observé | Ce qui est vendu | Source du prix (date) | Statut |", "|---|---|---|---|---|---|---|"]
    for r in rows:
        src_p = cell(r.get("source_prix")) + (f" ({cell(r.get('date_source'))})" if r.get("date_source") else "")
        nom = cell(r.get("nom"))
        if r.get("url"):
            nom = f"[{nom}]({r['url'].strip()})"
        L.append(f"| {nom} | {cell(r.get('type'))} | {cell(r.get('marche'))} | {cell(r.get('prix_observe'))} | {cell(r.get('ce_qui_est_vendu'))[:140]} | {src_p[:120]} | {cell(r.get('statut_verification'))} |")
    L.append("")
L.insert(4, f"Total : {n} concurrents, substituts ou offres publiques sur 8 pistes.\n")
open(dst, "w", encoding="utf-8").write("\n".join(L))
print(n, "lignes")
