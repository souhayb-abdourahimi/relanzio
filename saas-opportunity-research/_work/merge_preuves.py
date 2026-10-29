"""Fusionne tous les registres de preuves dans 06-registre-preuves.csv.
Usage : python3 -I merge_preuves.py <dossier _work> <sortie>"""
import csv, glob, os, sys

src, dst = sys.argv[1], sys.argv[2]
cols = ["id", "opportunite_id", "affirmation", "url", "titre", "auteur_organisme", "date_publication",
        "date_consultation", "extrait_ou_paraphrase", "type", "pertinence", "fraicheur", "confiance", "sens",
        "phase", "mode_acces"]
patterns = [
    ("[A-E]-preuves.csv", "phase-1"),
    ("DD-*-preuves.csv", "due-diligence"),
    ("alternatives-preuves.csv", "alternatives"),
    ("redteam-preuves.csv", "red-team"),
    ("audit2-D37-preuves.csv", "audit critique D-37 (phase 6)"),
    ("N[123]-preuves.csv", "nouvelles opportunités (phase 6)"),
    ("redteam2-preuves.csv", "red-team 2 (phase 6)"),
]
out, nfiles = [], 0
for pattern, phase in patterns:
    for f in sorted(glob.glob(os.path.join(src, pattern))):
        nfiles += 1
        with open(f, newline="", encoding="utf-8") as h:
            for r in csv.DictReader(h):
                r = {k: (v or "").strip() for k, v in r.items() if k}
                r.setdefault("sens", "")
                r["phase"] = phase
                r["mode_acces"] = "extrait de moteur de recherche (page non ouverte : WebFetch bloqué)"
                out.append(r)
with open(dst, "w", newline="", encoding="utf-8") as h:
    w = csv.DictWriter(h, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    w.writerows(out)
print(len(out), "preuves depuis", nfiles, "fichiers")
