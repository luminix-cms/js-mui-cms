import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BackButton from '../../components/Layout/BackButton';

function renderBackButton(props = {}) {
    return render(
        <MemoryRouter>
            <BackButton {...props} />
        </MemoryRouter>
    );
}

describe('BackButton', () => {
    it('renders a link element with aria-label "back"', () => {
        renderBackButton();
        expect(screen.getByLabelText('back')).toBeInTheDocument();
    });

    it('renders a ChevronLeft icon inside the button', () => {
        renderBackButton();
        const button = screen.getByLabelText('back');
        expect(button).toBeInTheDocument();
        expect(button.querySelector('svg')).toBeTruthy();
    });

    it('accepts and applies additional props', () => {
        renderBackButton({ 'aria-label': 'go back' });
        expect(screen.getByLabelText('go back')).toBeInTheDocument();
    });
});
