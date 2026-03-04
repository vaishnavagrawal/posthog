import { POSTHOG_PALETTE } from './colors';

/**
 * Maps PostHog Trends API JSON response directly to Chart.js datasets format.
 */
export function mapPostHogTrendsToChartJs(response: any) {
    if (!response || !response.results || response.results.length === 0) {
        return { labels: [], datasets: [] };
    }

    const results = response.results;
    const labels = results[0].days || results[0].labels;

    const datasets = results.map((series: any, index: number) => {
        const color = POSTHOG_PALETTE[index % POSTHOG_PALETTE.length];

        return {
            label: series.label || `Series ${index + 1}`,
            data: series.data,
            borderColor: color,
            backgroundColor: `${color}1A`, // 1A is 10% opacity in hex
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            fill: false, // Default to false, can be overridden by options
        };
    });

    return { labels, datasets };
}
