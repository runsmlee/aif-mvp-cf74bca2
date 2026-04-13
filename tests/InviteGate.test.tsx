import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InviteGate } from '../src/components/InviteGate';

describe('InviteGate', () => {
  it('renders without crash', () => {
    render(<InviteGate />);
  });

  it('displays progress indicator showing invites sent vs required', () => {
    render(<InviteGate currentInvites={1} requiredInvites={3} />);
    expect(screen.getByText(/1.*3/)).toBeInTheDocument();
  });

  it('renders gated content as blurred/locked when invite count is below threshold', () => {
    render(
      <InviteGate currentInvites={1} requiredInvites={3}>
        <div>Secret content</div>
      </InviteGate>
    );
    const content = screen.getByText('Secret content');
    expect(content.parentElement!.className).toContain('blur');
  });

  it('unlocks gated content when invite count meets or exceeds threshold', () => {
    render(
      <InviteGate currentInvites={3} requiredInvites={3}>
        <div>Secret content</div>
      </InviteGate>
    );
    const content = screen.getByText('Secret content');
    expect(content.parentElement!.className).not.toContain('blur');
  });

  it('accepts requiredInvites prop (default 3)', () => {
    render(<InviteGate />);
    // Default should show 0/3
    expect(screen.getByText(/0.*3/)).toBeInTheDocument();
  });

  it('accepts currentInvites prop (default 0)', () => {
    render(<InviteGate currentInvites={0} requiredInvites={5} />);
    expect(screen.getByText(/0.*5/)).toBeInTheDocument();
  });

  it('shows invite CTA button that triggers onInviteClick callback', () => {
    const onInviteClick = vi.fn();
    render(<InviteGate currentInvites={1} requiredInvites={3} onInviteClick={onInviteClick} />);
    const button = screen.getByRole('button', { name: /invite/i });
    fireEvent.click(button);
    expect(onInviteClick).toHaveBeenCalledOnce();
  });
});
