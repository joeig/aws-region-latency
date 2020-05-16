'use strict';

const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
const REGION_ENDPOINT = 'https://dynamodb.%REGION%.amazonaws.%TLD%/ping';

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
                if (!isLowercase(prefix.region)) {
                    continue;
                }

                if (regions.indexOf(prefix.region) !== -1) {
                    continue;
                }

                regions.push(prefix.region);
            }

            return regions;
        }
    };
}

function latencyMeterFactory(regionEndpoint, attemptCount) {
    function getTld(region) {
        if (/^cn-/.test(region)) {
            return 'com.cn';
        }
        return 'com';
    }

    function getRegionEndpoint(region) {
        const tld = getTld(region);
        return regionEndpoint.replace('%REGION%', region).replace('%TLD%', tld);
    }

    async function fetchRegionEndpoint(endpointUrl) {
        return fetch(endpointUrl, {redirect: 'manual', cache: 'no-store'});
    }

    async function measureMilliseconds(endpointUrl) {
        const start = window.performance.now();
        await fetchRegionEndpoint(endpointUrl);
        const finish = window.performance.now();

        return finish - start;
    }

    return {
        async measureLatencyMilliseconds(region) {
            const endpointUrl = getRegionEndpoint(region);
            const attempts = [];

            for (let i = 0; i < attemptCount; i++) {
                attempts.push(await measureMilliseconds(endpointUrl));
            }

            return Math.min(...attempts);
        }
    };
}

function resultTableFactory(resultsElement) {
    resultsElement.innerHTML = '';

    const tableElement = document.createElement('table');
    resultsElement.appendChild(tableElement);

    const headRow = document.createElement('tr');
    tableElement.appendChild(headRow);

    const thRegion = document.createElement('th');
    headRow.appendChild(thRegion);
    thRegion.innerText = 'Region';

    const thLatency = document.createElement('th');
    headRow.appendChild(thLatency);
    thLatency.innerText = 'Latency';

    const loaderElement = document.createElement('div');
    resultsElement.appendChild(loaderElement);
    loaderElement.className = 'loader';

    return {
        addResult(region, latency) {
            const regionRow = document.createElement('tr');
            tableElement.appendChild(regionRow);

            const tdRegion = document.createElement('td');
            regionRow.appendChild(tdRegion);
            tdRegion.innerText = region;

            const tdLatency = document.createElement('td');
            regionRow.appendChild(tdLatency);
            tdLatency.className = 'latency';

            if (latency !== -1) {
                tdLatency.innerText = `${Math.round(latency)} ms`;
            } else {
                tdLatency.innerText = 'unreachable';
            }
        },

        finishResults() {
            loaderElement.parentElement.removeChild(loaderElement);
        },
    };
}

async function startTest() {
    const {getRegions} = getRegionFactory(IP_RANGES_URL);
    const regions = await getRegions();

    if (!regions) {
        console.error('Unable to gather region identifiers');
        return;
    }

    console.log('Region identifiers', regions);

    const resultsElement = document.querySelector('#results');
    const {addResult, finishResults} = resultTableFactory(resultsElement);

    const {measureLatencyMilliseconds} = latencyMeterFactory(REGION_ENDPOINT, 2);

    for (const region of regions.sort()) {
        try {
            const latency = await measureLatencyMilliseconds(region);

            console.log(region, latency);
            addResult(region, latency);
        } catch (e) {
            console.error('Unable to reach region endpoint', region);
            addResult(region, -1);
        }
    }

    finishResults();
}

document.querySelector('#start-test').onclick = startTest;
