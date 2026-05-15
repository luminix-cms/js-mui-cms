import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const mockApp = vi.hoisted(() => ({ hasDebugModeEnabled: vi.fn(() => false) }));

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => mockApp),
}));

import ErrorView from '../../views/Error';

describe('Error', () => {
    it('always renders the Ops... heading', () => {
        render(<ErrorView />);
        expect(screen.getByRole('heading', { name: 'Ops...' })).toBeInTheDocument();
    });

    it('always renders the generic message', () => {
        render(<ErrorView />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('hides error details when debug mode is disabled', () => {
        mockApp.hasDebugModeEnabled.mockReturnValue(false);
        render(<ErrorView error={new Error('secret detail')} />);
        expect(screen.queryByText(/secret detail/)).not.toBeInTheDocument();
    });

    it('shows the error message when debug mode is enabled', () => {
        mockApp.hasDebugModeEnabled.mockReturnValue(true);
        render(<ErrorView error={new Error('debug detail')} />);
        expect(screen.getByText(/debug detail/)).toBeInTheDocument();
    });
});
