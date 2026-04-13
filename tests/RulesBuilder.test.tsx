import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RulesBuilder } from '../src/components/RulesBuilder';

describe('RulesBuilder', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders without crash', () => {
    render(<RulesBuilder />);
  });

  it('displays empty state when no rules exist', () => {
    render(<RulesBuilder />);
    expect(screen.getByText(/no rules/i)).toBeInTheDocument();
  });

  it('clicking "Add Rule" opens rule creation form', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    expect(screen.getByLabelText(/trigger event/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/threshold/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/action/i)).toBeInTheDocument();
  });

  it('can select a trigger event from dropdown (e.g., "export_count", "session_count")', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    const triggerSelect = screen.getByLabelText(/trigger event/i);
    expect(triggerSelect).toBeInTheDocument();
    fireEvent.change(triggerSelect, { target: { value: 'export_count' } });
    expect(triggerSelect).toHaveValue('export_count');
  });

  it('can set a threshold value for the trigger', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    const thresholdInput = screen.getByLabelText(/threshold/i);
    fireEvent.change(thresholdInput, { target: { value: '10' } });
    expect(thresholdInput).toHaveValue(10);
  });

  it('can select a growth action from dropdown (e.g., "show_referral", "show_badge")', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    const actionSelect = screen.getByLabelText(/action/i);
    fireEvent.change(actionSelect, { target: { value: 'show_referral' } });
    expect(actionSelect).toHaveValue('show_referral');
  });

  it('saving a rule adds it to the rules list', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    fireEvent.change(screen.getByLabelText(/trigger event/i), { target: { value: 'export_count' } });
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/action/i), { target: { value: 'show_referral' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    // export_count appears in both the rule card and JSON output
    expect(screen.getAllByText(/export_count/).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/no rules/)).not.toBeInTheDocument();
  });

  it('can delete an existing rule', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    fireEvent.change(screen.getByLabelText(/trigger event/i), { target: { value: 'export_count' } });
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/action/i), { target: { value: 'show_referral' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.getByText(/no rules/i)).toBeInTheDocument();
  });

  it('rules persist to localStorage and reload on page refresh', () => {
    const { unmount } = render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    fireEvent.change(screen.getByLabelText(/trigger event/i), { target: { value: 'export_count' } });
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/action/i), { target: { value: 'show_referral' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Verify localStorage has the data
    const stored = window.localStorage.getItem('loopforge-rules');
    expect(stored).not.toBeNull();

    // Unmount and remount to simulate page refresh
    unmount();
    render(<RulesBuilder />);
    expect(screen.getAllByText(/export_count/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders JSON config output panel reflecting current rules', () => {
    render(<RulesBuilder />);
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    fireEvent.change(screen.getByLabelText(/trigger event/i), { target: { value: 'export_count' } });
    fireEvent.change(screen.getByLabelText(/threshold/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/action/i), { target: { value: 'show_referral' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    const jsonPanel = screen.getByTestId('json-config-output');
    expect(jsonPanel).toBeInTheDocument();
    const parsed = JSON.parse(jsonPanel.textContent || '{}');
    expect(parsed.rules).toBeDefined();
    expect(parsed.rules.length).toBeGreaterThan(0);
  });
});
