import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

// Mock lazy imports
vi.mock('../src/components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard-mock">Dashboard</div>,
}));
vi.mock('../src/components/RulesBuilder', () => ({
  RulesBuilder: () => <div data-testid="rules-mock">Rules</div>,
}));
vi.mock('../src/components/QuickstartGuide', () => ({
  QuickstartGuide: () => <div data-testid="quickstart-mock">Quickstart</div>,
}));

describe('App', () => {
  it('renders the app with header containing brand name', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Viralo/i);
  });

  it('renders the playground as the default view with live preview', () => {
    render(<App />);
    // Playground should be visible immediately — no marketing hero
    expect(screen.getByTestId('playground')).toBeInTheDocument();
    expect(screen.getByTestId('live-preview')).toBeInTheDocument();
  });

  it('displays all navigation tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: /playground/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /rules/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /quickstart/i })).toBeInTheDocument();
  });

  it('switching to Dashboard tab renders dashboard content', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /dashboard/i }));
    expect(await screen.findByTestId('dashboard-mock')).toBeInTheDocument();
  });

  it('switching to Rules tab renders rules builder', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /rules/i }));
    expect(await screen.findByTestId('rules-mock')).toBeInTheDocument();
  });

  it('switching to Quickstart tab renders quickstart guide', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /quickstart/i }));
    expect(await screen.findByTestId('quickstart-mock')).toBeInTheDocument();
  });

  it('renders an h1 with the product name', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/Viralo/i);
  });
});
