import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import MenuButton from '../../components/Layout/AppBar/MenuButton';

function makeLayoutValue(setOpen = vi.fn()) {
    return {
        open: false,
        setOpen,
        layout: {},
        isBreakpointUp: false,
        currentPage: '',
        setCurrentPage: vi.fn(),
        showSearch: false,
        setShowSearch: vi.fn(),
        showBackButton: false,
        setShowBackButton: vi.fn(),
    };
}

describe('MenuButton', () => {
    it('renders a button with aria-label "open drawer"', () => {
        render(
            <LayoutContext.Provider value={makeLayoutValue()}>
                <MenuButton />
            </LayoutContext.Provider>
        );
        expect(screen.getByRole('button', { name: /open drawer/i })).toBeInTheDocument();
    });

    it('calls setOpen(true) when clicked', async () => {
        const setOpen = vi.fn();
        render(
            <LayoutContext.Provider value={makeLayoutValue(setOpen)}>
                <MenuButton />
            </LayoutContext.Provider>
        );
        await act(async () => {
            screen.getByRole('button', { name: /open drawer/i }).click();
        });
        expect(setOpen).toHaveBeenCalledWith(true);
    });

    it('renders a Menu icon inside the button', () => {
        render(
            <LayoutContext.Provider value={makeLayoutValue()}>
                <MenuButton />
            </LayoutContext.Provider>
        );
        const button = screen.getByRole('button', { name: /open drawer/i });
        expect(button.querySelector('svg')).toBeTruthy();
    });
});
