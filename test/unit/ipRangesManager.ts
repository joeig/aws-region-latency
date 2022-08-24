import test from 'ava';
import { stub } from 'sinon';
import { newIpRangesManager } from '../../src/ipRangesManager';
import { IpRangesClient } from '../../src/ipRangesClient';

test('fetchRegions() returns processed regions', async (t) => {
    const ipRangesClient: IpRangesClient = {
        fetch: stub().resolves({
            prefixes: [
                { region: 'eu-west-1' },
                { region: 'eu-west-1' },
                { region: 'cn-north-1' },
                { region: '' },
                { region: 'GLOBAL' }
            ]
        })
    };
    const { fetchRegions } = newIpRangesManager({ ipRangesClient });

    t.deepEqual(await fetchRegions(), ['cn-north-1', 'eu-west-1']);
});
