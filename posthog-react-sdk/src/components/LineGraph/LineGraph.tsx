import React, { useState } from 'react'
import 'chartjs-adapter-dayjs-3'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Chart as ReactChart } from 'react-chartjs-2'

import annotationPlugin from 'chartjs-plugin-annotation'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import ChartjsPluginStacked100 from 'chartjs-plugin-stacked100'
import chartTrendline from 'chartjs-plugin-trendline'
import clsx from 'clsx'

import { GraphType } from '../../types'
import { getBarColorFromStatus, getGraphColors } from '../../lib/colors'
import { hexToRGBA, lightenDarkenColor } from '../../utils/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartjsPluginStacked100,
  annotationPlugin,
  chartTrendline,
  ChartDataLabels
)

const RESOLVED_COLOR_MAP = new Map<string, string>()
const INCOMPLETE_SEGMENT_BORDER_DASH = [10, 10]
const LOG_ZERO = 1e-10

export function resolveVariableColor(color: string | undefined): string | undefined {
    if (!color) return color
    if (RESOLVED_COLOR_MAP.has(color)) return RESOLVED_COLOR_MAP.get(color)
    if (color.startsWith('var(--')) {
        const replaced = color.replace('var(', '').replace(')', '')
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue(replaced)
        RESOLVED_COLOR_MAP.set(color, computedColor)
        return computedColor
    }
    RESOLVED_COLOR_MAP.set(color, color)
    return color
}

function createPinstripePattern(color: string, isDarkMode: boolean): CanvasPattern | undefined {
    if (typeof document === 'undefined') return undefined
    const stripeWidth = 8
    const stripeAngle = -22.5

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = stripeWidth * 2

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = isDarkMode ? 'rgba(35, 36, 41, 0.5)' : 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(0, stripeWidth, 1, 2 * stripeWidth)

    const pattern = ctx.createPattern(canvas, 'repeat')
    if (!pattern) return undefined
    const xAx = Math.cos(stripeAngle)
    const xAy = Math.sin(stripeAngle)
    pattern.setTransform(new DOMMatrix([xAx, xAy, -xAy, xAx, 0, 0]))

    return pattern
}

