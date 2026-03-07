import React from 'react'
import { LineGraph } from './components/LineGraph/LineGraph'
import { FunnelChart } from './components/FunnelChart/FunnelChart'
import { GraphType } from './types'

const MOCK_DATA = {
  results: [
    {
      action: { id: 1, name: 'Pageviews' },
      data: [100, 200, 150, 300, 250, 400],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      label: 'Pageviews'
    },
    {
      action: { id: 2, name: 'Signups' },
      data: [10, 20, 15, 30, 25, 40],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      label: 'Signups',
      borderColor: '#ff0000'
    }
  ]
}

const MOCK_FUNNEL = [
  { name: 'Step 1: Visited Site', count: 1000 },
  { name: 'Step 2: Viewed Pricing', count: 500 },
  { name: 'Step 3: Started Signup', count: 200 },
  { name: 'Step 4: Completed Signup', count: 50 }
]

function App() {
  const labels = MOCK_DATA.results[0].days
  const datasets = MOCK_DATA.results.map((result, i) => ({
    id: result.action.id,
    label: result.label,
    data: result.data,
    backgroundColor: result.borderColor,
    borderColor: result.borderColor
  }))

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>PostHog React SDK Demo</h1>

      <div style={{ marginTop: '40px', border: '1px solid #eaeaea', padding: '20px', borderRadius: '8px' }}>
        <h2>Funnel Chart</h2>
        <div style={{ height: '300px' }}>
          <FunnelChart steps={MOCK_FUNNEL} />
        </div>
      </div>

      <div style={{ marginTop: '40px', border: '1px solid #eaeaea', padding: '20px', borderRadius: '8px' }}>
        <h2>Line Graph</h2>
        <div style={{ height: '400px' }}>
          <LineGraph
            type={GraphType.Line}
            datasets={datasets}
            labels={labels}
          />
        </div>
      </div>

      <div style={{ marginTop: '40px', border: '1px solid #eaeaea', padding: '20px', borderRadius: '8px' }}>
        <h2>Bar Graph</h2>
        <div style={{ height: '400px' }}>
          <LineGraph
            type={GraphType.Bar}
            datasets={datasets}
            labels={labels}
          />
        </div>
      </div>
    </div>
  )
}

export default App
