// eslint-disable-next-line import/no-unassigned-import
import './assets/index.css';
import { newIpRangesClient } from './ipRangesClient';
import { FETCH_TIMEOUT_MS, IP_RANGES_URL, MAX_REGIONS_TO_TEST, REGION_ENDPOINT_TEMPLATE } from './defaultSettings';
import { newIpRangesManager } from './ipRangesManager';
import { newLatencyMeter } from './latencyMeter';
import { newResultTable } from './resultTable';
import { newRegionTester } from './regionTester';
import { newStateDispatcher } from './stateDispatcher';
import { DataPoint, getBestLatencyMs } from './dataPoint';
import { newLoadingIndicator } from './loadingIndicator';

const startTest = async (resultsElement: HTMLDivElement): Promise<void> => {
    const resultTable = newResultTable(resultsElement);
    const latencyStateDispatcher = newStateDispatcher<DataPoint>();
    latencyStateDispatcher.onAddData(resultTable.addRegion);
    latencyStateDispatcher.onResetData(resultTable.prepareTable);
    const { testRegions } = newRegionTester(
        {
            ipRangesManager: newIpRangesManager({
                ipRangesClient: newIpRangesClient({ fetch: window.fetch.bind(window) }, IP_RANGES_URL, FETCH_TIMEOUT_MS)
            }),
            latencyMeter: newLatencyMeter(
                {
                    fetch: window.fetch.bind(window),
                    performance: window.performance
                },
                REGION_ENDPOINT_TEMPLATE,
                FETCH_TIMEOUT_MS
            ),
            stateDispatcher: latencyStateDispatcher
        },
        MAX_REGIONS_TO_TEST
    );

    latencyStateDispatcher.resetData();

    await testRegions();

    const bestDataPoint = getBestLatencyMs(latencyStateDispatcher.getData());
    resultTable.updateSummary(bestDataPoint);
};

const spinnerElement = document.querySelector('#loader') as HTMLDivElement;
const startTestButtonElement = document.querySelector('#start-test') as HTMLButtonElement;
const resultsElement = document.querySelector('#results') as HTMLDivElement;
const errorElement = document.querySelector('#error') as HTMLDivElement;
startTestButtonElement.addEventListener('click', () => {
    const { setLoading, setFinished } = newLoadingIndicator(spinnerElement, startTestButtonElement);
    setLoading();
    // eslint-disable-next-line promise/catch-or-return
    startTest(resultsElement)
        // eslint-disable-next-line promise/prefer-await-to-then
        .catch((error: Error) => {
            errorElement.style.display = 'block';
            // eslint-disable-next-line no-console
            console.error(error);
        })
        // eslint-disable-next-line promise/prefer-await-to-then
        .finally(() => {
            setFinished();
        });
});
