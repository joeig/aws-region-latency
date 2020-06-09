import { IpRangesClient } from './ipRanges';

export interface GetRegion {
    getRegions(): Promise<string[] | null>;
}

export function isLowercase(str: string): boolean {
    return !/[A-Z]/.test(str);
}

export function getRegionFactory(ipRangesClient: IpRangesClient): GetRegion {
    return {
        async getRegions(): Promise<string[] | null> {
            const { prefixes = null } = await ipRangesClient.fetchIpRanges();

            if (!prefixes) {
                return null;
            }

            const regions: string[] = [];

            for (const prefix of prefixes) {
                const { region } = prefix;

                if (region === '') {
                    continue;
                }

                if (!isLowercase(region)) {
                    continue;
                }

                if (regions.includes(region)) {
                    continue;
                }

                regions.push(region);
            }

            return regions;
        }
    };
}
