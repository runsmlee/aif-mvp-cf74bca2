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
  it('renders the app with header and playground tab active by default', () => {
    render(<App />);
    // Header should contain the brand name
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/Viralo/i);
    expect(header).toHaveTextContent(/Growth as Code/i);
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

  it('renders footer with brand text', () => {
    render(<App />);
    expect(screen.getByText(/Viralo — Growth as Code/i)).toBeInTheDocument();
  });
});
