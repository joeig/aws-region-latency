import test from 'ava';
import { assert, match, stub } from 'sinon';
import { newIpRangesClient } from '../../src/ipRangesClient';

test('fetch() returns IP ranges', async (t) => {
    const fetchStub = stub().resolves({
        json: stub().resolves({
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
        })
    });
    const ipRangesClient = newIpRangesClient({ fetch: fetchStub }, 'https://localhost:1234/ipRanges.json', 30_000);

    t.deepEqual(await ipRangesClient.fetch(), {
        prefixes: [{ region: 'af-south-1' }, { region: 'ap-northeast-2' }]
    });
    assert.calledWith(fetchStub, 'https://localhost:1234/ipRanges.json', match.any);
    t.pass();
});

test('fetch() throws if response does not match schema', async (t) => {
    const fetchStub = stub().resolves({
        json: stub().resolves({ prefixesXYZ: [{ region: 'af-south-1' }] })
    });
    const ipRangesClient = newIpRangesClient({ fetch: fetchStub }, 'https://localhost:1234/ipRanges.json', 30_000);

    await t.throwsAsync(async () => {
        await ipRangesClient.fetch();
    });
});
