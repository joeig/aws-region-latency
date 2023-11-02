import { expect, test, vi } from 'vitest';
import { newLatencyMeter } from './latencyMeter';

test('measure() works with the correct top-level domain', async () => {
    const fetchSpy = vi.fn();
    const latencyMeter = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now: vi.fn().mockReturnValue(100) } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%',
        30_000
    );

    await latencyMeter.measure('eu-west-1');

    expect(fetchSpy).toHaveBeenCalledWith('https://localhost.com', expect.anything());
});

test('measure() works with the correct top-level domain (Chinese regions)', async () => {
    const fetchSpy = vi.fn();
    const { measure } = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now: vi.fn().mockReturnValue(100) } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%',
        30_000
    );

    await measure('cn-north-1');

    expect(fetchSpy).toHaveBeenCalledWith('https://localhost.com.cn', expect.anything());
});

test('measure() returns the correct latency in milliseconds', async () => {
    const fetchSpy = vi.fn();
    const now = vi.fn();
    now.mockReturnValueOnce(100);
    now.mockReturnValueOnce(142);
    const { measure } = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%:1234/%REGION%/',
        30_000
    );

    expect(await measure('eu-west-1')).toBe(42);
    expect(fetchSpy).toHaveBeenCalledWith('https://localhost.com:1234/eu-west-1/', expect.anything());
});
