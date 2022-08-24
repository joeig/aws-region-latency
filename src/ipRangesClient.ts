import { z } from 'zod';

const prefixSchema = z.object({
    region: z.string().max(25)
});

export type Prefix = z.infer<typeof prefixSchema>;

const ipRangesSchema = z.object({
    prefixes: z.array(prefixSchema).max(10_000)
});

type IpRanges = z.infer<typeof ipRangesSchema>;

export interface IpRangesClient {
    fetch(): Promise<IpRanges>;
}

interface IpRangesClientDependencies {
    fetch: typeof window.fetch;
}

export const newIpRangesClient = (
    dependencies: IpRangesClientDependencies,
    ipRangesUrl: string,
    fetchTimeoutMs: number
): IpRangesClient => {
    return {
        async fetch(): Promise<IpRanges> {
            const abortController = new AbortController();
            const abortTimeout = setTimeout(() => {
                abortController.abort();
            }, fetchTimeoutMs);
            const response = await dependencies.fetch(ipRangesUrl, { signal: abortController.signal });
            clearTimeout(abortTimeout);
            const maybeIpRanges = (await response.json()) as unknown;

            return ipRangesSchema.parse(maybeIpRanges);
        }
    };
};
