import test from 'ava';
import { getPortionByMilliseconds } from '../src/resultTable';

test('getPortionByMilliseconds returns the right portion', (t) => {
    t.is(getPortionByMilliseconds(2000, 500), 0.25);
    t.is(getPortionByMilliseconds(2000, 2000), 1);
    t.is(getPortionByMilliseconds(2000, 3000), 1);
});
