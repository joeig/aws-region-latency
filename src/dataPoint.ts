import { Millisecond } from './millisecond';

export interface DataPoint {
    region: string;
    attempt: number;
    latency: Millisecond;
}

const isValidLatency = ({ latency }: Readonly<DataPoint>): boolean => latency >= 0;
const byLatency = (a: Readonly<DataPoint>, b: Readonly<DataPoint>): Millisecond => a.latency - b.latency;

export const getByBestLatency = (dataPoints: readonly DataPoint[]): DataPoint =>
    dataPoints.filter(isValidLatency).sort(byLatency)[0];

export const invalidLatency: Millisecond = -1;
