# LoopForge — Product Requirements Document

## Problem
Engineering teams building growth mechanics (referrals, viral loops, attribution tracking) must either stitch together marketing-oriented SaaS tools designed for non-technical operators — or build custom infrastructure from scratch. Neither option serves developers: marketing tools fight their tech stack with embed snippets and low-code builders, while custom builds burn months on plumbing instead of product. LoopForge gives engineers a code-native SDK and interactive playground to configure, preview, and deploy viral loop components in minutes, not quarters.

## Target Users
**Full-stack and frontend engineers at early-to-mid-stage SaaS companies** (5-50 dev team) who own growth feature implementation and want programmatic control over referral mechanics, attribution tracking, and event-triggered sharing — without involving a marketing ops team.

## Core Features

### Must Have
- **Interactive Playground**: Live component configurator where developers select a growth mechanic (referral widget, invite gate, "Powered by" badge), tweak props in a sidebar, see a real-time rendered preview, and copy production-ready React code — Acceptance Criteria: Developer can configure any of 3 component types, see live preview update within 200ms of any prop change, and copy a working `<ReferralWidget />` or `<InviteGate />` snippet to clipboard

- **Growth Mechanics Component Library**: Three production-grade React components — `ReferralWidget` (share link + copy button + social share icons), `InviteGate` (gate content behind n invites with progress indicator), `PoweredByBadge` (attribution watermark with configurable styling) — Acceptance Criteria: Each component renders correctly in isolation, accepts documented props, and matches the live preview output exactly

- **SDK Code Generator**: Given playground configuration, generate a complete copy-paste code snippet including component import, props, and usage example — Acceptance Criteria: Generated code is syntactically valid TypeScript React, imports from `@loopforge/react`, and runs without modification when pasted into a Vite + React project

- **Simulated Metrics Dashboard**: Interactive dashboard showing a simulated viral coefficient (K-factor) calculation, an attribution tree visualization of referrer→invitee relationships, and a conversion funnel for invite-to-signup flow — Acceptance Criteria: Dashboard renders with realistic mock data, K-factor updates when user adjusts simulation parameters, attribution tree displays at least 3 levels of depth

- **Rules Builder**: Visual rule configuration interface where developers define "when [event] fires → show [growth action]" rules (e.g., "when user reaches 10 exports → show referral prompt") — Acceptance Criteria: User can create, edit, and delete at least one rule; rule state persists to localStorage; rules render as readable JSON config output

### Should Have
- **Theme Customization**: Playground sidebar includes color picker and style overrides so generated components match the adopting product's design system — Acceptance Criteria: Changing primary color updates all component previews and generated CSS variables

- **Integration Quickstart Guide**: In-app tabbed documentation with copy-paste setup steps for Vite, Next.js, and CRA — Acceptance Criteria: Each tab shows a complete 3-step integration guide with terminal commands and code blocks

### Out of Scope (v1)
- Real server-side Attribution Graph API (requires backend infrastructure — v1 uses client-side simulation only)
- User authentication and saved configurations (no backend in v1)
- A/B testing of growth mechanic variants
- Actual K-factor tracking against real user data
- Email or notification delivery infrastructure

## Success Metrics
- Primary: Developer copies their first generated code snippet within 60 seconds of landing on the playground
- Secondary: User creates ≥2 rules in the Rules Builder and returns to the dashboard within the same session (indicating engagement with multiple features)

## Design Principles
- **Code-first, not canvas-first**: Every UI element maps to real code output. No visual-only abstractions.
- **Engineer-speed interactions**: Keyboard shortcuts, instant previews, zero-confirm copy actions. Respect that developers work fast.
- **Transparent output**: Always show the generated code alongside the preview so developers trust what they're shipping.
