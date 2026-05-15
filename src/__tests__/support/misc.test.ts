import { describe, it, expect, vi, afterEach } from 'vitest';
import { sleep, isSet } from '../../support/misc';

afterEach(() => {
    vi.useRealTimers();
});

describe('sleep', () => {
    it('resolves after the given duration', async () => {
        vi.useFakeTimers();
        const promise = sleep(200);
        vi.advanceTimersByTime(200);
        await expect(promise).resolves.toBeUndefined();
    });

    it('does not resolve before the duration', () => {
        vi.useFakeTimers();
        let resolved = false;
        sleep(500).then(() => { resolved = true; });
        vi.advanceTimersByTime(499);
        expect(resolved).toBe(false);
    });
});

describe('isSet', () => {
    it('returns false for undefined', () => {
        expect(isSet(undefined)).toBe(false);
    });

    it('returns false for null', () => {
        expect(isSet(null)).toBe(false);
    });

    it('returns false for empty object', () => {
        expect(isSet({})).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isSet('')).toBe(false);
    });

    it('returns false for empty array', () => {
        expect(isSet([])).toBe(false);
    });

    it('returns true for a non-empty string', () => {
        expect(isSet('hello')).toBe(true);
    });

    it('returns true for a non-empty object', () => {
        expect(isSet({ a: 1 })).toBe(true);
    });

    it('returns true for a non-empty array', () => {
        expect(isSet([1, 2])).toBe(true);
    });

});
