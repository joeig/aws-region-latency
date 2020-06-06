function isLowercase(str: string): boolean {
    return !/[A-Z]/.test(str);
}

export interface IpRanges {
    prefixes: [
        {
            region: string;
        }
    ];
}

export interface GetRegion {
    getRegions(): Promise<string[] | null>;
}

async function fetchIpRanges(ipRangesUrl: string): Promise<IpRanges> {
    const response = await fetch(ipRangesUrl);
    return response.json();
}

export function getRegionFactory(ipRangesUrl: string): GetRegion {
    return {
        async getRegions(): Promise<string[] | null> {
            const { prefixes = null } = await fetchIpRanges(ipRangesUrl);

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
