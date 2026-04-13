import { useState, useEffect, useCallback } from 'react';

interface Rule {
  id: string;
  trigger: string;
  threshold: number;
  action: string;
}

const STORAGE_KEY = 'viralo-rules';

const TRIGGER_EVENTS = [
  { value: 'export_count', label: 'Export Count' },
  { value: 'session_count', label: 'Session Count' },
  { value: 'invite_sent', label: 'Invite Sent' },
  { value: 'page_view', label: 'Page View' },
];

const GROWTH_ACTIONS = [
  { value: 'show_referral', label: 'Show Referral Prompt' },
  { value: 'show_badge', label: 'Show Powered By Badge' },
  { value: 'show_invite_gate', label: 'Show Invite Gate' },
  { value: 'show_nudge', label: 'Show Growth Nudge' },
];

function loadRules(): Rule[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Rule[];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveRules(rules: Rule[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

interface RuleFormState {
  trigger: string;
  threshold: number;
  action: string;
}

const EMPTY_FORM: RuleFormState = {
  trigger: 'export_count',
  threshold: 10,
  action: 'show_referral',
};

export function RulesBuilder() {
  const [rules, setRules] = useState<Rule[]>(loadRules);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RuleFormState>({ ...EMPTY_FORM });

  useEffect(() => {
    saveRules(rules);
  }, [rules]);

  const handleSave = useCallback(() => {
    const newRule: Rule = {
      id: crypto.randomUUID?.() ?? Date.now().toString(36),
      trigger: form.trigger,
      threshold: form.threshold,
      action: form.action,
    };
    setRules((prev) => [...prev, newRule]);
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  }, [form]);

  const handleDelete = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const jsonConfig = { rules: rules.map(({ trigger, threshold, action }) => ({ trigger, threshold, action })) };

  const hasRules = rules.length > 0;

  return (
    <div className="space-y-5" data-testid="rules-builder">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-text-primary text-lg font-semibold tracking-tight">Rules Builder</h2>
          <p className="text-text-muted text-xs mt-0.5">Configure automated growth triggers for your product</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface shadow-sm hover:shadow-glow-primary min-h-[44px]"
          aria-label="Add rule"
        >
          <span className="mr-1" aria-hidden="true">+</span> Add Rule
        </button>
      </div>

      {/* Rule Creation Form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-surface-light p-5 space-y-5 shadow-card" style={{ animation: 'slide-up 200ms ease-out' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            <h3 className="text-text-primary text-sm font-semibold tracking-tight">New Rule</h3>
          </div>
          <p className="text-text-secondary text-xs">
            When <strong className="text-text-primary font-medium">[trigger]</strong> reaches <strong className="text-text-primary font-medium">[threshold]</strong> → <strong className="text-text-primary font-medium">[action]</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="trigger-event" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Trigger Event
              </label>
              <select
                id="trigger-event"
                value={form.trigger}
                onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value }))}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Trigger event"
              >
                {TRIGGER_EVENTS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="threshold" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Threshold
              </label>
              <input
                id="threshold"
                type="number"
                min={1}
                value={form.threshold}
                onChange={(e) => setForm((f) => ({ ...f, threshold: Number(e.target.value) }))}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Threshold"
              />
            </div>

            <div>
              <label htmlFor="action" className="block text-text-secondary text-xs font-medium mb-1.5 tracking-wide">
                Action
              </label>
              <select
                id="action"
                value={form.action}
                onChange={(e) => setForm((f) => ({ ...f, action: e.target.value }))}
                className="w-full h-10 rounded-lg bg-surface px-3 text-text-primary text-sm border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Action"
              >
                {GROWTH_ACTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={() => { setForm({ ...EMPTY_FORM }); setShowForm(false); }}
              className="px-4 py-2.5 rounded-lg bg-surface-lighter text-text-secondary text-sm font-medium hover:text-text-primary hover:bg-surface-elevated transition-all duration-200 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface shadow-sm min-h-[44px]"
              aria-label="Save"
            >
              Save Rule
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {!hasRules && !showForm && (
        <div className="rounded-xl border border-dashed border-border bg-surface-light/30 p-12 text-center" style={{ animation: 'fade-in 300ms ease-out' }}>
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-lighter flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-text-secondary text-sm font-medium">No rules configured yet</p>
          <p className="text-text-muted text-xs mt-1.5 max-w-[260px] mx-auto">
            Click "Add Rule" to create your first growth automation rule.
          </p>
        </div>
      )}

      {hasRules && (
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-light p-4 hover:border-border-hover hover:shadow-card transition-all duration-200 group"
              style={{ animation: `slide-up 200ms ease-out ${index * 50}ms both` }}
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary border border-primary/20">
                  {rule.trigger}
                </span>
                <span className="text-text-muted text-xs font-medium" aria-hidden="true">≥</span>
                <span className="text-text-primary text-sm font-semibold font-mono">{rule.threshold}</span>
                <span className="text-text-muted text-xs" aria-hidden="true">→</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-info/10 text-info-light border border-info/20">
                  {rule.action}
                </span>
              </div>
              <button
                onClick={() => handleDelete(rule.id)}
                className="p-2 rounded-lg hover:bg-error-light/30 text-text-muted hover:text-error transition-all duration-200 opacity-0 group-hover:opacity-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Delete rule"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* JSON Config Output */}
      {hasRules && (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true" />
            <h3 className="text-text-primary text-sm font-semibold tracking-tight">Generated Config</h3>
          </div>
          <pre
            data-testid="json-config-output"
            className="text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap leading-relaxed"
          >
            {JSON.stringify(jsonConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
