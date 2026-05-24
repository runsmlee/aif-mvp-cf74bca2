import { useState, useCallback, lazy, Suspense } from 'react';
import { Playground } from './components/Playground';

const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const RulesBuilder = lazy(() => import('./components/RulesBuilder').then(m => ({ default: m.RulesBuilder })));
const QuickstartGuide = lazy(() => import('./components/QuickstartGuide').then(m => ({ default: m.QuickstartGuide })));

type Tab = 'playground' | 'dashboard' | 'rules' | 'quickstart';

const NAV_ITEMS: { key: Tab; label: string; icon: string }[] = [
  { key: 'playground', label: 'Playground', icon: '⚡' },
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'rules', label: 'Rules Builder', icon: '⚙️' },
  { key: 'quickstart', label: 'Quickstart', icon: '📖' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('playground');

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* Minimal header — zero marketing copy */}
      <header className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-surface-light/80 backdrop-blur-xl" role="banner">
        <h1 className="text-primary font-bold text-base tracking-tight">Viralo</h1>
        <nav className="flex gap-0.5 p-0.5 rounded-md bg-surface/50 border border-border-subtle" role="tablist" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={activeTab === item.key}
              onClick={() => handleTabChange(item.key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 min-h-[32px] ${
                activeTab === item.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50'
              }`}
            >
              <span className="mr-1" aria-hidden="true">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Full-viewport content — playground fills all available space */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div role="tabpanel" aria-label={`${activeTab} panel`} className="h-full">
          {activeTab === 'playground' && <Playground />}
          {activeTab !== 'playground' && (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-text-muted text-sm animate-pulse">Loading…</div>
              </div>
            }>
              <div className="h-full overflow-auto p-4 sm:p-6 lg:p-8">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'rules' && <RulesBuilder />}
                {activeTab === 'quickstart' && <QuickstartGuide />}
              </div>
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}
