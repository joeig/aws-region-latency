import { expect, test } from 'vitest';
import { formatRegionEndpointUrl } from './defaultSettings';

test('FORMAT_REGION_ENDPOINT_URL returns the correct region endpoint URL', () => {
    const result = formatRegionEndpointUrl('eu-west-1');

    expect(result).toBe('https://dynamodb.eu-west-1.amazonaws.com/ping');
});

test('FORMAT_REGION_ENDPOINT_URL returns the correct Chinese region endpoint URL', () => {
    const result = formatRegionEndpointUrl('cn-north-1');

    expect(result).toBe('https://dynamodb.cn-north-1.amazonaws.com.cn/ping');
});
