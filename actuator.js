function calculateActuatorValue(controlValue, containersPool) {
    containersPool += controlValue;
    if(containersPool <= 0) containersPool = 1;
    return containersPool;
}