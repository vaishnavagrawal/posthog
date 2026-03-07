import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PostHogReactSDK',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'chart.js', 'react-chartjs-2', 'chartjs-plugin-trendline', 'chartjs-plugin-datalabels', 'chartjs-plugin-stacked100', 'chartjs-plugin-annotation', 'chartjs-adapter-dayjs-3', 'clsx'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'chart.js': 'Chart',
          'react-chartjs-2': 'ReactChartJS2'
        }
      }
    }
  }
})
