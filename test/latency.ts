import test from 'ava';
import { getRegionEndpoint, getTld } from '../src/latency';

test('getTld returns the proper TLD for eu-west-1', (t) => {
    t.is(getTld('eu-west-1'), 'com');
});

test('getTld returns the proper TLD for cn-north-1', (t) => {
    t.is(getTld('cn-north-1'), 'com.cn');
});

test('getRegionEndpoint returns the correct endpoint', (t) => {
    t.is(
        getRegionEndpoint('https://dynamodb.%REGION%.amazonaws.%TLD%/ping', 'foo', 'bar'),
        'https://dynamodb.foo.amazonaws.bar/ping'
    );
});
