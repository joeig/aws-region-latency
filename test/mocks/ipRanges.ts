import { IpRanges, IpRangesClient } from '../../src/ipRanges';

export function ipRangesClientMockFactory(ipRanges: IpRanges): IpRangesClient {
    return {
        async fetchIpRanges(): Promise<IpRanges> {
            return ipRanges;
        }
    };
}
