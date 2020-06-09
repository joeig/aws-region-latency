import { IpRangesClient } from './ipRanges';

export interface GetRegion {
    getRegions(): Promise<string[] | null>;
}

export interface GetRegionDependencies {
    ipRangesClient: IpRangesClient;
}

export function isLowercase(str: string): boolean {
    return !/[A-Z]/.test(str);
}

export function getRegionFactory(dependencies: GetRegionDependencies): GetRegion {
    const { ipRangesClient } = dependencies;

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
