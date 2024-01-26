import { newIpRangesClient } from './ipRangesClient';
import { fetchTimeout, ipRangesUrl, maxRegionsToTest, formatRegionEndpointUrl } from './defaultSettings';
import { newIpRangesManager } from './ipRangesManager';
import { newLatencyMeter } from './latencyMeter';
import { newResultsView } from './resultsView';
import { newRegionTester } from './regionTester';
import { newStateDispatcher } from './stateDispatcher';
import { DataPoint, getByBestLatency } from './dataPoint';
import { newLoadingIndicatorView } from './loadingIndicator';

const startTest = async (resultsElement: Readonly<HTMLDivElement>): Promise<void> => {
    const resultsView = newResultsView(resultsElement);
    const latencyStateDispatcher = newStateDispatcher<DataPoint>();
    latencyStateDispatcher.onAddData(resultsView.addRegion);
    latencyStateDispatcher.onResetData(resultsView.initializeEmptyResult);
    const ipRangesClient = newIpRangesClient({ fetch: window.fetch.bind(window) }, ipRangesUrl, fetchTimeout);
    const ipRangesManager = newIpRangesManager({ ipRangesClient });
    const latencyMeter = newLatencyMeter(
        {
            fetch: window.fetch.bind(window),
            performance: window.performance
        },
        formatRegionEndpointUrl,
        fetchTimeout
    );
    const { testRegions } = newRegionTester(
        {
            ipRangesManager,
            latencyMeter,
            onAddData: latencyStateDispatcher.addData
        },
        maxRegionsToTest
    );

    latencyStateDispatcher.resetData();
    await testRegions();
    const bestDataPoint = getByBestLatency(latencyStateDispatcher.getData());
    resultsView.updateSummary(bestDataPoint);
};

const spinnerElement = document.querySelector('#loader') as HTMLDivElement;
const resultsElement = document.querySelector('#results') as HTMLDivElement;
const errorElement = document.querySelector('#error') as HTMLDivElement;
const startTestButtonElement = document.querySelector('#start-test') as HTMLButtonElement;
startTestButtonElement.addEventListener('click', () => {
    const { setLoading, setFinished } = newLoadingIndicatorView(spinnerElement, startTestButtonElement);
    setLoading();
    // eslint-disable-next-line promise/catch-or-return
    startTest(resultsElement)
        // eslint-disable-next-line promise/prefer-await-to-then
        .catch((error: Readonly<Error>) => {
            errorElement.style.display = 'block';
            // eslint-disable-next-line no-console
            console.error(error);
        })
        // eslint-disable-next-line promise/prefer-await-to-then
        .finally(() => {
            setFinished();
        });
});
