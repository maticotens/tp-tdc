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

    logEntry.innerHTML = `<span class="log-time">[${timestamp}] </span>` +
        `<span class="text-danger">Tiempo de respuesta: ${currentResponseTime.toFixed(2)}</span><span class="text-black">. </span>` +
        `<span class="text-success">Valor esperado: ${desiredValue}</span><span class="text-black">. </span>` +
        `<span class="text-primary">Containers a agregar: ${controlValue}</span>` +
        `<span class="text-black">. Pool containers: ${containersPool}</span>` +
        `<span class="text-black">. Requests: ${requestsPerSecond}. </span>` +
        `<span class="text-black">Pendientes: ${requestsAwaiting.length}. </span>`;

    logSection.appendChild(logEntry);

    logSection.scrollTop = logSection.scrollHeight;
}

scanNum = 0;
currentResponseTime = 0;
containersPoolSize = 1;
requestsPerSecond = []
totalContainers = []

function scan() {
    let desiredValue = readDesiredValue();

    if(scanNum == 0){
        currentResponseTime = desiredValue;
        requestsPerSecond = [
            {
                time: 100,
                waitingTime: 0,
                container: false
            }
        ];
        totalContainers = [
            {
                container: 1,
                time: 1000,
                isWorking: false
            }
        ];
    }

    let errorValue = desiredValue - currentResponseTime;

    let controlValue = calculateControllerValue(errorValue);

    let previousContainersCount = containersPoolSize;
    containersPoolSize = calculateActuatorValue(controlValue, containersPoolSize);

    processResult = processWork(containersPoolSize);

    requestsPerSecond = processResult.processedRequests;

    totalContainers = processResult.containersWithMiliseconds;

    let previousResponseTime = currentResponseTime;

    currentResponseTime = transformFrequencyToTime(requestsPerSecond, requestsAwaiting);

    addLog(desiredValue, previousResponseTime, errorValue, controlValue, containersPoolSize, requestsPerSecond.length, currentResponseTime)

    scanNum++;
}

function readDesiredValue() {
    return parseFloat(document.getElementById('desired-value').value);
}