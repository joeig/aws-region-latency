import { expect, test } from 'vitest';
import { buildRegionEndpointUrl } from './defaultSettings';

test('FORMAT_REGION_ENDPOINT_URL returns the correct region endpoint URL', () => {
    const result = buildRegionEndpointUrl('eu-west-1');

    expect(result).toBe('https://dynamodb.eu-west-1.amazonaws.com/ping');
});

test('FORMAT_REGION_ENDPOINT_URL returns the correct Chinese region endpoint URL', () => {
    const result = buildRegionEndpointUrl('cn-north-1');

    expect(result).toBe('https://dynamodb.cn-north-1.amazonaws.com.cn/ping');
});

test('FORMAT_REGION_ENDPOINT_URL returns the correct European Sovereign Cloud region endpoint URL', () => {
    const result = buildRegionEndpointUrl('eusc-de-east-1');

    expect(result).toBe('https://dynamodb.eusc-de-east-1.amazonaws.eu/ping');
});
