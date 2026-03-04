export interface PostHogTrendsResult {
    data: number[];
    days: string[];
    labels: string[];
    label: string;
}

export interface PostHogTrendsResponse {
    results: PostHogTrendsResult[];
}

/**
 * Maps the raw JSON response from PostHog's `/api/projects/:id/query` (Trends)
 * into an array of objects that Tremor's `LineChart` and `BarChart` expect.
 *
 * Tremor expects an array of objects where each object represents a point on the x-axis,
 * containing properties for the x-axis label and a value for each category (line/bar).
 *
 * Example PostHog Input:
 * {
 *   results: [
 *     { data: [10, 20], days: ["2023-01-01", "2023-01-02"], label: "Pageview" },
 *     { data: [5, 15], days: ["2023-01-01", "2023-01-02"], label: "Click" }
 *   ]
 * }
 *
 * Example Tremor Output:
 * [
 *   { date: "2023-01-01", "Pageview": 10, "Click": 5 },
 *   { date: "2023-01-02", "Pageview": 20, "Click": 15 }
 * ]
 */
export function mapTrendsResponseToTremorData(response: PostHogTrendsResponse | any) {
    if (!response || !response.results || response.results.length === 0) {
        return { mappedData: [], categories: [] };
    }

    const results = response.results as PostHogTrendsResult[];
    const mappedData: Record<string, any>[] = [];
    const categories: string[] = [];

    // Assuming the 'days' array is consistent across all results
    // We use the first result's days as our baseline for the x-axis index
    const baseDays = results[0].days || results[0].labels;

    if (!baseDays) {
        return { mappedData: [], categories: [] };
    }

    for (let i = 0; i < baseDays.length; i++) {
        const dataPoint: Record<string, any> = {
            date: baseDays[i] // this will act as the "index" for Tremor
        };

        for (const series of results) {
            const seriesName = series.label || "Series";
            if (!categories.includes(seriesName)) {
                categories.push(seriesName);
            }
            // Populate the value for this series at this specific day index
            dataPoint[seriesName] = series.data[i] || 0;
        }

        mappedData.push(dataPoint);
    }

    return { mappedData, categories, indexKey: "date" };
}
