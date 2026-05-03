import { useState } from 'react'
import './App.css'
import type {
  FormData,
  AppState,
  AuthState,
  ExampleDataItem,
} from './types'
import {
  AUDIENCE_OPTIONS,
  GANZTAG_OPTIONS,
  STYPE_OPTIONS,
} from './types'
import { isAuthEnabled, getApiKey, setApiKey, clearApiKey } from './config'
import AuthPage from './AuthPage'
import LogoutModal from './LogoutModal'
import { logo } from './assets'
import { StackedBarChart } from './components/StackedBarChart'
import { processExampleData, getAvailablePlots } from './dataProcessor'
import type { MetaHeader, MetaSet } from './iqb'
import exampleDataJson from './data/example_data.json'
import metaHeadersJson from './data/meta_headers.json'
import metaSetsJson from './data/meta_sets.json'

function App() {
  // Initialize auth state from localStorage on mount
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (!isAuthEnabled()) {
      return {
        isAuthenticated: true,
        apiKey: getApiKey(),
      }
    }
    const savedKey = getApiKey()
    return {
      isAuthenticated: !!savedKey,
      apiKey: savedKey,
    }
  })

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [state, setState] = useState<AppState>({
    formData: {
      snr: '2370',
      audience: 'sus',
      ganztag: false,
      stype: 'gm',
    },
    schoolData: null,
    selectedPlot: null,
    isLoading: false,
    isGeneratingReport: false,
    reportAvailable: false,
  })

  const handleAuthenticate = (apiKey: string) => {
    setApiKey(apiKey)
    setAuthState({
      isAuthenticated: true,
      apiKey,
    })
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    clearApiKey()
    setAuthState({
      isAuthenticated: false,
      apiKey: null,
    })
    // Reset app state
    setState({
      formData: {
        snr: '2370',
        audience: 'sus',
        ganztag: false,
        stype: 'gm',
      },
      schoolData: null,
      selectedPlot: null,
      isLoading: false,
      isGeneratingReport: false,
      reportAvailable: false,
    })
    setShowLogoutModal(false)
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }))
  }

  const handleLoadData = () => {
    if (!authState.isAuthenticated) {
      alert('Authentication required')
      return
    }

    setState((prev) => ({ ...prev, isLoading: true }))
    // TODO: Connect to backend API with authState.apiKey
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        schoolData: {
          name: `School ${prev.formData.snr}`,
          plots: [
            { id: 'plot1', label: 'Plot 1' },
            { id: 'plot2', label: 'Plot 2' },
            { id: 'plot3', label: 'Plot 3' },
          ],
        },
        selectedPlot: 'plot1',
      }))
    }, 1000)
  }

  const handleLoadExampleData = () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    
    setTimeout(() => {
      // Load metadata
      const exampleData = exampleDataJson as ExampleDataItem[]
      const metaHeaders = metaHeadersJson as MetaHeader[]
      const metaSets = metaSetsJson as MetaSet[]
      
      // Process the example data with metadata
      const plotDataMap = processExampleData(exampleData, metaHeaders, metaSets)
      const availablePlots = getAvailablePlots(exampleData)
      
      // Create plot metadata with headers
      const plots = availablePlots.map((plotName) => {
        const plotData = plotDataMap.get(plotName)
        return {
          id: plotName,
          label: plotData?.header2 || `Plot ${plotName}`,
        }
      })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        schoolData: {
          name: 'Beispiel OES Daten',
          plots,
          plotData: plotDataMap,
        },
        selectedPlot: availablePlots[0] || null,
      }))
    }, 500)
  }

  const handleGenerateReport = () => {
    setState((prev) => ({ ...prev, isGeneratingReport: true }))
    // TODO: Connect to backend API
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isGeneratingReport: false,
        reportAvailable: true,
      }))
    }, 2000)
  }

  const handleDownloadReport = () => {
    // TODO: Connect to backend API
    console.log('Downloading report...')
  }

  // Show auth page if not authenticated
  if (!authState.isAuthenticated) {
    return <AuthPage onAuthenticate={handleAuthenticate} />
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="ReportMaster" className="header-logo" />
            <div className="header-text">
              <h1 className="app-title">ReportMaster</h1>
              <p className="app-subtitle">Create LimeSurvey Reports</p>
            </div>
          </div>
          <div className="header-right">
            {isAuthEnabled() && (
              <button className="btn btn-outline" onClick={handleLogoutClick}>
                <span className="icon">⏻️</span>
                Abmelden
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="card">
            <div className="card-header">
              <div className="card-header-content">
                <div>
                  <h3 className="card-title">Konfiguration</h3>
                  <p className="card-subtitle">Schulparameter eingeben</p>
                </div>
                <button
                  className="btn-icon-header"
                  onClick={handleLoadExampleData}
                  disabled={state.isLoading}
                  title="Beispieldaten laden"
                >
                  <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                  <path fill="#E9570F" d="M9.428 10.286A4.286 4.286 0 0 1 13.714 6v-.857a5.143 5.143 0 0 0-5.143 5.143zm4.286-3a3 3 0 0 0-3 3h-.857a3.857 3.857 0 0 1 3.857-3.857zm0 1.285A1.714 1.714 0 0 0 12 10.286h-.858a2.57 2.57 0 0 1 2.572-2.572zm-3.857 6a4.286 4.286 0 0 1-4.286-4.285h-.857a5.143 5.143 0 0 0 5.143 5.143zm-3-4.285a3 3 0 0 0 3 3v.857A3.857 3.857 0 0 1 6 10.286zm1.285 0A1.714 1.714 0 0 0 9.857 12v.857a2.57 2.57 0 0 1-2.572-2.571zm6-.429a4.286 4.286 0 0 1 4.286 4.286h.857A5.143 5.143 0 0 0 14.142 9zm3 4.286a3 3 0 0 0-3-3v-.857A3.86 3.86 0 0 1 18 14.143zm-1.285 0a1.714 1.714 0 0 0-1.715-1.715v-.857a2.57 2.57 0 0 1 2.572 2.572zm-4.286 0a1.714 1.714 0 0 1-1.714 1.714v.857a2.57 2.57 0 0 0 2.571-2.571zm1.286 0a3 3 0 0 1-3 3V18a3.857 3.857 0 0 0 3.857-3.857zm-3 4.285a4.286 4.286 0 0 0 4.285-4.285H15a5.143 5.143 0 0 1-5.143 5.143z"/></svg>
                  </span>
                   <p className="card-subtitle">Beispieldaten</p>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="snr">
                   Schulnummer (SNR):
                </label>
                <input
                  type="text"
                  id="snr"
                  className="form-control"
                  value={state.formData.snr}
                  onChange={(e) => handleInputChange('snr', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="audience">
                  <span className="icon"></span>
                  Befragtengruppe:
                </label>
                <select
                  id="audience"
                  className="form-control"
                  value={state.formData.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                >
                  {AUDIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ganztag">
                  <span className="icon"></span>
                  Ganztag:
                </label>
                <select
                  id="ganztag"
                  className="form-control"
                  value={state.formData.ganztag ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('ganztag', e.target.value === 'true')}
                >
                  {GANZTAG_OPTIONS.map((option) => (
                    <option key={String(option.value)} value={String(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stype">
                  <span className="icon"></span>
                  Schulart:
                </label>
                <select
                  id="stype"
                  className="form-control"
                  value={state.formData.stype}
                  onChange={(e) => handleInputChange('stype', e.target.value)}
                >
                  {STYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-success btn-block btn-large"
                onClick={handleLoadData}
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <span className="spinner-icon">⏳</span>
                    Lade...
                  </>
                ) : (
                  <>
                    <span className="icon">⬇</span>
                    Daten laden
                  </>
                )}
              </button>

              {state.schoolData && (
                <>
                  <div className="divider"></div>
                  <h4 className="section-title">
                    <span className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" d="M22.5 18.5h-.304c-.94 0-1.877-.274-2.564-.917a10.931 10.931 0 0 1-2.061-2.624l-.82-1.459h-.5l-.822 1.459a10.922 10.922 0 0 1-1.75 2.32a4.604 4.604 0 0 1-1.919-1.062a15.292 15.292 0 0 1-2.868-3.674L7.75 10.5h-.498l-1.141 2.043a15.3 15.3 0 0 1-3.286 4.053a3.54 3.54 0 0 1-1.325.722m0 5.182v-21h21v21h-21Zm15-13a2 2 0 1 1 0-4a2 2 0 0 1 0 4Z"/></svg>
                    </span>
                    Abbildung:
                  </h4>
                  <div className="plot-list">
                    {state.schoolData.plots.map((plot) => {
                      const isSelected = state.selectedPlot === plot.id
                      // Extract plot code (e.g., "A11", "B12") from the label
                      const plotCodeMatch = plot.label.match(/^([A-Z]\d+[a-z]?)/)
                      const plotCode = plotCodeMatch ? plotCodeMatch[1] : plot.id
                      const plotDescription = plot.label.replace(/^[A-Z]\d+[a-z]?:\s*/, '')
                      
                      return (
                        <div
                          key={plot.id}
                          className={`plot-item ${isSelected ? 'selected' : ''}`}
                          onClick={() =>
                            setState((prev) => ({ ...prev, selectedPlot: plot.id }))
                          }
                        >
                          <span className="plot-code">{plotCode}</span>
                          <span className="plot-description">{plotDescription}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {state.schoolData && !state.reportAvailable && (
                <>
                  <div className="divider"></div>
                  <div className="action-section">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleGenerateReport}
                      disabled={state.isGeneratingReport}
                    >
                      <span className="icon">📄</span>
                      PDF Report generieren
                    </button>
                    <div className="helper-text">
                      <span className="icon">🕐</span>
                      Dies kann einen Moment dauern ...
                    </div>
                  </div>
                </>
              )}

              {state.isGeneratingReport && (
                <div className="progress-section">
                  <div className="spinner">⏳</div>
                  <p>Generating PDF report...</p>
                </div>
              )}

              {state.reportAvailable && (
                <div className="download-section">
                  <button
                    className="btn btn-success btn-block"
                    onClick={handleDownloadReport}
                  >
                    <span className="icon">💾</span>
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="card card-main">
            <div className="card-header">
              <h2 className="school-name">{state.schoolData?.name || 'Preview Panel'}</h2>
            </div>
            <div className="card-body plot-container">
              {state.schoolData && state.selectedPlot ? (
                state.schoolData.plotData ? (
                  <div className="plot-content">
                    {(() => {
                      const plotData = state.schoolData.plotData.get(state.selectedPlot)
                      if (!plotData) return null
                      
                      const metaSets = metaSetsJson as MetaSet[]
                      
                      return (
                        <StackedBarChart
                          groups={plotData.groups}
                          metaSets={metaSets.filter(m => m.set === plotData.set)}
                          plotName={state.selectedPlot}
                          header1={plotData.header1}
                          header2={plotData.header2}
                          showLegend={true}
                        />
                      )
                    })()}
                  </div>
                ) : (
                  <div className="plot-placeholder">
                    <div className="plot-icon">📈</div>
                    <h3>{state.selectedPlot}</h3>
                    <p className="helper-text">
                      Visualisierungen werden hier angezeigt. (Noch nicht implementiert)
                    </p>
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>Keine Daten verfügbar</h3>
                  <p>Klicken Sie auf "Daten laden" oder "Beispieldaten laden".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        Created with <span className="icon red">❤️</span> and React | By:{' '}
        <a
          href="https://edgar-treischl.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edgar Treischl
        </a>{' '}
        |{' '}
        <a
          href="https://gitlab.lrz.de/edgar-treischl/ReportMasterApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </footer>

      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  )
}

export default App
