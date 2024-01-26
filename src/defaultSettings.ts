import { Milliseconds } from './milliseconds';
import { FormatRegionEndpointUrl } from './latencyMeter';

export const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
export const FETCH_TIMEOUT: Milliseconds = 10_000;
export const MAX_REGIONS_TO_TEST = 50;

export const formatRegionEndpointUrl: FormatRegionEndpointUrl = (region: string) => {
    const tld = region.startsWith('cn-') ? 'com.cn' : 'com';
    return `https://dynamodb.${region}.amazonaws.${tld}/ping`;
};
