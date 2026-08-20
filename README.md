# vpscomparison

Production site for https://www.vpscomparison.com/

The live English pages (Aliyun OSS snapshot, May 2026) are in `www/`. Cloudflare Pages should deploy that folder as-is. Do not use the Hugo preset, or the Chinese source in `content/` will replace the English site.

## Cloudflare Pages

- Framework preset: None
- Build command: leave empty
- Build output directory: `www`
- Production branch: `main`

Bind `www.vpscomparison.com` and `vpscomparison.com` after the first green deploy. Keep the Aliyun OSS bucket until DNS has been on Cloudflare for a few days.
