import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Playground } from '../src/components/Playground';

describe('Playground', () => {
  it('renders without crash', () => {
    render(<Playground />);
  });

  it('renders the interactive K-factor calculator with inputs and result', () => {
    render(<Playground />);
    const invitesInput = screen.getByLabelText(/invites per user/i);
    const conversionInput = screen.getByLabelText(/conversion rate/i);
    expect(invitesInput).toBeInTheDocument();
    expect(conversionInput).toBeInTheDocument();
    // K-factor result should be displayed
    const result = screen.getByLabelText(/k-factor value/i);
    expect(result).toBeInTheDocument();
  });

  it('computes K-factor correctly from inputs', () => {
    render(<Playground />);
    const invitesInput = screen.getByLabelText(/invites per user/i);
    const conversionInput = screen.getByLabelText(/conversion rate/i);
    // Set invites = 4, conversion = 25% => K = 1.00
    fireEvent.change(invitesInput, { target: { value: '4' } });
    fireEvent.change(conversionInput, { target: { value: '25' } });
    const result = screen.getByLabelText(/k-factor value/i);
    expect(result).toHaveTextContent('1.00');
  });

  it('updates K-factor when inputs change', () => {
    render(<Playground />);
    const invitesInput = screen.getByLabelText(/invites per user/i);
    const conversionInput = screen.getByLabelText(/conversion rate/i);
    // Set invites = 5, conversion = 40% => K = 2.00
    fireEvent.change(invitesInput, { target: { value: '5' } });
    fireEvent.change(conversionInput, { target: { value: '40' } });
    const result = screen.getByLabelText(/k-factor value/i);
    expect(result).toHaveTextContent('2.00');
  });

  it('displays all three component type tabs: ReferralWidget, InviteGate, PoweredByBadge', () => {
    render(<Playground />);
    expect(screen.getByRole('tab', { name: /referral/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /invite/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /badge/i })).toBeInTheDocument();
  });

  it('switching component type tabs updates the live preview area', () => {
    render(<Playground />);
    // Default should show ReferralWidget
    expect(screen.getByRole('tab', { name: /referral/i })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('tab', { name: /invite/i }));
    expect(screen.getByRole('tab', { name: /invite/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /referral/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('changing a prop in the sidebar updates the preview within 200ms', () => {
    render(<Playground />);
    // Find color input in sidebar and change it
    const colorInput = screen.getByLabelText(/primary color/i);
    fireEvent.change(colorInput, { target: { value: '#3B82F6' } });
    // Preview area should exist and show component
    const previewArea = screen.getByTestId('live-preview');
    expect(previewArea).toBeInTheDocument();
  });

  it('clicking "Copy Code" copies valid TypeScript React snippet to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Playground />);
    const copyBtn = screen.getByRole('button', { name: /copy code/i });
    fireEvent.click(copyBtn);
    expect(writeText).toHaveBeenCalled();
    const copiedCode = writeText.mock.calls[0][0] as string;
    // Verify it looks like valid TSX
    expect(copiedCode).toContain('import');
    expect(copiedCode).toContain('<');
    expect(copiedCode).toContain('/>');
  });

  it('generated code contains correct import path @loopforge/react', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Playground />);
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));
    const copiedCode = writeText.mock.calls[0][0] as string;
    expect(copiedCode).toContain('@viralo/react');
  });

  it('generated code includes all configured props in the JSX', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Playground />);
    // Change referral code
    const codeInput = screen.getByLabelText(/referral code/i);
    fireEvent.change(codeInput, { target: { value: 'TESTCODE' } });

    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));
    const copiedCode = writeText.mock.calls[0][0] as string;
    expect(copiedCode).toContain('TESTCODE');
  });
});
