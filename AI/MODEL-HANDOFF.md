# Model Handoff: Shared Context and Next Actions

If you are another model/agent working on this repo, read this first.

## Ground truth context

- Legacy references were recovered into standlone-proto/.
- There are no direct zio-named files in current tree or git file history.
- Strong historical sources found:
  - commit d4d902a: zip archives (portfolio-from-resume variants)
  - commit f6e39e4: early portfolio code baseline
  - stash@{0}: intermediate portfolio WIP files

## Where to look before editing

1. standlone-proto/README.md
2. standlone-proto/notes/inventory.txt
3. standlone-proto/extracted/
4. standlone-proto/old-code/f6e39e4/
5. standlone-proto/old-code/stash-wip/

## Collaboration protocol for models

1. Do not redesign randomly. State the section and objective first.
2. Before editing production files, cite at least one recovered reference pattern from standlone-proto.
3. Keep changes scoped to one section per iteration and verify build/lint.
4. Leave a short note in AI/ with what changed and why.

## Portfolio rebuild priorities

1. Hero clarity: sharp value proposition and stronger visual anchor.
2. Proof density: project outcomes and credential context above fold or immediately after.
3. CTA quality: fewer competing actions, clearer primary path.
4. Visual consistency: unify spacing, typography scale, and accent usage.
5. Mobile quality: reduce clutter and ensure hierarchy survives narrow widths.

## Definition of done for each iteration

- Build passes.
- Lint passes.
- Section has clear narrative intent.
- Mobile and desktop both readable and deliberate.
