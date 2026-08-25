# Product Database v2.0 data dictionary

## Provider
The company or cloud/hosting platform. Provider identity is independent of affiliate participation.

## Family
A merchant product line, for example `hostinger-kvm`, `digitalocean-basic-regular`, or `kinsta-single-site`.

## Product
The canonical buyable item. Required `product_type` values currently include:

- `vps`
- `cloud_compute`
- `managed_vps`
- `managed_wordpress`
- `cloud_hosting`
- `gpu_cloud`
- `game_hosting`
- `bare_metal`

### Resources
Infrastructure products expose vCPU/RAM/storage/bandwidth when the merchant publishes them. Managed WordPress products may instead expose site count, visits, server bandwidth, CDN bandwidth, and storage. Missing merchant-level resources stay `null`; they are never invented.

### Management
`self-managed`, `panel-assisted`, or `fully-managed`.

### Platform capability
Flags such as WordPress, WooCommerce, Linux, Windows, and generic game-server capability describe product eligibility. They are not benchmark scores.

## Price snapshot
A dated observation tied to one `product_id`, source, currency, price type, and verification status. Current price and price history are separate from the product definition.

## Product-region availability
A dated, source-backed relationship between a product and region. Region is intentionally excluded from Finder scoring until these relationships are verified.

## Use-case score
An editorial fit score. It is never treated as an objective product fact and is versioned separately from pricing/spec data.

## Game profile
An editorial RAM-sizing baseline for common dedicated game-server workloads. It is a planning heuristic, not a benchmark or publisher guarantee.

## Source
Provenance for facts and prices: official pricing, official docs, merchant cart, API, manual test, or temporary internal-published bridge.

## Affiliate link
Monetization metadata stored separately from product facts. Products without affiliate programs may still rank first.
