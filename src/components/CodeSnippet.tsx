import { useState, useCallback } from 'react';

interface CodeSnippetProps {
  code: string;
  language?: string;
}

export function CodeSnippet({ code, language = 'tsx' }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [code]);

  return (
    <div className="relative rounded-xl bg-surface border border-border overflow-hidden shadow-card" data-testid="code-snippet">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-light">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-error/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
          </div>
          <span className="text-text-muted text-[11px] font-mono uppercase tracking-wider ml-2">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 bg-surface-lighter hover:bg-surface-elevated text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary min-h-[28px]"
          aria-label="Copy snippet"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <code className="text-text-primary">{code}</code>
      </pre>
    </div>
  );
}
