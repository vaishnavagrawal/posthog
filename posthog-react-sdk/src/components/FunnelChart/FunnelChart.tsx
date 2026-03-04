import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Chart as ReactChart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export interface FunnelStep {
  name: string
  count: number
  conversionRate?: number
}

export interface FunnelChartProps {
  steps: FunnelStep[]
  className?: string
  backgroundColor?: string
  borderColor?: string
}

export const FunnelChart = ({
  steps,
  className,
  backgroundColor = 'rgba(29, 74, 255, 0.7)',
  borderColor = 'rgba(29, 74, 255, 1)'
}: FunnelChartProps) => {

  const chartData = useMemo(() => {
    // Process steps and calculate drops
    const data = steps.map(s => s.count)
    const labels = steps.map(s => s.name)

    return {
      labels,
      datasets: [
        {
          label: 'Users',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.8,
        }
      ]
    }
  }, [steps, backgroundColor, borderColor])

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bars representation for standard Funnels
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
             const dataIndex = context.dataIndex;
             const value = context.parsed.x;
             const prevValue = dataIndex > 0 ? steps[dataIndex - 1].count : value;
             const drop = dataIndex > 0 ? prevValue - value : 0;
             const dropPercentage = dataIndex > 0 ? ((drop / prevValue) * 100).toFixed(1) + '%' : '';

             let label = `Count: ${value}`
             if (dataIndex > 0) {
                 label += ` (${dropPercentage} dropoff from previous)`
             }
             return label
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: true }
      },
      y: {
        grid: { display: false }
      }
    }
  }

  if (!steps || steps.length === 0) {
    return <div className="p-4 text-center text-gray-500">No funnel data available</div>
  }

  return (
    <div className={className || ''} style={{ minHeight: '300px', width: '100%' }}>
      <ReactChart type="bar" data={chartData} options={options} />
    </div>
  )
}
