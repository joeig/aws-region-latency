import test from 'ava';
import { getRegionFactory, isLowercase } from '../src/regions';
import { ipRangesClientMockFactory } from './mocks/ipRanges';

test('isLowercase returns true if string contains only lowercase characters', (t) => {
    t.true(isLowercase('foo'));
    t.true(isLowercase('f0o'));
});

test('isLowercase returns false if string contains at least one uppercase character', (t) => {
    t.false(isLowercase('Foo'));
    t.false(isLowercase('F0o'));
});

test('getRegionFactory shall return regions', async (t) => {
    const ipRanges = {
        prefixes: [
            {
                region: 'eu-west-1'
            },
            {
                region: 'eu-west-1'
            },
            {
                region: 'cn-north-1'
            },
            {
                region: ''
            },
            {
                region: 'GLOBAL'
            }
        ]
    };

    const expectedRegions = ['eu-west-1', 'cn-north-1'];

    const ipRangesClient = ipRangesClientMockFactory(ipRanges);
    const { getRegions } = getRegionFactory({ ipRangesClient });

    t.deepEqual(await getRegions(), expectedRegions);
});
