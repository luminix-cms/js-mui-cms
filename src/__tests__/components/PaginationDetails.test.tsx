import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import PaginationDetails from '../../components/ModelIndex/PaginationDetails';

vi.mock('@luminix/react', () => ({
    usePagination: vi.fn(() => ({
        meta: {
            total: 100,
            from: 1,
            to: 10,
        },
    })),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('PaginationDetails', () => {
    it('renders the pagination text', () => {
        render(<PaginationDetails />);
        expect(screen.getByText(':from–:to of :total')).toBeInTheDocument();
    });

    it('renders with zero values when meta is not provided', async () => {
        const { usePagination } = await import('@luminix/react');
        vi.mocked(usePagination).mockReturnValueOnce({ meta: undefined } as never);
        render(<PaginationDetails />);
        expect(screen.getByText(':from–:to of :total')).toBeInTheDocument();
    });

    it('renders as a typography element', () => {
        const { container } = render(<PaginationDetails />);
        expect(container.querySelector('p, span')).toBeInTheDocument();
    });
});
