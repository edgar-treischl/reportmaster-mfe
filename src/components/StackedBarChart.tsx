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

  // Extract unique categories from all data for legend
  const allCategories = new Set<string>()
  groups.forEach(group => {
    group.data.forEach(item => allCategories.add(item.category))
  })

  return (
    <div className="chart-wrapper">
      <div className="chart-controls">
        <button 
          className="btn-download" 
          onClick={handleDownloadPNG}
          title="Als PNG herunterladen"
        >
          <span className="icon">💾</span>
          PNG herunterladen
        </button>
      </div>

      <div ref={chartRef} className="stacked-bar-chart">
        <div className="chart-headers">
          <h2 className="chart-header1">{header1}</h2>
          <h3 className="chart-header2">{header2}</h3>
        </div>

        <div className="chart-bars">
          {groups.map((group, groupIdx) => {
            // Calculate cumulative percentages for positioning
            let cumulative = 0
            const bars = group.data.map((item) => {
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

        {showLegend && allCategories.size > 0 && (
          <div className="chart-legend">
            <div className="legend-items">
              {Array.from(allCategories).map((category) => {
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
    </div>
  )
}
