export interface LatencyMeter {
    measureLatencyMilliseconds(region: string): Promise<number>;
}

export function latencyMeterFactory(regionEndpointTemplate: string): LatencyMeter {
    function getTld(region: string): string {
        if (region.startsWith('cn-')) {
            return 'com.cn';
        }

        return 'com';
    }

    function getRegionEndpoint(region: string): string {
        const tld = getTld(region);
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

    return {
        async measureLatencyMilliseconds(region: string): Promise<number> {
            const endpointUrl = getRegionEndpoint(region);
            return measureMilliseconds(endpointUrl);
        }
    };
}
