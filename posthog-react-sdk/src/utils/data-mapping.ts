import { GraphDataset } from '../types'

/**
 * Normalizes a raw PostHog Query API response into the expected SDK format.
 * This is an example of what developers would use to wire PostHog and the SDK together.
 */
export function mapQueryResponseToDataset(response: any): { labels: string[], datasets: GraphDataset[] } {
  // If no results, return empty
  if (!response?.results || !Array.isArray(response.results)) {
    return { labels: [], datasets: [] }
  }

  const results = response.results

  // Assume the first result has the labels (e.g., dates)
  const labels = results.length > 0 ? (results[0].labels || results[0].days || []) : []

  const datasets: GraphDataset[] = results.map((result: any, index: number) => {
    return {
      id: result.action?.id || index,
      label: result.action?.name || result.label || `Series ${index + 1}`,
      data: result.data || [],
      count: result.aggregated_value || result.count,
      // Map other useful properties...
    }
  })

  return { labels, datasets }
}
