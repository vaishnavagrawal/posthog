
import { ExtractedLineGraph } from './components/LineGraph/LineGraph';
import { ExtractedBarGraph } from './components/BarGraph/BarGraph';
import { mapTrendsResponseToTremorData } from './utils/data-mapping';
import { mockPostHogTrendsData } from './data/mock-data';

function App() {
  const { mappedData, categories, indexKey } = mapTrendsResponseToTremorData(mockPostHogTrendsData);

  const valueFormatter = (number: number) => {
    return new Intl.NumberFormat('us').format(number).toString();
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-2">PostHog Extracted Charts Demo</h1>
        <p className="text-gray-600 mb-8">
          Below are the `LineGraph` and `BarGraph` components running independently of PostHog,
          powered by Tremor and mapped directly from a mock PostHog Query API response.
        </p>
      </div>

      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Line Graph Overview</h2>
        <ExtractedLineGraph
          data={mappedData}
          categories={categories}
          index={indexKey || "date"}
          valueFormatter={valueFormatter}
        />
      </div>

      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Bar Graph Overview</h2>
        <ExtractedBarGraph
          data={mappedData}
          categories={categories}
          index={indexKey || "date"}
          valueFormatter={valueFormatter}
        />
      </div>
    </div>
  );
}

export default App;
