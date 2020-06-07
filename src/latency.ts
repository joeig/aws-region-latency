export interface LatencyMeter {
    measureLatencyMilliseconds(region: string): Promise<number>;
}

export function getTld(region: string): string {
    if (region.startsWith('cn-')) {
        return 'com.cn';
    }

    return 'com';
}

export function getRegionEndpoint(regionEndpointTemplate: string, region: string, tld: string): string {
    return regionEndpointTemplate.replace('%REGION%', region).replace('%TLD%', tld);
}

async function fetchRegionEndpoint(endpointUrl: string): Promise<Response> {
    return fetch(endpointUrl, { redirect: 'manual', cache: 'no-store' });
}

async function measureMilliseconds(endpointUrl: string): Promise<number> {
    const start = window.performance.now();
    await fetchRegionEndpoint(endpointUrl);

    return window.performance.now() - start;
}

export function latencyMeterFactory(regionEndpointTemplate: string): LatencyMeter {
    return {
        async measureLatencyMilliseconds(region: string): Promise<number> {
            const tld = getTld(region);
            const endpointUrl = getRegionEndpoint(regionEndpointTemplate, region, tld);
            return measureMilliseconds(endpointUrl);
        }
    };
}
