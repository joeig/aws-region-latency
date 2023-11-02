import { expect, test, vi } from 'vitest';
import { newIpRangesManager } from './ipRangesManager';
import { IpRangesClient } from './ipRangesClient';

test('fetchRegions() returns processed regions', async () => {
    const fetchStub = vi.fn();
    fetchStub.mockResolvedValue(
        new Promise((resolve) => {
            resolve({
                prefixes: [
                    { region: 'eu-west-1' },
                    { region: 'eu-west-1' },
                    { region: 'cn-north-1' },
                    { region: '' },
                    { region: 'GLOBAL' }
                ]
            });
        })
    );
    const ipRangesClient: IpRangesClient = {
        fetch: fetchStub
    };
    const { fetchRegions } = newIpRangesManager({ ipRangesClient });

    expect(await fetchRegions()).toStrictEqual(['cn-north-1', 'eu-west-1']);
});
