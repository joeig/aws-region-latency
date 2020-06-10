import { IpRangesClient } from './ipRanges';
export interface GetRegion {
    getRegions(): Promise<string[] | null>;
}
export interface GetRegionDependencies {
    ipRangesClient: IpRangesClient;
}
export declare function isLowercase(str: string): boolean;
export declare function getRegionFactory(dependencies: GetRegionDependencies): GetRegion;
