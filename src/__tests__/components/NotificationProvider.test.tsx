import { render, act, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useContext } from 'react';
import NotificationProvider from '../../components/providers/NotificationProvider';
import NotificationContext from '../../contexts/NotificationContext';
import { Notification, NotificationActionCallbackEvent } from '../../types/Notifications';

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

    it('current becomes the notification immediately, with no delay', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First message');
        });
        expect(getCtx().isOpen).toBe(true);
        expect(getCtx().current?.message).toBe('First message');
    });

    it('notify() accepts a Notification object with severity', async () => {
        const getCtx = renderWithCapture();
        const notification: Notification = { message: 'Error occurred', severity: 'error' };
        await act(async () => {
            getCtx().notify(notification);
        });
        expect(getCtx().current?.severity).toBe('error');
    });

    it('dismissNotification closes the current notification', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('Dismiss me');
        });
        expect(getCtx().isOpen).toBe(true);

        await act(async () => {
            getCtx().dismissNotification();
        });
        expect(getCtx().isOpen).toBe(false);
        expect(getCtx().notifications).toHaveLength(0);
    });

    it('displacement can be changed via setDisplacement', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().setDisplacement('40px');
        });
        expect(getCtx().displacement).toBe('40px');
    });

    it('replaces the current notification when a new one arrives', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First');
        });
        expect(getCtx().current?.message).toBe('First');

        await act(async () => {
            getCtx().notify('Second');
        });
        expect(getCtx().current?.message).toBe('Second');
        expect(getCtx().notifications).toHaveLength(1);
    });

    it('keeps only the last notification when many arrive in the same tick', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First');
            getCtx().notify('Second');
            getCtx().notify('Third');
        });
        expect(getCtx().current?.message).toBe('Third');
        expect(getCtx().notifications).toHaveLength(1);
    });

    it('restarts the auto hide timer when a notification is replaced', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().notify('First');
        });
        await advanceAndFlush(5000);
        expect(getCtx().isOpen).toBe(true);

        await act(async () => {
            getCtx().notify('Second');
        });
        // 6500ms após a primeira: o timer dela já teria expirado
        await advanceAndFlush(1500);
        expect(getCtx().isOpen).toBe(true);
        expect(getCtx().current?.message).toBe('Second');

        // 6500ms após a substituição: o timer reiniciado já expirou
        await advanceAndFlush(5000);
        expect(getCtx().isOpen).toBe(false);
    });

    it('gives the action callback an event that closes its notification', async () => {
        const getCtx = renderWithCapture();
        const callback = vi.fn((e: NotificationActionCallbackEvent) => e.close());

        await act(async () => {
            getCtx().notify({
                message: 'Item excluído',
                actions: [{ label: 'Desfazer', callback }],
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
        });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(typeof callback.mock.calls[0][0].close).toBe('function');
        expect(getCtx().isOpen).toBe(false);
    });

    it('does not close the current notification when a replaced action closes late', async () => {
        const getCtx = renderWithCapture();
        let close!: () => void;
        const callback = vi.fn((e: NotificationActionCallbackEvent) => {
            close = e.close;
        });

        await act(async () => {
            getCtx().notify({
                message: 'Primeira',
                actions: [{ label: 'Desfazer', callback }],
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
        });

        await act(async () => {
            getCtx().notify('Segunda');
        });

        await act(async () => {
            close();
        });

        expect(getCtx().isOpen).toBe(true);
        expect(getCtx().current?.message).toBe('Segunda');
    });

    it('does not dismiss the notification when an action does not close it', async () => {
        const getCtx = renderWithCapture();
        const callback = vi.fn();

        await act(async () => {
            getCtx().notify({
                message: 'Item excluído',
                actions: [{ label: 'Desfazer', callback }],
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
        });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(getCtx().isOpen).toBe(true);
    });
});
