# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### Playground.test.tsx
- [ ] renders without crash
- [ ] displays all three component type tabs: ReferralWidget, InviteGate, PoweredByBadge
- [ ] switching component type tabs updates the live preview area
- [ ] changing a prop in the sidebar updates the preview within 200ms
- [ ] clicking "Copy Code" copies valid TypeScript React snippet to clipboard
- [ ] generated code contains correct import path `@viralo/react`
- [ ] generated code includes all configured props in the JSX

### ReferralWidget.test.tsx
- [ ] renders without crash
- [ ] displays referral link input with copy button
- [ ] clicking copy button copies referral link to clipboard
- [ ] renders social share icons (Twitter, LinkedIn, Email)
- [ ] accepts and applies `primaryColor` prop to style accent elements
- [ ] accepts `referralCode` prop and displays it in the link
- [ ] shows success state when link is copied

### InviteGate.test.tsx
- [ ] renders without crash
- [ ] displays progress indicator showing invites sent vs required
- [ ] renders gated content as blurred/locked when invite count is below threshold
- [ ] unlocks gated content when invite count meets or exceeds threshold
- [ ] accepts `requiredInvites` prop (default 3)
- [ ] accepts `currentInvites` prop (default 0)
- [ ] shows invite CTA button that triggers `onInviteClick` callback

### PoweredByBadge.test.tsx
- [ ] renders without crash
- [ ] displays "Powered by [brandName]" text
- [ ] accepts `brandName` prop
- [ ] accepts `brandUrl` prop and renders as clickable link
- [ ] accepts `primaryColor` prop and applies to badge accent
- [ ] renders in compact mode when `compact` prop is true

### Dashboard.test.tsx
- [ ] renders without crash
- [ ] displays K-factor metric card with a numeric value
- [ ] displays total invites metric
- [ ] displays conversion rate percentage
- [ ] K-factor value updates when simulation parameters change
- [ ] attribution tree renders with at least 3 levels of depth
- [ ] conversion funnel renders with stages: Invited → Clicked → Signed Up → Activated

### RulesBuilder.test.tsx
- [ ] renders without crash
- [ ] displays empty state when no rules exist
- [ ] clicking "Add Rule" opens rule creation form
- [ ] can select a trigger event from dropdown (e.g., "export_count", "session_count")
- [ ] can set a threshold value for the trigger
- [ ] can select a growth action from dropdown (e.g., "show_referral", "show_badge")
- [ ] saving a rule adds it to the rules list
- [ ] can delete an existing rule
- [ ] rules persist to localStorage and reload on page refresh
- [ ] renders JSON config output panel reflecting current rules

### CodeSnippet.test.tsx
- [ ] renders without crash
- [ ] displays syntax-highlighted code block
- [ ] clicking copy button copies code to clipboard
- [ ] shows "Copied!" feedback after copy action

### QuickstartGuide.test.tsx
- [ ] renders without crash
- [ ] displays framework tabs: Vite, Next.js, CRA
- [ ] displays 3 integration steps for each framework
- [ ] switching framework tab updates the guide content
- [ ] copy button on steps copies code to clipboard
- [ ] shows quickstart guide testid

## User Journey Tests

### Primary Workflow: Configure and Copy a Growth Component
1. App loads → Playground tab is active by default, showing ReferralWidget preview
2. Developer changes `primaryColor` in sidebar → preview updates with new color within 200ms
3. Developer switches to InviteGate tab → preview switches to InviteGate component with default props
4. Developer sets `requiredInvites` to 5 and `currentInvites` to 2 → preview shows locked state with "2/5 invites" progress
5. Developer clicks "Copy Code" → valid TypeScript snippet is copied, toast confirms "Code copied!"
6. Developer switches to Dashboard tab → sees simulated metrics with K-factor, attribution tree, funnel
7. Developer switches to Rules Builder tab → creates a rule "when export_count ≥ 10 → show_referral"
8. Developer reloads page → rule persists from localStorage, all tabs still functional

### Secondary Workflow: Theme Customization
1. Developer opens Playground → configures ReferralWidget with custom color #3B82F6
2. Preview and generated code both reflect the custom color
3. Developer switches to Dashboard → metrics cards use the same theme accent

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [ ] AC: Developer can configure any of 3 component types, see live preview update within 200ms of any prop change, and copy a working `<ReferralWidget />` or `<InviteGate />` snippet to clipboard
- [ ] AC: Each component renders correctly in isolation, accepts documented props, and matches the live preview output exactly
- [ ] AC: Generated code is syntactically valid TypeScript React, imports from `@viralo/react`, and runs without modification when pasted into a Vite + React project
- [ ] AC: Dashboard renders with realistic mock data, K-factor updates when user adjusts simulation parameters, attribution tree displays at least 3 levels of depth
- [ ] AC: User can create, edit, and delete at least one rule; rule state persists to localStorage; rules render as readable JSON config output
