function transformFrequencyToTime(requestsPerSecond) {
    let totalWaitingTime = requestsPerSecond.reduce((a, b) => a + b.waitingTime, 0);
    let totalProcessTime = requestsPerSecond.reduce((a, b) => a + b.time, 0);

    let totalTime = totalProcessTime + totalWaitingTime;
    let totalRequests = requestsPerSecond.length;

    return totalTime / totalRequests;
}