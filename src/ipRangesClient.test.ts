import { expect, test, vi } from 'vitest';
import { newIpRangesClient } from './ipRangesClient';

test('fetch() returns IP ranges', async () => {
    const fetchStub = vi.fn();
    fetchStub.mockResolvedValue({
        json: async () =>
            new Promise((resolve) => {
                resolve({
                    syncToken: '1234567890',
                    createDate: '1970-01-01-01-02-03',
                    prefixes: [
                        {
                            ip_prefix: '3.2.34.0/26',
                            region: 'af-south-1',
                            service: 'AMAZON',
                            network_border_group: 'af-south-1'
                        },
                        {
                            ip_prefix: '3.5.140.0/22',
                            region: 'ap-northeast-2',
                            service: 'AMAZON',
                            network_border_group: 'ap-northeast-2'
                        }
                    ]
                });
            })
    });
    const ipRangesClient = newIpRangesClient({ fetch: fetchStub }, 'https://localhost:1234/ipRanges.json', 30_000);

    expect(await ipRangesClient.fetch()).toStrictEqual({
        prefixes: [{ region: 'af-south-1' }, { region: 'ap-northeast-2' }]
    });
    expect(fetchStub).toHaveBeenCalledWith('https://localhost:1234/ipRanges.json', expect.anything());
});

test('fetch() throws if response does not match schema', async () => {
    const fetchStub = vi.fn();
    fetchStub.mockResolvedValue({
        json: async () =>
            new Promise((resolve) => {
                resolve({ prefixesXYZ: [{ region: 'af-south-1' }] });
            })
    });
    const ipRangesClient = newIpRangesClient({ fetch: fetchStub }, 'https://localhost:1234/ipRanges.json', 30_000);

    await expect(async () => {
        await ipRangesClient.fetch();
    }).rejects.toThrowError();
});
