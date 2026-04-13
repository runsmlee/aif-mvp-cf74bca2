import { useState, useMemo } from 'react';

interface TreeNode {
  id: string;
  name: string;
  invites: number;
  children: TreeNode[];
}

const MOCK_TREE: TreeNode = {
  id: 'root',
  name: 'You (Root)',
  invites: 4,
  children: [
    {
      id: 'u1',
      name: 'Alice',
      invites: 2,
      children: [
        { id: 'u1-1', name: 'Dave', invites: 1, children: [
          { id: 'u1-1-1', name: 'Frank', invites: 0, children: [] },
        ] },
        { id: 'u1-2', name: 'Eve', invites: 0, children: [] },
      ],
    },
    {
      id: 'u2',
      name: 'Bob',
      invites: 3,
      children: [
        { id: 'u2-1', name: 'Grace', invites: 1, children: [] },
        { id: 'u2-2', name: 'Hank', invites: 0, children: [] },
        { id: 'u2-3', name: 'Ivy', invites: 0, children: [] },
      ],
    },
    { id: 'u3', name: 'Carol', invites: 0, children: [] },
    { id: 'u4', name: 'Dan', invites: 1, children: [
      { id: 'u4-1', name: 'Jill', invites: 0, children: [] },
    ] },
  ],
};

const FUNNEL_DATA = [
  { stage: 'Invited', count: 1200, color: '#6366F1' },
  { stage: 'Clicked', count: 780, color: '#8B5CF6' },
  { stage: 'Signed Up', count: 420, color: '#A855F7' },
  { stage: 'Activated', count: 280, color: '#10B981' },
];

function MetricCard({ title, value, subtitle, accent }: {
  title: string;
  value: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-light p-5 space-y-2 shadow-card hover:shadow-card-hover hover:border-border-hover transition-all duration-300 group">
      <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-widest">{title}</p>
      <p className="text-text-primary text-3xl font-bold tracking-tight transition-colors duration-200" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
      {subtitle && <p className="text-text-muted text-xs">{subtitle}</p>}
    </div>
  );
}

function TreeView({ node, level = 0 }: { node: TreeNode; level?: number }) {
  return (
    <div data-level={level} className={level > 0 ? 'ml-5 border-l border-border pl-3' : ''}>
      <div className="flex items-center gap-2.5 py-1.5 group hover:bg-surface-lighter/30 rounded-md px-2 -mx-2 transition-colors duration-150">
        <div
          className="w-2.5 h-2.5 rounded-full ring-2 ring-surface-light flex-shrink-0"
          style={{ backgroundColor: level === 0 ? '#EF4444' : level === 1 ? '#6366F1' : level === 2 ? '#8B5CF6' : '#A855F7' }}
          aria-hidden="true"
        />
        <span className="text-text-primary text-sm font-medium">{node.name}</span>
        <span className="text-text-muted text-xs font-mono">({node.invites})</span>
      </div>
      {node.children.map((child) => (
        <TreeView key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}

function FunnelChart() {
  const maxCount = Math.max(...FUNNEL_DATA.map((d) => d.count));

  return (
    <div className="space-y-3">
      {FUNNEL_DATA.map((item) => {
        const widthPercent = (item.count / maxCount) * 100;
        const conversionRate = item.count / FUNNEL_DATA[0].count * 100;
        return (
          <div key={item.stage} className="flex items-center gap-3">
            <div className="w-24 text-right text-text-secondary text-xs font-medium">{item.stage}</div>
            <div className="flex-1 bg-surface/50 rounded-full h-8 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500 ease-out"
                style={{ width: `${widthPercent}%`, backgroundColor: item.color, animation: 'progress-fill 800ms ease-out' }}
              >
                <span className="text-white text-xs font-semibold">{item.count.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-16 text-text-muted text-xs font-mono text-right">{conversionRate.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
}

export function Dashboard() {
  const [inviteRate, setInviteRate] = useState(2.4);

  const metrics = useMemo(() => {
    const kFactor = parseFloat(inviteRate.toFixed(2));
    const totalInvites = Math.round(1200 * (inviteRate / 2.4));
    const conversionRate = ((280 / 1200) * 100 * (inviteRate / 2.4)).toFixed(1);
    return { kFactor, totalInvites, conversionRate };
  }, [inviteRate]);

  return (
    <div className="space-y-5" data-testid="dashboard">
      {/* Simulation Controls */}
      <div className="rounded-xl border border-border bg-surface-light p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
          <h3 className="text-text-primary text-sm font-semibold tracking-tight">Simulation Parameters</h3>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="invite-rate" className="text-text-secondary text-sm whitespace-nowrap min-w-[160px]">
            Avg Invites per User
          </label>
          <input
            id="invite-rate"
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={inviteRate}
            onChange={(e) => setInviteRate(parseFloat(e.target.value))}
            className="flex-1"
            aria-label="Invite rate"
          />
          <span className="text-text-primary text-sm font-mono font-semibold bg-surface px-2.5 py-1 rounded-md border border-border min-w-[48px] text-center">{inviteRate.toFixed(1)}</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div data-testid="k-factor-card">
          <MetricCard
            title="K-Factor"
            value={metrics.kFactor.toString()}
            subtitle="Viral coefficient"
            accent={metrics.kFactor >= 1 ? '#10B981' : '#EF4444'}
          />
          <span data-testid="k-factor-value" className="hidden">{metrics.kFactor.toString()}</span>
        </div>
        <MetricCard
          title="Total Invites"
          value={metrics.totalInvites.toLocaleString()}
          subtitle="Simulated total"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtitle="Invited → Activated"
        />
      </div>

      {/* Attribution Tree */}
      <div className="rounded-xl border border-border bg-surface-light p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-info" aria-hidden="true" />
          <h3 className="text-text-primary text-sm font-semibold tracking-tight">Attribution Tree</h3>
        </div>
        <div data-testid="attribution-tree">
          <TreeView node={MOCK_TREE} level={0} />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-xl border border-border bg-surface-light p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
          <h3 className="text-text-primary text-sm font-semibold tracking-tight">Conversion Funnel</h3>
        </div>
        <FunnelChart />
      </div>
    </div>
  );
}
