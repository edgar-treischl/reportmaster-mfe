import { useState } from 'react'
import './AuthPage.css'
import { logo } from './assets';


interface AuthPageProps {
  onAuthenticate: (apiKey: string) => void;
}

function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('Bitte einen gültigen API-Key eingeben.')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API validation (replace with actual API call)
    setTimeout(() => {
      // TODO: Validate API key with backend
      // For now, accept any non-empty key
      if (apiKey.trim().length > 0) {
        onAuthenticate(apiKey)
      } else {
        setError('Invalid API key')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side - Logo */}
        <div className="auth-header">
          <div className="logo-large">
            <img src={logo} alt="ReportMaster Logo" />
          </div>
          <h1>ReportMaster</h1>
          <p className="subtitle">Berichte für das OES</p>
          <p className="description">ReportMaster erstellt Umfrageberichte: Die App bietet eine einfache Benutzeroberfläche, um Umfragen auszuwählen, die Daten aus LimeSurvey abzurufen, die Ergebnisse werden visualisiert und in einen PDF-Bericht zusammengefasst.</p>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Anmelden</h2>
                <p>Zum Abbrufen der Daten wird ein API-Key benötigt.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="apiKey">API-Key</label>
              <input
                type="password"
                id="apiKey"
                className="auth-input"
                placeholder="API-Key eingeben"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError('')
                }}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-small">⏳</span>
                  Authentifizieren...
                </>
              ) : (
                'Anmelden'
              )}
            </button>

            <div className="auth-footer">
              <p className="help-text">
               Api-Key? Bitte wenden Sie sich an das Dash-Team, um Zugriff zu erhalten.
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className="auth-page-footer">
        Created with ❤️ and React | By{' '}
        <a
          href="https://edgar-treischl.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edgar Treischl
        </a>
      </footer>
    </div>
  )
}

export default AuthPage
