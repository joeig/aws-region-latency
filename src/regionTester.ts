import pEachSeries from 'p-each-series';
import { IpRangesManager } from './ipRangesManager';
import { LatencyMeter } from './latencyMeter';
import { DataPoint, invalidLatency } from './dataPoint';

interface RegionTester {
    testRegions(): Promise<void>;
}

export interface RegionTesterDependencies {
    ipRangesManager: IpRangesManager;
    latencyMeter: LatencyMeter;

    onAddData(data: Readonly<DataPoint>): void;
}

export const newRegionTester = (
    { ipRangesManager, latencyMeter, onAddData }: Readonly<RegionTesterDependencies>,
    maxRegionsToTest: number
): RegionTester => {
    const testRegion = async (region: string, attempt: number): Promise<void> => {
        try {
            const latency = await latencyMeter.measure(region);
            onAddData({ region, attempt, latency });
        } catch {
            onAddData({ region, attempt, latency: invalidLatency });
        }
    };

    return {
        async testRegions(): Promise<void> {
            const regions = await ipRangesManager.fetchRegions();
            const regionsToTest = regions.slice(0, maxRegionsToTest);

            await pEachSeries(regionsToTest, async (region) => {
                await testRegion(region, 0);
                await testRegion(region, 1);
            });
        }
    };
};
