import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ModelProvider from '../../components/providers/ModelProvider';
import ModelContext from '../../contexts/ModelContext';
import { useContext } from 'react';

vi.mock('@luminix/core', () => ({
    ModelType: class {},
}));

class FakeModel {
    static plural() { return 'Items'; }
    static singular() { return 'Item'; }
}

describe('ModelProvider', () => {
    it('renders children', () => {
        render(
            <ModelProvider Model={FakeModel as never}>
                <span data-testid="child">Hello</span>
            </ModelProvider>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('provides Model via ModelContext', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ModelProvider Model={FakeModel as never}>{children}</ModelProvider>
        );
        const { result } = renderHook(() => useContext(ModelContext), { wrapper });
        expect(result.current.Model).toBe(FakeModel);
    });

    it('updates context when Model prop changes', () => {
        class OtherModel {
            static plural() { return 'Others'; }
        }

        const { rerender } = render(
            <ModelProvider Model={FakeModel as never}>
                <span>test</span>
            </ModelProvider>
        );

        rerender(
            <ModelProvider Model={OtherModel as never}>
                <span>test</span>
            </ModelProvider>
        );
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
