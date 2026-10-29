"""Fusionne les registres de preuves (phase 1 + due diligence) dans 06-registre-preuves.csv.
Usage : python3 -I merge_preuves.py <dossier _work> <sortie>"""
import csv, glob, os, sys
src, dst = sys.argv[1], sys.argv[2]
cols = ["id","opportunite_id","affirmation","url","titre","auteur_organisme","date_publication",
        "date_consultation","extrait_ou_paraphrase","type","pertinence","fraicheur","confiance","sens","phase","mode_acces"]
out = []
files = sorted(glob.glob(os.path.join(src, "[A-E]-preuves.csv"))) + sorted(glob.glob(os.path.join(src, "DD-*-preuves.csv"))) + sorted(glob.glob(os.path.join(src, "alternatives-preuves.csv"))) + sorted(glob.glob(os.path.join(src, "redteam-preuves.csv")))
for f in files:
    b = os.path.basename(f)
    phase = "due-diligence" if b.startswith("DD-") else ("alternatives" if b.startswith("alternatives") else ("red-team" if b.startswith("redteam") else "phase-1"))
    with open(f, newline="", encoding="utf-8") as h:
        for r in csv.DictReader(h):
            r = {k: (v or "").strip() for k, v in r.items() if k}
            r.setdefault("sens", "")
            r["phase"] = phase
            r["mode_acces"] = "extrait de moteur de recherche (page non ouverte : WebFetch bloqué)"
            out.append(r)
with open(dst, "w", newline="", encoding="utf-8") as h:
    w = csv.DictWriter(h, fieldnames=cols, extrasaction="ignore")
    w.writeheader(); w.writerows(out)
print(len(out), "preuves depuis", len(files), "fichiers")
