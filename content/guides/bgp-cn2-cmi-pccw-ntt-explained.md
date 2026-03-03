---
title: BGP CN2 vs CMI vs PCCW vs NTT Explained (2026)
slug: bgp-cn2-cmi-pccw-ntt-explained
review_year: 2026
summary: 'CN2 vs CMI vs PCCW vs NTT (2026): what these routes actually mean, how to
  judge BGP quality for China traffic, realistic performance expectations, and what
  to buy for WordPress/SaaS/e-commerce/realtime.'
description: Decision-grade BGP routing guide for China traffic. Explains CN2, CMI,
  PCCW, NTT, route quality tiers, peak-hour behavior, traceroute validation, hidden
  costs, and scenario-based recommendations.
aliases:
- /posts/bgp-cn2-cmi-pccw-ntt-explained/
---

# CN2 vs CMI vs PCCW vs NTT (2026): What These Routes Really Mean

When vendors advertise “CN2,” “CMI,” “PCCW,” or “NTT,” they are usually trying to tell you:

> “Our upstream routing to China is better than cheap transit.”

But these labels are not standardized.  
Two providers can claim the same label and deliver wildly different real-world performance.

This guide gives you:
- a **mental model**
- a **validation method**
- a **buying decision framework**

---

# 1️⃣ Executive Summary (Fast Verdict)

If you serve Mainland China traffic, you’re buying **routing quality**, not a region.

### Practical decision rules:

- **CN2** is often chosen when you want stronger China Telecom paths and better peak-hour stability.
- **CMI** is often chosen when you care about China Mobile routing stability.
- **PCCW** can be a strong Asia transit backbone; quality depends on how it’s used.
- **NTT** is global transit; can be great for global traffic, but China performance varies by peering and path.

**Most important truth:**  
Do not buy based on the label. Buy based on **traceroute results + peak-hour consistency**.

---

# 2️⃣ The Problem: “China performance” is not one thing

China users come from multiple carriers:

- China Telecom (CT)
- China Unicom (CU)
- China Mobile (CM)

A route that is great for CT might be mediocre for CM.

**A single “CN2” label does not guarantee all-carrier quality.**

---

# 3️⃣ What These Labels Usually Refer To (High-level)

## CN2 (China Telecom Next Carrier Network)
- Typically implies better pathing/quality for China Telecom routes
- Often marketed as “premium route”
- Often costs more
- Common goal: reduce congestion and improve stability

**Best for:** Telecom-heavy user bases and stable peak-hour performance (when real).

---

## CMI (China Mobile International)
- Associated with China Mobile international routing
- Can improve CM user experience when the upstream is truly optimized for CM paths

**Best for:** CM-heavy regions/users, and routes where CM is the pain point.

---

## PCCW (HKT / PCCW Global)
- Major Asia network backbone provider
- Can be very strong in Asia if the route is engineered well
- “PCCW line” is often used as a signal of “Asia backbone quality” rather than a China-specific guarantee

**Best for:** Asia routing stability and Hong Kong/Singapore/Japan backbone quality.

---

## NTT (NTT Communications)
- One of the largest global transit networks
- Great for global reach
- China performance depends on the specific peering and exit path

**Best for:** Global traffic and balanced international reach. China quality varies.

---

# 4️⃣ The Only Model That Matters: Quality Tiers

Forget the brand labels. Use tiers.

## Tier A — China-friendly premium routing
- strong peak-hour stability
- lower loss/jitter
- engineered paths
- higher cost

## Tier B — Solid mainstream transit
- acceptable off-peak and often fine for many apps
- may degrade at night for some carriers

## Tier C — Cheap transit
- looks fine in daytime tests
- collapses at China evening peak
- packet loss spikes and jitter kills UX

**Your job is to identify Tier A or good Tier B.**

---

# 5️⃣ How to Validate “CN2/CMI/PCCW/NTT” (Non-negotiable method)

You validate using:

- traceroute / mtr from **China Telecom**
- traceroute / mtr from **China Unicom**
- traceroute / mtr from **China Mobile**

