import { Playground } from './components/Playground';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* Minimal header — brand only, zero navigation chrome */}
      <header className="shrink-0 flex items-center px-4 py-2 border-b border-border bg-surface-light/80 backdrop-blur-xl" role="banner">
        <h1 className="text-primary font-bold text-base tracking-tight">Viralo</h1>
      </header>

      {/* Full-viewport playground — split-pane IDE is the landing experience */}
      <main className="flex-1 min-h-0 overflow-hidden" role="region" aria-label="Interactive SDK Playground">
        <Playground />
      </main>
    </div>
  );
}
