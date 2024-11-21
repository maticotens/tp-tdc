const requestsPerSecondElement = document.getElementById('requests-per-second');
const MAX_PROCESS_TIME = 1000;

function processWork(containersPool) {
    let requestsPerSecond = parseInt(requestsPerSecondElement.value);
    let containers = containersPool.length;

    let requestsWithMiliseconds = []
    for(let i = 0; i < requestsPerSecond; i++) {
        let processTime = Math.floor(randomProcessTimeBetween(100, 900)) + 1;
        requestsWithMiliseconds.push({
            request: i,
            time: processTime,
            processed: false
        })
    }

    return processRequests(requestsWithMiliseconds, containers);
}

function processRequests(requestsWithMiliseconds, containers) {
    let containersWithMiliseconds = [];
    for (let i = 0; i < containers; i++) {
        containersWithMiliseconds.push({
            container: i,
            time: MAX_PROCESS_TIME
        })
    }

    for(let i = 0; i < requestsWithMiliseconds.length; i++) {
        let container = containersWithMiliseconds.find(container => container.time >= requestsWithMiliseconds[i].time);
        if(container !== undefined) {
            container.time -= requestsWithMiliseconds[i].time;
            requestsWithMiliseconds[i].processed = true;
        }
    }

    return requestsWithMiliseconds.filter(request => request.processed === true).length;
}

function randomProcessTimeBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}