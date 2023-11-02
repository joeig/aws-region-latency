import { expect, test, vi } from 'vitest';
import { DataPoint } from './dataPoint';
import { newStateDispatcher } from './stateDispatcher';

test('getData() returns data added by addData()', () => {
    const stateDispatcher = newStateDispatcher<number>();

    stateDispatcher.addData(1337);

    expect(stateDispatcher.getData()).toStrictEqual([1337]);
});

test('resetData() resets state', () => {
    const stateDispatcher = newStateDispatcher<number>();
    stateDispatcher.addData(1337);

    stateDispatcher.resetData();

    expect(stateDispatcher.getData()).toStrictEqual([]);
});

test('onAddData() calls all dispatchers when new data is added', () => {
    const dispatcher1 = vi.fn();
    const dispatcher2 = vi.fn();
    const stateDispatcher = newStateDispatcher<DataPoint>();
    stateDispatcher.onAddData(dispatcher1);
    stateDispatcher.onAddData(dispatcher2);

    stateDispatcher.addData({ region: 'the region', attempt: 5, latency: 42 });

    expect(dispatcher1).toHaveBeenCalledWith({ region: 'the region', attempt: 5, latency: 42 });
    expect(dispatcher2).toHaveBeenCalledWith({ region: 'the region', attempt: 5, latency: 42 });
});

test('onResetData() calls all dispatchers when invoked', () => {
    const dispatcher1 = vi.fn();
    const dispatcher2 = vi.fn();
    const stateDispatcher = newStateDispatcher<DataPoint>();
    stateDispatcher.onResetData(dispatcher1);
    stateDispatcher.onResetData(dispatcher2);

    stateDispatcher.resetData();

    expect(dispatcher1).toHaveBeenCalled();
    expect(dispatcher2).toHaveBeenCalled();
});
