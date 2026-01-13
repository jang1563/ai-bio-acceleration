/**
 * AI-Accelerated Biological Discovery - Chart.js Visualizations
 * ==============================================================
 * 5 main charts:
 * 1. Hero Chart - Acceleration trajectories
 * 2. Monte Carlo Distribution
 * 3. Sobol Sensitivity Analysis
 * 4. Disease Timeline
 * 5. Policy ROI
 */

// Color palette
const COLORS = {
    primary: '#2E86AB',
    primaryLight: 'rgba(46, 134, 171, 0.2)',
    secondary: '#A23B72',
    accent: '#F18F01',
    accentLight: 'rgba(241, 143, 1, 0.3)',
    success: '#28A745',
    warning: '#DC3545',
    neutral: '#3B3B3B',
    neutralLight: '#777777',
    gray: '#E0E0E0',
};

// Chart defaults
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = COLORS.neutral;

// =====================================================
// 1. HERO CHART - Acceleration Trajectories
// =====================================================

function createHeroChart() {
    const ctx = document.getElementById('heroChart');
    if (!ctx) return null;

    // Generate trajectory data
    const years = Array.from({ length: 27 }, (_, i) => 2024 + i);

    function computeTrajectory(gAi, years) {
        return years.map((year, i) => {
            const t = i;
            const Mt = 1 + 4 * (1 - Math.exp(-0.15 * t));
            const At = Math.pow(1 + gAi, t);
            // Cumulative progress
            let progress = 0;
            for (let j = 0; j <= i; j++) {
                const Mt_j = 1 + 4 * (1 - Math.exp(-0.15 * j));
                const At_j = Math.pow(1 + gAi, j);
                progress += Mt_j * Math.sqrt(At_j) / 10;
            }
            return progress;
        });
    }

    // Scenario data
    const baseline = computeTrajectory(0.25, years);
    const pessimistic = computeTrajectory(0.15, years);
    const optimistic = computeTrajectory(0.35, years);
    const amodei = computeTrajectory(0.40, years);
    const noAi = years.map((_, i) => (i + 1) * 0.8 / 10 * 8);

    // Monte Carlo uncertainty band (approximate)
    const ci80Low = baseline.map(v => v * 0.6);
    const ci80High = baseline.map(v => v * 1.5);

    const heroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: '80% CI Upper',
                    data: ci80High,
                    borderColor: 'transparent',
                    backgroundColor: COLORS.primaryLight,
                    fill: '+1',
                    pointRadius: 0,
                    order: 5,
                },
                {
                    label: '80% CI Lower',
                    data: ci80Low,
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    fill: false,
                    pointRadius: 0,
                    order: 5,
                },
                {
                    label: 'Baseline',
                    data: baseline,
                    borderColor: COLORS.primary,
                    backgroundColor: COLORS.primary,
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4,
                    order: 1,
                },
                {
                    label: 'Pessimistic',
                    data: pessimistic,
                    borderColor: COLORS.warning,
                    backgroundColor: COLORS.warning,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4,
                    hidden: true,
                    order: 2,
                },
                {
                    label: 'Optimistic',
                    data: optimistic,
                    borderColor: COLORS.success,
                    backgroundColor: COLORS.success,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4,
                    hidden: true,
                    order: 2,
                },
                {
                    label: 'Amodei Upper',
                    data: amodei,
                    borderColor: '#6F42C1',
                    backgroundColor: '#6F42C1',
                    borderWidth: 2,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4,
                    hidden: true,
                    order: 3,
                },
                {
                    label: 'No AI (counterfactual)',
                    data: noAi,
                    borderColor: COLORS.neutralLight,
                    backgroundColor: COLORS.neutralLight,
                    borderWidth: 1.5,
                    borderDash: [3, 3],
                    fill: false,
                    pointRadius: 0,
                    tension: 0,
                    order: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        filter: (item) => !item.text.includes('CI'),
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: COLORS.neutral,
                    bodyColor: COLORS.neutral,
                    borderColor: COLORS.gray,
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label.includes('CI')) return null;
                            const value = context.parsed.y.toFixed(1);
                            const accel = (context.parsed.y / noAi[context.dataIndex]).toFixed(1);
                            return `${context.dataset.label}: ${value} equiv years (${accel}x)`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: { weight: 'bold' },
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Progress (Equiv. Discovery-Years)',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
    });

    return heroChart;
}

// =====================================================
// 2. MONTE CARLO DISTRIBUTION
// =====================================================

