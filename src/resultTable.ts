export interface ResultTable {
    prepareTable(): void;
    addRegion(region: string, attempt: number): { setLatency(latency: number): void };
}

export function resultTableFactory(resultsElement: HTMLElement, fullWidthMilliseconds = 2000): ResultTable {
    function resetTable(): HTMLTableElement {
        /* eslint no-param-reassign: 'off' */
        resultsElement.innerHTML = '';

        const tableElement = document.createElement('table');
        resultsElement.append(tableElement);

        return tableElement;
    }

    function getPortionByMilliseconds(ms: number): number {
        if (ms > fullWidthMilliseconds) {
            return 1;
        }

        return ms / fullWidthMilliseconds;
    }

    let tableElement: HTMLTableElement;

    return {
        prepareTable(): void {
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
            thBar.innerHTML = `<span class="left">0 ms</span><span class="right">${fullWidthMilliseconds}+ ms</span>`;
        },

        addRegion(region: string, attempt: number): { setLatency(latency: number): void } {
            const regionRow = document.createElement('tr');
            tableElement.append(regionRow);

            const tdRegion = document.createElement('td');
            regionRow.append(tdRegion);
            tdRegion.textContent = region;

            const tdAttempt = document.createElement('td');
            regionRow.append(tdAttempt);
            tdAttempt.className = 'attempt';
            tdAttempt.textContent = `${attempt}`;

            const tdLatency = document.createElement('td');
            regionRow.append(tdLatency);
            tdLatency.className = 'latency';

            const loaderElement = document.createElement('div');
            tdLatency.append(loaderElement);
            loaderElement.className = 'loader';

            const tdBar = document.createElement('td');
            regionRow.append(tdBar);
            tdBar.className = 'bar';

            return {
                setLatency(latency: number): void {
                    if (latency > 0) {
                        tdLatency.textContent = `${Math.round(latency)} ms`;
                    } else {
                        tdLatency.textContent = 'error';
                    }

                    const portion = document.createElement('div');
                    tdBar.append(portion);
                    portion.className = 'portion';
                    portion.innerHTML = '&nbsp;';

                    const portionWidth = Math.round(getPortionByMilliseconds(latency) * 100);
                    portion.style.width = `${portionWidth}%`;
                }
            };
        }
    };
}
