
import { LineChart } from '@tremor/react';

// Example types for the raw PostHog input structure and the mapped structure
export interface ExtractedChartProps {
    data: any[]; // The formatted data
    categories: string[]; // The lines/bars to draw
    index: string; // The X-axis key
    colors?: string[]; // Colors for the series
    yAxisWidth?: number;
    showLegend?: boolean;
    className?: string;
    valueFormatter?: (value: number) => string;
}

export function ExtractedLineGraph({
    data,
    categories,
    index,
    colors = ['blue', 'cyan', 'indigo', 'violet', 'fuchsia'],
    yAxisWidth = 40,
    showLegend = true,
    className,
    valueFormatter,
}: ExtractedChartProps) {
    return (
        <LineChart
            className={className || "h-72 mt-4"}
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            yAxisWidth={yAxisWidth}
            showLegend={showLegend}
            valueFormatter={valueFormatter}
        />
    );
}
