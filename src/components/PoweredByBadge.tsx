interface PoweredByBadgeProps {
  brandName?: string;
  brandUrl?: string;
  primaryColor?: string;
  compact?: boolean;
}

export function PoweredByBadge({
  brandName = 'LoopForge',
  brandUrl,
  primaryColor = '#EF4444',
  compact = false,
}: PoweredByBadgeProps) {
  const nameElement = brandUrl ? (
    <a
      href={brandUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold hover:underline"
      style={{ color: primaryColor }}
      aria-label={brandName}
    >
      {brandName}
    </a>
  ) : (
    <span className="font-semibold" style={{ color: primaryColor }}>
      {brandName}
    </span>
  );

  return (
    <div
      data-testid="powered-by-badge"
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 transition-all duration-200 hover:shadow-sm ${
        compact ? 'text-xs' : 'text-sm'
      }`}
      style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}08` }}
    >
      <span className="text-text-secondary">Powered by</span>
      {nameElement}
    </div>
  );
}
