"""Calcule les scores pondérés (sur 100) à partir de scores-bruts.csv.

Entrée : CSV avec colonnes id,titre,douleur_budget,frequence,preuves,distribution,lacune,
faisabilite,marge,timing,defendabilite,risques,confiance,eliminatoire,justification.
Chaque critère est noté de 0 à 10 ; il est ramené à son poids.
Usage : python3 -I score.py scores-bruts.csv sortie.csv
"""
import csv
import sys

POIDS = {
    "douleur_budget": 20,
    "frequence": 10,
    "preuves": 15,
    "distribution": 15,
    "lacune": 10,
    "faisabilite": 10,
    "marge": 5,
    "timing": 5,
    "defendabilite": 5,
    "risques": 5,
}
assert sum(POIDS.values()) == 100


def main(src, dst):
    with open(src, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        total = 0.0
        for k, w in POIDS.items():
            v = float(r[k])
            if not 0 <= v <= 10:
                raise ValueError(f"{r['id']} {k}={v} hors 0-10")
            total += v / 10 * w
        r["score_100"] = f"{total:.1f}"
        if r.get("eliminatoire", "").strip():
            r["score_100"] = f"{total:.1f} (ÉLIMINÉ)"
    rows.sort(key=lambda r: (bool(r.get("eliminatoire", "").strip()), -float(r["score_100"].split()[0])))
    for i, r in enumerate(rows, 1):
        r["rang"] = i
    cols = ["rang", "id", "titre", "score_100"] + list(POIDS) + ["confiance", "eliminatoire", "justification"]
    with open(dst, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore", quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)
    for r in rows[:25]:
        print(r["rang"], r["id"], r["score_100"], r["titre"][:70])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
