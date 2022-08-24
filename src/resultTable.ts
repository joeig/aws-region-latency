import { DataPoint } from './dataPoint';

export interface ResultTable {
    prepareTable(): void;
    updateSummary(data: DataPoint): void;
    addRegion(data: DataPoint): void;
}

export const newResultTable = (resultsElement: HTMLDivElement, fullWidthMs = 2000): ResultTable => {
    const resetResults = (): void => {
        // eslint-disable-next-line no-param-reassign
        resultsElement.innerHTML = '';
    };

    const resetSummary = (): HTMLDivElement => {
        const summaryElement = document.createElement('div');
        summaryElement.className = 'summary';
        resultsElement.append(summaryElement);

        return summaryElement;
    };

    const resetTable = (): HTMLTableElement => {
        const tableElement = document.createElement('table');
        resultsElement.append(tableElement);

        return tableElement;
    };

    const getPortionByMs = (ms: number): number => (ms > fullWidthMs ? 1 : ms / fullWidthMs);

    let summaryElement: HTMLDivElement;
    let tableElement: HTMLTableElement;

    return {
        prepareTable(): void {
            resetResults();
            summaryElement = resetSummary();
            tableElement = resetTable();

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
            thBar.innerHTML = `<span class="left">0 ms</span><span class="right">${fullWidthMs}+ ms</span>`;
        },
        updateSummary({ region, latencyMs }: DataPoint): void {
            summaryElement.textContent = `The region with the best result is ${region} (${Math.round(latencyMs)} ms).`;
        },
        addRegion({ region, attempt, latencyMs }: DataPoint): void {
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
            tdLatency.textContent = latencyMs >= 0 ? `${Math.round(latencyMs)} ms` : 'error';

            const tdBar = document.createElement('td');
            regionRow.append(tdBar);
            tdBar.className = 'bar';

            const portion = document.createElement('div');
            tdBar.append(portion);
            portion.className = 'portion';
            portion.innerHTML = '&nbsp;';

            const portionWidth = Math.round(getPortionByMs(latencyMs) * 100);
            portion.style.width = `${portionWidth}%`;
        }
    };
};
