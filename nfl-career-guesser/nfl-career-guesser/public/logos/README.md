# Team logo assets

Drop your own image for each team in this folder, named by team code:

```
public/logos/ARI.png
public/logos/ATL.png
public/logos/BAL.png
...
```

## Naming

The filename (minus extension) must exactly match the team code below.
Supported extensions, tried in this order: `.png`, `.svg`, `.webp`, `.jpg`, `.jpeg`.
So `ARI.png` and `ARI.svg` both work — the app tries `.png` first and falls
back automatically.

All 32 codes the app uses:

```
ARI  ATL  BAL  BUF  CAR  CHI  CIN  CLE
DAL  DEN  DET  GB   HOU  IND  JAX  KC
LA   LAC  LV   MIA  MIN  NE   NO   NYG
NYJ  PHI  PIT  SEA  SF   TB   TEN  WAS
```

Notes on the historical codes: `LA` covers the Rams for all years (St. Louis
and LA eras), `LAC` covers the Chargers (San Diego and LA eras), and `LV`
covers the Raiders (Oakland and Las Vegas eras) — the app treats each as one
continuous franchise rather than splitting by city/era, so you only need one
image per franchise.

## If you skip a team

No problem — any team without a matching file automatically falls back to a
plain colored shield with the team's abbreviation, so the app keeps working
while you fill these in gradually.

## Recommended format

Square-ish (e.g. 200×200), transparent background PNG or SVG works best —
the badge shape already provides a shield frame, so a plain logo mark
(no background) will look cleanest.
