import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Pagination from '../../components/ModelIndex/Pagination';
import { usePagination } from '@luminix/react';

vi.mock('@luminix/core', () => ({
    ModelPaginatedLink: class {},
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Form: ({ children, onSubmit, preventScrollReset: _p, ...props }: any) =>
            React.createElement('form', { onSubmit, ...props }, children),
    };
});

const basePaginationData = {
    links: {
        first: '/users?page=1',
        prev: null,
        next: '/users?page=2',
        last: '/users?page=5',
    },
    meta: {
        current_page: 1,
        last_page: 5,
        per_page: 15,
        links: [
            { url: '/users?page=1', label: '1', active: true },
            { url: '/users?page=2', label: '2', active: false },
            { url: '/users?page=3', label: '3', active: false },
        ],
    },
    data: [],
    refresh: vi.fn(),
    error: null,
    loading: false,
};

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        usePagination: vi.fn(() => basePaginationData),
    };
});

function renderPagination(variant?: 'default' | 'compact') {
    render(
        <MemoryRouter>
            <Pagination variant={variant} />
        </MemoryRouter>
    );
}

describe('Pagination', () => {
    it('default variant renders numbered page buttons', () => {
        renderPagination('default');
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('compact variant renders the page number text field', () => {
        renderPagination('compact');
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('compact variant renders navigation buttons', () => {
        renderPagination('compact');
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('default variant is used when no variant prop is provided', () => {
        renderPagination();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('compact variant disables the page field when there is only one page', () => {
        vi.mocked(usePagination).mockReturnValueOnce({
            ...basePaginationData,
            meta: { ...basePaginationData.meta, last_page: 1, current_page: 1 },
        } as never);
        renderPagination('compact');
        const input = screen.getByRole('spinbutton');
        expect(input).toBeDisabled();
    });
});
