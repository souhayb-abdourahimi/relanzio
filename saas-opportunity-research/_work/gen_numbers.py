"""Génère founder/numbers-<scenario>.json pour unit_economics.py (Founder Skill).
Adaptation SaaS : unit = client-mois, days_per_month = 1, donc « par jour » = clients actifs payants du mois.
Clients actifs du mois m = actifs(m-1) × (1 - churn) + nouveaux(m). Toutes les valeurs sont des ESTIMATIONS (voir 08-business-model.md).
Usage : python3 -I gen_numbers.py <dossier founder>"""
import json, sys, os
out = sys.argv[1]
base = {
    "unit": "client-mois",
    "price": 33.0,  # ARPA HT mixte : ~85 % Solo à 29 €, ~15 % Équipe à 59 € (ESTIMATION)
    "variable": [
        {"label": "IA (classement de pièces, génération de procédures)", "cost": 1.0},
        {"label": "Hébergement + stockage fichiers (Supabase)", "cost": 1.0},
        {"label": "Frais Stripe (~1,5 % + 0,25 €)", "cost": 0.75},
        {"label": "Support (temps valorisé)", "cost": 2.0},
    ],
    "fixed_monthly": [
        {"label": "Outils SaaS (Brevo, Supabase base, domaine, monitoring)", "cost": 80},
        {"label": "Assurance RC pro + comptabilité", "cost": 90},
        {"label": "Prospection (enrichissement e-mails, outil d'envoi)", "cost": 80},
    ],
    "startup": [
        {"label": "Juriste RGPD/CGV/DPA (ponctuel)", "cost": 800},
        {"label": "Relecture référentiel par consultant/ex-auditeur Qualiopi", "cost": 600},
        {"label": "Landing, nom de domaine, identité minimale", "cost": 150},
        {"label": "Divers (LLM en dev, tests)", "cost": 250},
    ],
    "days_per_month": 1,
}
scen = {
    "pessimiste": ([0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3], 0.05),
    "central":    ([0, 0, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 0.03),
    "favorable":  ([0, 0, 5, 8, 10, 12, 14, 16, 18, 20, 22, 24], 0.02),
}
for name, (new, churn) in scen.items():
    act, ramp = 0.0, []
    for n in new:
        act = act * (1 - churn) + n
        ramp.append(round(act, 1))
    spec = dict(base, business=f"Preuvio — scénario {name} (nouveaux/mois {new}, churn {churn:.0%})",
                ramp_per_day=ramp, plan_per_day=ramp[-1])
    with open(os.path.join(out, f"numbers-{name}.json"), "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)
    print(name, "actifs fin M12 =", ramp[-1])
