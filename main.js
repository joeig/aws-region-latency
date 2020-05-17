'use strict';

const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
const REGION_ENDPOINT_TEMPLATE = 'https://dynamodb.%REGION%.amazonaws.%TLD%/ping';

function isLowercase(str) {
    return !(/[A-Z]/.test(str));
}

function getRegionFactory(ipRangesUrl) {
    async function fetchIpRanges(ipRangesUrl) {
        return fetch(ipRangesUrl).then(resp => resp.json());
    }

    return {
        async getRegions() {
            const {prefixes = null} = await fetchIpRanges(ipRangesUrl);

            if (!prefixes) {
                return null;
            }

            const regions = [];

            for (const prefix of prefixes) {
                const {region} = prefix;

                if (region === '') {
                    continue;
                }

                if (!isLowercase(region)) {
                    continue;
                }

                if (regions.indexOf(region) !== -1) {
                    continue;
                }

                regions.push(region);
            }

            return regions;
        }
    };
}

function latencyMeterFactory(regionEndpointTemplate) {
    function getTld(region) {
        if (region.startsWith('cn-')) {
            return 'com.cn';
        }

        return 'com';
    }

    function getRegionEndpoint(region) {
        const tld = getTld(region);

        return regionEndpointTemplate
            .replace('%REGION%', region)
            .replace('%TLD%', tld);
    }

    async function fetchRegionEndpoint(endpointUrl) {
        return fetch(endpointUrl, {redirect: 'manual', cache: 'no-store'});
    }

    async function measureMilliseconds(endpointUrl) {
        const start = window.performance.now();
        await fetchRegionEndpoint(endpointUrl);

        return window.performance.now() - start;
    }

    return {
        async measureLatencyMilliseconds(region) {
            const endpointUrl = getRegionEndpoint(region);
            return measureMilliseconds(endpointUrl);
        }
    };
}

function resultTableFactory(resultsElement) {
    function resetTable() {
        resultsElement.innerHTML = '';

        const tableElement = document.createElement('table');
        resultsElement.appendChild(tableElement);

        return tableElement;
    }

    function getPortionByMilliseconds(ms) {
        const fullWidthMilliseconds = 1000;

        if (ms > fullWidthMilliseconds) {
            return 1;
        }

        return ms / fullWidthMilliseconds;
    }

    let tableElement = undefined;

    return {
        prepareTable() {
            tableElement = resetTable();

            const headRow = document.createElement('tr');
            tableElement.appendChild(headRow);

            const thRegion = document.createElement('th');
            headRow.appendChild(thRegion);
            thRegion.innerText = 'Region';

            const thLatency = document.createElement('th');
            headRow.appendChild(thLatency);
            thLatency.innerText = 'Latency';

            const thBar = document.createElement('th');
            headRow.appendChild(thBar);
        },

        addRegion(region) {
            const regionRow = document.createElement('tr');
            tableElement.appendChild(regionRow);

            const tdRegion = document.createElement('td');
            regionRow.appendChild(tdRegion);
            tdRegion.innerText = region;

            const tdLatency = document.createElement('td');
            regionRow.appendChild(tdLatency);
            tdLatency.className = 'latency';

            const loaderElement = document.createElement('div');
            tdLatency.appendChild(loaderElement);
            loaderElement.className = 'loader';

            const tdBar = document.createElement('td');
            regionRow.appendChild(tdBar);
            tdBar.className = 'bar';

            return {
                setLatency(latency) {
                    if (latency > 0) {
                        tdLatency.innerText = `${Math.round(latency)} ms`;
                    } else {
                        tdLatency.innerText = 'error';
                    }

                    const portion = document.createElement('div');
                    tdBar.appendChild(portion);
                    portion.className = 'portion';
                    portion.innerHTML = '&nbsp;';

                    const portionWidth = Math.round(getPortionByMilliseconds(latency) * 100);
                    portion.style.width = `${portionWidth}%`;
                }
            };
        },
    };
}

async function startTest() {
    const {getRegions} = getRegionFactory(IP_RANGES_URL);
    let regions = [];

    try {
        regions = await getRegions();
    } catch (e) {
        console.error('Unable to gather region identifiers', e);
        return;
    }

    console.log('Region identifiers', regions);

    const {measureLatencyMilliseconds} = latencyMeterFactory(REGION_ENDPOINT_TEMPLATE);

    const resultsElement = document.querySelector('#results');
    const {prepareTable, addRegion} = resultTableFactory(resultsElement);

    prepareTable();

    for (const region of regions.sort()) {
        for (let i = 0; i < 2; i++) {
            let regionName = region;

            if (i > 0) {
                regionName = '';
            }

            const {setLatency} = addRegion(regionName);
            let latency = -1;

            try {
                latency = await measureLatencyMilliseconds(region);
                console.log(region, latency);
            } catch (e) {
                console.error('Unable to reach region endpoint', region, e);
            }

            setLatency(latency);
        }
    }
}

document.querySelector('#start-test').onclick = startTest;
