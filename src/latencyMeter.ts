import { Milliseconds } from './milliseconds';

export interface LatencyMeter {
    measure(region: string): Promise<Milliseconds>;
}

interface LatencyMeterDependencies {
    fetch: typeof window.fetch;
    performance: typeof window.performance;
}

export const newLatencyMeter = (
    dependencies: LatencyMeterDependencies,
    regionEndpointTemplate: string,
    fetchTimeout: Milliseconds
): LatencyMeter => {
    const getTld = (region: string): string => (region.startsWith('cn-') ? 'com.cn' : 'com');
    const regionEndpointFormatter = (region: string): string =>
        regionEndpointTemplate.replace('%REGION%', region).replace('%TLD%', getTld(region));
    const abortController = new AbortController();
    const abortTimeout = setTimeout(() => {
        abortController.abort();
    }, fetchTimeout);
    const fetchRegionEndpoint = async (endpointUrl: string): Promise<Response> =>
        dependencies.fetch(endpointUrl, { redirect: 'manual', cache: 'no-store', signal: abortController.signal });
    const measure = async (endpointUrl: string): Promise<Milliseconds> => {
        const start = dependencies.performance.now();
        await fetchRegionEndpoint(endpointUrl);
        return dependencies.performance.now() - start;
    };
    clearTimeout(abortTimeout);

    return {
        async measure(region: string): Promise<number> {
            return measure(regionEndpointFormatter(region));
        }
    };
};
