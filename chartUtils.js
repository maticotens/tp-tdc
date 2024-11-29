// Object to hold chart instances
const charts = {};

// Function to initialize a chart
function initializeChart(canvasId, label, lineColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Empty labels initially
            datasets: [
                {
                    label: label,
                    data: [],
                    borderColor: lineColor,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Scan',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: label,
                    },
                },
            },
        },
    });

    // Save the chart instance
    charts[canvasId] = chart;
}

// Function to update chart data
function updateChart(canvasId, newData) {
    const chart = charts[canvasId];
    if (chart) {
        const labels = chart.data.labels;
        const dataset = chart.data.datasets[0].data;

        // Add a new label and data point
        labels.push(scanNum);
        dataset.push(newData);

        // Keep only the last 10 data points
        if (labels.length > 10) labels.shift();
        if (dataset.length > 10) dataset.shift();

        // Update the chart data
        chart.data.labels = labels;
        chart.data.datasets[0].data = dataset;

        // Update the chart
        chart.update();
    }
}

// Expose functions globally
window.initializeChart = initializeChart;
window.updateChart = updateChart;
