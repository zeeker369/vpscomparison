---
title: "Run OpenClaw on DigitalOcean (2026): Fast, Secure VPS Setup"
slug: "digitalocean-run-openclaw"
page_type: "guide"
review_year: 2026
summary: "Deploy OpenClaw Gateway on a DigitalOcean Droplet with Docker Compose, keep it private (SSH/Tailscale), and verify everything before you rely on it."
description: "DigitalOcean OpenClaw setup (2026): droplet sizing, Docker install, openclaw docker-setup.sh, Control UI via SSH tunnel, token pairing, health checks, logs, updates, and hardening checklist."
tags: ["DigitalOcean", "OpenClaw", "Docker", "VPS", "Gateway", "SSH", "Tailscale", "Security"]
affiliate_url: "https://m.do.co/c/9704fecd14d5"
affiliate_cta_text: "Claim DigitalOcean credit →"
---

# Run OpenClaw on DigitalOcean (2026): Fast, Secure VPS Setup

This is a **decision-grade deployment guide** (not a blog post).  
You’ll finish with:

- OpenClaw Gateway running in Docker Compose on a **DigitalOcean Droplet**
- Control UI reachable **safely** via SSH tunnel (or Tailscale)
- Token pairing + “unauthorized / pairing required” fixes
- A hardening checklist so you don’t accidentally expose your Control UI

> **Disclosure:** This page may include affiliate links. If you sign up through them, I may earn a commission **at no extra cost to you**.  
> 👉 [Claim DigitalOcean credit →](https://m.do.co/c/9704fecd14d5)

---

## 0) Quick decisions (choose first)

### Droplet size (don’t cheap out)
OpenClaw’s Docker image build can be OOM-killed on 1GB hosts (exit 137).  
**Recommendation:** start with **≥ 2GB RAM**.

### Region (simple rule)
Pick the region closest to **where you operate** (admin + tools).  
If you’re optimizing for China performance later, that’s a separate routing decision—see **China Hub** (linked at the end).

### Exposure model (IMPORTANT)
- **Recommended (default):** Keep Control UI private → use **SSH tunnel**
- Better for teams / multi-devices: **Tailscale**
- Avoid: **publicly opening UI ports** (high risk)

---

## 1) Create the Droplet (DigitalOcean)

1. DigitalOcean → **Create Droplet**
2. Image: **Ubuntu 22.04 LTS** (or 24.04 if you’re standardizing)
3. Plan: **Basic**, ≥ **2GB RAM**
4. Auth: **SSH key** (recommended)  
5. Networking: keep defaults; we will lock down ports later

---

## 2) Minimal server hardening (10 minutes, worth it)

SSH in:

~~~bash
ssh root@YOUR_DROPLET_IP
~~~

Update + basics:

~~~bash
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw
~~~

Firewall: allow SSH, deny everything else for now:

~~~bash
ufw allow OpenSSH
ufw --force enable
ufw status
~~~

> If you later use Tailscale, you still keep UFW tight—Tailscale traffic isn’t exposed to the public internet.

---

## 3) Install Docker (Engine + Compose v2)

On Ubuntu:

~~~bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER
newgrp docker
docker version
docker compose version
~~~

If you stayed as `root`, the group step is optional, but it’s cleaner to create a non-root user later.

---

## 4) Install OpenClaw (Docker Compose: recommended flow)

Clone the repo and run the setup script:

~~~bash
cd ~
git clone https://github.com/openclaw/openclaw.git
cd openclaw
chmod +x ./docker-setup.sh
./docker-setup.sh
~~~

What this script does (important expectations):
- Builds the gateway image
- Runs onboarding wizard
- Starts the gateway via Docker Compose
- Generates a **gateway token** and writes it into `.env`

After it finishes, OpenClaw expects you to open:
- `http://127.0.0.1:18789/`

On a VPS, you **do not** open this port publicly. Use a tunnel.

---

## 5) Access the Control UI safely (SSH tunnel)

On your **local machine** (not the server):

~~~bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_DROPLET_IP
~~~

Then open in your browser:

- http://127.0.0.1:18789/

### Token: where to find it
On the server, the setup script wrote it to `.env`:

~~~bash
cd ~/openclaw
grep -n "OPENCLAW" .env || cat .env
~~~

In the UI:
- Settings → Token → paste token

---

## 6) Health check (confirm it’s actually running)

On the server:

~~~bash
cd ~/openclaw
docker compose ps
docker compose logs -n 200 openclaw-gateway
~~~

Get the dashboard URL again (without auto-opening a browser):

~~~bash
docker compose run --rm openclaw-cli dashboard --no-open
~~~

---

## 7) Fix “unauthorized / pairing required (1008)” (common)

If the UI says **unauthorized** or **disconnected (1008): pairing required**, do this:

~~~bash
cd ~/openclaw
docker compose run --rm openclaw-cli dashboard --no-open
docker compose run --rm openclaw-cli devices list
docker compose run --rm openclaw-cli devices approve <requestId>
~~~

Then refresh the UI.

---

## 8) Recommended: Tailscale instead of SSH tunnel (team-friendly)

Use this if:
- You want access from multiple devices
- You don’t want to keep an SSH tunnel open

High-level flow:
1) Install Tailscale on the Droplet
2) Add Droplet to your tailnet
3) Access the UI over the private tailnet IP

Keep UFW tight; don’t open UI ports publicly.

---

## 9) Updates (safe pattern)

OpenClaw moves fast. For Docker Compose installs, a conservative update flow is:

~~~bash
cd ~/openclaw
git pull
./docker-setup.sh
docker compose ps
~~~

If you need a “no rebuild unless needed” approach:
- `git pull` → then `docker compose up -d` (but use the script if you changed env/setup)

---

## 10) Troubleshooting checklist (fast diagnostics)

### Symptom: build exits with 137 (OOM)
- Upgrade droplet to **≥ 2GB RAM**
- Optional: add swap (if you must stay small)

### Symptom: UI loads but actions fail
- Check logs:

~~~bash
cd ~/openclaw
docker compose logs -n 200 openclaw-gateway
~~~

### Symptom: permission errors (EACCES) on mounted dirs
If you use bind mounts, the container runs as `node` (uid 1000).  
Ensure mounted directories are owned by uid 1000.

---

## 11) Security rules (do not skip)

- **Do NOT** expose the Control UI port to the public internet.
- Use **SSH tunnel** or **Tailscale**.
- Treat `.env` and tokens as secrets.
- If you ever suspect leakage: rotate token and re-approve devices.

---

## Next Steps (closed loop)

### Make a hosting decision
- Compare providers: **[All provider reviews]({{< relref "/provider/_index.md" >}})**
- Side-by-side: **[Browse comparisons]({{< relref "/vs/_index.md" >}})**

### If you care about Mainland China performance
- **[China Hub]({{< relref "/china/_index.md" >}})**
- **[Best Regions for China Traffic (2026)]({{< relref "guides/best-regions-for-china-traffic-2026.md" >}})**

### Want the simplest VPS buying flow (no regrets)
- **[VPS Buying Checklist (2026)]({{< relref "guides/vps-buying-checklist-2026.md" >}})**

Ready to deploy?  
👉 [Claim DigitalOcean credit →](https://m.do.co/c/9704fecd14d5)