import { useState } from 'react'
import './AuthPage.css'
import logo from './assets/logo.png'

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
      setError('Please enter an API key')
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
          <p className="subtitle">School Report Generation System</p>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>Enter your API key to access the application</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="apiKey">API Key</label>
              <input
                type="password"
                id="apiKey"
                className="auth-input"
                placeholder="Enter your API key"
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
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="auth-footer">
              <p className="help-text">
                Need an API key? Contact your system administrator.
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className="auth-page-footer">
        Created with ❤️ by{' '}
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
