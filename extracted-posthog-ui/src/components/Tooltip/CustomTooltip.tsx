import React from 'react';

interface TooltipProps {
    x: number;
    y: number;
    opacity: number;
    title: string[];
    dataPoints: any[];
}

export const CustomTooltip: React.FC<TooltipProps> = ({ x, y, opacity, title, dataPoints }) => {
    if (opacity === 0) return null;

    return (
        <div
            className="absolute bg-white border border-gray-200 shadow-xl rounded-md p-3 text-sm z-50 min-w-[180px] pointer-events-none transition-opacity duration-100 ease-in-out"
            style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -100%)', // Center horizontally above cursor
                marginTop: '-15px',
                opacity: opacity,
            }}
        >
            <div className="font-semibold border-b border-gray-100 pb-2 mb-2 text-gray-800 text-xs text-center uppercase tracking-wider">
                {title.join(' ')}
            </div>
            {dataPoints.map((point, i) => (
                <div key={i} className="flex justify-between items-center text-gray-700 py-0.5 space-x-6">
                    <div className="flex items-center space-x-2">
                        <span
                            className="inline-block w-3 h-3 rounded-sm shadow-sm"
                            style={{ backgroundColor: point.dataset.borderColor || point.dataset.backgroundColor }}
                        />
                        <span className="truncate max-w-[120px] font-medium">{point.dataset.label}</span>
                    </div>
                    <span className="font-bold tabular-nums text-gray-900">{point.formattedValue}</span>
                </div>
            ))}
            {/* Tooltip caret */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
        </div>
    );
};
