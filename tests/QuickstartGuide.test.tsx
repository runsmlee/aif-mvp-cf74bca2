import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QuickstartGuide } from '../src/components/QuickstartGuide';

describe('QuickstartGuide', () => {
  it('renders without crash', () => {
    render(<QuickstartGuide />);
  });

  it('displays framework tabs: Vite, Next.js, CRA', () => {
    render(<QuickstartGuide />);
    expect(screen.getByRole('tab', { name: /vite/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /next\.js/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /cra/i })).toBeInTheDocument();
  });

  it('displays 3 integration steps for each framework', () => {
    render(<QuickstartGuide />);
    expect(screen.getByText(/install the sdk/i)).toBeInTheDocument();
    expect(screen.getByText(/configure the provider/i) || screen.getByText(/create a client provider/i)).toBeTruthy();
  });

  it('switching framework tab updates the guide content', () => {
    render(<QuickstartGuide />);
    // Default is Vite - should show src/main.tsx
    expect(screen.getByText(/src\/main\.tsx/)).toBeInTheDocument();

    // Switch to Next.js
    fireEvent.click(screen.getByRole('tab', { name: /next\.js/i }));
    expect(screen.getByRole('tab', { name: /next\.js/i })).toHaveAttribute('aria-selected', 'true');
    // Next.js guide shows providers.tsx
    expect(screen.getByText(/src\/app\/providers\.tsx/)).toBeInTheDocument();
  });

  it('copy button on steps copies code to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<QuickstartGuide />);
    const copyButtons = screen.getAllByRole('button', { name: /copy step/i });
    await act(async () => {
      fireEvent.click(copyButtons[0]);
    });
    expect(writeText).toHaveBeenCalled();
    const copiedCode = writeText.mock.calls[0][0] as string;
    expect(copiedCode).toContain('npm install');
  });

  it('shows quickstart guide testid', () => {
    render(<QuickstartGuide />);
    expect(screen.getByTestId('quickstart-guide')).toBeInTheDocument();
  });
});
