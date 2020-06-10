export interface IpRanges {
    prefixes: Array<{
        region: string;
    }>;
}
export interface IpRangesClient {
    fetchIpRanges(): Promise<IpRanges>;
}
export declare function ipRangesClientFactory(ipRangesUrl: string): IpRangesClient;
