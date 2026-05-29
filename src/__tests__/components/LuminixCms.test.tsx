import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import LuminixCms from '../../components/LuminixCms';

vi.mock('@luminix/core', () => ({
    AppFacade: class {},
}));

vi.mock('@luminix/react', () => ({
    LuminixProvider: ({ children }: { children: React.ReactNode }) =>
        React.createElement('div', { 'data-testid': 'luminix-provider' }, children),
}));

vi.mock('@mui/material/styles', () => ({
    createTheme: vi.fn((...args: object[]) => Object.assign({}, ...args)),
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

vi.mock('@mui/material', () => ({
    useMediaQuery: vi.fn(() => false),
    CssBaseline: () => null,
}));

vi.mock('../../providers/CmsServiceProvider', () => ({
    default: class MockCmsServiceProvider {},
}));

vi.mock('../../providers/i18NextServiceProvider', () => ({
    default: class MockI18NextServiceProvider {},
}));

beforeAll(() => {
    if (!window.matchMedia) {
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
    }
});

describe('LuminixCms', () => {
    it('renders the LuminixProvider wrapper', () => {
        render(<LuminixCms />);
        expect(screen.getByTestId('luminix-provider')).toBeInTheDocument();
    });

    it('renders children inside LuminixProvider', () => {
        render(
            <LuminixCms>
                <span data-testid="child">Content</span>
            </LuminixCms>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('accepts a custom theme override', () => {
        const customTheme = {
            palette: {
                primary: { main: '#ff0000' },
                secondary: { main: '#00ff00' },
            },
        };
        render(<LuminixCms theme={customTheme} />);
        expect(screen.getByTestId('luminix-provider')).toBeInTheDocument();
    });

    it('accepts additional providers via providers prop', () => {
        class CustomProvider {}
        render(<LuminixCms providers={[CustomProvider as never]} />);
        expect(screen.getByTestId('luminix-provider')).toBeInTheDocument();
    });

    it('renders in dark mode when useMediaQuery returns true', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValueOnce(true);
        render(<LuminixCms />);
        expect(screen.getByTestId('luminix-provider')).toBeInTheDocument();
    });

    it('accepts themeArgs for additional theme configuration', () => {
        render(<LuminixCms themeArgs={[{ typography: { fontSize: 14 } }]} />);
        expect(screen.getByTestId('luminix-provider')).toBeInTheDocument();
    });

    it('uses light mode when colorScheme is "light", regardless of OS preference', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(true); // OS prefers dark
        const { createTheme } = await import('@mui/material/styles');
        render(<LuminixCms colorScheme="light" />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ mode: 'light' }) }),
        );
    });

    it('uses dark mode when colorScheme is "dark", regardless of OS preference', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(false); // OS prefers light
        const { createTheme } = await import('@mui/material/styles');
        render(<LuminixCms colorScheme="dark" />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ mode: 'dark' }) }),
        );
    });

    it('follows OS preference when colorScheme is "auto" (default)', async () => {
        const muiMaterial = await import('@mui/material');
        const { createTheme } = await import('@mui/material/styles');

        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(true);
        render(<LuminixCms colorScheme="auto" />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ mode: 'dark' }) }),
        );
    });

    it('uses darkTheme when colorScheme is "auto" and OS prefers dark', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(true);
        const { createTheme } = await import('@mui/material/styles');
        const darkTheme = { palette: { primary: { main: '#000000' } } };
        render(<LuminixCms colorScheme="auto" darkTheme={darkTheme} />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ primary: { main: '#000000' }, mode: 'dark' }) }),
        );
    });

    it('ignores darkTheme when colorScheme is "auto" and OS prefers light', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(false);
        const { createTheme } = await import('@mui/material/styles');
        const lightTheme = { palette: { primary: { main: '#ffffff' } } };
        const darkTheme = { palette: { primary: { main: '#000000' } } };
        render(<LuminixCms colorScheme="auto" theme={lightTheme} darkTheme={darkTheme} />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ primary: { main: '#ffffff' }, mode: 'light' }) }),
        );
    });

    it('ignores darkTheme when colorScheme is "dark" (use theme prop instead)', async () => {
        const muiMaterial = await import('@mui/material');
        vi.mocked(muiMaterial.useMediaQuery).mockReturnValue(false);
        const { createTheme } = await import('@mui/material/styles');
        const forcedDarkTheme = { palette: { primary: { main: '#aaaaaa' } } };
        const ignoredDarkTheme = { palette: { primary: { main: '#000000' } } };
        render(<LuminixCms colorScheme="dark" theme={forcedDarkTheme} darkTheme={ignoredDarkTheme} />);
        expect(vi.mocked(createTheme)).toHaveBeenCalledWith(
            expect.objectContaining({ palette: expect.objectContaining({ primary: { main: '#aaaaaa' }, mode: 'dark' }) }),
        );
    });
});