### What you want to see
- stable hop progression (no weird detours)
- no persistent loss spikes
- predictable peak-hour RTT behavior
- consistency over multiple tests

### What you must avoid
- “nice label” with poor peak-hour reality
- routes that shift wildly by hour
- packet loss on international hops

**If the vendor cannot show testable proof, assume marketing.**

---

# 6️⃣ Pricing Reality (What premium routes really cost)

You typically pay more for:

- premium routing
- better transit upstreams
- higher-quality bandwidth
- lower congestion risk

But the “hidden cost” is the opposite:

Cheap routing can cost you more through:
- lost conversions
- slow checkout/login
- unstable API calls
- support burden

---

# 7️⃣ Which Route Type Fits Which Scenario

## WordPress / content sites
You can often accept Tier B if you use CDN heavily.

Best setup:
- Tokyo/Singapore + CDN
- premium route only if China conversion is critical

---

## SaaS / API heavy
Dynamic traffic needs stable routing.

Best setup:
- Tier A preferred if China is core
- multi-region or failover if budget allows

---

## Cross-border e-commerce
Checkout and product interactions suffer on jitter/loss.

Best setup:
- premium route (Tier A) + CDN
- consider Hong Kong premium or Mainland (if compliance OK)

---

## Realtime apps (gaming/voice)
Latency + jitter dominate.

Best setup:
- premium route required
- test carefully per carrier

---

# 8️⃣ Common Misunderstandings (Costly)

❌ “CN2 means fast everywhere in China”  
❌ “Hong Kong is always the best region”  
❌ “CDN solves dynamic performance”  
❌ “My ping test is fine → it’s good” (ping is not enough)  
❌ “One traceroute is proof” (it’s not)

---

# 9️⃣ Buying Checklist (Decision tool)

Before you buy a “CN2/CMI/PCCW/NTT” product, require:

1) Multi-carrier testing evidence (CT/CU/CM)  
2) Peak-hour test results (China evening)  
3) Confirmation of bandwidth/egress pricing  
4) Clarity on SLA and support scope  
5) A fallback plan (CDN / backup region)  

If you can’t validate, don’t scale.

---

# 🔟 FAQ (12)

### 1) Is CN2 always the best?
Not always. It often helps CT paths, but implementation matters.

### 2) Is CMI better than CN2?
Different goal. CMI is often more relevant for China Mobile-heavy users.

### 3) Is PCCW a “China route”?
Not strictly. It’s often a strong Asia backbone signal.

### 4) Is NTT bad for China?
Not necessarily. It depends on peering and congestion behavior.

### 5) Why do routes look fine in the daytime?
Peak-hour congestion is the real test.

### 6) What metric matters most?
Packet loss and jitter often matter more than raw RTT.

### 7) Can CDN replace good routing?
Only for static content. Dynamic traffic still depends on routing quality.

### 8) Do I need premium routing for WordPress?
Not always. If China conversion is critical, yes.

### 9) How do I know if a route is “Tier A”?
Stable peak-hour performance + consistent traceroute/mtr across carriers.

### 10) Why does one user say “fast” and another says “slow”?
They’re likely on different carriers (CT vs CM vs CU).

### 11) What’s the safest default if I’m unsure?
Tokyo + CDN, then upgrade routing if needed.

### 12) What’s the most expensive mistake?
Scaling before validating routing quality.

---

# Next Steps (Closed Loop)

- 👉 [China Traffic Routing 101](/posts/china-traffic-routing-101-2026/)
- 👉 [Best Regions for China Traffic (2026)](/posts/best-regions-for-china-traffic-2026/)
- 👉 [How to Test Latency to China](/posts/how-to-test-latency-to-china/)
- 👉 [Deploy & Verify Checklist](/posts/deploy-verify-china-traffic-checklist/)
- 👉 [CDN for China: Cloudflare vs Bunny vs CloudFront](/posts/cdn-for-china-cloudflare-bunny-cloudfront/)
- 👉 [Browse comparisons](/vs/)