export const LineGraph = ({
    datasets: _datasets,
    labels,
    type,
    isInProgress = false,
    isDarkModeOn = false,
    isArea = false,
    incompletenessOffsetFromEnd = -1,
    showValuesOnSeries,
    showPercentStackView,
    supportsPercentStackView,
    showPercentView,
    hideXAxis,
    hideYAxis,
    yAxisScaleType,
    showMultipleYAxes = false,
    legend = { display: false },
    goalLines: _goalLines = [],
    isStacked = true,
    showTrendLines = false,
    datalabelFormatter,
    className
}: any): JSX.Element => {
    const datasets = _datasets

    const [hoveredDatasetIndex] = useState<number | null>(null)
    const isShiftPressed = false

    const colors = getGraphColors()
    const isHorizontal = type === GraphType.HorizontalBar

    if (type === GraphType.Pie) {
        throw new Error('PieChart is not supported in this basic LineGraph SDK wrapper yet.')
    }

    const isBar = [GraphType.Bar, GraphType.HorizontalBar, GraphType.Histogram].includes(type)
    const isBackgroundBasedGraphType = [GraphType.Bar].includes(type)
    const isPercentStackView = !!supportsPercentStackView && !!showPercentStackView
    const isLog10 = yAxisScaleType === 'log10'
    const isHighlightBarMode = isBar && isStacked && isShiftPressed

    function processDataset(dataset: any, index: number): any {
        const isPrevious = !!dataset.compare && dataset.compare_label === 'previous'
        const isActiveSeries = !dataset.compare || dataset.compare_label !== 'previous'
        const incompleteStartIndex = dataset.data.length + incompletenessOffsetFromEnd

        const themeColor = dataset?.status
            ? getBarColorFromStatus(dataset.status)
            : isHorizontal
              ? dataset.backgroundColor || colors.primary
              : dataset.borderColor || colors.primary

        const mainColor = isPrevious ? `${themeColor}80` : themeColor
        const hoverColor = dataset?.status ? getBarColorFromStatus(dataset.status, true) : mainColor

        let backgroundColor: string | undefined = undefined
        if (isBackgroundBasedGraphType) {
            if (isHighlightBarMode && hoveredDatasetIndex !== null && index !== hoveredDatasetIndex) {
                backgroundColor = hexToRGBA(mainColor, 0.2)
            } else {
                backgroundColor = mainColor
            }
        } else if (isArea) {
            const alpha = isPercentStackView ? 1 : 0.5
            backgroundColor = hexToRGBA(mainColor, alpha)
        }

        let adjustedData = dataset.data
        if (isLog10 && Array.isArray(adjustedData)) {
            adjustedData = adjustedData.map((value: any) => (value === 0 ? LOG_ZERO : value))
        }

        if (showPercentView && Array.isArray(adjustedData)) {
            const count = dataset.count || 1
            adjustedData = adjustedData.map((value: any) => (typeof value === 'number' ? (value / count) * 100 : value))
        }

        const shouldShowIncompleteLineSegment = type === GraphType.Line && isInProgress && isActiveSeries
        const shouldShowIncompleteAreaSegment = shouldShowIncompleteLineSegment && isArea
        const areaIncompletePattern = shouldShowIncompleteAreaSegment
            ? createPinstripePattern(hexToRGBA(mainColor, 0.5), isDarkModeOn)
            : undefined
        const incompleteSegmentBorderDash = shouldShowIncompleteLineSegment
            ? (ctx: any) => ctx.p1DataIndex >= incompleteStartIndex ? INCOMPLETE_SEGMENT_BORDER_DASH : undefined
            : undefined
        const incompleteSegmentBackgroundColor = shouldShowIncompleteAreaSegment
            ? (ctx: any) => ctx.p1DataIndex >= incompleteStartIndex ? areaIncompletePattern : undefined
            : undefined

        return {
            borderColor: mainColor,
            hoverBorderColor: isBackgroundBasedGraphType ? lightenDarkenColor(mainColor, -20) : hoverColor,
            hoverBackgroundColor: isBackgroundBasedGraphType ? lightenDarkenColor(mainColor, -20) : undefined,
            fill: isArea ? 'origin' : false,
            backgroundColor,
            segment: {
                borderDash: incompleteSegmentBorderDash,
                backgroundColor: incompleteSegmentBackgroundColor,
            },
            borderWidth: isBar ? 0 : 2,
            pointRadius: Array.isArray(adjustedData) && adjustedData.length === 1 ? 4 : 0,
            hitRadius: Array.isArray(adjustedData) && adjustedData.length === 1 ? 8 : 0,
            order: 1,
            ...(type === GraphType.Histogram ? { barPercentage: 1 } : {}),
            ...dataset,
            data: adjustedData,
            hoverBorderWidth: isBar ? 0 : 2,
            hoverBorderRadius: isBar ? 0 : 2,
            type: (isHorizontal ? 'bar' : type.toLowerCase()),
            yAxisID:
                type === GraphType.Line && showMultipleYAxes && index > 0 && !dataset.yAxisID
                    ? `y${index}`
                    : dataset.yAxisID
                      ? dataset.yAxisID
                      : 'y',
            ...(showTrendLines
                ? {
                      trendlineLinear: {
                          colorMin: mainColor,
                          colorMax: mainColor,
                          lineStyle: 'dotted',
                          width: 2,
                      },
                  }
                : {}),
        }
    }

    const processedDatasets = datasets.map(processDataset)
    let seriesNonZeroMax = Number.NEGATIVE_INFINITY
    let seriesNonZeroMin = Number.POSITIVE_INFINITY
    for (const dataset of processedDatasets) {
        if (!Array.isArray(dataset.data)) continue
        for (const rawValue of dataset.data) {
            const value = Number(rawValue)
            if (!value || value === LOG_ZERO || Number.isNaN(value)) continue
            if (value > seriesNonZeroMax) seriesNonZeroMax = value
            if (value < seriesNonZeroMin) seriesNonZeroMin = value
        }
    }
    const precision = seriesNonZeroMax < 2 ? 2 : seriesNonZeroMax < 5 ? 1 : 0
    const goalLines = _goalLines.filter(
        (goalLine: any) => goalLine.displayIfCrossed !== false || goalLine.value >= seriesNonZeroMax
    )

    const tickOptions = {
        color: colors.axisLabel,
        font: {
            family: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", Helvetica, Arial, sans-serif',
            size: 12,
            weight: 'normal' as const,
        },
    }

    const gridOptions = {
        color: colors.axisLine,
        tickColor: colors.axisLine,
        tickBorderDash: [4, 2],
    }

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: { tension: 0 },
        },
        interaction: {
            includeInvisible: true,
        },
        plugins: {
            stacked100: { enable: isPercentStackView, precision: 1 },
            datalabels: {
                color: 'white',
                anchor: (context: any) => {
                    const datum = context.dataset?.data[context.dataIndex]
                    return typeof datum !== 'number' ? 'end' : datum > 0 ? 'end' : 'start'
                },
                backgroundColor: (context: any) => (context.dataset?.borderColor as string) || 'black',
                display: (context: any) => {
                    const datum = context.dataset?.data[context.dataIndex]
                    if (showValuesOnSeries === true && typeof datum === 'number' && datum !== 0) return 'auto'
                    return false
                },
                formatter: (value: number, context: any) => {
                    if (datalabelFormatter) return datalabelFormatter(value, context.datasetIndex)
                    return String(value) + (isPercentStackView ? '%' : '')
                },
                borderWidth: 2,
                borderRadius: 4,
                borderColor: 'white',
            },
            legend: legend,
            annotation: {
                annotations: goalLines.reduce((acc: any, annotation: any, idx: number) => {
                    acc[`line-${idx}`] = {
                        type: 'line',
                        yMin: annotation.value,
                        yMax: annotation.value,
                        borderWidth: 2,
                        borderDash: [6, 6],
                        borderColor: resolveVariableColor(annotation.borderColor),
                        label: {
                            content: annotation.label,
                            display: annotation.displayLabel ?? true,
                            position: annotation.position ?? 'end',
                        },
                    }
                    return acc
                }, {}),
            },
            tooltip: {
                enabled: true,
                mode: isHighlightBarMode ? 'point' : 'nearest',
                axis: isHorizontal ? 'y' : 'x',
                intersect: isHighlightBarMode,
            },
        },
        hover: {
            mode: isBar ? 'point' : 'nearest',
            axis: isHorizontal ? 'y' : 'x',
            intersect: false,
        },
    }

    if (type === GraphType.Bar) {
        options.scales = {
            x: {
                display: !hideXAxis,
                beginAtZero: true,
                stacked: isStacked,
                ticks: { ...tickOptions, precision },
                grid: gridOptions,
            },
            y: {
                display: !hideYAxis,
                beginAtZero: true,
                stacked: isStacked,
                ticks: { ...tickOptions, precision },
                grid: gridOptions,
            },
        }
    } else if (type === GraphType.Line) {
        options.scales = {
            x: {
                display: !hideXAxis,
                beginAtZero: true,
                ticks: { ...tickOptions },
                grid: { ...gridOptions, drawOnChartArea: false },
            },
            y: {
                display: !hideYAxis,
                beginAtZero: true,
                type: isLog10 ? 'logarithmic' : 'linear',
                stacked: showPercentStackView || isArea,
                ticks: { ...tickOptions, precision: isLog10 ? undefined : precision },
                grid: gridOptions,
            }
        }
    }

    const chartData: any = {
        labels,
        datasets: processedDatasets
    }

    return (
        <div className={clsx('LineGraph w-full grow relative overflow-hidden', className)} style={{ minHeight: '300px' }}>
            <ReactChart type={(isBar ? 'bar' : type.toLowerCase()) as any} data={chartData} options={options} />
        </div>
    )
}
