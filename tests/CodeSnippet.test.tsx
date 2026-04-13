import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeSnippet } from '../src/components/CodeSnippet';

describe('CodeSnippet', () => {
  const sampleCode = `import { ReferralWidget } from '@loopforge/react';\n\n<ReferralWidget referralCode="ABC" />`;

  it('renders without crash', () => {
    render(<CodeSnippet code={sampleCode} />);
  });

  it('displays syntax-highlighted code block', () => {
    render(<CodeSnippet code={sampleCode} />);
    expect(screen.getByText(/@loopforge\/react/)).toBeInTheDocument();
  });

  it('clicking copy button copies code to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CodeSnippet code={sampleCode} />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith(sampleCode);
  });

  it('shows "Copied!" feedback after copy action', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CodeSnippet code={sampleCode} />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });
});
