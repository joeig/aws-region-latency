import { Milliseconds } from './milliseconds';

export interface DataPoint {
    region: string;
    attempt: number;
    latency: Milliseconds;
}

const isValidLatency = ({ latency }: DataPoint): boolean => latency >= 0;
const byLatency = (a: DataPoint, b: DataPoint): Milliseconds => a.latency - b.latency;

export const getByBestLatency = (dataPoints: DataPoint[]): DataPoint =>
    dataPoints.filter(isValidLatency).sort(byLatency)[0];

export const invalidLatency: Milliseconds = -1;
