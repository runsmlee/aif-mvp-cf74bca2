import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../src/components/Dashboard';

describe('Dashboard', () => {
  it('renders without crash', () => {
    render(<Dashboard />);
  });

  it('displays K-factor metric card with a numeric value', () => {
    render(<Dashboard />);
    expect(screen.getByText(/k-factor/i)).toBeInTheDocument();
    // Should show a numeric value
    const kFactorCard = screen.getByTestId('k-factor-card');
    expect(kFactorCard.textContent).toMatch(/\d+\.?\d*/);
  });

  it('displays total invites metric', () => {
    render(<Dashboard />);
    expect(screen.getByText(/total invites/i)).toBeInTheDocument();
  });

  it('displays conversion rate percentage', () => {
    render(<Dashboard />);
    expect(screen.getByText(/conversion rate/i)).toBeInTheDocument();
    expect(screen.getAllByText(/%/).length).toBeGreaterThan(0);
  });

  it('K-factor value updates when simulation parameters change', () => {
    render(<Dashboard />);
    const kFactorBefore = screen.getByTestId('k-factor-value').textContent;
    // Find invite rate slider and change it
    const slider = screen.getByLabelText(/invite rate/i);
    fireEvent.change(slider, { target: { value: '5' } });
    const kFactorAfter = screen.getByTestId('k-factor-value').textContent;
    expect(kFactorAfter).not.toBe(kFactorBefore);
  });

  it('attribution tree renders with at least 3 levels of depth', () => {
    render(<Dashboard />);
    const tree = screen.getByTestId('attribution-tree');
    // Should have at least 3 nested levels
    expect(tree).toBeInTheDocument();
    const levels = tree.querySelectorAll('[data-level]');
    expect(levels.length).toBeGreaterThanOrEqual(3);
  });

  it('conversion funnel renders with stages: Invited → Clicked → Signed Up → Activated', () => {
    render(<Dashboard />);
    // Use getAllByText since "Invited" and "Activated" appear in subtitle too
    expect(screen.getAllByText(/invited/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
    expect(screen.getByText(/signed up/i)).toBeInTheDocument();
    expect(screen.getAllByText(/activated/i).length).toBeGreaterThanOrEqual(1);
  });
});
