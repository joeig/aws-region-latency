import test from 'ava';
import { assert, match, spy, stub } from 'sinon';
import { newLatencyMeter } from '../../src/latencyMeter';

test('measure() works with the correct top-level domain', async (t) => {
    const fetchSpy = spy();
    const latencyMeter = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now: stub().returns(100) } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%',
        30_000
    );

    await latencyMeter.measure('eu-west-1');

    assert.calledWith(fetchSpy, 'https://localhost.com');
    t.pass();
});

test('measure() works with the correct top-level domain (Chinese regions)', async (t) => {
    const fetchSpy = spy();
    const { measure } = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now: stub().returns(100) } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%',
        30_000
    );

    await measure('cn-north-1');

    assert.calledWith(fetchSpy, 'https://localhost.com.cn');
    t.pass();
});

test('measure() returns the correct latency in milliseconds', async (t) => {
    const fetchSpy = stub().resolves();
    const now = stub();
    now.onFirstCall().returns(100);
    now.onSecondCall().returns(142);
    const { measure } = newLatencyMeter(
        {
            fetch: fetchSpy,
            performance: { now } as unknown as typeof window.performance
        },
        'https://localhost.%TLD%:1234/%REGION%/',
        30_000
    );

    t.is(await measure('eu-west-1'), 42);
    assert.calledWith(fetchSpy, 'https://localhost.com:1234/eu-west-1/', match.any);
    t.pass();
});
