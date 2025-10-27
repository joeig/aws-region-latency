import { Millisecond } from './millisecond';
import { FormatRegionEndpointUrl } from './formatRegionEndpointUrl';

export const ipRangesUrl = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
export const fetchTimeout: Millisecond = 10_000;
export const maxRegionsToTest = 50;

const partitionTlds: Record<string, string> = {
    cn: 'com.cn',
    eusc: 'eu'
} as const;

const findTldForRegion = (region: string): string => {
    const partition = region.split('-')[0];
    return partitionTlds[partition] || 'com';
};

export const buildRegionEndpointUrl: FormatRegionEndpointUrl = (region: string) => {
    const tld = findTldForRegion(region);
    const endpoint = new URL('https://localhost');
    endpoint.hostname = ['dynamodb', region, 'amazonaws', tld].join('.');
    endpoint.pathname = '/ping';

    return endpoint.toString();
};
