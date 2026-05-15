import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ShrinkedCell from '../../components/ModelIndex/Table/ShrinkedCell';

describe('ShrinkedCell', () => {
    it('renders children inside a table cell', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <ShrinkedCell>
                            <span data-testid="content">Click</span>
                        </ShrinkedCell>
                    </tr>
                </tbody>
            </table>
        );
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('renders as a td element', () => {
        const { container } = render(
            <table>
                <tbody>
                    <tr>
                        <ShrinkedCell>text</ShrinkedCell>
                    </tr>
                </tbody>
            </table>
        );
        expect(container.querySelector('td')).toBeInTheDocument();
    });
});
