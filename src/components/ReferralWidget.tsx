import { useState, useCallback } from 'react';

interface ReferralWidgetProps {
  referralCode: string;
  referralLink?: string;
  primaryColor?: string;
}

const BASE_URL = 'https://app.example.com/ref/';

export function ReferralWidget({
  referralCode,
  referralLink,
  primaryColor = '#EF4444',
}: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);
  const fullLink = referralLink ?? `${BASE_URL}${referralCode}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [fullLink]);

  const shareUrl = encodeURIComponent(fullLink);
  const shareText = encodeURIComponent('Join me on this app!');

  return (
    <div className="rounded-xl border border-border bg-surface-light p-5 space-y-4 shadow-card" data-testid="referral-widget">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} aria-hidden="true" />
        <h3 className="text-text-primary font-semibold text-sm tracking-tight">Share Your Referral Link</h3>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={fullLink}
          className="flex-1 h-10 rounded-lg bg-surface px-3 text-text-primary text-sm font-mono border border-border outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary"
          aria-label="Referral link"
        />
        <button
          onClick={handleCopy}
          className="px-4 h-10 rounded-lg text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[80px] shadow-sm hover:brightness-110"
          style={{ backgroundColor: primaryColor }}
          aria-label="Copy referral link"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {copied && (
        <p className="text-success text-xs font-medium" role="status" style={{ animation: 'fade-in 200ms ease-out' }}>
          Link copied to clipboard!
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <span className="text-text-muted text-xs font-medium">Share via:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-lighter border border-border transition-all duration-200 text-text-secondary hover:text-text-primary hover:border-border-hover"
          aria-label="Share on Twitter"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-lighter border border-border transition-all duration-200 text-text-secondary hover:text-text-primary hover:border-border-hover"
          aria-label="Share on LinkedIn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a
          href={`mailto:?subject=${shareText}&body=${shareUrl}`}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-lighter border border-border transition-all duration-200 text-text-secondary hover:text-text-primary hover:border-border-hover"
          aria-label="Share via Email"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </a>
      </div>
    </div>
  );
}
