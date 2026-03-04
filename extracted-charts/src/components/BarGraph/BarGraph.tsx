import React from 'react';
import { BarChart } from '@tremor/react';
import { ExtractedChartProps } from '../LineGraph/LineGraph';

export function ExtractedBarGraph({
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
        <BarChart
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
