import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import React from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';

vi.mock('../../hooks/useHasSearch', () => ({
    default: vi.fn(() => false),
}));

const brand: Record<string, unknown> = {};

vi.mock('@luminix/core', () => ({
    config: vi.fn((key: string, fallback?: unknown) => brand[key] ?? fallback),
}));

let prefersDark = false;

beforeEach(() => {
    Object.keys(brand).forEach((key) => delete brand[key]);
    prefersDark = false;
});

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: prefersDark && query.includes('dark'),
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

async function renderLogo(mode: PaletteMode = 'light') {
    const { default: AppLogo } = await import('../../components/Layout/AppLogo');
    return render(
        <ThemeProvider theme={createTheme({ palette: { mode } })}>
            <AppLogo />
        </ThemeProvider>
    );
}

describe('AppLogo', () => {
    it('renders an Avatar with alt "Luminix"', async () => {
        await renderLogo();
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });

    it('renders a square avatar', async () => {
        const { container } = await renderLogo();
        expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('renders correctly when searching (useHasSearch returns true)', async () => {
        const useHasSearch = await import('../../hooks/useHasSearch');
        vi.mocked(useHasSearch.default).mockReturnValueOnce(true);
        await renderLogo();
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });

    it('uses the brand the host application configured', async () => {
        brand['luminix.admin.brand.name'] = 'Acme';
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';

        await renderLogo();

        const img = screen.getByAltText('Acme') as HTMLImageElement;
        expect(img.getAttribute('src')).toBe('/brand/acme.svg');
    });

    it('uses the dark variation when the theme is dark', async () => {
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';
        brand['luminix.admin.brand.logo_dark'] = '/brand/acme-dark.svg';

        const { container } = await renderLogo('dark');

        expect(container.querySelector('img')?.getAttribute('src')).toBe('/brand/acme-dark.svg');
    });

    it('reuses the single logo when no dark variation is given', async () => {
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';

        const { container } = await renderLogo('dark');

        expect(container.querySelector('img')?.getAttribute('src')).toBe('/brand/acme.svg');
    });

    it('follows the theme mode instead of the OS preference', async () => {
        // <LuminixCms colorScheme="light" /> must win over an OS set to dark.
        prefersDark = true;
        brand['luminix.admin.brand.logo'] = '/brand/acme.svg';
        brand['luminix.admin.brand.logo_dark'] = '/brand/acme-dark.svg';

        const { container } = await renderLogo('light');

        expect(container.querySelector('img')?.getAttribute('src')).toBe('/brand/acme.svg');
    });

    it('renders correctly in dark mode', async () => {
        await renderLogo('dark');
        expect(screen.getByAltText('Luminix')).toBeInTheDocument();
    });
});
