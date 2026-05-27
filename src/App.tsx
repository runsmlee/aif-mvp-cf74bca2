import { Playground } from './components/Playground';

export default function App() {
  return (
    <main className="h-screen bg-surface" role="region" aria-label="Interactive SDK Playground">
      <Playground />
    </main>
  );
}
