import os, re, sys
import yaml

ROOT = os.path.join(os.getcwd(), "content", "datacenter")

FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S | re.M)
YEAR_FILE_RE = re.compile(r"-(19|20)\d{2}\.md$", re.I)

PROVIDER_KEY_MAP = {
    "aws": "aws",
    "amazon web services": "aws",
    "google cloud": "google-cloud",
    "gcp": "google-cloud",
    "alibaba cloud": "alibaba-cloud",
    "alicloud": "alibaba-cloud",
    "digitalocean": "digitalocean",
    "linode": "linode",
    "vultr": "vultr",
    "hetzner": "hetzner",
    "ibm cloud": "ibm-cloud",
    "azure": "azure",
    "microsoft azure": "azure",
    "oracle cloud": "oracle-cloud",
    "ovhcloud": "ovhcloud",
    "ovh": "ovhcloud",
    "scaleway": "scaleway",
    "contabo": "contabo",
    "upcloud": "upcloud",
    "ionos": "ionos",
    "kamatera": "kamatera",
    "interserver": "interserver",
}

CITY_CANON = {
    "hongkong": "Hong Kong",
    "hong kong": "Hong Kong",
    "tokyo": "Tokyo",
    "seoul": "Seoul",
    "singapore": "Singapore",
    "losangeles": "Los Angeles",
    "los angeles": "Los Angeles",
    "frankfurt": "Frankfurt",
    "london": "London",
    "mumbai": "Mumbai",
    "sao paulo": "Sao Paulo",
    "saopaulo": "Sao Paulo",
    "n. virginia": "N. Virginia",
    "n virginia": "N. Virginia",
    "virginia": "N. Virginia",
}

REGION_CANON = {
    "asia pacific": ("Asia Pacific", "asia-pacific"),
    "apac": ("Asia Pacific", "asia-pacific"),
    "north america": ("North America", "north-america"),
    "europe": ("Europe", "europe"),
    "middle east": ("Middle East", "middle-east"),
    "oceania": ("Oceania", "oceania"),
    "south america": ("South America", "south-america"),
    "africa": ("Africa", "africa"),
    "china mainland": ("China Mainland", "china-mainland"),
    "china": ("China Mainland", "china-mainland"),
}

def slugify(s: str) -> str:
    s = (s or "").strip().lower()
    s = s.replace("&", " and ")
    s = re.sub(r"[’'`]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s

def to_bool(v):
    if isinstance(v, bool):
        return v
    if v is None:
        return None
    s = str(v).strip().lower()
    if s in ("true", "1", "yes", "y"):
        return True
    if s in ("false", "0", "no", "n"):
        return False
    return None

def load_md(path):
    txt = open(path, "r", encoding="utf-8").read()
    m = FM_RE.search(txt)
    if not m:
        return None, txt
    fm = yaml.safe_load(m.group(1)) or {}
    body = txt[m.end():]
    return fm, body

def dump_md(fm, body):
    y = yaml.safe_dump(fm, sort_keys=False, allow_unicode=True).strip() + "\n"
    return "---\n" + y + "---\n\n" + body.lstrip()

changed = 0
visited = 0

for root, _, files in os.walk(ROOT):
    for fn in files:
        if not fn.endswith(".md"):
            continue
        path = os.path.join(root, fn)
        fm, body = load_md(path)
        if fm is None:
            continue

        visited += 1
        orig = dict(fm)

        page_type = str(fm.get("page_type", "")).strip().lower()
        if page_type:
            if page_type in ("city-hub", "cityhub"):
                fm["page_type"] = "city_hub"
            elif page_type == "datacenter":
                fm["page_type"] = "datacenter"

        # Normalize provider
        pname = (fm.get("provider_name") or "").strip()
        pkey = (fm.get("provider_key") or "").strip()
        pkey_norm = slugify(pkey) if pkey else ""
        pname_norm = slugify(pname)

        if not pkey_norm and pname_norm:
            pkey_norm = PROVIDER_KEY_MAP.get(pname_norm, pname_norm)

        if pkey_norm:
            fm["provider_key"] = pkey_norm
        if pname:
            fm["provider_name"] = pname

        # Normalize city
        city = (fm.get("city") or "").strip()
        if city:
            key = slugify(city).replace("-", "")
            # try common canonical map
            cand = CITY_CANON.get(city.strip().lower(), None)
            if not cand:
                cand = CITY_CANON.get(key, None)
            if cand:
                fm["city"] = cand
            else:
                # fallback: Title Case
                fm["city"] = " ".join([w[:1].upper() + w[1:].lower() for w in re.split(r"\s+", city) if w])

        # Normalize region / region_key
        region = (fm.get("region") or "").strip()
        rkey = (fm.get("region_key") or "").strip()
        region_norm_key = (region or rkey).strip().lower()
        if region_norm_key:
            if region_norm_key in REGION_CANON:
                rname, rk = REGION_CANON[region_norm_key]
                fm["region"] = rname
                fm["region_key"] = rk
            else:
                if region:
                    fm["region"] = region
                if not rkey and region:
                    fm["region_key"] = slugify(region)

        # Normalize booleans
        for k in ("china_pick", "china_only"):
            if k in fm:
                bv = to_bool(fm.get(k))
                if bv is None:
                    # drop invalid values to avoid Hugo "expected bool" crash
                    fm.pop(k, None)
                else:
                    fm[k] = bv

        # Suppress legacy year pages
        if YEAR_FILE_RE.search(fn):
            b = fm.get("build", {}) or {}
            b["render"] = "never"
            b["list"] = "never"
            fm["build"] = b

        if fm != orig:
            open(path, "w", encoding="utf-8").write(dump_md(fm, body))
            changed += 1

print(f"Visited: {visited}")
print(f"Changed: {changed}")
print("Done.")