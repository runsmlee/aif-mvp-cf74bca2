import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the app with header containing brand name', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Viralo/i);
  });

  it('renders the playground as the default view with live preview', () => {
    render(<App />);
    // Playground should be visible immediately — no marketing hero, zero clicks
    expect(screen.getByTestId('playground')).toBeInTheDocument();
    expect(screen.getByTestId('live-preview')).toBeInTheDocument();
  });

  it('renders an h1 with the product name', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/Viralo/i);
  });

  it('renders the playground component type tabs (ReferralWidget, InviteGate, PoweredByBadge)', () => {
    render(<App />);
    // These are the playground's internal component tabs, not navigation tabs
    expect(screen.getByRole('tab', { name: /referral/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /invite/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /badge/i })).toBeInTheDocument();
  });

  it('does not render navigation menu tabs (Dashboard, Rules Builder, Quickstart)', () => {
    render(<App />);
    // Root route must show playground directly — no navigation menu
    expect(screen.queryByRole('tab', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /rules/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /quickstart/i })).not.toBeInTheDocument();
  });
});
