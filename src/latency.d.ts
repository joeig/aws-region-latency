export interface LatencyMeter {
    measureLatencyMilliseconds(region: string): Promise<number>;
}
export declare function latencyMeterFactory(regionEndpointTemplate: string): LatencyMeter;
