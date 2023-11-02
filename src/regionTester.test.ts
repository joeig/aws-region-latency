import { expect, test, vi } from 'vitest';
import { newRegionTester, RegionTesterDependencies } from './regionTester';

test('testRegions() adds the correct latency data', async () => {
    const latencyMeter = { measure: vi.fn() };
    latencyMeter.measure.mockResolvedValueOnce(42);
    latencyMeter.measure.mockResolvedValueOnce(24);
    latencyMeter.measure.mockResolvedValueOnce(7331);
    latencyMeter.measure.mockResolvedValueOnce(1337);
    const addData = vi.fn();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: vi.fn().mockResolvedValue(['eu-central-1', 'eu-west-1'])
            },
            latencyMeter,
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    expect(addData).toHaveBeenCalledWith({ region: 'eu-central-1', attempt: 0, latency: 42 });
    expect(addData).toHaveBeenCalledWith({ region: 'eu-central-1', attempt: 1, latency: 24 });
    expect(addData).toHaveBeenCalledWith({ region: 'eu-west-1', attempt: 0, latency: 7331 });
    expect(addData).toHaveBeenCalledWith({ region: 'eu-west-1', attempt: 1, latency: 1337 });
});

test('testRegions() adds the correct latency data if a test fails', async () => {
    const addData = vi.fn();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: vi.fn().mockResolvedValue(['eu-central-1'])
            },
            latencyMeter: {
                measure: vi.fn().mockRejectedValue({})
            },
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        50
    );

    await testRegions();

    expect(addData).toHaveBeenCalledWith({ region: 'eu-central-1', attempt: 0, latency: -1 });
    expect(addData).toHaveBeenCalledWith({ region: 'eu-central-1', attempt: 1, latency: -1 });
});

test('testRegions() tests only the number amount of regions', async () => {
    const addData = vi.fn();
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: {
                fetchRegions: vi.fn().mockResolvedValue(['cn-north-1', 'eu-central-1', 'eu-west-1'])
            },
            latencyMeter: {
                measure: vi.fn().mockResolvedValue(42)
            },
            onAddData: addData
        } as unknown as RegionTesterDependencies,
        1
    );

    await testRegions();

    expect(addData.mock.calls.length).toBe(2);
});
