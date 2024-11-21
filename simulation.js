// Obtén referencias a los elementos del DOM
const logSection = document.getElementById('log-section');
const generateLogButton = document.getElementById('generate-log');

function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.classList.add(`text-${type}`);

    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${message}`;

    logSection.appendChild(logEntry);

    logSection.scrollTop = logSection.scrollHeight;
}

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