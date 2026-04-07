# Standlone Proto Recovery Pack

This folder was created to give all agents one shared context source.
It contains older portfolio artifacts recovered from git history and stash.

## What is inside

- old-zips/
  - Historical zip artifacts recovered from commit d4d902a (message: MY CV zip files)
  - Files include portfolio-from-resume.zip and portfolio-from-resume (1..8).zip
- extracted/
  - Unzipped content from each historical zip for quick inspection
- old-code/f6e39e4/
  - Baseline code snapshot from commit f6e39e4 (Save Next.js portfolio app)
  - Includes app/page.tsx, app/globals.css, layout/template, and key portfolio sections
- old-code/stash-wip/
  - Portfolio-focused snapshot exported from stash@{0}
- notes/inventory.txt
  - File index of this entire recovery pack

## Why this exists

The current portfolio quality concerns are likely due to loss of design references and inconsistent context across agents.
This pack centralizes old references so all future changes can compare old vs current behavior.

## Suggested workflow

1. Start from extracted/ and old-code/ to identify stronger visual patterns.
2. Compare with current components under components/portfolio and components/sections.
3. Rebuild one section at a time with measurable UX goals (clarity, hierarchy, conversion).
4. Keep successful experiments in standlone-proto before merging into app/components.
