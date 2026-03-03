---
title: "ICP Filing Guide (2026): Requirements, Steps, Timeline, and Common Rejections"
slug: "icp-filing-guide-2026"
review_year: 2026
summary: "A decision-grade guide to ICP filing in China (2026): who needs it, ICP Filing vs ICP Commercial License, required documents, step-by-step process via cloud providers, timeline, PSB filing, and what causes rejections."
description: "ICP filing guide (2026) for websites and apps hosted in Mainland China. Covers requirements, materials, MIIT display rules, PSB filing, overseas enterprise options, common rejection reasons, and post-approval checklist."
---

# ICP Filing Guide (2026): Requirements, Steps, Timeline, and Common Rejections

If your website/app is hosted on a **Mainland China** server, you generally need an **MIIT ICP filing** before it can go live.

Note (non-legal): Rules vary by province and scenario. Use this as an implementation guide and confirm details with your cloud provider and local counsel if you operate a regulated or commercial service.

---

## 1) Executive Verdict

### Do you need ICP filing?
- **Yes** if your domain resolves to a **server located in Mainland China**.
- **No** if your server is **outside Mainland China** (e.g., Hong Kong, Singapore, US).

### After ICP approval, what else?
- You must display the ICP number in the footer and link it to **beian.miit.gov.cn**.
- Many scenarios also require **PSB filing** (public security registration) after MIIT filing, then display PSB info in the footer.

---

## 2) ICP Filing vs ICP Commercial License (Don’t Mix These)

### ICP Filing (Bei’an)
- Basic registration generally required for sites/apps hosted in Mainland China.
- Submitted through your **Mainland hosting provider**’s filing system.

### ICP Commercial License (ICP Permit)
- Typically required for certain **commercial/operational** internet services (value-added telecom categories).
- More complex; eligibility and rules vary by province.

Practical rule: For a normal informational site in Mainland China, you are usually talking about **ICP filing**, not the commercial license.

---

## 3) Who Can Apply (Individuals vs Companies vs Overseas)

### Individuals
Some providers support individual ICP filing for personal sites.

### Mainland companies
Generally the most straightforward filing path.

### Overseas companies
May face additional requirements depending on province and scenario. In some cases, local registrations or representative office documents may be required. Rules vary.

---

## 4) What You Must Prepare (Non-negotiables)

### A) Mainland China hosting access
Most ICP filings are submitted through the provider that provides the Mainland “access service.” Typically you need qualifying Mainland resources on that provider.

### B) Domain real-name verification
Your domain must be registered and real-name verified before filing.

### C) Documents (typical)
Depending on scenario and province:
- ID documents (individual)
- Business/qualification documents (company)
- Website owner/responsible person information
- Supporting materials required by local administration/provider

---

## 5) Step-by-Step Filing Process (Practical)

UI differs by provider, workflow is broadly consistent.

### Step 1 — Choose your filing scenario
Common types:
- Initial filing (first time entity + site)
- Add a new site under an existing entity
- “New access” when migrating to a new provider (or adding another provider)

### Step 2 — Submit entity information
- Entity identity must match registration documents.
- Province/city must match document requirements.

### Step 3 — Submit website/app information
Expect review on:
- Website name compliance
- Content compliance
- Responsible person authenticity

### Step 4 — Provider review → MIIT review
Provider checks materials, then MIIT review proceeds. Once approved, your site can go live on Mainland hosting (subject to other compliance).

---

## 6) Post-Approval Website Requirements (You MUST do these)

### A) Display the ICP number + MIIT link
Place your ICP number in the footer and link to:
- https://beian.miit.gov.cn/

Minimal footer snippet (HTML), copy as-is (no code fence used here to avoid breaking your paste):
    <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow">YOUR_ICP_NUMBER</a>

### B) PSB filing (Public Security Bureau)
If required for your scenario, complete PSB filing after MIIT filing and then display PSB info in the footer (format depends on the platform requirements).

---

## 7) Common Rejection Reasons (Why filings get stuck)

1) Domain real-name verification mismatch (name/entity mismatch)  
2) Province/city selection inconsistent with registration documents  
3) Website name/content not acceptable to local review rules  
4) Missing documents or incorrect file format/photo requirements  
5) “New access” process not handled correctly when migrating providers  

---

## 8) Low-regret Recommendations

### If you only want faster China access (but not Mainland hosting)
Consider:
- Tokyo/Hong Kong/Singapore origin + CDN + routing validation  
This avoids ICP complexity while still improving performance for many cases.

### If you truly need Mainland hosting
Plan for:
- ICP filing + possible PSB filing
- longer lead time
- operational compliance (footer display, documentation, ongoing changes)

---

## 9) FAQ (10)

### 1) Do I need ICP filing if my server is in Hong Kong?
Generally no. ICP filing is tied to Mainland China hosting access.

### 2) Do I need ICP filing if my users are in China but server is outside China?
Usually no. ICP filing is based on hosting location (Mainland China).

### 3) Is ICP filing the same as ICP commercial license?
No. Filing is registration; commercial license is a separate category for certain services.

### 4) Can an overseas company apply?
Sometimes yes, but requirements vary and can be stricter depending on province.

### 5) Where do I submit the filing?
Through your Mainland hosting provider’s ICP filing system.

### 6) Must I display the ICP number on the website?
Yes, for Mainland-hosted sites.

### 7) Do I also need PSB filing?
Often required after MIIT filing, depending on scenario.

### 8) Is ICP filing free?
Filing itself may not have a direct fee, but you typically must purchase qualifying Mainland hosting resources.

### 9) What’s the fastest low-regret performance solution?
Non-Mainland origin + CDN + correct caching + routing validation.

### 10) What if I change providers?
You may need a “new access” process so the new provider becomes your access service provider.

---

## Next Steps (Closed Loop)

- [China Traffic Routing 101](/posts/china-traffic-routing-101-2026/)
- [Best Regions for China Traffic (2026)](/posts/best-regions-for-china-traffic-2026/)
- [How to Test Latency to China](/posts/how-to-test-latency-to-china/)
- [Deploy & Verify China Traffic Checklist](/posts/deploy-verify-china-traffic-checklist/)
- [CDN for China: Cloudflare vs Bunny vs CloudFront](/posts/cdn-for-china-cloudflare-bunny-cloudfront/)
- [Browse comparisons](/vs/)