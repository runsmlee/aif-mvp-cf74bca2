import { useState, useCallback } from 'react';
import { Playground } from './components/Playground';
import { Dashboard } from './components/Dashboard';
import { RulesBuilder } from './components/RulesBuilder';

type Tab = 'playground' | 'dashboard' | 'rules';

const NAV_ITEMS: { key: Tab; label: string; icon: string }[] = [
  { key: 'playground', label: 'Playground', icon: '⚡' },
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'rules', label: 'Rules Builder', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('playground');

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface-light/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface-light/60 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-text-primary font-bold text-xl tracking-tight">
              <span className="text-primary">Loop</span>Forge
            </h1>
            <span className="text-text-muted text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-border bg-surface/50">
              SDK Playground
            </span>
          </div>
          <nav className="flex gap-1 p-1 rounded-lg bg-surface/50 border border-border-subtle" role="tablist" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                role="tab"
                aria-selected={activeTab === item.key}
                onClick={() => handleTabChange(item.key)}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[36px] ${
                  activeTab === item.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50'
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div role="tabpanel" aria-label={`${activeTab} panel`} style={{ animation: 'fade-in 200ms ease-out' }}>
          {activeTab === 'playground' && <Playground />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'rules' && <RulesBuilder />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-4 py-4 text-center">
        <p className="text-text-muted text-xs">
          LoopForge SDK Playground — Build viral growth loops into your product architecture
        </p>
      </footer>
    </div>
  );
}
