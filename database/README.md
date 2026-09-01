# VPSComparison Product Database v2.0

This directory is the source-of-truth dataset for the buying engine. It is deliberately separate from affiliate links and from rendered HTML.

## Canonical entity

`product` is the canonical buyable unit. A product can be a VPS, cloud-compute instance, managed WordPress plan, managed VPS, cloud hosting, GPU cloud, game hosting, or bare metal.

## Current bootstrap (1 Sep 2026)

- 5 providers
- 6 product families
- 21 products
- 39 current price records
- 21 fully verified products
- 0 partial products (Vultr High Performance catalog/API rechecked 1 Sep 2026)
- 6 first-class workloads
- 6 game-server sizing profiles

## Directory map

- `providers/` — merchant/provider identity
- `families/` — product families under each provider
- `products/` — canonical buyable products
- `pricing/current.json` — current price observations
- `pricing/history/` — immutable date snapshots; append history, do not overwrite the past
- `availability/product-regions.json` — verified product × region availability
- `scoring/use-cases.json` — user-intent taxonomy
- `scoring/product-use-case-scores.json` — editorial fit layer, separate from objective facts
- `scoring/game-profiles.json` — editorial game-server RAM baselines
- `sources/sources.json` — source provenance
- `affiliate/affiliate-links.json` — monetization layer, scoped by family where possible
- `verification/` — dated verification runs
- `schema/` — JSON Schema contracts

## Verification rule

A frontend may say **verified today** only when the underlying verified product record has today's `last_verified_at` / price `observed_at`. A stale record must show its actual date. A partial record remains partial even when it was reviewed today.

`tools/check_price_freshness.py` is a freshness guard, not a scraper. It can alert when verified primary prices are stale, but it never claims that a price was checked automatically.
