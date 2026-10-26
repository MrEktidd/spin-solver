# Spin Solver — Offline Spin & Gold Study Lab

A browser-based **heads-up preflop chip-EV study prototype** for practicing between poker sessions. The project is **not yet a Nash/GTO solver**, nor a complete three-handed Spin & Gold model.

## Current features
- Interactive 13×13 (169-hand) selector
- Heads-up shove-versus-fold and call-versus-fold calculations
- Effective stack, committed blind and dead-chip configuration
- Opponent range percentage presets (heuristic, **not GTO**)
- Seeded, blocker-aware Monte Carlo showdown equity with a seven-card hand evaluator
- Exact blocker-aware opponent fold-frequency counting against selected ranges
- Randomized shove/fold drills and locally saved practice accuracy
- Node tests and GitHub Actions CI
- Entirely static: no database, hosted backend, credentials, account or build step

## Run locally

Use any static HTTP server from the repository root (ES modules will not work reliably from a `file://` URL):

```bash
python -m http.server 8080
```

Open http://localhost:8080. Node.js 22+ is needed **only** for automated tests:

```bash
npm test
npm run check
```

## Publish with GitHub Pages (GitHub Free)

The site is prepared for GitHub Pages: `index.html` is at the repository root, with relative CSS and JS paths and a `.nojekyll` file. No build command or deployment workflow is needed.

1. [Repository Settings](https://github.com/MrEktidd/spin-solver/settings) → General → Danger Zone → Change repository visibility → Make public. Changing visibility exposes the entire repository and its history.
2. [Pages settings](https://github.com/MrEktidd/spin-solver/settings/pages) → Build and deployment → Source: **Deploy from a branch** → Branch: **main** → Folder: **/(root)** → Save.

After GitHub publishes successfully, the expected URL is **https://mrektidd.github.io/spin-solver/**. This URL is not guaranteed to be active until the settings are completed and deployment succeeds. Future pushes to `main` will publish automatically.

## Read before relying on numbers

This is an **educational EV estimator**, not a poker advice engine. It uses approximate heuristic opponent ranges, a finite Monte Carlo sample, and heads-up chip-EV with fold as zero. It does not solve Nash strategies or evaluate limps, smaller raises, multiway outcomes, rake, blind structure changes, payouts or ICM. A positive shove EV **does not mean a shove is optimal**, because the model ignores other possible actions.

The currently modeled opponent calling range is assumed fixed rather than derived from equilibrium. Quizzes grade decisions *against this model only*. Run experiments and independent cross-validation before trusting results.

Study only while not playing: **do not use as a real-time decision aid during GGPoker games**.

See [development roadmap](docs/ROADMAP.md) for the next engineering stages.
