import test from 'ava';
import { assert, stub } from 'sinon';
import { newRegionTester, RegionTesterDependencies } from '../../src/regionTester';

test('testRegions() adds the correct latency data', async (t) => {
    const latencyMeter = { measureMs: stub() };
    latencyMeter.measureMs.withArgs('eu-central-1').onCall(0).resolves(42);
    latencyMeter.measureMs.withArgs('eu-central-1').onCall(1).resolves(24);
    latencyMeter.measureMs.withArgs('eu-west-1').onCall(0).resolves(7331);
    latencyMeter.measureMs.withArgs('eu-west-1').onCall(1).resolves(1337);
    const stateDispatcher = { addData: stub() };
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['eu-central-1', 'eu-west-1'])
            },
            latencyMeter,
            stateDispatcher
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    assert.calledWith(stateDispatcher.addData.getCall(0), { region: 'eu-central-1', attempt: 0, latencyMs: 42 });
    assert.calledWith(stateDispatcher.addData.getCall(1), { region: 'eu-central-1', attempt: 1, latencyMs: 24 });
    assert.calledWith(stateDispatcher.addData.getCall(2), { region: 'eu-west-1', attempt: 0, latencyMs: 7331 });
    assert.calledWith(stateDispatcher.addData.getCall(3), { region: 'eu-west-1', attempt: 1, latencyMs: 1337 });
    t.pass();
});

test('testRegions() adds the correct latency data if a test fails', async (t) => {
    const stateDispatcher = { addData: stub() };
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['eu-central-1'])
            },
            latencyMeter: {
                measureMs: stub().rejects()
            },
            stateDispatcher
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    assert.calledWith(stateDispatcher.addData.getCall(0), { region: 'eu-central-1', attempt: 0, latencyMs: -1 });
    assert.calledWith(stateDispatcher.addData.getCall(1), { region: 'eu-central-1', attempt: 1, latencyMs: -1 });
    t.pass();
});

test('testRegions() tests only the number amount of regions', async (t) => {
    const stateDispatcher = { addData: stub() };
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['cn-north-1', 'eu-central-1', 'eu-west-1'])
            },
            latencyMeter: {
                measureMs: stub().resolves(42)
            },
            stateDispatcher
        } as unknown as RegionTesterDependencies,
        1
    );

    await testRegions();

    assert.callCount(stateDispatcher.addData, 2);
    t.pass();
});
