
import { PostHogLineChart } from './components/LineGraph/LineGraph';
import { PostHogBarChart } from './components/BarGraph/BarGraph';
import { mapPostHogTrendsToChartJs } from './utils/data-mapping';
import { mockPostHogTrendsData } from './data/mock-data';

function App() {
  const chartJsData = mapPostHogTrendsToChartJs(mockPostHogTrendsData);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2 font-sans tracking-tight text-gray-900">PostHog UI Decoupled SDK</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          These are native <code>react-chartjs-2</code> wrappers mimicking PostHog's exact visualizations, completely devoid of Kea.js state management. They accept raw PostHog JSON query responses and handle colors, tooltips, and rendering seamlessly out of the box!
        </p>
      </div>

      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 font-sans text-gray-900">Pageviews and Events over Time</h2>
        <PostHogLineChart data={chartJsData} />
      </div>

      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 font-sans text-gray-900">Total Events Stacked</h2>
        <PostHogBarChart
            data={{
                ...chartJsData,
                datasets: chartJsData.datasets.map((d: any) => ({...d, backgroundColor: d.borderColor }))
            }}
            options={{
                scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                }
            }}
        />
      </div>
    </div>
  );
}

export default App;
