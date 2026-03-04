import React, { useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CustomTooltip } from '../Tooltip/CustomTooltip';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface PostHogBarChartProps {
    data: any;
    options?: any;
}

export const PostHogBarChart: React.FC<PostHogBarChartProps> = ({ data, options }) => {
    const chartRef = useRef<any>(null);
    const [tooltipState, setTooltipState] = useState({ opacity: 0, x: 0, y: 0, title: [], dataPoints: [] });

    const handleTooltip = (context: any) => {
        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
            setTooltipState(prev => ({ ...prev, opacity: 0 }));
            return;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        setTooltipState({
            opacity: 1,
            x: position.left + window.pageXOffset + tooltipModel.caretX,
            y: position.top + window.pageYOffset + tooltipModel.caretY,
            title: tooltipModel.title || [],
            dataPoints: tooltipModel.dataPoints || []
        });
    };

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: {
                        family: 'Inter, system-ui, sans-serif',
                        size: 13,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                enabled: false,
                external: handleTooltip,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: { family: 'Inter, system-ui, sans-serif', size: 12 },
                    color: '#6b7280',
                    maxRotation: 0,
                    autoSkipPadding: 20
                }
            },
            y: {
                grid: {
                    color: '#f3f4f6',
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    font: { family: 'Inter, system-ui, sans-serif', size: 12 },
                    color: '#6b7280',
                    padding: 10
                },
                beginAtZero: true
            }
        },
        elements: {
            bar: {
                borderRadius: 2,
                borderWidth: 0,
            }
        }
    };

    return (
        <div className="relative w-full h-[350px]">
            <Bar ref={chartRef} data={data} options={{ ...defaultOptions, ...options }} />
            <CustomTooltip {...tooltipState} />
        </div>
    );
};
