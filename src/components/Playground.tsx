import { useState, useMemo, useCallback } from 'react';
import { ReferralWidget } from './ReferralWidget';
import { InviteGate } from './InviteGate';
import { PoweredByBadge } from './PoweredByBadge';
import { CodeSnippet } from './CodeSnippet';

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

type Config = ReferralConfig | InviteConfig | BadgeConfig;

function generateCode(type: ComponentType, config: Config): string {
  switch (type) {
    case 'referral': {
      const c = config as ReferralConfig;
      return `import { ReferralWidget } from '@loopforge/react';

export function App() {
  return (
    <ReferralWidget
      referralCode="${c.referralCode}"
      primaryColor="${c.primaryColor}"
    />
  );
}`;
    }
    case 'invite': {
      const c = config as InviteConfig;
      return `import { InviteGate } from '@loopforge/react';

export function App() {
  return (
    <InviteGate
      requiredInvites={${c.requiredInvites}}
      currentInvites={${c.currentInvites}}
      primaryColor="${c.primaryColor}"
      onInviteClick={() => console.log('invite clicked')}
    >
      <div>Protected content here</div>
    </InviteGate>
  );
}`;
    }
    case 'badge': {
      const c = config as BadgeConfig;
      return `import { PoweredByBadge } from '@loopforge/react';

export function App() {
  return (
    <PoweredByBadge
      brandName="${c.brandName}"
      brandUrl="${c.brandUrl}"
      primaryColor="${c.primaryColor}"
      compact={${c.compact}}
    />
  );
}`;
    }
  }
}

const DEFAULT_CONFIGS: Record<ComponentType, Config> = {
  referral: { referralCode: 'ABC123', primaryColor: '#EF4444' } as ReferralConfig,
  invite: { requiredInvites: 3, currentInvites: 0, primaryColor: '#EF4444' } as InviteConfig,
  badge: { brandName: 'LoopForge', brandUrl: 'https://loopforge.dev', primaryColor: '#EF4444', compact: false } as BadgeConfig,
};

const TABS: { key: ComponentType; label: string }[] = [
  { key: 'referral', label: 'ReferralWidget' },
  { key: 'invite', label: 'InviteGate' },
  { key: 'badge', label: 'PoweredByBadge' },
];

export function Playground() {
  const [activeType, setActiveType] = useState<ComponentType>('referral');
  const [configs, setConfigs] = useState<Record<ComponentType, Config>>({
    referral: { ...DEFAULT_CONFIGS.referral } as ReferralConfig,
    invite: { ...DEFAULT_CONFIGS.invite } as InviteConfig,
    badge: { ...DEFAULT_CONFIGS.badge } as BadgeConfig,
  });

  const currentConfig = configs[activeType];
  const code = useMemo(() => generateCode(activeType, currentConfig), [activeType, currentConfig]);

  const updateConfig = useCallback((updates: Partial<Config>) => {
    setConfigs((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], ...updates },
    }));
  }, [activeType]);

  const handleTabChange = useCallback((type: ComponentType) => {
    setActiveType(type);
  }, []);

  const renderPreview = () => {
    switch (activeType) {
      case 'referral': {
        const c = currentConfig as ReferralConfig;
        return <ReferralWidget referralCode={c.referralCode} primaryColor={c.primaryColor} />;
      }
      case 'invite': {
        const c = currentConfig as InviteConfig;
        return (
          <InviteGate
            requiredInvites={c.requiredInvites}
            currentInvites={c.currentInvites}
            primaryColor={c.primaryColor}
            onInviteClick={() => {
              updateConfig({ currentInvites: c.currentInvites + 1 });
            }}
          >
            <div className="p-4 rounded-md bg-surface text-text-primary">
              <h4 className="font-semibold">Premium Feature</h4>
              <p className="text-text-secondary text-sm mt-1">
                This content is gated behind invites.
              </p>
            </div>
          </InviteGate>
        );
      }
      case 'badge': {
        const c = currentConfig as BadgeConfig;
        return (
          <PoweredByBadge
            brandName={c.brandName}
            brandUrl={c.brandUrl}
            primaryColor={c.primaryColor}
            compact={c.compact}
          />
        );
      }
    }
  };

  const renderSidebar = () => {
    switch (activeType) {
      case 'referral': {
        const c = currentConfig as ReferralConfig;
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="referral-code" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Referral Code
              </label>
              <input
                id="referral-code"
                type="text"
                value={c.referralCode}
                onChange={(e) => updateConfig({ referralCode: e.target.value })}
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
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      }
      case 'invite': {
        const c = currentConfig as InviteConfig;
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
                value={c.requiredInvites}
                onChange={(e) => updateConfig({ requiredInvites: Math.max(1, Number(e.target.value)) })}
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
                value={c.currentInvites}
                onChange={(e) => updateConfig({ currentInvites: Math.max(0, Number(e.target.value)) })}
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
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        );
      }
      case 'badge': {
        const c = currentConfig as BadgeConfig;
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="brand-name" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Brand Name
              </label>
              <input
                id="brand-name"
                type="text"
                value={c.brandName}
                onChange={(e) => updateConfig({ brandName: e.target.value })}
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
                value={c.brandUrl}
                onChange={(e) => updateConfig({ brandUrl: e.target.value })}
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
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  aria-label="Primary color"
                />
                <input
                  type="text"
                  value={c.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                id="compact-mode"
                type="checkbox"
                checked={c.compact}
                onChange={(e) => updateConfig({ compact: e.target.checked })}
              />
              <label htmlFor="compact-mode" className="text-text-secondary text-sm cursor-pointer select-none">
                Compact mode
              </label>
            </div>
          </div>
        );
      }
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
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code);
                  } catch {
                    // fallback
                  }
                }}
                className="mt-3 w-full px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface shadow-sm hover:shadow-glow-primary min-h-[44px]"
                aria-label="Copy code"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
