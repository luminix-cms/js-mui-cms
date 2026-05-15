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
});
