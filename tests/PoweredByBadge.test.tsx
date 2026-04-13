import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PoweredByBadge } from '../src/components/PoweredByBadge';

describe('PoweredByBadge', () => {
  it('renders without crash', () => {
    render(<PoweredByBadge />);
  });

  it('displays "Powered by [brandName]" text', () => {
    render(<PoweredByBadge brandName="LoopForge" />);
    expect(screen.getByText(/Powered by/)).toBeInTheDocument();
    expect(screen.getByText(/LoopForge/)).toBeInTheDocument();
  });

  it('accepts brandName prop', () => {
    render(<PoweredByBadge brandName="Acme Corp" />);
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
  });

  it('accepts brandUrl prop and renders as clickable link', () => {
    render(<PoweredByBadge brandName="LoopForge" brandUrl="https://loopforge.dev" />);
    const link = screen.getByRole('link', { name: /loopforge/i });
    expect(link).toHaveAttribute('href', 'https://loopforge.dev');
  });

  it('accepts primaryColor prop and applies to badge accent', () => {
    render(<PoweredByBadge brandName="Test" primaryColor="#3B82F6" />);
    const badge = screen.getByTestId('powered-by-badge');
    expect(badge).toHaveStyle({ borderColor: '#3B82F6' });
  });

  it('renders in compact mode when compact prop is true', () => {
    const { rerender } = render(<PoweredByBadge brandName="Test" compact={false} />);
    const badge = screen.getByTestId('powered-by-badge');
    expect(badge.className).not.toContain('text-xs');
    rerender(<PoweredByBadge brandName="Test" compact={true} />);
    const badgeCompact = screen.getByTestId('powered-by-badge');
    expect(badgeCompact.className).toContain('text-xs');
  });
});
