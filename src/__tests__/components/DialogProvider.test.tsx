import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useContext } from 'react';
import DialogProvider from '../../components/providers/DialogProvider';
import DialogContext from '../../contexts/DialogContext';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

function renderWithCapture() {
    let ctx!: ReturnType<typeof useContext<typeof DialogContext>>;

    function Capture() {
        ctx = useContext(DialogContext);
        return null;
    }

    render(
        <DialogProvider>
            <Capture />
        </DialogProvider>
    );

    return () => ctx;
}

describe('DialogProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('isOpen is false initially', () => {
        const getCtx = renderWithCapture();
        expect(getCtx().isOpen).toBe(false);
    });

    it('isOpen becomes true after calling dialog()', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().dialog('Hello');
        });
        expect(getCtx().isOpen).toBe(true);
    });

    it('current contains the message after calling dialog()', async () => {
        const getCtx = renderWithCapture();
        await act(async () => {
            getCtx().dialog('Hello from test');
        });
        expect(getCtx().current?.message).toBe('Hello from test');
    });

    it('dialog() resolves true when the confirm button is clicked on a confirm dialog', async () => {
        const getCtx = renderWithCapture();
        let promise: Promise<boolean | string>;
        await act(async () => {
            promise = getCtx().dialog({ message: 'Sure?', type: 'confirm' });
        });

        await act(async () => {
            screen.getByText('Yes').click();
        });

        expect(await promise!).toBe(true);
    });

    it('dialog() resolves false when cancel is clicked on a confirm dialog', async () => {
        const getCtx = renderWithCapture();
        let promise: Promise<boolean | string>;
        await act(async () => {
            promise = getCtx().dialog({ message: 'Sure?', type: 'confirm' });
        });

        await act(async () => {
            screen.getByText('No').click();
        });

        expect(await promise!).toBe(false);
    });

    it('dialog() resolves the typed value for a prompt dialog', async () => {
        const getCtx = renderWithCapture();
        let promise: Promise<boolean | string>;
        await act(async () => {
            promise = getCtx().dialog({ message: 'Name?', type: 'prompt' });
        });

        const input = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'Bruno');

        await act(async () => {
            screen.getByText('Ok').click();
        });

        expect(await promise!).toBe('Bruno');
    });

    it('dismissDialog closes the dialog and resolves false', async () => {
        const getCtx = renderWithCapture();
        let promise: Promise<boolean | string>;
        await act(async () => {
            promise = getCtx().dialog({ message: 'Alert!', type: 'alert' });
        });

        expect(getCtx().isOpen).toBe(true);

        await act(async () => {
            getCtx().dismissDialog();
        });

        await waitFor(() => {
            expect(getCtx().isOpen).toBe(false);
        });

        expect(await promise!).toBe(false);
    });
});
