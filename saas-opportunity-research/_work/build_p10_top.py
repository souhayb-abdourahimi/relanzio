"""Construit le TOP 15 de la phase 10 : note vérifiée si disponible (P10-V*-scores.csv), sinon note du découvreur.
Usage : python3 -I build_p10_top.py <dossier _work> <sortie.md> <sortie.csv>"""
import csv, glob, os, sys
src, out_md, out_csv = sys.argv[1], sys.argv[2], sys.argv[3]
def f(x):
    try: return float(str(x).replace(',', '.'))
    except Exception: return None
pistes = {}
for p in sorted(glob.glob(os.path.join(src, 'P10-D[1-4]-pistes.csv'))):
    for r in csv.DictReader(open(p, encoding='utf-8')):
        pistes[r['id']] = r
ver = {}
for p in sorted(glob.glob(os.path.join(src, 'P10-V[1-9]-scores.csv'))):
    for r in csv.DictReader(open(p, encoding='utf-8')):
        ver[r['id']] = r
# alias : les vérificateurs ont parfois noté l'id sans préfixe
alias = {}
for k in ver:
    for pk in pistes:
        if pk == k or pk.endswith(k) or k.endswith(pk):
            alias[pk] = k
deltas, rows = [], []
for pk, r in pistes.items():
    d = f(r['total_100'])
    v = ver.get(alias.get(pk, ''), None)
    vt = f(v['total_100']) if v else None
    if vt is not None and d is not None:
        deltas.append(vt - d)
    rows.append(dict(id=pk, titre=r['titre'], categorie=r['categorie'], client=r['client_payeur'], probleme=r['probleme'],
                     depense=r['depense_actuelle'], concurrents=r['concurrents_directs'], substituts=r['substituts'],
                     lacune=r['lacune'], innovation=r['innovation_0_5'], prix=r['prix_test'], risque=r['risque_principal'],
                     note_decouvreur=d, note_verifiee=vt, confiance_demande=(v or {}).get('confiance_demande') or r['confiance_demande'],
                     verdict=(v or {}).get('verdict', 'non vérifiée')))
moy = sum(deltas) / len(deltas) if deltas else 0
for r in rows:
    r['note_retenue'] = r['note_verifiee'] if r['note_verifiee'] is not None else (r['note_decouvreur'] or 0) + moy
    r['statut'] = 'vérifiée' if r['note_verifiee'] is not None else f'non vérifiée (décote moyenne {moy:+.1f} appliquée)'
rows.sort(key=lambda r: -r['note_retenue'])
cols = ['id', 'titre', 'categorie', 'note_decouvreur', 'note_verifiee', 'note_retenue', 'statut', 'confiance_demande', 'innovation',
        'client', 'probleme', 'depense', 'concurrents', 'substituts', 'lacune', 'prix', 'risque', 'verdict']
with open(out_csv, 'w', newline='', encoding='utf-8') as h:
    w = csv.DictWriter(h, fieldnames=cols); w.writeheader()
    for r in rows:
        w.writerow({c: (f"{r[c]:.1f}" if isinstance(r[c], float) else r[c]) for c in cols})
cell = lambda s: str(s or '').replace('|', '/').replace('\n', ' ')
L = [f"Décote moyenne observée entre découvreur et vérificateur sur {len(deltas)} pistes vérifiées : **{moy:+.1f} points**. Elle est appliquée, à titre indicatif, aux pistes non vérifiées.", "",
     "| Rang | Id | Piste | Cat. | Note découvreur → vérifiée | Note retenue | Confiance demande | Innov. 0-5 | Client payeur | Prix testable | Principal risque |",
     "|---|---|---|---|---|---|---|---|---|---|---|"]
for i, r in enumerate(rows[:15], 1):
    nv = f"{r['note_verifiee']:.1f}" if r['note_verifiee'] is not None else 'non vérifiée'
    L.append(f"| {i} | {r['id']} | {cell(r['titre'])[:110]} | {cell(r['categorie'])[:14]} | {r['note_decouvreur']} → {nv} | **{r['note_retenue']:.1f}** | {cell(r['confiance_demande'])[:20]} | {cell(r['innovation'])} | {cell(r['client'])[:70]} | {cell(r['prix'])[:50]} | {cell(r['risque'])[:110]} |")
open(out_md, 'w', encoding='utf-8').write('\n'.join(L))
print(f"{len(rows)} pistes, {len(deltas)} vérifiées, décote moyenne {moy:+.1f}")
for r in rows[:15]: print(f"{r['note_retenue']:.1f} {r['id']} {r['statut'][:12]} {r['titre'][:70]}")
