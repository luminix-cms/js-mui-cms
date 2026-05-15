import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import routes from '../routes';

vi.mock('@luminix/core', () => ({
    app: vi.fn(),
    config: vi.fn((_key: string, fallback?: unknown) => fallback),
}));

vi.mock('@mui/material', () => ({
    useMediaQuery: vi.fn(() => false),
}));

vi.mock('@luminix/react', () => ({
    PaginationProvider: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

vi.mock('../components/providers/LayoutProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

vi.mock('../components/providers/ModelProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

vi.mock('../components/providers/DialogProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

vi.mock('../components/providers/NotificationProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
}));

const MockLayout = () => null;
const MockDashboard = () => null;
const MockModelIndex = () => null;
const MockModelItem = (_props: { create?: boolean }) => null;

const components = {
    Layout: MockLayout,
    Dashboard: MockDashboard,
    ModelIndex: MockModelIndex,
    ModelItem: MockModelItem,
};

describe('routes', () => {
    it('returns an array with one root route entry', () => {
        const result = routes([], components, {});
        expect(result).toHaveLength(1);
    });

    it('root route has an element (LayoutProviderStack wrapper)', () => {
        const result = routes([], components, {});
        expect(result[0].element).toBeDefined();
    });

    it('root route has children array', () => {
        const result = routes([], components, {});
        expect(Array.isArray(result[0].children)).toBe(true);
    });

    it('includes dashboard route as first child', () => {
        const result = routes([], components, {});
        const children = result[0].children ?? [];
        const dashboard = children.find(r => r.path === '/');
        expect(dashboard).toBeDefined();
        expect(dashboard?.name).toBe('luminix.cms.dashboard');
    });

    it('generates three routes per model (index, create, show)', () => {
        const MockModel = {
            plural: vi.fn(() => 'Users'),
            query: vi.fn(),
        };

        const result = routes([], components, { user: MockModel as never });
        const children = result[0].children ?? [];
        const modelRoutes = children.filter(r => r.path?.includes('users'));
        expect(modelRoutes).toHaveLength(3);
    });

    it('model routes have correct names', () => {
        const MockModel = {
            plural: vi.fn(() => 'Posts'),
            query: vi.fn(),
        };

        const result = routes([], components, { post: MockModel as never });
        const children = result[0].children ?? [];
        const names = children.map(r => r.name).filter(Boolean);
        expect(names).toContain('luminix.cms.dashboard');
        expect(names).toContain('luminix.cms.post.index');
        expect(names).toContain('luminix.cms.post.create');
        expect(names).toContain('luminix.cms.post.show');
    });

    it('model index route path uses kebab-cased plural model name', () => {
        const MockModel = {
            plural: vi.fn(() => 'Blog Posts'),
            query: vi.fn(),
        };

        const result = routes([], components, { blogPost: MockModel as never });
        const children = result[0].children ?? [];
        const indexRoute = children.find(r => r.name === 'luminix.cms.blogPost.index');
        expect(indexRoute?.path).toBe('/blog-posts');
    });

    it('renders LayoutProviderStack element without errors', () => {
        const result = routes([], components, {});
        expect(() => {
            render(
                <MemoryRouter>
                    {result[0].element as React.ReactElement}
                </MemoryRouter>
            );
        }).not.toThrow();
    });

    it('handles multiple models', () => {
        const MockUser = { plural: vi.fn(() => 'Users'), query: vi.fn() };
        const MockPost = { plural: vi.fn(() => 'Posts'), query: vi.fn() };

        const result = routes([], components, {
            user: MockUser as never,
            post: MockPost as never,
        });
        const children = result[0].children ?? [];
        expect(children).toHaveLength(7); // 1 dashboard + 3 user routes + 3 post routes
    });
});
