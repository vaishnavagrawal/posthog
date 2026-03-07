export const colors = {
  axisLabel: '#666666',
  axisLine: '#e0e0e0',
  crosshair: '#000000',
  primary: '#1d4aff',
}

export function getGraphColors() {
  return colors
}

export function getBarColorFromStatus(status: string, hover = false) {
  if (status === 'success') return hover ? '#00b300' : '#00ff00'
  if (status === 'warning') return hover ? '#ccaa00' : '#ffcc00'
  if (status === 'danger') return hover ? '#cc0000' : '#ff0000'
  return hover ? '#0000aa' : '#0000ff'
}
