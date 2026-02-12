# ATDD/BDD Debugging Standards (Simple)

Use this checklist for every bug fix and feature adjustment.

## Goal
- Keep debugging behavior-focused and verifiable.
- Prevent regressions with lightweight, readable tests.
- Align automated checks with manual UI testing.

## Required Workflow
1. Define acceptance behavior first in plain Given/When/Then terms.
2. Add or update at least one automated scenario before finalizing code.
3. Apply the smallest possible code change to satisfy the scenario.
4. Run automated validation and confirm green status.
5. Launch manual UI and verify the end-user path.

## Naming Rules
- Prefer test names in BDD sentence form:
`Given <context>, When <action>, Then <expected outcome>`
- Keep each test focused on one observable behavior.
- Avoid implementation details in test names.

## Minimum Coverage Per Change
- One positive-path test for the intended behavior.
- One guard/validation test for invalid or edge input.
- One interaction-level check when UI/module wiring changes.

## Debugging Guardrails
- Reproduce first, then fix.
- Do not widen scope to unrelated refactors during a bug fix.
- If a fix changes UI behavior, validate both keyboard and click paths.
- If export, print, or file workflows are touched, validate trigger wiring and output generation path.

## Required Commands
- `npm test` for headless ATDD checks.
- `npm run validate:ui` for module/UI interaction validation.
- `npm start` for manual browser verification.

## Done Criteria
- Failing behavior is covered by a passing automated test.
- Existing regression suite remains green.
- Manual browser flow for the touched path is confirmed.
- Any changed behavior is reflected in test/docs updates.
