import React, { useState, useEffect } from 'react'
import { 
  isBiometricAvailable, 
  requestBiometricAuth, 
  request2FACode,
  verify2FACode,
  hasMedicalDataAccess 
} from '../utils/secureAuth'

interface SecureNoteAccessProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

const SecureNoteAccess: React.FC<SecureNoteAccessProps> = ({ onAuthenticated, onCancel }) => {
  const [authMethod, setAuthMethod] = useState<'biometric' | '2fa' | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    if (hasMedicalDataAccess()) {
      onAuthenticated()
      return
    }

    // Check biometric availability
    isBiometricAvailable().then(available => {
      setBiometricAvailable(available)
      if (available) {
        setAuthMethod('biometric')
      } else {
        setAuthMethod('2fa')
      }
    })
  }, [onAuthenticated])

  const handleBiometricAuth = async () => {
    setLoading(true)
    setError('')

    const result = await requestBiometricAuth()

    if (result.authenticated) {
      onAuthenticated()
    } else {
      setError('Biometric authentication failed. Try 2FA instead.')
      setAuthMethod('2fa')
    }

    setLoading(false)
  }

  const handleRequest2FA = async () => {
    setLoading(true)
    setError('')

    const success = await request2FACode()

    if (success) {
      setCodeSent(true)
    } else {
      setError('Failed to send verification code. Please try again.')
    }

    setLoading(false)
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await verify2FACode(twoFACode)

    if (result.authenticated) {
      onAuthenticated()
    } else {
      setError('Invalid code. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="secure-auth-overlay">
      <div className="secure-auth-modal">
        <h2>🔒 Secure Medical Data Access</h2>
        <p>Medical notes require additional authentication for privacy protection.</p>

        {error && <div className="error-message">{error}</div>}

        {authMethod === 'biometric' && (
          <div className="auth-method-section">
            <h3>Use Device Security</h3>
            <p>Authenticate using your fingerprint, face, or device PIN</p>
            <button 
              onClick={handleBiometricAuth} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : '🔐 Authenticate'}
            </button>
            {biometricAvailable && (
              <button 
                onClick={() => setAuthMethod('2fa')} 
                className="btn btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Use 2FA Instead
              </button>
            )}
          </div>
        )}

        {authMethod === '2fa' && !codeSent && (
          <div className="auth-method-section">
            <h3>Two-Factor Authentication</h3>
            <p>A verification code will be sent to your registered device</p>
            <button 
              onClick={handleRequest2FA} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : '📱 Send Verification Code'}
            </button>
            {biometricAvailable && (
              <button 
                onClick={() => setAuthMethod('biometric')} 
                className="btn btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Use Biometric Instead
              </button>
            )}
          </div>
        )}

        {authMethod === '2fa' && codeSent && (
          <div className="auth-method-section">
            <h3>Enter Verification Code</h3>
            <form onSubmit={handleVerify2FA}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || twoFACode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button 
                type="button"
                onClick={handleRequest2FA} 
                className="btn btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Resend Code
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={onCancel} 
          className="btn btn-text"
          style={{ marginTop: '20px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default SecureNoteAccess
