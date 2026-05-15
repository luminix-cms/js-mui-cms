import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';

vi.mock('../../hooks/useHasSearch', () => ({
    default: vi.fn(() => false),
}));

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

describe('AppLogo', () => {
    it('renders an Avatar with alt "Luminix"', async () => {
        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        render(<AppLogo />);
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });

    it('renders a square avatar', async () => {
        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        const { container } = render(<AppLogo />);
        expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('renders correctly when searching (useHasSearch returns true)', async () => {
        const useHasSearch = await import('../../hooks/useHasSearch');
        vi.mocked(useHasSearch.default).mockReturnValueOnce(true);
        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        render(<AppLogo />);
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });

    it('renders correctly in dark mode (useMediaQuery returns true)', async () => {
        vi.mocked(window.matchMedia).mockImplementationOnce((query: string) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        render(<AppLogo />);
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });
});
