export enum GraphType {
  Line = 'Line',
  Bar = 'Bar',
  HorizontalBar = 'HorizontalBar',
  Pie = 'Pie',
  Histogram = 'Histogram',
  Area = 'Area',
}

export interface GraphDataset {
  id: string | number
  label: string
  data: number[] | (number | null)[]
  backgroundColor?: string
  borderColor?: string
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  borderWidth?: number
  hoverBorderWidth?: number
  type?: string
  fill?: boolean | string
  dotted?: boolean
  days?: string[]
  labels?: string[]
  actions?: any[]
  breakdownLabels?: string[]
  compareLabels?: string[]
  status?: string
  count?: number
  yAxisID?: string
  persons_urls?: any[]
  compare?: boolean
  compare_label?: string
}

export interface GraphPoint {
  dataset: GraphDataset
  index: number
}

export interface GraphPointPayload {
  points: {
      pointsIntersectingLine: GraphPoint[]
      pointsIntersectingClick: GraphPoint[]
      clickedPointNotLine: boolean
      referencePoint: GraphPoint
  }
  index: number
  crossDataset: any[]
  seriesId: string | number
}

export interface GoalLine {
  value: number
  label: string
  displayLabel?: boolean
  borderColor?: string
  position?: 'start' | 'center' | 'end'
  displayIfCrossed?: boolean
}

export type TrendsFilter = any // Simplified for SDK
export type TooltipConfig = any // Simplified for SDK
