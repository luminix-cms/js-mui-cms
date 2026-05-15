import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useContext } from 'react';
import NotificationProvider from '../../components/providers/NotificationProvider';
import NotificationContext from '../../contexts/NotificationContext';
import { Notification } from '../../types/Notifications';

const _state = vi.hoisted(() => ({ notifications: null as import('@luminix/support').Collection<Notification> | null }));

vi.mock('@luminix/core', async () => {
    const { Collection } = await import('@luminix/support');
    return {
        collect: vi.fn((items: unknown[]) => {
            _state.notifications = new Collection(items as Notification[]);
            return _state.notifications;
        }),
    };
});

function renderWithCapture() {
    let ctx!: ReturnType<typeof useContext<typeof NotificationContext>>;

    function Capture() {
        ctx = useContext(NotificationContext);
        return null;
    }

    render(
        <NotificationProvider>
            <Capture />
        </NotificationProvider>
    );

    return () => ctx;
}

async function advanceAndFlush(ms = 100) {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(ms);
    });
}

describe('NotificationProvider', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        _state.notifications?.splice(0, _state.notifications.count());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('isOpen is false initially with no notifications', () => {
        const getCtx = renderWithCapture();
        expect(getCtx().isOpen).toBe(false);
        expect(getCtx().current).toBeUndefined();
    });

    it('notify() adds a notification to the queue', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('Hello world');
        });
        expect(getCtx().notifications).toHaveLength(1);
    });

    it('current becomes the first notification after 100ms', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First message');
        });
        await advanceAndFlush(100);
        expect(getCtx().isOpen).toBe(true);
        expect(getCtx().current?.message).toBe('First message');
    });

    it('notify() accepts a Notification object with severity', async () => {
        const getCtx = renderWithCapture();
        const notification: Notification = { message: 'Error occurred', severity: 'error' };
        await act(async () => {
            getCtx().notify(notification);
        });
        await advanceAndFlush(100);
        expect(getCtx().current?.severity).toBe('error');
    });

    it('dismissNotification closes the current notification', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('Dismiss me');
        });
        await advanceAndFlush(100);
        expect(getCtx().isOpen).toBe(true);

        await act(async () => {
            getCtx().dismissNotification();
        });
        expect(getCtx().isOpen).toBe(false);
    });

    it('displacement can be changed via setDisplacement', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().setDisplacement('40px');
        });
        expect(getCtx().displacement).toBe('40px');
    });

    it('processes multiple notifications in FIFO order', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First');
            getCtx().notify('Second');
        });
        await advanceAndFlush(100);
        expect(getCtx().current?.message).toBe('First');

        await act(async () => {
            getCtx().dismissNotification();
        });
        await advanceAndFlush(100);
        expect(getCtx().current?.message).toBe('Second');
    });
});
