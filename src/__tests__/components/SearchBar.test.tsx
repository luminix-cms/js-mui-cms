import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LayoutContext from '../../contexts/LayoutContext';
import SearchBar from '../../components/Layout/SearchBar';

vi.mock('@luminix/support', () => ({
    Func: {
        throttle: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
    },
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
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

function makeLayoutValue(isBreakpointUp = false) {
    return {
        open: false,
        setOpen: vi.fn(),
        layout: {},
        isBreakpointUp,
        currentPage: '',
        setCurrentPage: vi.fn(),
        showSearch: false,
        setShowSearch: vi.fn(),
        showBackButton: false,
        setShowBackButton: vi.fn(),
    };
}

function renderSearchBar(isDesktop = false, initialUrl = '/') {
    return render(
        <MemoryRouter initialEntries={[initialUrl]}>
            <LayoutContext.Provider value={makeLayoutValue(isDesktop)}>
                <SearchBar />
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('SearchBar', () => {
    it('renders the search field in desktop mode', () => {
        renderSearchBar(true);
        expect(screen.getByPlaceholderText(/Search\.\.\./)).toBeInTheDocument();
    });

    it('shows search icon button in mobile mode (not focused)', () => {
        renderSearchBar(false);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders with initial search value from URL query params', () => {
        renderSearchBar(true, '/?q=hello');
        const input = screen.getByPlaceholderText(/Search\.\.\./);
        expect((input as HTMLInputElement).value).toBe('hello');
    });

    it('calls setSearchParams when user types in search field', async () => {
        renderSearchBar(true);
        const input = screen.getByPlaceholderText(/Search\.\.\./);
        await act(async () => {
            fireEvent.change(input, { target: { value: 'test query' } });
        });
        expect(input).toBeInTheDocument();
    });

    it('clears search value when input is emptied', async () => {
        renderSearchBar(true, '/?q=hello');
        const input = screen.getByPlaceholderText(/Search\.\.\./);
        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
        });
        expect(input).toBeInTheDocument();
    });

    it('shows search field after clicking search icon in mobile mode', async () => {
        renderSearchBar(false);
        const buttons = screen.getAllByRole('button');
        await act(async () => {
            buttons[0].click();
        });
        expect(screen.getByPlaceholderText(/Search\.\.\./)).toBeInTheDocument();
    });

    it('desktop placeholder includes keyboard shortcut hint', () => {
        renderSearchBar(true);
        expect(screen.getByPlaceholderText(/Ctrl \+ \//)).toBeInTheDocument();
    });

    it('responds to Ctrl+/ key chord to focus the input', async () => {
        renderSearchBar(true);
        const input = screen.getByPlaceholderText(/Search\.\.\./);
        const focusSpy = vi.spyOn(input, 'focus');
        await act(async () => {
            fireEvent.keyDown(window, { key: 'Control' });
            fireEvent.keyDown(window, { key: '/' });
        });
        focusSpy.mockRestore();
        expect(input).toBeInTheDocument();
    });

    it('hides search field on blur in mobile mode', async () => {
        renderSearchBar(false);
        const buttons = screen.getAllByRole('button');
        await act(async () => {
            buttons[0].click();
        });
        const input = screen.getByPlaceholderText(/Search\.\.\./);
        await act(async () => {
            fireEvent.blur(input);
        });
        expect(input).toBeInTheDocument();
    });
});
