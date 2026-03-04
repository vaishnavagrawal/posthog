import React, { useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CustomTooltip } from '../Tooltip/CustomTooltip';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export interface PostHogLineChartProps {
    data: any;
    options?: any;
}

export const PostHogLineChart: React.FC<PostHogLineChartProps> = ({ data, options }) => {
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
                enabled: false, // Disable default tooltip
                external: handleTooltip, // Handle via our custom tooltip
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
            line: {
                tension: 0.2, // Smooth curves similar to PostHog
                borderWidth: 2,
            },
            point: {
                radius: 0, // Hide points by default
                hoverRadius: 5,
                hitRadius: 10,
            }
        }
    };

    return (
        <div className="relative w-full h-[350px]">
            <Line ref={chartRef} data={data} options={{ ...defaultOptions, ...options }} />
            <CustomTooltip {...tooltipState} />
        </div>
    );
};
