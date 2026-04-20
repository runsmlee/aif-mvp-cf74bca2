import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
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

export function Playground() {
  const [activeType, setActiveType] = useState<ComponentType>('referral');
  const [referralConfig, setReferralConfig] = useState<ReferralConfig>({ ...DEFAULT_REFERRAL });
  const [inviteConfig, setInviteConfig] = useState<InviteConfig>({ ...DEFAULT_INVITE });
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({ ...DEFAULT_BADGE });
  const [codeCopied, setCodeCopied] = useState(false);

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

  const renderSidebar = () => {
    switch (activeType) {
      case 'referral':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="referral-code" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Referral Code
              </label>
              <input
                id="referral-code"
                type="text"
                value={referralConfig.referralCode}
                onChange={(e) => updateReferral({ referralCode: e.target.value })}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Referral code"
              />
            </div>
            <div>
              <label htmlFor="primary-color" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={referralConfig.primaryColor}
                  onChange={(e) => updateReferral({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={referralConfig.primaryColor}
                  onChange={(e) => updateReferral({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      case 'invite':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="required-invites" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Required Invites
              </label>
              <input
                id="required-invites"
                type="number"
                min={1}
                value={inviteConfig.requiredInvites}
                onChange={(e) => updateInvite({ requiredInvites: Math.max(1, Number(e.target.value)) })}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="current-invites" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Current Invites
              </label>
              <input
                id="current-invites"
                type="number"
                min={0}
                value={inviteConfig.currentInvites}
                onChange={(e) => updateInvite({ currentInvites: Math.max(0, Number(e.target.value)) })}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="invite-primary-color" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="invite-primary-color"
                  type="color"
                  value={inviteConfig.primaryColor}
                  onChange={(e) => updateInvite({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={inviteConfig.primaryColor}
                  onChange={(e) => updateInvite({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      case 'badge':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="brand-name" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Brand Name
              </label>
              <input
                id="brand-name"
                type="text"
                value={badgeConfig.brandName}
                onChange={(e) => updateBadge({ brandName: e.target.value })}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="brand-url" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Brand URL
              </label>
              <input
                id="brand-url"
                type="text"
                value={badgeConfig.brandUrl}
                onChange={(e) => updateBadge({ brandUrl: e.target.value })}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="badge-primary-color" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="badge-primary-color"
                  type="color"
                  value={badgeConfig.primaryColor}
                  onChange={(e) => updateBadge({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={badgeConfig.primaryColor}
                  onChange={(e) => updateBadge({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
    <div className="flex flex-col lg:flex-row gap-4 h-full" data-testid="playground">
      {/* Component Type Tabs */}
      <div className="flex flex-col w-full">
        <div className="flex gap-0 border-b border-border" role="tablist" aria-label="Component type">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeType === tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 sm:px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px min-h-[44px] ${
                activeType === tab.key
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-5 flex-1">
          {/* Live Preview */}
          <div
            className="flex-1 rounded-xl border border-border bg-surface-light p-6 sm:p-8 flex items-center justify-center min-h-[320px] shadow-card relative overflow-hidden"
            data-testid="live-preview"
            role="tabpanel"
            aria-label="Live preview"
          >
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />
            <div className="w-full max-w-md relative">
              {renderPreview()}
            </div>
          </div>

          {/* Sidebar + Code */}
          <div className="w-full lg:w-[380px] flex flex-col gap-4">
            {/* Config Sidebar */}
            <div className="rounded-xl border border-border bg-surface-light p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                <h3 className="text-text-primary text-sm font-semibold tracking-tight">Configuration</h3>
              </div>
              {renderSidebar()}
            </div>

            {/* Code Output */}
            <div className="flex-1">
              <CodeSnippet code={code} />
              <button
                onClick={handleCopyCode}
                className="mt-3 w-full px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface shadow-sm hover:shadow-glow-primary min-h-[44px]"
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
    </div>
  );
}
