// IQB Chart types and utilities

export interface ChartDataItem {
  category: string
  percentage: number
  count: number
}

export interface ChartGroup {
  label: string
  data: ChartDataItem[]
  varCode?: string
}

export interface MetaSet {
  set: string
  code: string
  labels: string
  sort: string
  colors: string
  text_color: string
  timestamp: string
}

export interface MetaHeader {
  sort: number
  plot: string
  header1: string
  header2: string
  report: string
}

export function formatPercentage(value: number): string {
  if (value < 5) return ''
  return `${Math.round(value)}%`
}

// Text wrapping utility (similar to R's str_wrap)
export function wrapText(text: string, width: number = 45): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    if ((currentLine + ' ' + word).length <= width) {
      currentLine = currentLine ? currentLine + ' ' + word : word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine) lines.push(currentLine)

  return lines.join('\n')
}

// Format label with bold variable code
export function formatLabelWithCode(varCode: string, labelShort: string): string {
  const wrapped = wrapText(`${varCode}: ${labelShort}`, 45)
  return wrapped
}

// Get color mappings from meta_sets
export function getColorMapping(metaSets: MetaSet[], responseCategory: string): {
  bgColor: string
  textColor: string
} {
  const match = metaSets.find((item) => item.labels === responseCategory)
  if (match && match.colors !== 'NA') {
    return {
      bgColor: match.colors,
      textColor: match.text_color === 'white' ? '#ffffff' : '#000000',
    }
  }
  // Fallback
  return {
    bgColor: '#95a5a6',
    textColor: '#ffffff',
  }
}
