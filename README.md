# Touchstone

*A touchstone is the dark stone a jeweller rubs gold against to find out whether
it is real. It is also the standard by which a thing is judged.*

Touchstone is a published view of an autonomous **paper-trading** experiment on
spot gold (XAUUSD), plus a lab where anyone can replay the bots' rules with
their own settings over a real year of 30-minute candles.

**Open it:** https://sruthishps-alt.github.io/Touchstone/

## What this is

Five paper bots trade an imaginary $10,000 each. Every half hour an automated
job fetches a real gold price, steps the bots, scores the news, scores the
economic data actually released that morning, checks smart-money positioning,
and writes down what happened. This site is the window onto that.

- **Desk** — live price, each bot's money, what the news and today's economic
  releases mean for gold, and what the flat bots are waiting for.
- **Bot Lab** — sliders for risk, stop width, patience and target. Every move
  recomputes the whole year in your browser and draws your settings against the
  live rules, with the honesty split (first half vs second half) shown so a
  lucky setting cannot hide.
- **Journal** — the economic-data report card: each data morning's score and
  where gold actually went 4 and 24 hours later. Evidence, accumulating.

## What this is not

**Not investment advice. Not a signal service. No real money, ever.** Nothing
here is a recommendation to buy or sell anything. The bots are an experiment in
measuring trading ideas honestly, and most measured ideas turn out not to work —
several documented in this project's history did exactly that.

Backtests are not predictions. The Lab charges no spread or slippage and holds
the news score at zero, exactly like the paper engine, so its numbers are
friendlier than real trading would be.

## How it works

This repository is **published output only** — data files and one HTML page. The
trading engine, the strategy code and the full history live in a private
repository. This one is rewritten by an automated job as a single fresh commit,
so it stays small and always reflects the latest run.

- `data/desk.json` — the display numbers behind the Desk and Journal
- `data/spot_30m.json` — the 30-minute spot gold archive the Lab replays
- `index.html` — the whole app: no build step, no framework, no tracking, no
  cookies, no accounts, no network calls except to the two files above

The Bot Lab's replay engine is a JavaScript port of the Python paper engine.
It is held to a fidelity test: at default settings and at several non-default
parameter sets, it reproduces the Python engine's year-long replay **to the
cent** — trade count, wins, net, final cash and worst drawdown — before any
slider is trusted.
