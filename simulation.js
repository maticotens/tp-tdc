function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const logSection = document.getElementById('log-section');

let intervalId;
const initSimulationButton = document.getElementById('init-simulation');
const stopSimulationButton = document.getElementById('stop-simulation');
const botsButton = document.getElementById('bots-button');
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

botsButton.addEventListener('click', async () => {
    let previousValue = document.getElementById("requests-per-second").value;
    document.getElementById("requests-per-second").value = 3000;
    await sleep(2200);
    document.getElementById("requests-per-second").value = previousValue;
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