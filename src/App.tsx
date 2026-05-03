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
          name: 'Example Survey Data',
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
              <h3 className="card-title">Konfiguration</h3>
              <p className="card-subtitle">Schulparameter eingeben</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="snr">
                  <span className="icon">🔢</span>
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
                  <span className="icon">👥</span>
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
                  <span className="icon">⏰</span>
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
                  <span className="icon">🎓</span>
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
                    <span className="icon">⬇️</span>
                    Daten laden
                  </>
                )}
              </button>

              <button
                className="btn btn-outline btn-block"
                onClick={handleLoadExampleData}
                disabled={state.isLoading}
                style={{ marginTop: '8px' }}
              >
                <span className="icon">📊</span>
                Beispieldaten laden
              </button>

              {state.schoolData && (
                <>
                  <div className="divider"></div>
                  <h4 className="section-title">
                    <span className="icon">📊</span>
                    Abbildung:
                  </h4>
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={state.selectedPlot || ''}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, selectedPlot: e.target.value }))
                      }
                    >
                      {state.schoolData.plots.map((plot) => (
                        <option key={plot.id} value={plot.id}>
                          {plot.label}
                        </option>
                      ))}
                    </select>
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
