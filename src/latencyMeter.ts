import { Milliseconds } from './milliseconds';

export type FormatRegionEndpointUrl = (regionName: string) => string;

export interface LatencyMeter {
    measure(region: string): Promise<Milliseconds>;
}

interface LatencyMeterDependencies {
    fetch: typeof window.fetch;
    performance: typeof window.performance;
}

export const newLatencyMeter = (
    dependencies: Readonly<LatencyMeterDependencies>,
    formatRegionEndpointUrl: FormatRegionEndpointUrl,
    fetchTimeout: Milliseconds
): LatencyMeter => {
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
            return measure(formatRegionEndpointUrl(region));
        }
    };
};
