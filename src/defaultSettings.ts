import { Milliseconds } from './milliseconds';
import { FormatRegionEndpointUrl } from './latencyMeter';

export const ipRangesUrl = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
export const fetchTimeout: Milliseconds = 10_000;
export const maxRegionsToTest = 50;

export const formatRegionEndpointUrl: FormatRegionEndpointUrl = (region: string) => {
    const tld = region.startsWith('cn-') ? 'com.cn' : 'com';
    return `https://dynamodb.${region}.amazonaws.${tld}/ping`;
};
