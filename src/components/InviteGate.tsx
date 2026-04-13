import { type ReactNode } from 'react';

interface InviteGateProps {
  requiredInvites?: number;
  currentInvites?: number;
  onInviteClick?: () => void;
  primaryColor?: string;
  children?: ReactNode;
}

export function InviteGate({
  requiredInvites = 3,
  currentInvites = 0,
  onInviteClick,
  primaryColor = '#EF4444',
  children,
}: InviteGateProps) {
  const progress = Math.min(currentInvites / requiredInvites, 1);
  const isUnlocked = currentInvites >= requiredInvites;
  const percentage = Math.round(progress * 100);

  return (
    <div className="rounded-xl border border-border bg-surface-light p-5 space-y-4 shadow-card" data-testid="invite-gate">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} aria-hidden="true" />
          <h3 className="text-text-primary font-semibold text-sm tracking-tight">
            {isUnlocked ? 'Content Unlocked!' : 'Invite Friends to Unlock'}
          </h3>
        </div>
        <span className="text-text-muted text-xs font-mono tabular-nums">
          {currentInvites}/{requiredInvites}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface/50 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: primaryColor,
            animation: 'progress-fill 600ms ease-out',
          }}
          role="progressbar"
          aria-valuenow={currentInvites}
          aria-valuemin={0}
          aria-valuemax={requiredInvites}
          aria-label="Invite progress"
        />
      </div>

      {/* Gated content */}
      {children && (
        <div className={`transition-all duration-300 ${isUnlocked ? '' : 'blur-[3px] pointer-events-none select-none opacity-60'}`}>
          {children}
        </div>
      )}

      {!isUnlocked && (
        <button
          onClick={onInviteClick}
          className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] shadow-sm hover:brightness-110"
          style={{ backgroundColor: primaryColor }}
          aria-label="Invite friends"
        >
          Invite Friends ({requiredInvites - currentInvites} more needed)
        </button>
      )}
    </div>
  );
}
