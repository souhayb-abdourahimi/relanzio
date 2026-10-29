"""Modèle bottom-up du temps d'exploitation N06 (phase 9) : d'où viendraient les heures à 21 cabinets ?

Usage : python3 -I p9_temps.py > ../P9-modele-temps.md
Toutes les valeurs sont des ESTIMATIONS [E] ou HYPOTHÈSES [H] à remplacer par les mesures du protocole de chronométrage.
"""

SCENARIOS = {
    # cabinets, dossiers par cabinet, marketplaces par dossier, versements par marketplace et par mois,
    # taux d'exception, minutes par exception, minutes de contrôle humain par versement automatisé,
    # churn cabinets/mois, heures d'acquisition par cabinet, heures de mise en place par cabinet,
    # heures par nouveau dossier, renouvellement des dossiers/mois, changements de format/mois,
    # heures par changement, heures fixes de maintenance, minutes de support par cabinet/mois, heures admin
    "bas": dict(cab=21, dos=5, mkp=1.5, vers=2.0, exc=0.02, min_exc=10, min_ctrl=0.0, churn=0.015,
                h_acq=12, h_setup=2, h_dos=0.5, renouv=0.02, chg=0.5, h_chg=2, h_maint=2, min_sup=10, h_admin=1.5),
    "central": dict(cab=21, dos=6.5, mkp=1.8, vers=2.5, exc=0.05, min_exc=12, min_ctrl=0.0, churn=0.02,
                    h_acq=17, h_setup=3, h_dos=1.0, renouv=0.03, chg=1.0, h_chg=3, h_maint=3, min_sup=20, h_admin=2),
    "haut": dict(cab=21, dos=8, mkp=2.2, vers=3.0, exc=0.10, min_exc=15, min_ctrl=0.5, churn=0.03,
                 h_acq=25, h_setup=4, h_dos=1.5, renouv=0.05, chg=2.0, h_chg=4, h_maint=5, min_sup=40, h_admin=3),
}


def calc(p):
    dossiers = p["cab"] * p["dos"]
    versements = dossiers * p["mkp"] * p["vers"]
    r = {}
    r["Acquisition (remplacement du churn)"] = p["cab"] * p["churn"] * p["h_acq"]
    r["Intégration (nouveaux cabinets + nouveaux dossiers)"] = (p["cab"] * p["churn"] * p["h_setup"]
                                                                 + dossiers * p["renouv"] * p["h_dos"])
    r["Rapprochement (contrôle humain des versements automatisés)"] = versements * p["min_ctrl"] / 60
    r["Gestion des exceptions"] = versements * p["exc"] * p["min_exc"] / 60
    r["Maintenance (formats d'export, dépendances, sécurité)"] = p["chg"] * p["h_chg"] + p["h_maint"]
    r["Support aux cabinets"] = p["cab"] * p["min_sup"] / 60
    r["Administration (facturation, RGPD, comptabilité)"] = p["h_admin"]
    return dossiers, versements, r


def main():
    print("# P9 — Modèle bottom-up du temps d'exploitation N06 à 21 cabinets\n")
    print("Généré par `_work/p9_temps.py`. **Estimations [E] et hypothèses [H] à remplacer par les mesures du protocole de chronométrage** (`15-validation-n06.md` §7).\n")
    print("Modèle précédent (P8) : 8,8 h/semaine, soit 31 h d'exploitation + 7,2 h d'acquisition par mois, calculé **par client**. Ce modèle-ci le recalcule **par versement**, car la charge réelle dépend du volume de versements et du taux d'exceptions.\n")
    rows = {}
    for nom, p in SCENARIOS.items():
        rows[nom] = calc(p)
    print("| Poste (h/mois) | Bas | Central | Haut |")
    print("|---|---|---|---|")
    keys = list(rows["central"][2].keys())
    for k in keys:
        print(f"| {k} | {rows['bas'][2][k]:.1f} | {rows['central'][2][k]:.1f} | {rows['haut'][2][k]:.1f} |")
    tot = {n: sum(v[2].values()) for n, v in rows.items()}
    print(f"| **Total h/mois** | **{tot['bas']:.0f}** | **{tot['central']:.0f}** | **{tot['haut']:.0f}** |")
    print(f"| **Total h/semaine** | **{tot['bas']/4.33:.1f}** | **{tot['central']/4.33:.1f}** | **{tot['haut']/4.33:.1f}** |")
    print(f"| Dossiers gérés | {rows['bas'][0]:.0f} | {rows['central'][0]:.0f} | {rows['haut'][0]:.0f} |")
    print(f"| Versements traités/mois | {rows['bas'][1]:.0f} | {rows['central'][1]:.0f} | {rows['haut'][1]:.0f} |")
    print()
    print("## Paramètres\n")
    print("| Paramètre | Bas | Central | Haut | Statut |")
    print("|---|---|---|---|---|")
    lib = {"dos": "Dossiers marketplace par cabinet", "mkp": "Marketplaces par dossier", "vers": "Versements par marketplace et par mois",
           "exc": "Taux d'exception (versement non traité automatiquement)", "min_exc": "Minutes par exception",
           "min_ctrl": "Minutes de contrôle humain par versement automatisé", "churn": "Churn mensuel des cabinets",
           "h_acq": "Heures d'acquisition par cabinet", "h_setup": "Heures de mise en place par cabinet",
           "h_dos": "Heures par nouveau dossier", "renouv": "Renouvellement mensuel des dossiers",
           "chg": "Changements de format d'export par mois (toutes sources)", "h_chg": "Heures par changement de format",
           "h_maint": "Heures fixes de maintenance", "min_sup": "Minutes de support par cabinet et par mois", "h_admin": "Heures d'administration"}
    for k, l in lib.items():
        print(f"| {l} | {SCENARIOS['bas'][k]} | {SCENARIOS['central'][k]} | {SCENARIOS['haut'][k]} | [H] |")
    print()
    # Pilote manuel : sans automatisation, chaque versement est traité à la main
    print("## Pilote manuel (concierge) : jusqu'où tient-il ?\n")
    print("Sans automatisation, chaque versement est décomposé, saisi et rapproché à la main.\n")
    print("| Minutes par versement manuel | Versements/mois pour 1 cabinet de 6,5 dossiers (central) | Heures/mois par cabinet | Cabinets tenables à 10 h/semaine |")
    print("|---|---|---|---|")
    v1 = 6.5 * 1.8 * 2.5
    for m in (10, 15, 20, 30):
        h = v1 * m / 60
        print(f"| {m} | {v1:.0f} | {h:.1f} | {43.3 / h:.1f} |")
    print()
    print("**Lecture** :")
    print("- **Le pilote manuel ne passe pas à l'échelle.** Il tient pour 3 à 9 cabinets selon le temps réel par versement (30 min → 3 cabinets ; 10 min → 9). En pratique, limitez-le à 2 ou 3 cabinets pour garder du temps pour la mesure et la prospection. Il sert à mesurer, pas à exploiter.")
    print("- **L'objectif de moins de 10 h/semaine à 21 cabinets n'est atteignable que si deux conditions sont réunies** :")
    print("  - le traitement des versements est automatisé (contrôle humain proche de 0) ;")
    print("  - le taux d'exceptions reste d'environ 5 % ou moins.")
    print("- **Scénario haut** : sans ces deux conditions, la charge dépasse 20 h/semaine et l'objectif d'exploitation solo légère échoue.")
    print("- **Ces deux paramètres sont précisément ce que le pilote doit mesurer.**")


if __name__ == "__main__":
    main()
