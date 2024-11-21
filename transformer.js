function transformFrequencyToTime(requestsPerSecond, containers) {
    if(requestsPerSecond <= 0) return 3000;
    return 1000 / requestsPerSecond;
}