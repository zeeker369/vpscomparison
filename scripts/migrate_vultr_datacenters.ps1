\
# scripts/migrate_vultr_datacenters.ps1
# Goal:
# 1) Move vultr-* city pages from content/provider/ -> content/datacenter/
# 2) Rewrite/insert YAML front matter so homepage can pick them up
#
# Usage:
#   cd D:\cloud-hosting-site
#   powershell -ExecutionPolicy Bypass -File .\scripts\migrate_vultr_datacenters.ps1
#
# Notes:
# - It will NOT touch content/provider/vultr-review.md
# - If a file already has front matter, it will be replaced (body preserved).
# - Adjust $chinaPickSlugs and scoring rules as you like.

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$site = Resolve-Path (Join-Path $root "..")
$contentProvider = Join-Path $site "content\provider"
$contentDc = Join-Path $site "content\datacenter"

if (!(Test-Path $contentDc)) { New-Item -ItemType Directory -Path $contentDc | Out-Null }

$chinaPickSlugs = @(
  "vultr-tokyo",
  "vultr-singapore",
  "vultr-seoul",
  "vultr-los-angeles",
  "vultr-seattle"
)

function TitleCase([string]$s) {
  return ($s -split ' ' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ' '
}

function GuessRegion([string]$slug) {
  if ($slug -match "tokyo|singapore|seoul|mumbai|delhi|bangkok|jakarta|sydney|melbourne") { return "Asia" }
  if ($slug -match "amsterdam|frankfurt|london|paris|milan|madrid|warsaw|stockholm|barcelona") { return "Europe" }
  if ($slug -match "los-angeles|seattle|new-york|chicago|dallas|miami|toronto|vancouver|mexico-city") { return "North America" }
  if ($slug -match "sao-paulo") { return "South America" }
  if ($slug -match "johannesburg") { return "Africa" }
  return "Global"
}

Get-ChildItem -Path $contentProvider -Filter "vultr-*.md" | ForEach-Object {
  if ($_.Name -ieq "vultr-review.md") { return }

  $file = $_.FullName
  $slug = $_.BaseName  # vultr-amsterdam

  $cityRaw = ($slug -replace "^vultr-", "") -replace "-", " "
  $city = TitleCase $cityRaw

  $region = GuessRegion $slug

  $intent = 70
  if ($slug -match "tokyo|singapore") { $intent = 93 }
  if ($slug -match "seoul") { $intent = 90 }
  if ($slug -match "los-angeles") { $intent = 88 }

  $chinaPick = $false
  if ($chinaPickSlugs -contains $slug) { $chinaPick = $true }

  $title = "Vultr $city Data Center"
  $summary = "Latency notes, routing stability, and best-fit scenarios for Vultr $city."
  $desc = "$title (2026): latency notes, routing stability, best use cases and a quick setup checklist."

  $raw = Get-Content -Raw -Path $file

  if ($raw -match "^\s*---\s*[\s\S]*?\s*---\s*") {
    $body = ($raw -replace "^\s*---\s*[\s\S]*?\s*---\s*", "").TrimStart()
  } else {
    $body = $raw
  }

  $fm = @"
---
title: "$title"
slug: "$slug"
draft: false
page_type: "datacenter"
provider_name: "Vultr"
city: "$city"
region: "$region"
intent_score: $intent
china_pick: $($chinaPick.ToString().ToLower())
summary: "$summary"
description: "$desc"
affiliate_key: "vultr"
---
"@

  $outPath = Join-Path $contentDc ($_.Name)
  ($fm + "`n`n" + $body.Trim()) | Set-Content -Encoding UTF8 -Path $outPath

  Remove-Item -Path $file -Force
}

Write-Host "Done. Vultr city pages are now in content/datacenter/ with required front matter."
