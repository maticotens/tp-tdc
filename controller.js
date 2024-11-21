const MIN_ERROR = -2000;
const MAX_ERROR = 1000;
const thresholds = [
    { min: MIN_ERROR, max: -1500, value: 3 },
    { min: -1500, max: -1000, value: 2 },
    { min: -1000, max: -500, value: 1 },
    { min: -500, max: 0, value: 0 },
    { min: 0, max: 500, value: -1 },
    { min: 500, max: MAX_ERROR, value: -2 }
]

const last10ErrorValues = [0,0,0,0,0,0,0,0,0,0];

const DERIVATE_INTERVAL = 2;

function calculateControllerValue(errorValue) {
    let proportionalValue = calculateProportionalValue(errorValue);
    let integralValue = calculateIntegralValue(errorValue);
    let derivativeValue = calculateDerivativeValue(errorValue);

    return proportionalValue + integralValue + derivativeValue;
}

function calculateProportionalValue(errorValue) {
    const threshold = thresholds.find(
        range => errorValue >= range.min && errorValue <= range.max
    );

    if(threshold !== undefined) return threshold.value
    if(errorValue < MIN_ERROR) return 3;
    return -2;
}

function calculateIntegralValue(errorValue) {
    last10ErrorValues.pop();
    last10ErrorValues.unshift(errorValue);
    let average = last10ErrorValues.reduce((a, b) => a + b, 0) / last10ErrorValues.length;
    return errorResultValue(average);
}

function calculateDerivativeValue(errorValue) {
    let initialValue = last10ErrorValues[DERIVATE_INTERVAL];
    let derivativeValue = (errorValue - initialValue)/(DERIVATE_INTERVAL+1);
    return errorResultValue(derivativeValue);
}

function errorResultValue(errorValue) {
    if (errorValue > 500) return -1;
    if (errorValue < -1000) return 1;
    return 0;
}