---
title: China Traffic Routing 101 (2026)
slug: china-traffic-routing-101-2026
review_year: 2026
summary: 'China traffic routing explained (2026): why China latency is different, how Telecom/Unicom/Mobile routes work, what
  ''good BGP'' really means, and how to choose regions, carriers, and CDNs with confidence.'
description: Decision-grade guide to China traffic routing in 2026. Covers carrier realities (CT/CU/CM), BGP quality tiers
  (CN2/CMI/NTT/PCCW), latency vs packet loss, CDN limits, testing methods, and practical deployment patterns.
aliases:
- /posts/china-traffic-routing-101-2026/
---

# China Traffic Routing 101 (2026)

If your users are in Mainland China, **latency and stability are not determined by geography**.

They’re determined by:

- Which Chinese carrier your users are on (**Telecom / Unicom / Mobile**)
- What international routes your server’s upstream uses (**BGP quality**)
- Whether peak-hour congestion hits your chosen path
- Whether your traffic is static (CDN-friendly) or dynamic (routing-sensitive)

This guide gives you a mental model and a repeatable decision process.

---

# 1️⃣ Executive Summary (The “Truth”)

### If you remember only five rules:

1) **Hong Kong is not automatically fast** — cheap HK can be worse than Tokyo.  
2) **BGP quality beats distance** — “CN2/CMI-grade” routes are what you’re buying.  
3) **Static vs dynamic matters** — CDN helps static; routing quality matters for dynamic.  
4) **Test on three carriers** — Telecom + Unicom + Mobile behave differently.  
5) **Peak hour decides reality** — test during China evening congestion (not daytime).

---

# 2️⃣ Why China Traffic Behaves Differently

China’s outbound traffic typically exits through controlled international gateways and major carrier backbones.

Practical consequences:

- Some routes are **stable but expensive**
- Some routes are **cheap but congested**
- Some routes look fine off-peak and collapse at night

If you serve China traffic, you’re not just buying “a server.”  
You’re buying **a routing relationship**.

---

# 3️⃣ The Three Major Carriers (CT / CU / CM)

## China Telecom (CT)
- Large footprint, strong in many regions
- Often the “baseline” for enterprise traffic
- Quality varies heavily by upstream and peering

## China Unicom (CU)
- Can be excellent in some north/metro routes
- Often more predictable in certain paths than cheap CT routes

## China Mobile (CM)
- Huge user base
- International routing can be “different,” sometimes unstable on cheaper upstreams
- If you ignore Mobile, you can lose a large segment of real users

**Important:**  
A region that is great for Telecom may be mediocre for Mobile.  
That’s why “single test” benchmarks lie.

---

# 4️⃣ What “Good Routing” Actually Means (BGP Quality Tiers)

You’ll see marketing terms like:

- CN2
- CMI
- Premium
- Optimized
- China route

They’re not standardized. You need a model.

## Tier Model (Decision-first)

### Tier A — Premium China-friendly routing
- Designed to avoid bad congestion paths
- More stable peak-hour performance
- Costs more

### Tier B — Decent mainstream transit
- Works fine for some users
- Peak hour may degrade
- Often acceptable if your app is not latency-critical

### Tier C — Cheap transit (the trap)
- Fine in tests at 2pm
- Falls apart at 9pm
- Packet loss and jitter show up unpredictably

You want Tier A or good Tier B depending on your scenario.

---

# 5️⃣ Region Choice (Reality, not map distance)

This is the region model most teams eventually converge on:

## 🇭🇰 Hong Kong
Best when:
- Your upstream is premium and proven for China routes
- You care about the lowest possible RTT

Risk:
- Cheap HK is a frequent disappointment

## 🇯🇵 Tokyo
Best when:
- You want predictable stability for broad China audiences
- You want a “safe default” that often outperforms cheap HK in practice

## 🇸🇬 Singapore
Best when:
- Budget is important
- You target South China / SEA mixed traffic
- You accept higher RTT for North China

## 🇺🇸 US West
Best when:
- You need global architecture and China is one segment
- You use CDN heavily and dynamic traffic is limited
- You need backup/failover

---

# 6️⃣ Static vs Dynamic: Where CDN Helps (and where it doesn’t)

## CDN is great for:
- images, CSS/JS, downloads
- static landing pages
- caching-heavy e-commerce assets

