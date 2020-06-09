export interface IpRanges {
    prefixes: Array<{ region: string }>;
}

export interface IpRangesClient {
    fetchIpRanges(): Promise<IpRanges>;
}

export function ipRangesClientFactory(ipRangesUrl: string): IpRangesClient {
    return {
        async fetchIpRanges(): Promise<IpRanges> {
            const response = await fetch(ipRangesUrl);
            return response.json();
        }
    };
}
