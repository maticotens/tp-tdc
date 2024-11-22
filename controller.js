const percentThresholds = (desiredValue) => [
    { min: -1*desiredValue, max: -0.80*desiredValue, value: 6 },
    { min: -0.80*desiredValue, max: -0.60*desiredValue, value: 3 },
    { min: -0.60*desiredValue, max: -0.40*desiredValue, value: 1 },
    { min: -0.40*desiredValue, max: 0.15*desiredValue, value: 0 },
    { min: 0.15*desiredValue, max: 0.60*desiredValue, value: -1 },
    { min: 0.60*desiredValue, max: 0.80*desiredValue, value: -3 },
    { min: 0.80*desiredValue, max: desiredValue, value: -6 }
]

const last10ErrorValues = [0,0,0,0,0,0,0,0,0,0];

const DERIVATE_INTERVAL = 1;

function calculateControllerValue(errorValue) {
    let proportionalValue = calculateProportionalValue(errorValue);
    //let integralValue = calculateIntegralValue(errorValue);
    let derivativeValue = calculateDerivativeValue(errorValue);

    return proportionalValue + derivativeValue;
}

function calculateProportionalValue(errorValue) {
    const threshold = percentThresholds(readDesiredValue()).find(
        range => errorValue >= range.min && errorValue <= range.max
    );

    let result = 0;
    let inactiveContainers = totalContainers.filter(container => !container.isWorking).length;
    console.log(inactiveContainers);
    let wastedTime = inactiveContainers*1000;
    if(wastedTime >= 0.9*containersPoolSize*1000) result-=12;
    if(wastedTime >= 0.7*containersPoolSize*1000) result-=6;
    if(wastedTime >= 0.4*containersPoolSize*1000) result-=3;

    if(threshold !== undefined) return result+threshold.value
    if(errorValue < -readDesiredValue()) return result+8;
    return result-8;
}

function calculateIntegralValue(errorValue) {
    last10ErrorValues.pop();
    last10ErrorValues.unshift(errorValue);
    let average = last10ErrorValues.reduce((a, b) => a + b, 0) / last10ErrorValues.length;
    return errorResultValue(average);
}

function calculateDerivativeValue(errorValue) {
    last10ErrorValues.pop();
    last10ErrorValues.unshift(errorValue);

    let initialValue = last10ErrorValues[DERIVATE_INTERVAL];
    let derivativeValue = (errorValue - initialValue)/(DERIVATE_INTERVAL);
    return errorResultValue(derivativeValue);
}

function errorResultValue(errorValue) {
    if (errorValue > 500) return -10;
    if (errorValue < -1000) return 10;
    return 0;
}