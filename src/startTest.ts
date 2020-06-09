/* eslint-disable no-console */

import { getRegionFactory } from './regions';
import { latencyMeterFactory } from './latency';
import { resultTableFactory } from './resultTable';
import { IP_RANGES_URL, REGION_ENDPOINT_TEMPLATE } from './defaultSettings';
import { ipRangesClientFactory } from './ipRanges';

export async function startTest(): Promise<void> {
    const ipRangesClient = ipRangesClientFactory(IP_RANGES_URL);
    const { getRegions } = getRegionFactory(ipRangesClient);
    let regions: string[] = [];

    try {
        const regionsResponse = await getRegions();
        if (regionsResponse) {
            regions = regionsResponse;
        } else {
            console.error('No region identifiers found', regionsResponse);
        }
    } catch (error) {
        console.error('Unable to gather region identifiers', error);
        return;
    }

    console.log('Region identifiers', regions);

    const { measureLatencyMilliseconds } = latencyMeterFactory(REGION_ENDPOINT_TEMPLATE);

    const resultsElement = document.querySelector('#results') as HTMLElement;
    const { prepareTable, addRegion } = resultTableFactory(resultsElement);

    prepareTable();

    for (const region of regions.sort((a, b) => a.localeCompare(b))) {
        const totalAttempts = 2;

        for (let i = 0; i < totalAttempts; i += 1) {
            let regionName = region;

            if (i > 0) {
                regionName = '';
            }

            const { setLatency } = addRegion(regionName, i + 1);
            let latency = -1;

            try {
                latency = await measureLatencyMilliseconds(region);
                console.log('Latency to region', region, latency, 'attempt', i);
            } catch (error) {
                console.error('Unable to reach region endpoint', region, error);
            }

            setLatency(latency);
        }
    }
}
