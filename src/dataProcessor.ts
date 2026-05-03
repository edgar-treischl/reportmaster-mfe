import type { ExampleDataItem, PlotDataWithMeta } from './types'
import type { ChartGroup, MetaHeader, MetaSet } from './iqb'
import { formatLabelWithCode } from './iqb'

/**
 * Process example data from JSON and convert it to chart groups with metadata
 */
export function processExampleData(
  data: ExampleDataItem[],
  metaHeaders: MetaHeader[],
  metaSets: MetaSet[]
): Map<string, PlotDataWithMeta> {
  const plotMap = new Map<string, PlotDataWithMeta>()

  // Group data by plot_name
  const byPlot = new Map<string, ExampleDataItem[]>()
  data.forEach((item) => {
    const items = byPlot.get(item.plot_name) || []
    items.push(item)
    byPlot.set(item.plot_name, items)
  })

  // Process each plot
  byPlot.forEach((items, plotName) => {
    // Get metadata for this plot
    const header = metaHeaders.find(
      (h) => h.plot === plotName && h.report === 'Survey'
    )
    const header1 = header?.header1 || plotName
    const header2 = header?.header2 || ''
    const set = items[0]?.set || 'set01'

    // Group by vars (question)
    const byQuestion = new Map<string, ExampleDataItem[]>()
    items.forEach((item) => {
      const questionItems = byQuestion.get(item.vars) || []
      questionItems.push(item)
      byQuestion.set(item.vars, questionItems)
    })

    // Convert to ChartGroups
    const groups: ChartGroup[] = []
    byQuestion.forEach((questionItems, vars) => {
      // Get label from first item
      const labelShort = questionItems[0]?.label_short || vars
      const formattedLabel = formatLabelWithCode(vars, labelShort)

      // Sort responses by sort order from meta_sets
      const sortedItems = sortResponseCategories(questionItems, metaSets, set)

      const chartData = sortedItems.map((item) => ({
        category: item.vals,
        percentage: item.p,
        count: item.anz,
      }))

      groups.push({ 
        label: formattedLabel, 
        data: chartData,
        varCode: vars
      })
    })

    plotMap.set(plotName, {
      groups,
      header1,
      header2,
      set,
    })
  })

  return plotMap
}

/**
 * Sort response categories based on meta_sets order
 */
function sortResponseCategories(
  items: ExampleDataItem[],
  metaSets: MetaSet[],
  set: string
): ExampleDataItem[] {
  return [...items].sort((a, b) => {
    const metaA = metaSets.find(
      (m) => m.set === set && m.labels === a.vals
    )
    const metaB = metaSets.find(
      (m) => m.set === set && m.labels === b.vals
    )

    const sortA = metaA ? parseInt(metaA.sort) : 999
    const sortB = metaB ? parseInt(metaB.sort) : 999

    return sortA - sortB
  })
}

/**
 * Get all available plot names from the data
 */
export function getAvailablePlots(data: ExampleDataItem[]): string[] {
  const plotNames = new Set<string>()
  data.forEach((item) => plotNames.add(item.plot_name))
  return Array.from(plotNames).sort()
}
