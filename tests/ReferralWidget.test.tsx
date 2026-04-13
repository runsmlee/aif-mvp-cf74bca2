import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ReferralWidget } from '../src/components/ReferralWidget';

describe('ReferralWidget', () => {
  it('renders without crash', () => {
    render(<ReferralWidget referralCode="ABC123" />);
  });

  it('displays referral link input with copy button', () => {
    render(<ReferralWidget referralCode="ABC123" />);
    expect(screen.getByDisplayValue(/ABC123/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('clicking copy button copies referral link to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ReferralWidget referralCode="ABC123" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('ABC123'));
  });

  it('renders social share icons (Twitter, LinkedIn, Email)', () => {
    render(<ReferralWidget referralCode="ABC123" />);
    expect(screen.getByLabelText(/share on twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share on linkedin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share via email/i)).toBeInTheDocument();
  });

  it('accepts and applies primaryColor prop to style accent elements', () => {
    render(<ReferralWidget referralCode="ABC123" primaryColor="#3B82F6" />);
    const copyButton = screen.getByRole('button', { name: /copy/i });
    expect(copyButton).toHaveStyle({ backgroundColor: '#3B82F6' });
  });

  it('accepts referralCode prop and displays it in the link', () => {
    render(<ReferralWidget referralCode="XYZ789" />);
    const input = screen.getByDisplayValue(/XYZ789/) as HTMLInputElement;
    expect(input.value).toContain('XYZ789');
  });

  it('shows success state when link is copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ReferralWidget referralCode="ABC123" />);
    const copyBtn = screen.getByRole('button', { name: /copy referral link/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    await waitFor(() => {
      expect(copyBtn).toHaveTextContent(/copied/i);
    });
  });
});
