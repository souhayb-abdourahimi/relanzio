"""Simulation micro-SaaS solo (phase 7) : clients nécessaires, coûts, cotisations, bénéfice ajusté, valorisation.

Usage : python3 -I micro_saas_sim.py <config.json> <sortie.md>

Le JSON contient :
  "fiscal": {"taux_cotisations": 0.xx, "taux_vl": 0.0xx, "cfp": 0.00x, "source": "..."}
            (taux appliqués au CA encaissé ; versement libératoire supposé si éligible)
  "multiples": {"pessimiste": x, "central": y, "favorable": z, "base": "SDE annuel ajusté", "source": "..."}
  "cout_horaire_operateur": € / heure (coût d'un opérateur freelance qui remplacerait le fondateur)
  "opportunites": [ {"id","titre","prix_mensuel_ht","cout_variable_client_mois","frais_paiement_pct",
                     "frais_paiement_fixe","fixes_mensuels","heures_fixes_mois","heures_par_client_mois",
                     "churn_mensuel","cac"} ]
Toutes les entrées sont des ESTIMATIONS sauf mention contraire dans le fichier de configuration.
"""
import json
import math
import sys

PALIERS = [1000, 2000, 3000, 5000]


def simuler(o, fiscal, mult, cout_h):
    lignes = []
    for mrr_cible in PALIERS:
        n = math.ceil(mrr_cible / o["prix_mensuel_ht"])
        mrr = n * o["prix_mensuel_ht"]
        paiement = n * (o["prix_mensuel_ht"] * o["frais_paiement_pct"] + o["frais_paiement_fixe"])
        variables = n * o["cout_variable_client_mois"]
        fixes = o["fixes_mensuels"]
        cotis = mrr * (fiscal["taux_cotisations"] + fiscal["cfp"])
        impot = mrr * fiscal["taux_vl"]
        charges_reelles = paiement + variables + fixes
        net_fondateur = mrr - charges_reelles - cotis - impot
        heures = o["heures_fixes_mois"] + n * o["heures_par_client_mois"]
        # Bénéfice économique pour un repreneur : on retire le coût d'un opérateur qui ferait le travail.
        # La fiscalité du repreneur dépend de sa structure : on valorise sur le bénéfice avant impôts personnels.
        sde_mensuel = mrr - charges_reelles
        benefice_ajuste = sde_mensuel - heures * cout_h
        # Remplacement des clients perdus : n x churn nouveaux clients par mois à acquérir au CAC
        remplacement = n * o["churn_mensuel"] * o["cac"]
        benefice_ajuste_net_acq = benefice_ajuste - remplacement
        lignes.append({
            "mrr_cible": mrr_cible, "clients": n, "mrr": mrr, "paiement": paiement, "variables": variables,
            "fixes": fixes, "cotisations": cotis, "impot_vl": impot, "net_fondateur": net_fondateur,
            "heures": heures, "taux_horaire_fondateur": net_fondateur / heures if heures else 0,
            "sde_mensuel": sde_mensuel, "benefice_ajuste": benefice_ajuste,
            "cout_remplacement_churn": remplacement, "benefice_ajuste_net_acq": benefice_ajuste_net_acq,
            "val_pess": max(0, benefice_ajuste_net_acq * 12 * mult["pessimiste"]),
            "val_cent": max(0, benefice_ajuste_net_acq * 12 * mult["central"]),
            "val_fav": max(0, benefice_ajuste_net_acq * 12 * mult["favorable"]),
            "clients_perdus_an": n * (1 - (1 - o["churn_mensuel"]) ** 12),
        })
    return lignes


def eur(x):
    return f"{x:,.0f} €".replace(",", " ")


def main(cfg_path, out_path):
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    f, m, ch = cfg["fiscal"], cfg["multiples"], cfg["cout_horaire_operateur"]
    L = ["# Simulations financières — micro-SaaS solo (phase 7)", "",
         f"Généré par `_work/micro_saas_sim.py` depuis `{cfg_path}`. **Toutes les entrées sont des estimations** sauf mention contraire.", "",
         f"- Cotisations sociales : {f['taux_cotisations']:.1%} du CA ; CFP : {f['cfp']:.2%} ; versement libératoire de l'IR : {f['taux_vl']:.1%} (source : {f['source']}).",
         f"- Coût d'un opérateur qui remplacerait le fondateur : {ch} €/h.",
         f"- Multiples appliqués au bénéfice ajusté annuel (net du coût d'acquisition de remplacement) : pessimiste {m['pessimiste']}×, central {m['central']}×, favorable {m['favorable']}× (source : {m['source']}). **Ce ne sont pas des prix garantis.**",
         "- **Net fondateur** = trésorerie disponible après charges réelles, cotisations et IR libératoire. **Bénéfice ajusté** = bénéfice avant impôts personnels, moins le coût d'un opérateur rémunéré pour les heures d'exploitation. C'est ce qu'un repreneur achète.", ""]
    for o in cfg["opportunites"]:
        L += [f"## {o['id']} — {o['titre']}", "",
              f"Prix {o['prix_mensuel_ht']} € HT/mois ; coût variable {o['cout_variable_client_mois']} €/client/mois ; paiement {o['frais_paiement_pct']:.1%} + {o['frais_paiement_fixe']} € ; fixes {o['fixes_mensuels']} €/mois ; "
              f"{o['heures_fixes_mois']} h fixes + {o['heures_par_client_mois']} h/client/mois ; churn {o['churn_mensuel']:.1%}/mois ; CAC {o['cac']} €.", "",
              "| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |",
              "|---|---|---|---|---|---|---|---|---|---|---|---|"]
        for r in simuler(o, f, m, ch):
            charges = r["paiement"] + r["variables"] + r["fixes"]
            L.append(f"| {eur(r['mrr_cible'])} | {r['clients']} | {eur(charges)} | {eur(r['cotisations'])} | {eur(r['impot_vl'])} | **{eur(r['net_fondateur'])}** | {r['heures']:.0f} | {r['taux_horaire_fondateur']:.0f} € | {eur(r['benefice_ajuste'])} | {eur(r['benefice_ajuste_net_acq'])} | {r['clients_perdus_an']:.0f} | {eur(r['val_pess'])} / {eur(r['val_cent'])} / {eur(r['val_fav'])} |")
        L.append("")
    open(out_path, "w", encoding="utf-8").write("\n".join(L))
    print("écrit", out_path)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
