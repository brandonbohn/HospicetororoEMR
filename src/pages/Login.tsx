import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { NurseInfo } from '../types'
import '../css/Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in
    const stored = sessionStorage.getItem('nurseInfo')
    if (stored) {
      navigate('/dashboard')
      return
    }

    // Check for URL parameters from external system
    const staffId = searchParams.get('staffId')
    const staffName = searchParams.get('staffName')
    const staffRole = searchParams.get('role')

    if (staffId && staffName) {
      const nurseInfo: NurseInfo = {
        name: staffName,
        id: staffId,
        role: (staffRole === 'doctor' ? 'doctor' : 'nurse') as 'nurse' | 'doctor',
        loginTime: new Date().toISOString()
      }
      sessionStorage.setItem('nurseInfo', JSON.stringify(nurseInfo))
      navigate('/dashboard')
    }
  }, [navigate, searchParams])

  const handleTestLogin = () => {
    const nurseInfo: NurseInfo = {
      name: 'Test User',
      id: 'TEST001',
      role: 'nurse',
      loginTime: new Date().toISOString()
    }

    sessionStorage.setItem('nurseInfo', JSON.stringify(nurseInfo))
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <div className="login-wrapper">
        <div className="card login-card">
          <h1 className="login-title">Hospice Tororo EMR</h1>
          <p className="login-subtitle">Staff Dashboard Access</p>
          
          <div className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#64748b' }}>
              Please access this system through your staff portal.
            </p>

            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleTestLogin}
            >
              Continue with Test Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
