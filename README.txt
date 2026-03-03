Drop-in patch:
1) Put layouts/vs/list.html into your project (create folders if missing)
2) Optional: copy static/css/_patch_vs_filterbar.css into your main.css (or import it) to make the VS filterbar not waste empty columns.
3) Run: hugo server -D --disableFastRender --ignoreCache

Why you only saw 3 cards:
- Your old layouts/vs/list.html was filtering by front-matter fields (left_provider/right_provider) or similar, so only the few pages that had those params were included.
- This patch derives provider A/B from Title (A vs B) and falls back to slug, so ALL VS articles render.
