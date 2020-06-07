export interface LatencyMeter {
    measureLatencyMilliseconds(region: string): Promise<number>;
}
export declare function getTld(region: string): string;
export declare function getRegionEndpoint(regionEndpointTemplate: string, region: string, tld: string): string;
export declare function latencyMeterFactory(regionEndpointTemplate: string): LatencyMeter;
