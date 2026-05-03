import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { type ChartGroup, type MetaSet, getColorMapping, formatPercentage } from '../iqb'
import './StackedBarChart.css'

type StackedBarChartProps = {
  groups: ChartGroup[]
  metaSets: MetaSet[]
  plotName: string
  header1: string
  header2: string
  showLegend?: boolean
}

export function StackedBarChart({ 
  groups, 
  metaSets, 
  plotName,
  header1,
  header2,
  showLegend = true 
}: StackedBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  if (groups.length === 0) {
    return <div className="chart-empty">Keine Daten verfügbar</div>
  }

  const handleDownloadPNG = async () => {
    if (!chartRef.current) return

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${plotName}_${new Date().getTime()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error generating PNG:', error)
      alert('Fehler beim Erstellen des PNG-Bildes')
    }
  }

  // Extract unique categories from all data for legend and sort by meta_sets sort field
  const allCategories = new Set<string>()
  groups.forEach(group => {
    group.data.forEach(item => allCategories.add(item.category))
  })

  // Sort categories based on metaSets sort field
  const sortedCategories = Array.from(allCategories).sort((a, b) => {
    const metaA = metaSets.find(m => m.labels === a)
    const metaB = metaSets.find(m => m.labels === b)
    const sortA = metaA?.sort ? parseInt(metaA.sort, 10) : 999
    const sortB = metaB?.sort ? parseInt(metaB.sort, 10) : 999
    return sortA - sortB
  })

  return (
    <div className="chart-wrapper">
      <div ref={chartRef} className="stacked-bar-chart">
        <div className="chart-headers">
          <h2 className="chart-header1">{header1}</h2>
          <h3 className="chart-header2">{header2}</h3>
        </div>

        <div className="chart-bars">
          {groups.map((group, groupIdx) => {
            // Sort data by metaSets sort field
            const sortedData = [...group.data].sort((a, b) => {
              const metaA = metaSets.find(m => m.labels === a.category)
              const metaB = metaSets.find(m => m.labels === b.category)
              const sortA = metaA?.sort ? parseInt(metaA.sort, 10) : 999
              const sortB = metaB?.sort ? parseInt(metaB.sort, 10) : 999
              return sortA - sortB
            })

            // Calculate cumulative percentages for positioning
            let cumulative = 0
            const bars = sortedData.map((item) => {
              const bar = {
                category: item.category,
                percentage: item.percentage,
                count: item.count,
                start: cumulative,
                width: item.percentage,
              }
              cumulative += item.percentage
              return bar
            })

            return (
              <div key={groupIdx} className="chart-row">
                <div className="chart-label">
                  {group.label.split('\n').map((line, i) => {
                    const parts = line.split(':')
                    if (i === 0 && parts.length > 1) {
                      return (
                        <div key={i} className="label-line">
                          <strong className="var-code">{parts[0]}:</strong>
                          <span className="label-text">{parts.slice(1).join(':')}</span>
                        </div>
                      )
                    }
                    return (
                      <div key={i} className="label-line">
                        <span className="label-text">{line}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="chart-bar-container">
                  {bars.map((bar, barIdx) => {
                    const colors = getColorMapping(metaSets, bar.category)
                    return (
                      <div
                        key={barIdx}
                        className="chart-bar-segment"
                        style={{
                          width: `${bar.width}%`,
                          backgroundColor: colors.bgColor,
                        }}
                        title={`${bar.category}: ${bar.percentage}% (n=${bar.count})`}
                      >
                        <span
                          className="chart-bar-label"
                          style={{
                            color: colors.textColor,
                          }}
                        >
                          {bar.percentage > 3 && (
                            <>
                              {formatPercentage(bar.percentage)}
                              <br />
                              {bar.count}
                            </>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {showLegend && sortedCategories.length > 0 && (
          <div className="chart-legend">
            <div className="legend-items">
              {sortedCategories.map((category) => {
                const colors = getColorMapping(metaSets, category)
                return (
                  <div key={category} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: colors.bgColor }}
                    />
                    <span>{category}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="chart-controls">
        <button 
          className="btn-download" 
          onClick={handleDownloadPNG}
          title="Als PNG herunterladen"
        >
          <span className="icon">💾</span>
          Abbildung herunterladen
        </button>
      </div>
    </div>
  )
}
