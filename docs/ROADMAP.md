# Spin Solver development plan

## v0.1 – implemented foundation
- Vanilla JS offline-first static app (no build service or credentials).
- 13×13 169-hand selector, computed single-hand preflop chip EV.
- Heads-up shove-versus-fold and call-versus-fold scenarios, effective stacks, posted blinds, dead money, assumption-driven opponent ranges.
- Card-removal-aware Monte Carlo equity, deterministic RNG, seven-card hand ranking, exact enumeration of fold frequency against a fixed combo range.
- Randomized practice spots and persisted session accuracy (localStorage).
- GitHub Actions checks and node tests; can publish from private repo to Cloudflare Pages (build command: none; output directory: /).

## v0.2 – correctness and range editor
- Independently cross-validate seven-card hand evaluator on a large reference corpus.
- Performance optimization (Web Worker, opponent range combination caching).
- Full combo-level selectable opponent ranges, import/export scenarios, confidence interval estimates.
- Proper treatment of caller stack and stack caps, automated decision-state validation.

## v0.3 – 3-handed engine
- Three stacks, 3-max BTN/SB/BB action sequences, multiway showdown equity, side-pot settlement and correctly accounted posted money.
- All-in tree evaluation and configurable independent opponent strategies.
- Heads-up and 3-way payout-aware ICM (requires verified game-specific payout data), rake and multiplier metadata.

## v0.4+ – equilibrium and advanced study
- Import and audit precomputed Nash push/fold equilibria, preserve assumptions, explain numerical convergence and limitations.
- Build an independently validated tree solver where tractable, with exploitability diagnostics.
- Postflop game trees, mixed strategies, range-vs-range comparison, hand-history study, spaced repetition.

## Non-goals and safety
Do not advertise GTO where only heuristic range assumptions and Monte Carlo EV are available. No automation, HUD, screen reading, or real-time assistance; only offline study between poker sessions.
