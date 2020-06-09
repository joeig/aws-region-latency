import { IpRanges, IpRangesClient } from '../../src/ipRanges';

export function ipRangesClientMockFactory(): IpRangesClient {
    return {
        async fetchIpRanges(): Promise<IpRanges> {
            return {
                prefixes: [
                    {
                        region: 'eu-west-1'
                    },
                    {
                        region: 'eu-west-1'
                    },
                    {
                        region: 'cn-north-1'
                    },
                    {
                        region: ''
                    },
                    {
                        region: 'GLOBAL'
                    }
                ]
            };
        }
    };
}
