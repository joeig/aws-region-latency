import test from 'ava';
import { DataPoint, getBestLatencyMs } from '../../src/dataPoint';

test('getBestLatencyMs() returns the DataPoint with the best latency', (t) => {
    const dataPoints: DataPoint[] = [
        { region: 'a', attempt: 0, latencyMs: 15 },
        { region: 'b', attempt: 0, latencyMs: 3 },
        { region: 'c', attempt: 0, latencyMs: 26 }
    ];

    t.is(getBestLatencyMs(dataPoints).region, 'b');
});
