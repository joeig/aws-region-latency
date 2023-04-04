import { Milliseconds } from './milliseconds';

export interface DataPoint {
    region: string;
    attempt: number;
    latency: Milliseconds;
}

const isValidLatency = ({ latency }: Readonly<DataPoint>): boolean => latency >= 0;
const byLatency = (a: Readonly<DataPoint>, b: Readonly<DataPoint>): Milliseconds => a.latency - b.latency;

export const getByBestLatency = (dataPoints: readonly DataPoint[]): DataPoint =>
    dataPoints.filter(isValidLatency).sort(byLatency)[0];

export const invalidLatency: Milliseconds = -1;
