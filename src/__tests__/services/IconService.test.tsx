import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import IconService from '../../services/IconService';

vi.mock('@luminix/core', () => ({
    Model: { reducer: vi.fn() },
}));

const FooIcon = () => React.createElement('svg', null, 'foo');
const BarIcon = () => React.createElement('svg', null, 'bar');

let service: IconService;

beforeEach(() => {
    service = new IconService();
});

describe('IconService constructor', () => {
    it('instantiates without throwing', () => {
        expect(service).toBeInstanceOf(IconService);
    });
});

describe('IconService.registerIcon', () => {
    it('registers a single icon by name and component', () => {
        service.registerIcon('FooIcon', FooIcon);
        expect(service.all()).toContain('FooIcon');
    });

    it('registers multiple icons from an object map', () => {
        service.registerIcon({ FooIcon, BarIcon });
        expect(service.all()).toContain('FooIcon');
        expect(service.all()).toContain('BarIcon');
    });
});

describe('IconService.make', () => {
    it('returns the component registered under the given name', () => {
        service.registerIcon('FooIcon', FooIcon);
        expect(service.make('FooIcon')).toBe(FooIcon);
    });
});

describe('IconService.render', () => {
    it('returns null when make returns falsy (spied)', () => {
        vi.spyOn(service, 'make').mockReturnValue(undefined as any);
        expect(service.render('NonExistent')).toBeNull();
    });

    it('returns a React element when the icon exists', () => {
        service.registerIcon('FooIcon', FooIcon);
        const result = service.render('FooIcon');
        expect(React.isValidElement(result)).toBe(true);
    });

    it('passes props to the rendered icon', () => {
        service.registerIcon('FooIcon', FooIcon);
        const result = service.render('FooIcon', { 'data-testid': 'foo' }) as React.ReactElement;
        expect(result.props['data-testid']).toBe('foo');
    });
});

describe('IconService.all', () => {
    it('returns empty array before any icons are registered', () => {
        expect(service.all()).toEqual([]);
    });

    it('returns names of all registered icons', () => {
        service.registerIcon('A', FooIcon);
        service.registerIcon('B', BarIcon);
        expect(service.all()).toEqual(['A', 'B']);
    });
});

describe('IconService.forModel', () => {
    it('calls Model.reducer with the model-specific key', async () => {
        const { Model } = await import('@luminix/core');
        service.forModel('post', 'ArticleIcon');
        expect(Model.reducer).toHaveBeenCalledWith(
            expect.stringContaining('Post'),
            expect.any(Function)
        );
    });

    it('forModel reducer callback creates icon() that renders the given icon', async () => {
        const { Model } = await import('@luminix/core');
        vi.clearAllMocks();
        const fresh = new IconService();
        fresh.registerIcon('ArticleIcon', FooIcon);
        fresh.forModel('post', 'ArticleIcon');
        const calls = (Model.reducer as any).mock.calls;
        const forModelCall = calls.find((c: any[]) => String(c[0]).toLowerCase().includes('post'));
        const callback = forModelCall[1];
        const Base = class {};
        const Extended = callback(Base);
        expect(React.isValidElement(Extended.icon())).toBe(true);
    });
});

describe('IconService constructor reducer callback', () => {
    it('creates a class with a static icon() returning a rendered element', async () => {
        const { Model } = await import('@luminix/core');
        vi.clearAllMocks();
        const fresh = new IconService();
        fresh.registerIcon('CategoryOutlined', FooIcon);
        const constructorCallback = (Model.reducer as any).mock.calls[0][1];
        const Base = class {};
        const Extended = constructorCallback(Base);
        expect(React.isValidElement(Extended.icon())).toBe(true);
    });
});