## CDN does NOT solve:
- login flows
- checkout
- API responses that can’t be cached
- realtime apps (voice, gaming)
- WebSocket-heavy products

If your site is dynamic-heavy, **routing quality matters more than CDN**.

---

# 7️⃣ Pricing Reality Breakdown (What You Actually Pay For)

Your “China performance cost” typically comes from:

- premium routing / better transit upstreams
- bandwidth (especially egress)
- CDN usage (if you go heavy static)
- multi-region duplication (if you build failover)

Cheap server + bad routing = expensive in lost conversions.

---

# 8️⃣ Deployment Patterns That Actually Work

## Pattern 1: “Tokyo + CDN”
Best for:
- WordPress
- content-heavy sites
- SaaS with mixed traffic

Why it works:
- stable baseline routing
- CDN absorbs static traffic

---

## Pattern 2: “Hong Kong premium + CDN”
Best for:
- latency-sensitive China-first products
- e-commerce with frequent interactions
- businesses where China conversion matters

Why it works:
- lowest RTT + stable routing when premium is real

---

## Pattern 3: “HK + Tokyo failover”
Best for:
- mission-critical products
- higher-budget teams

Why it works:
- hedge against route degradation
- allows carrier-specific optimization

---

## Pattern 4: “Mainland China hosting (ICP)”
Best for:
- strict compliance needs
- maximum China performance
- deep China business operations

Cost:
- compliance + ICP work + operational overhead

---

# 9️⃣ How to Test Routing Properly (Step-by-step)

### What you measure
- RTT (latency)
- jitter (stability)
- packet loss
- traceroute path (where congestion happens)

### Minimum test plan (recommended)
1) Deploy a test VM in target region  
2) Run traceroute from China Telecom + Unicom + Mobile sources  
3) Run tests at:
   - off-peak (daytime)
   - peak (China evening)  
4) Repeat for 2–3 days  
5) Decide based on consistency, not best-case results

**Key insight:**  
Peak hour performance is the true product you’re buying.

---

# 10️⃣ Common Mistakes (Costly ones)

❌ Choosing by map distance  
❌ Believing “CN2” claims without traceroute validation  
❌ Only testing from one ISP  
❌ Testing once and deploying at scale  
❌ Overusing CDN and ignoring dynamic latency  
❌ Ignoring packet loss (loss kills UX more than RTT)

---

# 11️⃣ FAQ (12)

### 1) Is Hong Kong always the best for China?
No. Only if routing quality is premium and proven.

### 2) Is Tokyo a safer default?
Yes. Tokyo often wins on consistency.

### 3) Do I need CN2 for every project?
No. Only when you need consistent peak-hour performance.

### 4) Is Singapore OK for China?
Often yes for budget setups, but RTT to North China is higher.

### 5) Can CDN solve China performance?
Only for static-heavy sites. Dynamic performance still depends on routing.

### 6) Why do daytime tests look great but nights are terrible?
Peak-hour international congestion.

### 7) Should I use Mainland China hosting?
Only if you accept compliance and operational overhead (ICP etc.).

### 8) What matters more: latency or packet loss?
Packet loss. Loss destroys UX even at low RTT.

### 9) Is “premium route” a standard label?
No. Always validate via traceroute and multi-carrier tests.

### 10) What’s the quickest way to decide region?
Tokyo + CDN is the least-regret baseline for many cases.

### 11) What’s the most accurate testing method?
Multi-carrier tests at peak hour across multiple days.

### 12) How do I avoid wrong purchases?
Treat routing as a product. Test before committing.

---

# 12️⃣ Next Steps (Internal Links / Closed Loop)

- 👉 **Best region decision:** [Best Regions for China Traffic (2026)](/posts/best-regions-for-china-traffic-2026/)
- 👉 **Carrier and route labels:** [BGP CN2 vs CMI vs PCCW vs NTT Explained](/posts/bgp-cn2-cmi-pccw-ntt-explained/)
- 👉 **Latency testing method:** [How to Test Latency to China](/posts/how-to-test-latency-to-china/)
- 👉 **Deployment checklist:** [Deploy & Verify China Traffic Checklist](/posts/deploy-verify-china-traffic-checklist/)
- 👉 **CDN decision guide:** [CDN for China: Cloudflare vs Bunny vs CloudFront](/posts/cdn-for-china-cloudflare-bunny-cloudfront/)
- 👉 **Compare providers:** [Browse comparisons](/vs/)
