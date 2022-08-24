export interface DataPoint {
    region: string;
    attempt: number;
    latencyMs: number;
}

const isValidLatencyMs = ({ latencyMs }: DataPoint): boolean => latencyMs >= 0;
const byLatencyMs = (a: DataPoint, b: DataPoint): number => a.latencyMs - b.latencyMs;

export const getBestLatencyMs = (dataPoints: DataPoint[]): DataPoint =>
    dataPoints.filter(isValidLatencyMs).sort(byLatencyMs)[0];
