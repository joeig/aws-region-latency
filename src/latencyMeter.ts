export interface LatencyMeter {
    measureMs(region: string): Promise<number>;
}

interface LatencyMeterDependencies {
    fetch: typeof window.fetch;
    performance: typeof window.performance;
}

export const newLatencyMeter = (
    dependencies: LatencyMeterDependencies,
    regionEndpointTemplate: string,
    fetchTimeoutMs: number
): LatencyMeter => {
    const getTld = (region: string): string => (region.startsWith('cn-') ? 'com.cn' : 'com');
    const regionEndpointFormatter = (region: string): string =>
        regionEndpointTemplate.replace('%REGION%', region).replace('%TLD%', getTld(region));
    const abortController = new AbortController();
    const abortTimeout = setTimeout(() => {
        abortController.abort();
    }, fetchTimeoutMs);
    const fetchRegionEndpoint = async (endpointUrl: string): Promise<Response> =>
        dependencies.fetch(endpointUrl, { redirect: 'manual', cache: 'no-store', signal: abortController.signal });
    const measureMs = async (endpointUrl: string): Promise<number> => {
        const start = dependencies.performance.now();
        await fetchRegionEndpoint(endpointUrl);
        return dependencies.performance.now() - start;
    };
    clearTimeout(abortTimeout);

    return {
        async measureMs(region: string): Promise<number> {
            return measureMs(regionEndpointFormatter(region));
        }
    };
};
