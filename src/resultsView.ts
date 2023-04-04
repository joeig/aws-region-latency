import { DataPoint } from './dataPoint';
import { Milliseconds } from './milliseconds';

export interface ResultsView {
    initializeEmptyResult(): void;
    updateSummary(data: Readonly<DataPoint>): void;
    addRegion(data: Readonly<DataPoint>): void;
}

export const newResultsView = (
    // eslint-disable-next-line functional/prefer-immutable-types
    resultsElement: HTMLDivElement,
    fullWidth: Milliseconds = 2000
): ResultsView => {
    const resetResults = (): void => {
        // eslint-disable-next-line no-param-reassign
        resultsElement.innerHTML = '';
    };

    const prepareSummary = (): HTMLDivElement => {
        const summaryElement = document.createElement('div');
        summaryElement.className = 'summary';
        resultsElement.append(summaryElement);

        return summaryElement;
    };

    const prepareTable = (): HTMLTableElement => {
        const tableElement = document.createElement('table');
        resultsElement.append(tableElement);

        return tableElement;
    };

    const getPortionByMs = (ms: Milliseconds): number => (ms > fullWidth ? 1 : ms / fullWidth);

    let summaryElement: HTMLDivElement;
    let tableElement: HTMLTableElement;

    return {
        // eslint-disable-next-line max-statements
        initializeEmptyResult(): void {
            resetResults();
            summaryElement = prepareSummary();
            tableElement = prepareTable();

            const headRow = document.createElement('tr');
            tableElement.append(headRow);

            const thRegion = document.createElement('th');
            headRow.append(thRegion);
            thRegion.textContent = 'Region';

            const thAttempt = document.createElement('th');
            headRow.append(thAttempt);
            thAttempt.textContent = 'Attempt';

            const thLatency = document.createElement('th');
            headRow.append(thLatency);
            thLatency.textContent = 'Latency';

            const thBar = document.createElement('th');
            headRow.append(thBar);
            thBar.innerHTML = `<span class="left">0 ms</span><span class="right">${fullWidth}+ ms</span>`;
        },
        updateSummary({ region, latency }: Readonly<DataPoint>): void {
            summaryElement.textContent = `The region with the best result is ${region} (${Math.round(latency)} ms).`;
        },
        // eslint-disable-next-line max-statements
        addRegion({ region, attempt, latency }: Readonly<DataPoint>): void {
            const regionRow = document.createElement('tr');
            tableElement.append(regionRow);

            const tdRegion = document.createElement('td');
            regionRow.append(tdRegion);
            tdRegion.textContent = attempt === 0 ? region : '';

            const tdAttempt = document.createElement('td');
            regionRow.append(tdAttempt);
            tdAttempt.className = 'attempt';
            tdAttempt.textContent = `${attempt + 1}`;

            const tdLatency = document.createElement('td');
            regionRow.append(tdLatency);
            tdLatency.className = 'latency';
            tdLatency.textContent = latency >= 0 ? `${Math.round(latency)} ms` : '-';

            const tdBar = document.createElement('td');
            regionRow.append(tdBar);
            tdBar.className = 'bar';

            const portion = document.createElement('div');
            tdBar.append(portion);
            portion.className = 'portion';
            portion.innerHTML = '&nbsp;';

            const portionWidth = Math.round(getPortionByMs(latency) * 100);
            portion.style.width = `${portionWidth}%`;
        }
    };
};
