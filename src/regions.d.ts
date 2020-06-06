export interface IpRanges {
    prefixes: [{
        region: string;
    }];
}
export interface GetRegion {
    getRegions(): Promise<string[] | null>;
}
export declare function getRegionFactory(ipRangesUrl: string): GetRegion;
