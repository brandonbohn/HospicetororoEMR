import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { NurseInfo, Patient } from '../types'
import { testPatients } from '../test'
import PatientCard from '../components/PatientCard'
import DrugCalculator from '../components/DrugCalculator'
import KMSSearch from '../components/KMSSearch'
import Header from './Header'
import '../css/Dashboard.css'
import '../css/SecureAuth.css'
const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [nurseInfo, setNurseInfo] = useState<NurseInfo | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showKMS, setShowKMS] = useState(false)

  useEffect(() => {
    // Load nurse info from sessionStorage
    const stored = sessionStorage.getItem('nurseInfo')
    if (stored) {
      setNurseInfo(JSON.parse(stored))
    } else {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (nurseInfo) {
      loadPatients()
    }
  }, [nurseInfo])

  const loadPatients = async () => {
    setLoading(true)
    // For now, use test data instead of loading from storage
    // const patientList = await getPatientList()
    setPatients(testPatients)
    setLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('nurseInfo')
    navigate('/')
  }

  if (!nurseInfo) {
    return null
  }

  const myScheduleToday = patients.filter(p => p.scheduledTime)
  const allPatients = patients

  return (
    <>
      <Header nurseInfo={nurseInfo} isOnline={isOnline} onLogout={handleLogout} />
      <div className="container">
        <div className="dashboard-container">
        
        {/* Welcome Message */}
        <div className="welcome-message">
          <h1>Hello {nurseInfo.role === 'doctor' ? 'Doctor' : 'Head Nurse'} {nurseInfo.name}</h1>
        </div>

        {/* Nursing Tools Section */}
        <div className="tools-section">
          <div className="tools-grid">
            <button className="tool-card" onClick={() => setShowKMS(true)}>
              <div className="tool-icon">📚</div>
              <h3>Knowledge Base</h3>
              <p>Search clinical protocols, drug guides, and care procedures</p>
            </button>

            <button className="tool-card" onClick={() => setShowCalculator(true)}>
              <div className="tool-icon">💊</div>
              <h3>Drug Calculator</h3>
              <p>Calculate doses, conversions, and infusion rates</p>
            </button>

            <button className="tool-card" disabled>
              <div className="tool-icon">🩺</div>
              <h3>Symptom Guide</h3>
              <p>Quick reference for symptom management</p>
              <span className="coming-soon">Coming Soon</span>
            </button>

            <button className="tool-card" disabled>
              <div className="tool-icon">📞</div>
              <h3>Emergency Contacts</h3>
              <p>Doctor on-call, pharmacy, ambulance</p>
              <span className="coming-soon">Coming Soon</span>
            </button>

            <button className="tool-card" onClick={() => navigate('/supply-medication')}>
              <div className="tool-icon">📦</div>
              <h3>Supply & Meds</h3>
              <p>Patient medication history & inventory</p>
              <span className="secure-badge">🔒 Secure</span>
            </button>

            <button className="tool-card" disabled>
              <div className="tool-icon">📊</div>
              <h3>Assessment Tools</h3>
              <p>Pain scales and quality assessments</p>
              <span className="coming-soon">Coming Soon</span>
            </button>
          </div>
        </div>
        
        {/* My Schedule Card */}
        {myScheduleToday.length > 0 && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📅 Today's Schedule</h2>
              <span className="patient-count">{myScheduleToday.length}</span>
            </div>
            <div className="card-content">
              <div className="schedule-compact">
                {myScheduleToday.map(patient => (
                  <Link 
                    key={patient.id} 
                    to={`/patient/${patient.id}`} 
                    className="schedule-compact-item"
                  >
                    <span className="schedule-compact-time">
                      {patient.scheduledTime ? new Date(patient.scheduledTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </span>
                    <span className="schedule-compact-patient">Patient {patient.initials}</span>
                    <span className="schedule-compact-location">
                      {patient.location === 'ward' ? '🏥' : '🏠'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Patients Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>👥 My Patients</h2>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="empty-state-small">
                <p>Loading patients...</p>
              </div>
            ) : allPatients.length === 0 ? (
              <div className="empty-state-small">
                <p>No patients assigned yet</p>
              </div>
            ) : (
              <div className="patient-grid">
                {allPatients.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <strong>ℹ️ Privacy Note:</strong> Patient identities protected with numbers only. 
          Full medical records available in secure portal with proper authentication.
        </div>
      </div>
      </div>

      {/* Modals */}
      <DrugCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
      <KMSSearch isOpen={showKMS} onClose={() => setShowKMS(false)} />
    </>
  )
}

export default Dashboard
