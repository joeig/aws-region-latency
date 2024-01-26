import { expect, test, vi } from 'vitest';
import { newLatencyMeter } from './latencyMeter';

test('measure() works with the correct region', async () => {
    const fetchSpy = vi.fn();
    const formatRegionEndpointUrlSpy = vi.fn().mockReturnValue('https://localhost.com');
    const latencyMeter = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now: vi.fn().mockReturnValue(100) } as unknown as typeof window.performance
        },
        formatRegionEndpointUrlSpy,
        30_000
    );

    await latencyMeter.measure('eu-west-1');

    expect(fetchSpy).toHaveBeenCalledWith('https://localhost.com', expect.anything());
    expect(formatRegionEndpointUrlSpy).toHaveBeenCalledWith('eu-west-1');
});

test('measure() returns the correct latency in milliseconds', async () => {
    const fetchSpy = vi.fn();
    const now = vi.fn();
    now.mockReturnValueOnce(100);
    now.mockReturnValueOnce(142);
    const formatRegionEndpointUrlSpy = vi.fn().mockReturnValue('https://localhost.com');
    const { measure } = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now } as unknown as typeof window.performance
        },
        formatRegionEndpointUrlSpy,
        30_000
    );

    expect(await measure('eu-west-1')).toBe(42);
    expect(fetchSpy).toHaveBeenCalledWith('https://localhost.com', expect.anything());
    expect(formatRegionEndpointUrlSpy).toHaveBeenCalledWith('eu-west-1');
});
