import { expect, test } from 'vitest';
import { DataPoint, getByBestLatency } from './dataPoint';

test('getBestLatency() returns the DataPoint with the best latency', () => {
    const dataPoints: DataPoint[] = [
        { region: 'a', attempt: 0, latency: 15 },
        { region: 'b', attempt: 0, latency: 3 },
        { region: 'c', attempt: 0, latency: 26 }
    ];

    expect(getByBestLatency(dataPoints).region).toBe('b');
});
