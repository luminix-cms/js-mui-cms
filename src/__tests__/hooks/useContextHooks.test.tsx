import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import DialogContext from '../../contexts/DialogContext';
import NotificationContext from '../../contexts/NotificationContext';
import TableContext from '../../contexts/TableContext';
import ModelContext from '../../contexts/ModelContext';
import useHasSearch from '../../hooks/useHasSearch';
import useHasBackButton from '../../hooks/useHasBackButton';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import usePageTitle from '../../hooks/usePageTitle';
import useDialog from '../../hooks/useDialog';
import useNotify from '../../hooks/useNotify';
import useNotifications from '../../hooks/useNotifications';
import useTable from '../../hooks/useTable';
import useCurrentModel from '../../hooks/useCurrentModel';

vi.mock('@luminix/core', () => ({
    collect: vi.fn(() => ({ count: () => 0, all: () => [] })),
    ModelType: class {},
}));

const mockLayoutValue = (overrides = {}) => ({
    open: false,
    setOpen: vi.fn(),
    layout: {},
    isBreakpointUp: false,
    currentPage: '',
    setCurrentPage: vi.fn(),
    showSearch: false,
    setShowSearch: vi.fn(),
    showBackButton: false,
    setShowBackButton: vi.fn(),
    ...overrides,
});

const mockNotificationValue = (overrides = {}) => ({
    isOpen: false,
    notify: vi.fn(),
    dismissNotification: vi.fn(),
    notifications: [],
    current: undefined,
    displacement: '8px',
    setDisplacement: vi.fn(),
    ...overrides,
});

describe('useHasSearch', () => {
    it('returns showSearch from LayoutContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(LayoutContext.Provider, { value: mockLayoutValue({ showSearch: true }) }, children);
        const { result } = renderHook(() => useHasSearch(), { wrapper });
        expect(result.current).toBe(true);
    });

    it('returns false when showSearch is false', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(LayoutContext.Provider, { value: mockLayoutValue({ showSearch: false }) }, children);
        const { result } = renderHook(() => useHasSearch(), { wrapper });
        expect(result.current).toBe(false);
    });
});

describe('useHasBackButton', () => {
    it('returns showBackButton from LayoutContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(LayoutContext.Provider, { value: mockLayoutValue({ showBackButton: true }) }, children);
        const { result } = renderHook(() => useHasBackButton(), { wrapper });
        expect(result.current).toBe(true);
    });
});

describe('useIsDesktopMode', () => {
    it('returns isBreakpointUp from LayoutContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(LayoutContext.Provider, { value: mockLayoutValue({ isBreakpointUp: true }) }, children);
        const { result } = renderHook(() => useIsDesktopMode(), { wrapper });
        expect(result.current).toBe(true);
    });
});

describe('usePageTitle', () => {
    it('returns currentPage from LayoutContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(LayoutContext.Provider, { value: mockLayoutValue({ currentPage: 'Users' }) }, children);
        const { result } = renderHook(() => usePageTitle(), { wrapper });
        expect(result.current).toBe('Users');
    });
});

describe('useDialog', () => {
    it('returns the dialog function from DialogContext', () => {
        const dialogFn = vi.fn();
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(DialogContext.Provider, {
                value: { isOpen: false, dialog: dialogFn, dismissDialog: vi.fn(), current: undefined },
            }, children);
        const { result } = renderHook(() => useDialog(), { wrapper });
        expect(result.current).toBe(dialogFn);
    });
});

describe('useNotify', () => {
    it('returns the notify function from NotificationContext', () => {
        const notifyFn = vi.fn();
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(NotificationContext.Provider, { value: mockNotificationValue({ notify: notifyFn }) }, children);
        const { result } = renderHook(() => useNotify(), { wrapper });
        expect(result.current).toBe(notifyFn);
    });
});

describe('useNotifications', () => {
    it('returns the full NotificationContext value', () => {
        const contextValue = mockNotificationValue();
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(NotificationContext.Provider, { value: contextValue }, children);
        const { result } = renderHook(() => useNotifications(), { wrapper });
        expect(result.current).toBe(contextValue);
    });
});

describe('useTable', () => {
    it('returns the full TableContext value', () => {
        const tableValue = {
            columns: [],
            columnCount: 0,
            selected: { count: () => 0 } as never,
            massActions: [],
            error: new Error(),
            Model: null as never,
        };
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(TableContext.Provider, { value: tableValue }, children);
        const { result } = renderHook(() => useTable(), { wrapper });
        expect(result.current).toBe(tableValue);
    });
});

describe('useCurrentModel', () => {
    it('returns the Model from ModelContext', () => {
        class FakeModel {}
        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(ModelContext.Provider, { value: { Model: FakeModel as never } }, children);
        const { result } = renderHook(() => useCurrentModel(), { wrapper });
        expect(result.current).toBe(FakeModel);
    });
});
