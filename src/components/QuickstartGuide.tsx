import { useState, useCallback } from 'react';

type FrameworkTab = 'vite' | 'nextjs' | 'cra';

interface GuideStep {
  step: number;
  title: string;
  description: string;
  code: string;
}

const FRAMEWORKS: { key: FrameworkTab; label: string }[] = [
  { key: 'vite', label: 'Vite' },
  { key: 'nextjs', label: 'Next.js' },
  { key: 'cra', label: 'CRA' },
];

const GUIDES: Record<FrameworkTab, GuideStep[]> = {
  vite: [
    {
      step: 1,
      title: 'Install the SDK',
      description: 'Add the Viralo React SDK to your Vite project.',
      code: `npm install @viralo/react`,
    },
    {
      step: 2,
      title: 'Configure the Provider',
      description: 'Wrap your app with the Viralo provider in your entry file.',
      code: `// src/main.tsx
import { ViraloProvider } from '@viralo/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ViraloProvider config={{ apiKey: 'your-api-key' }}>
    <App />
  </ViraloProvider>
);`,
    },
    {
      step: 3,
      title: 'Add Growth Components',
      description: 'Use any of the growth components in your app.',
      code: `// src/App.tsx
import { ReferralWidget, InviteGate } from '@viralo/react';

export function App() {
  return (
    <div>
      <ReferralWidget referralCode="USER_CODE" />
      <InviteGate requiredInvites={3} currentInvites={0}>
        <PremiumContent />
      </InviteGate>
    </div>
  );
}`,
    },
  ],
  nextjs: [
    {
      step: 1,
      title: 'Install the SDK',
      description: 'Add the Viralo React SDK to your Next.js project.',
      code: `npm install @viralo/react`,
    },
    {
      step: 2,
      title: 'Create a Client Provider',
      description: 'Create a client component wrapper for the Viralo provider.',
      code: `// src/app/providers.tsx
'use client';
import { ViraloProvider } from '@viralo/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ViraloProvider config={{ apiKey: 'your-api-key' }}>
      {children}
    </ViraloProvider>
  );
}`,
    },
    {
      step: 3,
      title: 'Wrap Your Layout',
      description: 'Add the provider to your root layout and use components.',
      code: `// src/app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// src/app/page.tsx
'use client';
import { ReferralWidget } from '@viralo/react';

export default function Page() {
  return <ReferralWidget referralCode="USER_CODE" />;
}`,
    },
  ],
  cra: [
    {
      step: 1,
      title: 'Install the SDK',
      description: 'Add the Viralo React SDK to your Create React App project.',
      code: `npm install @viralo/react`,
    },
    {
      step: 2,
      title: 'Configure the Provider',
      description: 'Wrap your app with the Viralo provider in index.js.',
      code: `// src/index.js
import { ViraloProvider } from '@viralo/react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ViraloProvider config={{ apiKey: 'your-api-key' }}>
    <App />
  </ViraloProvider>
);`,
    },
    {
      step: 3,
      title: 'Use Growth Components',
      description: 'Add any growth component to your pages.',
      code: `// src/App.js
import { ReferralWidget, InviteGate, PoweredByBadge } from '@viralo/react';

function App() {
  return (
    <div>
      <ReferralWidget referralCode="USER_CODE" primaryColor="#3B82F6" />
      <InviteGate requiredInvites={5} currentInvites={2}>
        <div>Premium Feature Content</div>
      </InviteGate>
      <PoweredByBadge brandName="MyApp" brandUrl="https://myapp.com" />
    </div>
  );
}`,
    },
  ],
};

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-surface rounded-lg p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-text-primary border border-border">
      <code>{code}</code>
    </pre>
  );
}

export function QuickstartGuide() {
  const [activeFramework, setActiveFramework] = useState<FrameworkTab>('vite');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleFrameworkChange = useCallback((fw: FrameworkTab) => {
    setActiveFramework(fw);
    setCopiedStep(null);
  }, []);

  const handleCopyStep = useCallback(async (step: GuideStep) => {
    try {
      await navigator.clipboard.writeText(step.code);
      setCopiedStep(step.step);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      // Fallback
    }
  }, []);

  const steps = GUIDES[activeFramework];

  return (
    <div className="space-y-5" data-testid="quickstart-guide">
      <div>
        <h2 className="text-text-primary text-lg font-semibold tracking-tight">
          Integration Quickstart
        </h2>
        <p className="text-text-muted text-xs mt-0.5">
          Get Viralo running in your project in under 2 minutes
        </p>
      </div>

      {/* Framework Tabs */}
      <div className="flex gap-0 border-b border-border" role="tablist" aria-label="Framework selector">
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw.key}
            role="tab"
            aria-selected={activeFramework === fw.key}
            onClick={() => handleFrameworkChange(fw.key)}
            className={`px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px min-h-[44px] ${
              activeFramework === fw.key
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-hover'
            }`}
          >
            {fw.label}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-4" role="tabpanel" aria-label={`${activeFramework} guide`}>
        {steps.map((step) => (
          <div
            key={step.step}
            className="rounded-xl border border-border bg-surface-light p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {step.step}
                </span>
                <div>
                  <h3 className="text-text-primary text-sm font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-xs mt-0.5">{step.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleCopyStep(step)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-surface-lighter hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all duration-200 min-h-[32px]"
                aria-label={`Copy step ${step.step} code`}
              >
                {copiedStep === step.step ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <CodeBlock code={step.code} />
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-dashed border-border bg-surface-light/30 p-5 text-center">
        <p className="text-text-secondary text-sm font-medium">Ready for more?</p>
        <p className="text-text-muted text-xs mt-1.5 max-w-md mx-auto">
          Use the <strong className="text-text-primary">Playground</strong> tab to configure components visually,
          then copy production-ready code. Use the <strong className="text-text-primary">Rules Builder</strong> to
          set up automated growth triggers.
        </p>
      </div>
    </div>
  );
}
