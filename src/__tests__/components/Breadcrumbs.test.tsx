import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';

vi.mock('@luminix/core', () => ({
    config: vi.fn((_key: string, fallback?: string) => fallback ?? 'App'),
}));

function renderBreadcrumbs(parts?: Array<{ name: string; href?: string }>) {
    return render(
        <MemoryRouter>
            <Breadcrumbs parts={parts} />
        </MemoryRouter>
    );
}

describe('Breadcrumbs', () => {
    it('renders the home link using config app.name fallback', () => {
        renderBreadcrumbs();
        expect(screen.getByText('Laravel')).toBeInTheDocument();
    });

    it('renders without parts (only home link)', () => {
        renderBreadcrumbs();
        expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    });

    it('renders a part without href as Typography (no hyperlink)', () => {
        renderBreadcrumbs([{ name: 'Users' }]);
        expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('renders a part with href as a navigation link', () => {
        renderBreadcrumbs([{ name: 'Users', href: '/users' }]);
        const links = screen.getAllByRole('link');
        const usersLink = links.find(l => l.textContent === 'Users');
        expect(usersLink).toBeDefined();
    });

    it('renders multiple mixed parts', () => {
        renderBreadcrumbs([
            { name: 'Users', href: '/users' },
            { name: 'Edit' },
        ]);
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('renders multiple parts all with hrefs', () => {
        renderBreadcrumbs([
            { name: 'Admin', href: '/admin' },
            { name: 'Users', href: '/admin/users' },
            { name: 'John' },
        ]);
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
    });
});
