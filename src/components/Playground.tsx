import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { ReferralWidget } from './ReferralWidget';
import { CodeSnippet } from './CodeSnippet';

const InviteGate = lazy(() => import('./InviteGate').then(m => ({ default: m.InviteGate })));
const PoweredByBadge = lazy(() => import('./PoweredByBadge').then(m => ({ default: m.PoweredByBadge })));

type ComponentType = 'referral' | 'invite' | 'badge';

interface ReferralConfig {
  referralCode: string;
  primaryColor: string;
}

interface InviteConfig {
  requiredInvites: number;
  currentInvites: number;
  primaryColor: string;
}

interface BadgeConfig {
  brandName: string;
  brandUrl: string;
  primaryColor: string;
  compact: boolean;
}

const DEFAULT_REFERRAL: ReferralConfig = { referralCode: 'ABC123', primaryColor: '#EF4444' };
const DEFAULT_INVITE: InviteConfig = { requiredInvites: 3, currentInvites: 0, primaryColor: '#EF4444' };
const DEFAULT_BADGE: BadgeConfig = { brandName: 'Viralo', brandUrl: 'https://viralo.dev', primaryColor: '#EF4444', compact: false };

function generateCode(type: ComponentType, referral: ReferralConfig, invite: InviteConfig, badge: BadgeConfig): string {
  switch (type) {
    case 'referral':
      return `import { ReferralWidget } from '@viralo/react';

export function App() {
  return (
    <ReferralWidget
      referralCode="${referral.referralCode}"
      primaryColor="${referral.primaryColor}"
    />
  );
}`;
    case 'invite':
      return `import { InviteGate } from '@viralo/react';

export function App() {
  return (
    <InviteGate
      requiredInvites={${invite.requiredInvites}}
      currentInvites={${invite.currentInvites}}
      primaryColor="${invite.primaryColor}"
      onInviteClick={() => console.log('invite clicked')}
    >
      <div>Protected content here</div>
    </InviteGate>
  );
}`;
    case 'badge':
      return `import { PoweredByBadge } from '@viralo/react';

export function App() {
  return (
    <PoweredByBadge
      brandName="${badge.brandName}"
      brandUrl="${badge.brandUrl}"
      primaryColor="${badge.primaryColor}"
      compact={${badge.compact}}
    />
  );
}`;
  }
}

const TABS: { key: ComponentType; label: string }[] = [
  { key: 'referral', label: 'ReferralWidget' },
  { key: 'invite', label: 'InviteGate' },
  { key: 'badge', label: 'PoweredByBadge' },
];

/** Persist a numeric state to localStorage */
function usePersistentNumber(key: string, initial: number): [number, (v: number) => void] {
  const [value, setValue] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? Number(stored) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, String(value)); } catch { /* noop */ }
  }, [key, value]);
  return [value, setValue];
}

