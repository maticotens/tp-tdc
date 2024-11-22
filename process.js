const requestsPerSecondElement = document.getElementById('requests-per-second');
const MAX_PROCESS_TIME = 1000;

let requestsAwaiting = [];

function processWork(containersPool) {
    let requestsPerSecond = parseInt(requestsPerSecondElement.value);

    for(let i = 0; i < requestsPerSecond; i++) {
        let processTime = Math.floor(randomProcessTimeBetween(600, 1200)) + 1;
        requestsAwaiting.unshift({
            time: processTime,
            waitingTime: 0
        })
    }

    return processRequests(containersPool);
}

function processRequests(containers) {
    let containersWithMiliseconds = [];
    for (let i = 0; i < containers; i++) {
        containersWithMiliseconds.push({
            container: i,
            time: MAX_PROCESS_TIME,
            isWorking: false
        })
    }

    let processedRequests = [];

    for (let i = 0; i < containersWithMiliseconds.length; i++) {
        while(containersWithMiliseconds[i].time > 0 && requestsAwaiting.length > 0) {
            let request = requestsAwaiting.pop();

            containersWithMiliseconds[i].time -= request.time;
            containersWithMiliseconds[i].isWorking = true;

            if(containersWithMiliseconds[i].time <= 0) {
                containersWithMiliseconds[i].time = 0;
            }

            processedRequests.unshift({
                ...request,
                container: containersWithMiliseconds[i].isWorking
            });
        }
    }

    requestsAwaiting = requestsAwaiting.map(request => ({
        ...request,
        waitingTime: request.waitingTime + 1000
    }))

    return {
        processedRequests: processedRequests,
        containersWithMiliseconds: containersWithMiliseconds
    };
}

function randomProcessTimeBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}