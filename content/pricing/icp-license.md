---
title: ICP License & China Hosting Reality (Non-Legal Overview)
slug: icp-license
summary: If you host in Mainland China, ICP/filing requirements and domestic compliance
  affect both architecture and vendor choice.
description: 'ICP license overview: when it applies, typical hosting patterns, and
  how to avoid common launch blockers.'
page_type: guide
intent_score: 76
updated: 2026
lastmod: '2026-02-28'
---

## Quick profile

If your website/app is hosted on servers **inside Mainland China**, an ICP filing/license is commonly required depending on the nature of the service. Requirements can vary by province and hosting provider processes.

This page is a **practical overview** (not legal advice) to help you design infrastructure without getting blocked late.

## Common hosting patterns

- **China-only**: origin and services in CN regions (best domestic latency, highest compliance overhead).
- **Global + China edge**: global origin with China-optimized CDN/edge (works for some content but not all).
- **Dual-stack**: separate China stack + global stack (most robust, highest ops complexity).

## Practical implications

- Domain ownership andreal-name requirements often matter.
- Some services/features differ between China and global regions.
- Expect operational separation if you run both China and global.

## Checklist before you commit

- [ ] Confirm whether your workload qualifies as “commercial” and needs filing/license.
- [ ] Confirm provider process and required documents.
- [ ] Decide if you must host origin in Mainland China or can use edge acceleration.
- [ ] Plan for separate accounts/operations if using China + global clouds.