function createMonteCarloChart() {
    const ctx = document.getElementById('monteCarloChart');
    if (!ctx) return null;

    // Simulated Monte Carlo data (approximating actual model output)
    const accelerationData = generateMonteCarloData(1000);
    const histogram = createHistogram(accelerationData, 30);

    // Calculate percentiles
    const sorted = [...accelerationData].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const mean = accelerationData.reduce((a, b) => a + b, 0) / accelerationData.length;

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: histogram.labels,
            datasets: [
                {
                    label: 'Frequency',
                    data: histogram.counts,
                    backgroundColor: histogram.labels.map(label => {
                        const val = parseFloat(label);
                        if (val >= p10 && val <= p90) {
                            return COLORS.accentLight;
                        }
                        return COLORS.primaryLight;
                    }),
                    borderColor: histogram.labels.map(label => {
                        const val = parseFloat(label);
                        if (val >= p10 && val <= p90) {
                            return COLORS.accent;
                        }
                        return COLORS.primary;
                    }),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        title: function(items) {
                            return `Acceleration: ${items[0].label}x`;
                        },
                        label: function(context) {
                            const percent = (context.parsed.y / accelerationData.length * 100).toFixed(1);
                            return `${context.parsed.y} samples (${percent}%)`;
                        },
                    },
                },
                annotation: {
                    annotations: {
                        meanLine: {
                            type: 'line',
                            xMin: mean,
                            xMax: mean,
                            borderColor: COLORS.warning,
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Mean: ${mean.toFixed(1)}x`,
                                position: 'start',
                            },
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Acceleration Factor (x)',
                        font: { weight: 'bold' },
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
    });

    return chart;
}

function generateMonteCarloData(n) {
    // Approximate lognormal distribution for acceleration factor
    const data = [];
    for (let i = 0; i < n; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        // Lognormal with mean ~6.1 and approximate 80% CI [3.4, 9.2]
        const mu = Math.log(5.7);
        const sigma = 0.35;
        const value = Math.exp(mu + sigma * z);

        // Clip to reasonable range
        data.push(Math.max(1.5, Math.min(14, value)));
    }
    return data;
}

function createHistogram(data, bins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;

    const counts = new Array(bins).fill(0);
    const labels = [];

    for (let i = 0; i < bins; i++) {
        labels.push((min + i * binWidth + binWidth / 2).toFixed(1));
    }

    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        counts[binIndex]++;
    });

    return { labels, counts };
}

// =====================================================
// 3. SOBOL SENSITIVITY ANALYSIS
// =====================================================

function createSobolChart() {
    const ctx = document.getElementById('sobolChart');
    if (!ctx) return null;

    const parameters = [
        'AI Growth Rate (g_ai)',
        'Phase 2 Success (p_phase2)',
        'Cognitive Multiplier (M_max)',
        'Saturation Rate (k)',
        'Clinical Multiplier',
        'Data Quality (γ)',
        'Physical Multiplier',
    ];

    const firstOrder = [0.915, 0.045, 0.016, 0.012, 0.009, 0.002, 0.001];
    const totalOrder = [0.942, 0.058, 0.024, 0.018, 0.015, 0.008, 0.005];

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: parameters,
            datasets: [
                {
                    label: 'First-order (S_i)',
                    data: firstOrder,
                    backgroundColor: COLORS.primary,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                },
                {
                    label: 'Total-order (S_Ti)',
                    data: totalOrder,
                    backgroundColor: COLORS.secondary,
                    borderColor: COLORS.secondary,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.x;
                            const percent = (value * 100).toFixed(1);
                            return `${context.dataset.label}: ${percent}%`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sensitivity Index',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });

    return chart;
}

// =====================================================
// 4. DISEASE TIMELINE
// =====================================================

function createDiseaseChart() {
    const ctx = document.getElementById('diseaseChart');
    if (!ctx) return null;

    const diseases = [
        { name: 'Breast Cancer (early)', aiYear: 2028, noAiYear: 2035, prob: 100, category: 'Cancer' },
        { name: 'Lung Cancer', aiYear: 2032, noAiYear: 2045, prob: 85, category: 'Cancer' },
        { name: 'Pancreatic Cancer', aiYear: 2038, noAiYear: 2055, prob: 65, category: 'Cancer' },
        { name: 'Alzheimer\'s', aiYear: 2040, noAiYear: 2065, prob: 64, category: 'Neuro' },
        { name: 'Parkinson\'s', aiYear: 2035, noAiYear: 2055, prob: 72, category: 'Neuro' },
        { name: 'ALS', aiYear: 2042, noAiYear: 2070, prob: 55, category: 'Neuro' },
        { name: 'Type 1 Diabetes', aiYear: 2033, noAiYear: 2048, prob: 78, category: 'Metabolic' },
        { name: 'Cystic Fibrosis', aiYear: 2030, noAiYear: 2042, prob: 90, category: 'Rare' },
        { name: 'Sickle Cell', aiYear: 2028, noAiYear: 2038, prob: 95, category: 'Rare' },
        { name: 'HIV (functional)', aiYear: 2032, noAiYear: 2050, prob: 80, category: 'Infectious' },
        { name: 'Malaria (vaccine)', aiYear: 2027, noAiYear: 2035, prob: 100, category: 'Infectious' },
        { name: 'Pandemic Prep', aiYear: 2026, noAiYear: 2030, prob: 100, category: 'Preparedness' },
    ];

    const categoryColors = {
        'Cancer': '#E63946',
        'Neuro': '#457B9D',
        'Metabolic': '#2A9D8F',
        'Rare': '#E9C46A',
        'Infectious': '#F4A261',
        'Preparedness': '#9B5DE5',
    };

    // Create floating bar data
    const labels = diseases.map(d => d.name);
    const barData = diseases.map(d => [d.aiYear, d.noAiYear]);
    const colors = diseases.map(d => categoryColors[d.category]);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Years Saved (AI acceleration)',
                    data: barData,
                    backgroundColor: colors.map(c => c + '99'),
                    borderColor: colors,
                    borderWidth: 2,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const disease = diseases[context.dataIndex];
                            const yearsSaved = disease.noAiYear - disease.aiYear;
                            return [
                                `With AI: ${disease.aiYear}`,
                                `Without AI: ${disease.noAiYear}`,
                                `Years saved: ${yearsSaved}`,
                                `P(Cure by 2050): ${disease.prob}%`,
                            ];
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Projected Year of Cure/Breakthrough',
                        font: { weight: 'bold' },
                    },
                    min: 2024,
                    max: 2080,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                        stepSize: 10,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: { size: 11 },
                    },
                },
            },
        },
    });

    return chart;
}

// =====================================================
// 5. POLICY ROI
// =====================================================

function createPolicyChart() {
    const ctx = document.getElementById('policyChart');
    if (!ctx) return null;

    const policies = [
        { name: 'Adaptive Trials', roi: 20331, cost: 250, category: 'Regulatory' },
        { name: 'RWE Integration', roi: 12077, cost: 500, category: 'Regulatory' },
        { name: 'Industry-Academia', roi: 9638, cost: 1000, category: 'R&D' },
        { name: 'Target Validation', roi: 5394, cost: 2000, category: 'R&D' },
        { name: 'Double AI Funding', roi: 5140, cost: 5000, category: 'Funding' },
        { name: 'Biobank Expansion', roi: 2847, cost: 1500, category: 'Infrastructure' },
        { name: 'Regulatory Harmony', roi: 2156, cost: 300, category: 'Regulatory' },
        { name: 'AI Safety Standards', roi: 1823, cost: 200, category: 'Regulatory' },
    ];

    const categoryColors = {
        'Regulatory': COLORS.primary,
        'R&D': COLORS.secondary,
        'Funding': COLORS.accent,
        'Infrastructure': COLORS.success,
    };

    const labels = policies.map(p => p.name);
    const roiData = policies.map(p => p.roi);
    const colors = policies.map(p => categoryColors[p.category]);

    // Error bars (80% CI approximation)
    const errorLow = policies.map(p => p.roi * 0.33);
    const errorHigh = policies.map(p => p.roi * 0.38);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'ROI (Mean)',
                    data: roiData,
                    backgroundColor: colors.map(c => c + 'CC'),
                    borderColor: colors,
                    borderWidth: 2,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const policy = policies[context.dataIndex];
                            const roiLow = Math.round(policy.roi * 0.66);
                            const roiHigh = Math.round(policy.roi * 1.38);
                            return [
                                `ROI: ${policy.roi.toLocaleString()}x`,
                                `80% CI: [${roiLow.toLocaleString()}x, ${roiHigh.toLocaleString()}x]`,
                                `Investment: $${policy.cost}M`,
                                `Category: ${policy.category}`,
                            ];
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Return on Investment (ROI)',
                        font: { weight: 'bold' },
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + 'x';
                        },
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });

    return chart;
}

// =====================================================
// INITIALIZE ALL CHARTS
// =====================================================

let charts = {};

function initializeCharts() {
    charts.hero = createHeroChart();
    charts.monteCarlo = createMonteCarloChart();
    charts.sobol = createSobolChart();
    charts.disease = createDiseaseChart();
    charts.policy = createPolicyChart();

    // Set up hero chart controls
    setupHeroControls();
}

function setupHeroControls() {
    const buttons = document.querySelectorAll('.chart-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const scenario = btn.dataset.scenario;

            if (charts.hero) {
                if (scenario === 'baseline') {
                    // Show only baseline + CI
                    charts.hero.data.datasets[3].hidden = true; // Pessimistic
                    charts.hero.data.datasets[4].hidden = true; // Optimistic
                    charts.hero.data.datasets[5].hidden = true; // Amodei
                } else {
                    // Show all scenarios
                    charts.hero.data.datasets[3].hidden = false;
                    charts.hero.data.datasets[4].hidden = false;
                    charts.hero.data.datasets[5].hidden = false;
                }
                charts.hero.update();
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCharts);
} else {
    initializeCharts();
}
