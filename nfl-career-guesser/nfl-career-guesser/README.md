# Name The Player — NFL Career Guesser

Guess the NFL player from their team-by-team career history. Unlimited
practice mode, autocomplete search, two-tier hints (side of ball, then
position).

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Add your own team images

See [`public/logos/README.md`](public/logos/README.md). Short version: drop
`ARI.png`, `ATL.png`, etc. into `public/logos/`, named by team code. Any team
without an image falls back to a plain colored shield automatically, so the
app works fine before you've added any.

## Deploy to GitHub Pages

1. Create a new GitHub repo and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In your repo on GitHub: **Settings → Pages → Build and deployment →
   Source**, select **GitHub Actions**.

3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys
   automatically on every push to `main`. After the first push, check the
   **Actions** tab — once the workflow finishes, your game will be live at
   `https://<your-username>.github.io/<your-repo>/`.

No config changes needed for the subdirectory path — `vite.config.js` is
already set up with a relative base path.

## Editing the player pool

The dataset lives at `src/data/players.json` — an array of:

```json
{
  "id": "00-0019596",
  "name": "Tom Brady",
  "pos": "QB",
  "side": "Offense",
  "teams": [
    { "c": "NE", "n": "New England Patriots", "s": 2000, "e": 2019 },
    { "c": "TB", "n": "Tampa Bay Buccaneers", "s": 2020, "e": 2022 }
  ]
}
```

`c` = team code (matches the logo filenames), `n` = full team name, `s`/`e` =
start/end season for that stint. Add, remove, or edit entries directly — no
other code changes needed.
