const MAX_CONCURRENT_REQUESTS = 4;

function transformFrequencyToTime(requestsPerSecond, containers) {
    return 1 / (containers*MAX_CONCURRENT_REQUESTS - requestsPerSecond);
}