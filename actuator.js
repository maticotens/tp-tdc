const MAX_CONTAINERS = 300

function calculateActuatorValue(controlValue, containersPool) {
    containersPool += controlValue;
    if(containersPool <= 0) containersPool = 1;
    return Math.min(containersPool, MAX_CONTAINERS);
}