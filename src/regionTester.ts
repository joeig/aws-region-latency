import { Mutex } from 'async-mutex';
import { IpRangesManager } from './ipRangesManager';
import { LatencyMeter } from './latencyMeter';
import { StateDispatcher } from './stateDispatcher';
import { DataPoint } from './dataPoint';

interface RegionTester {
    testRegions(): Promise<void>;
}

export interface RegionTesterDependencies {
    ipRangesManager: IpRangesManager;
    latencyMeter: LatencyMeter;
    stateDispatcher: StateDispatcher<DataPoint>;
}

export const newRegionTester = (
    { ipRangesManager, latencyMeter, stateDispatcher }: RegionTesterDependencies,
    maxRegionsToTest: number
): RegionTester => {
    const testRegion = async (region: string, attempt: number): Promise<void> => {
        try {
            const latencyMs = await latencyMeter.measureMs(region);
            stateDispatcher.addData({ region, attempt, latencyMs });
        } catch {
            stateDispatcher.addData({ region, attempt, latencyMs: -1 });
        }
    };

    return {
        async testRegions(): Promise<void> {
            const regions = await ipRangesManager.fetchRegions();
            const mutex = new Mutex();

            await Promise.all(
                regions.slice(0, maxRegionsToTest).map(async (region) =>
                    mutex.runExclusive(async () => {
                        await testRegion(region, 0);
                        await testRegion(region, 1);
                    })
                )
            );
        }
    };
};
