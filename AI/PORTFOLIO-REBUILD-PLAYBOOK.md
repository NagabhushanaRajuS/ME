# Portfolio Rebuild Playbook

Use this when coordinating multiple GPT agents.

## Core objective

Turn the current portfolio into a high-trust, high-clarity experience with a coherent visual language.

## Workstream split for parallel agents

1. Agent A: Hero and above-the-fold conversion narrative.
2. Agent B: Projects grid, modal clarity, outcomes-first card content.
3. Agent C: About and skills storytelling flow.
4. Agent D: Contact funnel and inquiry friction removal.
5. Agent E: Performance, accessibility, and responsive polish.

## Prompt template for each agent

Task:
Improve one section only, preserving existing architecture.

Mandatory inputs:
- Compare current section with one reference from standlone-proto/extracted or standlone-proto/old-code.
- Explain why the proposed change improves hierarchy and trust.

Constraints:
- Keep APIs and data contracts stable unless explicitly needed.
- Avoid broad refactors unrelated to the target section.
- Verify npm run build and npm run lint.

Output format:
1. Files changed
2. What improved
3. Risks
4. Follow-up tasks

## Scoring rubric per section (1-5)

1. Clarity of message
2. Visual hierarchy
3. Trust signals
4. CTA strength
5. Mobile readability

Ship only when average score is at least 4.
