/*
generateLogButton.addEventListener('click', () => {
    const logTypes = ['info', 'warning', 'danger', 'success'];
    const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
    const messages = [
        'User logged in',
        'Data fetched successfully',
        'Error connecting to the server',
        'New record created',
        'User logged out',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    addLog(randomMessage, randomType);
});
function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.classList.add(`text-${type}`);

    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${message}`;

    logSection.appendChild(logEntry);

    logSection.scrollTop = logSection.scrollHeight;
}
 */

const logSection = document.getElementById('log-section');

let intervalId;
const initSimulationButton = document.getElementById('init-simulation');
const stopSimulationButton = document.getElementById('stop-simulation');
const SCAN_INTERVAL = 1000;

initSimulationButton.addEventListener('click', () => {
    if (!intervalId) intervalId = setInterval(scan, SCAN_INTERVAL);
});

stopSimulationButton.addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

function addLog(desiredValue, previousResponseTime, errorValue, controlValue, containersPool, requestsPerSecond, currentResponseTime) {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');

    const timestamp = new Date().toLocaleTimeString();

    logEntry.innerHTML = `<span class="log-time">${timestamp}</span>` +
        `<span class="log-desired-value">Desired Value: ${desiredValue}</span>` +
        `<span class="log-previous-response-time">Previous Response Time: ${previousResponseTime}</span>` +
        `<span class="log-error-value">Error Value: ${errorValue}</span>` +
        `<span class="log-control-value">Control Value: ${controlValue}</span>` +
        `<span class="log-containers-pool">Containers Pool: ${containersPool}</span>` +
        `<span class="log-requests-per-second">Requests per Second: ${requestsPerSecond}</span>` +
        `<span class="log-current-response-time">Current Response Time: ${currentResponseTime}</span>`;

    logSection.appendChild(logEntry);

    logSection.scrollTop = logSection.scrollHeight;
}

currentResponseTime = 0;
containersPool = [0];

function scan() {
    let desiredValue = readDesiredValue();

    let previousResponseTime = currentResponseTime;

    let errorValue = desiredValue - currentResponseTime;

    let controlValue = calculateControllerValue(errorValue);

    let previousContainersCount = containersPool.length;
    containersPool = calculateActuatorValue(controlValue, containersPool);

    let requestsPerSecond = processWork(containersPool);

    currentResponseTime = transformFrequencyToTime(requestsPerSecond, previousContainersCount);

    addLog(desiredValue, previousResponseTime, errorValue, controlValue, containersPool, requestsPerSecond, currentResponseTime)
}

function readDesiredValue() {
    return parseFloat(document.getElementById('desired-value').value);
}