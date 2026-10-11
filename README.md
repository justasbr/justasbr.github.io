# justasbr.github.io

Public output only. The private `justasbr/sport-models` repo generates these pages.

| Path | Source | How it updates |
|---|---|---|
| `index.html` | this repo | edit by hand |
| `euroleague/` | `sport-models/euroleague` | GitHub Actions workflow, game nights and daily |
| `nba/` | `sport-models/fantasy` | copied by hand; the path is the Yahoo app redirect URI |

Do not edit `euroleague/` here. The next workflow run overwrites it.