export function Playground() {
  const [activeType, setActiveType] = useState<ComponentType>('referral');
  const [referralConfig, setReferralConfig] = useState<ReferralConfig>({ ...DEFAULT_REFERRAL });
  const [inviteConfig, setInviteConfig] = useState<InviteConfig>({ ...DEFAULT_INVITE });
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({ ...DEFAULT_BADGE });
  const [codeCopied, setCodeCopied] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);

  // Interactive K-factor calculator state (persisted)
  const [calcInvites, setCalcInvites] = usePersistentNumber('kfactor-invites', 4);
  const [calcConversion, setCalcConversion] = usePersistentNumber('kfactor-conversion', 25);

  const kFactor = useMemo(() => {
    const k = calcInvites * (calcConversion / 100);
    return Math.round(k * 100) / 100;
  }, [calcInvites, calcConversion]);

  const kStatus = useMemo(() => {
    if (kFactor > 1) return { label: 'Viral Growth', color: '#22c55e', desc: 'Each user brings in more than one new user — exponential growth.' };
    if (kFactor === 1) return { label: 'Self-Sustaining', color: '#eab308', desc: 'Each user replaces themselves — linear organic growth.' };
    return { label: 'Needs Boost', color: '#f97316', desc: 'Viral mechanics alone cannot sustain growth — pair with paid/organic.' };
  }, [kFactor]);

  const code = useMemo(
    () => generateCode(activeType, referralConfig, inviteConfig, badgeConfig),
    [activeType, referralConfig, inviteConfig, badgeConfig],
  );

  const handleTabChange = useCallback((type: ComponentType) => {
    setActiveType(type);
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [code]);

  const updateReferral = useCallback((updates: Partial<ReferralConfig>) => {
    setReferralConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateInvite = useCallback((updates: Partial<InviteConfig>) => {
    setInviteConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBadge = useCallback((updates: Partial<BadgeConfig>) => {
    setBadgeConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const renderPreview = () => {
    switch (activeType) {
      case 'referral':
        return <ReferralWidget referralCode={referralConfig.referralCode} primaryColor={referralConfig.primaryColor} />;
      case 'invite':
        return (
          <Suspense fallback={<div className="text-text-muted text-sm animate-pulse">Loading…</div>}>
            <InviteGate
              requiredInvites={inviteConfig.requiredInvites}
              currentInvites={inviteConfig.currentInvites}
              primaryColor={inviteConfig.primaryColor}
              onInviteClick={() => {
                updateInvite({ currentInvites: inviteConfig.currentInvites + 1 });
              }}
            >
              <div className="p-4 rounded-md bg-surface text-text-primary">
                <h4 className="font-semibold">Premium Feature</h4>
                <p className="text-text-secondary text-sm mt-1">
                  This content is gated behind invites.
                </p>
              </div>
            </InviteGate>
          </Suspense>
        );
      case 'badge':
        return (
          <Suspense fallback={<div className="text-text-muted text-sm animate-pulse">Loading…</div>}>
            <PoweredByBadge
              brandName={badgeConfig.brandName}
              brandUrl={badgeConfig.brandUrl}
              primaryColor={badgeConfig.primaryColor}
              compact={badgeConfig.compact}
            />
          </Suspense>
        );
    }
  };

  const renderConfig = () => {
    switch (activeType) {
      case 'referral':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor="referral-code" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Referral Code
              </label>
              <input
                id="referral-code"
                type="text"
                value={referralConfig.referralCode}
                onChange={(e) => updateReferral({ referralCode: e.target.value })}
                className="w-full h-9 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Referral code"
              />
            </div>
            <div>
              <label htmlFor="primary-color" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={referralConfig.primaryColor}
                  onChange={(e) => updateReferral({ primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={referralConfig.primaryColor}
                  onChange={(e) => updateReferral({ primaryColor: e.target.value })}
                  className="flex-1 h-9 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      case 'invite':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor="required-invites" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Required Invites
              </label>
              <input
                id="required-invites"
                type="number"
                min={1}
                value={inviteConfig.requiredInvites}
                onChange={(e) => updateInvite({ requiredInvites: Math.max(1, Number(e.target.value)) })}
                className="w-full h-9 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="current-invites" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Current Invites
              </label>
              <input
                id="current-invites"
                type="number"
                min={0}
                value={inviteConfig.currentInvites}
                onChange={(e) => updateInvite({ currentInvites: Math.max(0, Number(e.target.value)) })}
                className="w-full h-9 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="invite-primary-color" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="invite-primary-color"
                  type="color"
                  value={inviteConfig.primaryColor}
                  onChange={(e) => updateInvite({ primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={inviteConfig.primaryColor}
                  onChange={(e) => updateInvite({ primaryColor: e.target.value })}
                  className="flex-1 h-9 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      case 'badge':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor="brand-name" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Brand Name
              </label>
              <input
                id="brand-name"
                type="text"
                value={badgeConfig.brandName}
                onChange={(e) => updateBadge({ brandName: e.target.value })}
                className="w-full h-9 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="brand-url" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Brand URL
              </label>
              <input
                id="brand-url"
                type="text"
                value={badgeConfig.brandUrl}
                onChange={(e) => updateBadge({ brandUrl: e.target.value })}
                className="w-full h-9 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="badge-primary-color" className="block text-text-secondary text-xs font-medium mb-1 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="badge-primary-color"
                  type="color"
                  value={badgeConfig.primaryColor}
                  onChange={(e) => updateBadge({ primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={badgeConfig.primaryColor}
                  onChange={(e) => updateBadge({ primaryColor: e.target.value })}
                  className="flex-1 h-9 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                id="compact-mode"
                type="checkbox"
                checked={badgeConfig.compact}
                onChange={(e) => updateBadge({ compact: e.target.checked })}
              />
              <label htmlFor="compact-mode" className="text-text-secondary text-sm cursor-pointer select-none">
                Compact mode
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" data-testid="playground">
      {/* SEO h1 — keyword-targeted for search queries */}
      <h1 className="sr-only">
        K-Factor Calculator
        <span className="sr-only"> — Viralo</span>
      </h1>

      {/* Interactive K-Factor Calculator — hero with primary_user_action interactivity */}
      <div className="shrink-0 px-6 py-5 border-b border-border bg-surface-light/40" data-testid="kfactor-calculator">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="calc-invites" className="text-text-secondary text-xs font-medium tracking-wide">
              Invites per user
            </label>
            <input
              id="calc-invites"
              type="number"
              min={0}
              step={0.1}
              value={calcInvites}
              onChange={(e) => setCalcInvites(Math.max(0, Number(e.target.value)))}
              className="w-28 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <span className="text-text-muted text-lg font-mono pb-2">×</span>
          <div className="flex flex-col gap-1">
            <label htmlFor="calc-conversion" className="text-text-secondary text-xs font-medium tracking-wide">
              Conversion rate (%)
            </label>
            <input
              id="calc-conversion"
              type="number"
              min={0}
              max={100}
              step={1}
              value={calcConversion}
              onChange={(e) => setCalcConversion(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-28 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <span className="text-text-muted text-lg font-mono pb-2">=</span>
          <div className="flex flex-col gap-1">
            <span className="text-text-muted text-xs font-medium tracking-wide">Your K-Factor</span>
            <div className="flex items-center gap-3">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: kStatus.color }}
                aria-label={`K-factor value: ${kFactor}`}
              >
                {kFactor.toFixed(2)}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: `${kStatus.color}1a`, color: kStatus.color }}
              >
                {kStatus.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-text-muted text-xs mt-2">{kStatus.desc}</p>
      </div>

      {/* K-Factor Formula — educational reference content (300-400 words, indexable HTML) */}
      <div className="shrink-0 px-6 py-6 border-b border-border">
        <h2 className="text-text-primary font-semibold text-lg mb-3">K-Factor Formula</h2>
        <div className="text-text-secondary text-sm leading-relaxed space-y-4">
          <p>
            The K-factor (viral coefficient) formula is:{' '}
            <strong className="text-text-primary">K = invites per user × invite-to-signup conversion rate</strong>.
            Each variable captures a distinct part of your referral loop.
          </p>
          <p>
            <strong className="text-text-primary">Invites per user</strong> measures how many people your average
            user actively invites. For a SaaS dashboard, this is the average number of referral links shared per
            user in a 30-day window. Consumer social apps typically see 5–10 invites per user; B2B tools see 0.5–2.
            Track this by counting unique share events per user in tools like Amplitude, Mixpanel, or PostHog, then
            dividing by total active users.
          </p>
          <p>
            <strong className="text-text-primary">Invite-to-signup conversion rate</strong> is the percentage of
            invited prospects who create an account. If Sarah sends 10 invites and 3 recipients sign up, her
            conversion rate is 30%. Measure this at the product level by dividing referral-attributed signups by
            total invites sent in the same period. You need a referral attribution mechanism — a unique code or
            tracked link stored in a cookie or URL parameter — to connect each signup back to the inviter.
          </p>
          <p>
            <strong className="text-text-primary">Benchmark interpretation:</strong> K &lt; 1 means each user brings
            in less than one new user — growth depends on paid or organic channels. Most B2B SaaS products operate
            here (K = 0.3–0.6), and that is normal. K = 1.0 means each user replaces themselves — your user base
            grows linearly without acquisition spend. K &gt; 1 means exponential viral growth, where each user
            brings in more than one replacement, compounding generation over generation.
          </p>
          <p>
            <strong className="text-text-primary">Worked example — K = 0.8 vs K = 1.2:</strong> Starting with 1,000
            users and K = 0.8, each generation shrinks: 1,000 → 800 → 640 → 512. The referral loop decays and
            dies within roughly 10 generations. With K = 1.2, the trajectory reverses: 1,000 → 1,200 → 1,440 →
            1,728 → 2,074. By generation 10 you have added over 6,000 users — all from the same starting cohort.
            The gap between 0.8 and 1.2 is not incremental; it is the difference between a loop that fizzles and
            one that compounds.
          </p>
          <p>
            <strong className="text-text-primary">What "good" looks like by product type:</strong> Consumer social
            apps like WhatsApp or Instagram in their early days sustained K &gt; 1.5. B2B SaaS tools typically see
            K = 0.3–0.7 — viral mechanics supplement but never fully replace paid acquisition. Developer tools
            with built-in sharing, such as code snippet links or API playgrounds, can reach K = 0.8–1.2. Mobile
            games with invite rewards often hit K = 1.0–2.0 during launch windows but decay quickly as the
            existing user base saturates. Marketplaces benefit from two-sided referrals and can sustain K = 0.6–1.0
            when both buyers and sellers invite.
          </p>
          <p>
            <strong className="text-text-primary">Common measurement pitfalls:</strong> Counting bots or duplicate
            accounts as signups inflates conversion rate — verify signups with email confirmation. Track unique
            recipient emails, not total send events, because users invite the same person multiple times. Define
            your measurement window consistently — K measured over 7 days differs from 90 days. Confusing
            activation with signup overstates viral performance; a user who creates an account but never returns
            does not contribute to growth. Finally, compute K-factor across your entire active user base, not just
            power-user cohorts, which will overstate results.
          </p>
        </div>
      </div>

      {/* Split pane: left = preview, right = code editor with file-style tabs */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Left pane: live preview + config */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 border-r border-border">
          <h2 className="sr-only">
            {activeType === 'referral'
              ? 'React Referral Widget Code'
              : activeType === 'invite'
                ? 'React Invite Gate Code'
                : 'React Powered By Badge Code'}
          </h2>
          <div
            className="flex-1 flex items-center justify-center p-6 relative overflow-auto"
            data-testid="live-preview"
            role="tabpanel"
            aria-label="Live preview"
          >
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />
            <div className="w-full max-w-md relative">
              {renderPreview()}
            </div>
          </div>

          {/* Collapsible config panel */}
          <div className="shrink-0 border-t border-border">
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              aria-expanded={configOpen}
              aria-controls="config-panel"
            >
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Configuration
              </span>
              <span className="text-text-muted">{configOpen ? '▾' : '▸'}</span>
            </button>
            {configOpen && (
              <div id="config-panel" className="px-4 pb-4">
                {renderConfig()}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: file-style tabs + code editor */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 lg:max-w-[50%]">
          {/* File-style tab bar (VS Code style) — component selector lives here */}
          <div className="shrink-0 flex items-center gap-0 border-b border-border bg-surface-light/50" role="tablist" aria-label="Component type">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeType === tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 text-xs font-mono font-medium transition-all duration-200 border-b-2 -mb-px min-h-[36px] ${
                  activeType === tab.key
                    ? 'text-primary border-primary bg-surface/80'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-surface/40'
                }`}
              >
                {tab.label}.tsx
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-auto p-4">
            <CodeSnippet code={code} />
          </div>
          <div className="shrink-0 px-4 pb-4">
            <button
              onClick={handleCopyCode}
              className="w-full px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface shadow-sm hover:shadow-glow-primary min-h-[44px]"
              aria-label="Copy code"
            >
              {codeCopied ? '✓ Copied!' : 'Copy Code'}
            </button>
            {codeCopied && (
              <p className="text-success text-xs font-medium mt-2 text-center" role="status" style={{ animation: 'fade-in 200ms ease-out' }}>
                Code copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
