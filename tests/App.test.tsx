import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the playground as the first element in the DOM body', () => {
    const { container } = render(<App />);
    // The first child of the root should be <main> containing the playground
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('MAIN');
    expect(screen.getByTestId('playground')).toBeInTheDocument();
  });

  it('does not render a navigation header above the playground', () => {
    render(<App />);
    // No standalone header/banner element should exist above the playground
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('renders the playground with live preview immediately', () => {
    render(<App />);
    // Playground should be visible immediately — no marketing hero, zero clicks
    expect(screen.getByTestId('playground')).toBeInTheDocument();
    expect(screen.getByTestId('live-preview')).toBeInTheDocument();
  });

  it('renders an h1 with SEO text inside the playground layout', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('K-Factor Calculator');
  });

  it('renders an h2 with component section heading for heading hierarchy', () => {
    render(<App />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(1);
    expect(h2s.some(h => h.textContent?.includes('React Referral Widget Code'))).toBe(true);
  });

  it('renders the interactive K-factor calculator', () => {
    render(<App />);
    expect(screen.getByTestId('kfactor-calculator')).toBeInTheDocument();
  });

  it('renders K-factor formula educational content section', () => {
    render(<App />);
    const formulaHeading = screen.getByRole('heading', { level: 2, name: /k-factor formula/i });
    expect(formulaHeading).toBeInTheDocument();
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
