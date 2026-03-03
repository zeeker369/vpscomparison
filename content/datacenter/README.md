---
title: "Datacenter Internal Notes"
slug: "datacenter-notes"
_build:
  render: "never"
  list: "never"
  publishResources: false
---

# Cloud Hosting Hugo Site (Affiliate Framework)

This scaffold is **front-matter driven**:
- Provider reviews (`page_type = provider_review`)
- Data centers (`page_type = datacenter`)
- China picks (`china_pick = true`)
- Sorting (`intent_score`)

## Run locally (Windows)
```powershell
cd D:\cloud-hosting-site
& "D:\gw1\guwen-reading\hugo.exe" server -D --disableFastRender --ignoreCache
```

## Import your existing Vultr 30-city pages
If your old Vultr city pages are currently in `content/provider/` (e.g. `vultr-amsterdam.md` etc.):

1) Copy them into this project: `content/provider/`
   - Keep `vultr-review.md` there.
2) Run:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\migrate_vultr_datacenters.ps1
```

The script will:
- move `vultr-*.md` (except `vultr-review.md`) into `content/datacenter/`
- rewrite front matter with the fields the homepage uses

## Where to add DigitalOcean / Linode / others
- Provider review pages: `content/provider/`
- Their city/datacenter pages: `content/datacenter/` with:
  - `provider_name: "DigitalOcean"` / `"Linode"`
  - `page_type: "datacenter"`
  - set `intent_score` and `china_pick`
