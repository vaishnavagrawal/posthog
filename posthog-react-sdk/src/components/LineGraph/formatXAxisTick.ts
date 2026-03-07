export function createXAxisTickCallback(options: any) {
  return function (value: number | string, index: number, ticks: any[]) {
      if (typeof value === 'string') return value
      // simple fallback tick callback for SDK
      const allDays = options?.allDays || []
      const day = allDays[index]
      return day || `Tick ${index}`
  }
}
