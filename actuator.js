function calculateActuatorValue(controlValue, containersPool) {
    if(controlValue > 0) return addContainers(containersPool, controlValue);
    if(controlValue < 0) return removeContainers(containersPool, controlValue);

    return containersPool;
}

function addContainers(containersPool, controlValue) {
    for(let i = 0; i < controlValue; i++) {
        let randomContainer = Math.floor(Math.random() * 100) + 1;
        while(containersPool.includes(randomContainer)) {
            randomContainer = Math.floor(Math.random() * 100) + 1;
        }
        containersPool.push(randomContainer);
    }
    return containersPool;
}

function removeContainers(containersPool, controlValue) {
    for(let i = 0; i < controlValue; i++) {
        containersPool.pop();
    }
    return containersPool;
}