import { Milliseconds } from './milliseconds';

export const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
export const REGION_ENDPOINT_TEMPLATE = 'https://dynamodb.%REGION%.amazonaws.%TLD%/ping';
export const FETCH_TIMEOUT: Milliseconds = 10_000;
export const MAX_REGIONS_TO_TEST = 50;
