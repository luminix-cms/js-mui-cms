import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import React from 'react';

vi.mock('../../hooks/useHasSearch', () => ({
    default: vi.fn(() => false),
}));

const brand: Record<string, unknown> = {};

vi.mock('@luminix/core', () => ({
    config: vi.fn((key: string, fallback?: unknown) => brand[key] ?? fallback),
}));

beforeEach(() => {
    Object.keys(brand).forEach((key) => delete brand[key]);
});

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

    it('uses the brand the host application configured', async () => {
        brand['luminix.admin.brand.name'] = 'Acme';
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';

        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        render(<AppLogo />);

        const img = screen.getByAltText('Acme') as HTMLImageElement;
        expect(img.getAttribute('src')).toBe('/brand/acme.svg');
    });

    it('reuses the single logo when no dark variation is given', async () => {
        // Better than falling back to the Luminix mark for half the users.
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
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';

        const { default: AppLogo } = await import('../../components/Layout/AppLogo');
        const { container } = render(<AppLogo />);

        expect(container.querySelector('img')?.getAttribute('src')).toBe('/brand/acme.svg');
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
