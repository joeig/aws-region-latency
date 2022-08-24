import test from 'ava';
import { assert, spy, stub } from 'sinon';
import { newRegionTester, RegionTesterDependencies } from '../../src/regionTester';

test('testRegions() adds the correct latency data', async (t) => {
    const latencyMeter = { measure: stub() };
    latencyMeter.measure.withArgs('eu-central-1').onCall(0).resolves(42);
    latencyMeter.measure.withArgs('eu-central-1').onCall(1).resolves(24);
    latencyMeter.measure.withArgs('eu-west-1').onCall(0).resolves(7331);
    latencyMeter.measure.withArgs('eu-west-1').onCall(1).resolves(1337);
    const addData = spy();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['eu-central-1', 'eu-west-1'])
            },
            latencyMeter,
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    assert.calledWith(addData.getCall(0), { region: 'eu-central-1', attempt: 0, latency: 42 });
    assert.calledWith(addData.getCall(1), { region: 'eu-central-1', attempt: 1, latency: 24 });
    assert.calledWith(addData.getCall(2), { region: 'eu-west-1', attempt: 0, latency: 7331 });
    assert.calledWith(addData.getCall(3), { region: 'eu-west-1', attempt: 1, latency: 1337 });
    t.pass();
});

test('testRegions() adds the correct latency data if a test fails', async (t) => {
    const addData = spy();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['eu-central-1'])
            },
            latencyMeter: {
                measure: stub().rejects()
            },
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    assert.calledWith(addData.getCall(0), { region: 'eu-central-1', attempt: 0, latency: -1 });
    assert.calledWith(addData.getCall(1), { region: 'eu-central-1', attempt: 1, latency: -1 });
    t.pass();
});

test('testRegions() tests only the number amount of regions', async (t) => {
    const addData = spy();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: stub().resolves(['cn-north-1', 'eu-central-1', 'eu-west-1'])
            },
            latencyMeter: {
                measure: stub().resolves(42)
            },
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        1
    );

    await testRegions();

    assert.callCount(addData, 2);
    t.pass();
});
