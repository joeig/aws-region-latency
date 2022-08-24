import test from 'ava';
import { DataPoint, getByBestLatency } from '../../src/dataPoint';

test('getBestLatency() returns the DataPoint with the best latency', (t) => {
    const dataPoints: DataPoint[] = [
        { region: 'a', attempt: 0, latency: 15 },
        { region: 'b', attempt: 0, latency: 3 },
        { region: 'c', attempt: 0, latency: 26 }
    ];

    t.is(getByBestLatency(dataPoints).region, 'b');
});
