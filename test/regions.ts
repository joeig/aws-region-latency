import test from 'ava';
import { isLowercase } from '../src/regions';

test('isLowercase returns true if string contains only lowercase characters', (t) => {
    t.true(isLowercase('foo'));
    t.true(isLowercase('f0o'));
});

test('isLowercase returns false if string contains at least one uppercase character', (t) => {
    t.false(isLowercase('Foo'));
    t.false(isLowercase('F0o'));
});
