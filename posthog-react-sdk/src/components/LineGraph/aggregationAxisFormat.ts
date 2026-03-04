export function formatAggregationAxisValue(filter: any, value: number) {
  return String(value)
}

export function formatPercentStackAxisValue(filter: any, value: number, isPercentStackView?: boolean) {
  return String(value) + (isPercentStackView ? '%' : '')
}
