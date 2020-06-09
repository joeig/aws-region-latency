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
    const ipRangesClientMock = ipRangesClientMockFactory();
    const { getRegions } = getRegionFactory(ipRangesClientMock);

    t.deepEqual(await getRegions(), ['eu-west-1', 'cn-north-1']);
});
