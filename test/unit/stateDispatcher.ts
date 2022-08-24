import test from 'ava';
import { assert, spy } from 'sinon';
import { DataPoint } from '../../src/dataPoint';
import { newStateDispatcher } from '../../src/stateDispatcher';

test('getData() returns data added by addData()', (t) => {
    const stateDispatcher = newStateDispatcher<number>();

    stateDispatcher.addData(1337);

    t.deepEqual(stateDispatcher.getData(), [1337]);
});

test('resetData() resets state', (t) => {
    const stateDispatcher = newStateDispatcher<number>();
    stateDispatcher.addData(1337);

    stateDispatcher.resetData();

    t.deepEqual(stateDispatcher.getData(), []);
});

test('onAddData() calls all dispatchers when new data is added', (t) => {
    const dispatcher1 = spy();
    const dispatcher2 = spy();
    const stateDispatcher = newStateDispatcher<DataPoint>();
    stateDispatcher.onAddData(dispatcher1);
    stateDispatcher.onAddData(dispatcher2);

    stateDispatcher.addData({ region: 'the region', attempt: 5, latency: 42 });

    assert.calledWith(dispatcher1, { region: 'the region', attempt: 5, latency: 42 });
    assert.calledWith(dispatcher2, { region: 'the region', attempt: 5, latency: 42 });
    t.pass();
});

test('onResetData() calls all dispatchers when invoked', (t) => {
    const dispatcher1 = spy();
    const dispatcher2 = spy();
    const stateDispatcher = newStateDispatcher<DataPoint>();
    stateDispatcher.onResetData(dispatcher1);
    stateDispatcher.onResetData(dispatcher2);

    stateDispatcher.resetData();

    assert.called(dispatcher1);
    assert.called(dispatcher2);
    t.pass();
});
