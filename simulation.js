function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

setInterval(() => {
    for (const canvasId in charts) {
        charts[canvasId].update();
    }
}, 999);

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
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all charts
    initializeChart('errorChart', 'Error', 'red');
    initializeChart('controlChart', 'Salida Controlador', 'blue');
    initializeChart('containersChart', 'Total de Containers', 'purple');
    initializeChart('requestsChart', 'Perturbaciones', 'orange');
    initializeChart('responseTimeChart', 'Salida', 'teal');
    initializeChart('transformationChart', 'Salida transformador (f)', 'green');
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

let scanNum = 0;
let currentResponseTime = 0;
let containersPoolSize = 1;
let requestsPerSecond = []
let totalContainers = []

function scan() {
    let desiredValue = readDesiredValue();

    if(scanNum === 0){
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
    let processResult = processWork(containersPoolSize);
    requestsPerSecond = processResult.processedRequests;
    totalContainers = processResult.containersWithMiliseconds;
    let previousResponseTime = currentResponseTime;
    currentResponseTime = transformFrequencyToTime(requestsPerSecond, requestsAwaiting);

    addLog(desiredValue, previousResponseTime, errorValue, controlValue, containersPoolSize, requestsPerSecond.length, currentResponseTime);

    updateChart('errorChart', errorValue);
    updateChart('controlChart', controlValue);
    updateChart('requestsChart', parseInt(requestsPerSecondElement.value));
    updateChart('containersChart', containersPoolSize);
    updateChart('responseTimeChart', requestsPerSecond.reduce((a,b) => a + b.time, 0)/requestsPerSecond.length);
    updateChart('transformationChart', currentResponseTime);


    scanNum++;
}

function readDesiredValue() {
    return parseFloat(document.getElementById('desired-value').value);
}