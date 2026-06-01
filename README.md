# @crezam/contracts

Cross-window contract types + Zod schemas for the Crezam Campus V2 platform.

## What lives here

Every WS frame, cross-window API request/response, and shared enum that
crosses a window boundary. Each module exports BOTH:

- a Zod schema (for runtime parse on producer emit + consumer receive)
- the inferred TypeScript type

Producers parse on emit, consumers parse on receive. No ambient `as Foo`
casts on the wire.

## What does NOT live here

- Anything that stays inside ONE window (DB columns the window owns alone,
  internal helpers, etc.)
- Vendor lock-ins (Azure SDK shapes, Judge0 RapidAPI shapes — those wrap
  upstream contracts we don't author).

## Layout

```
src/
  ws/          — WebSocket frames (interview-ws, etc.)
  api/         — HTTP request/response shapes per cross-window endpoint
  enums/       — Shared enum unions (end-reason, section-module-code, …)
  analyser/    — Per-section + verdict analyser outputs (Round 9 work area 3)
  ai-bots/     — AI bot input/output schemas (Round 9 work area 1, C leads)
  index.ts     — Re-exports
```

## Distribution

Consumed as a **git submodule** at `<window-repo>/vendor/campus-contracts`.
Each window's tsconfig paths alias `@crezam/contracts` to this folder.

```
// tsconfig.json (consumer window)
"paths": {
  "@crezam/contracts": ["./vendor/campus-contracts/src"],
  "@crezam/contracts/*": ["./vendor/campus-contracts/src/*"]
}
```

Contract changes ship as a SHA bump in the consumer window's submodule
pointer; the diff is visible in the consumer PR.

## Migration phases (Round 9)

- **Phase 1 (live now)** — scaffold + pull existing Round 8 contracts
  verbatim from each window's local types. No behavior change.
- **Phase 2** — every Round 9 cross-window contract change lands HERE
  first (with PR-level ack from affected windows), then in producer +
  consumer. Locally-defined cross-window types are progressively
  replaced with `@crezam/contracts` imports.
- **Phase 3 (Round 9 close)** — CI gate enforces no local cross-window
  types. Banned pattern: `// @cross-window` comment on a type
  definition outside this package.

## CI gate

- **Mid-Round-9**: soft warning. Each window's CI greps for
  `// @cross-window` flagged types outside `vendor/campus-contracts`
  and warns.
- **End-Round-9**: hard fail. Same grep but as a CI failure.

## Ownership

- **Window A** — leads Phase 1 (WS frames, cross-window API contracts,
  enums).
- **Window C** — leads Phase 2 AI-bot schemas (shipped as part of the
  Interview Brain v2 release).
- **Windows A/B/C/D** — all propose changes in `ROUND_9_COMMS.md` BEFORE
  shipping. Ack from affected windows required.

## Versioning

Major version bumps for breaking changes after Round 9 closes. During
Round 9 the package stays at `0.x` and consumers pin via submodule SHA.
