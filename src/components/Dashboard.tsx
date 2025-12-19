import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { NurseInfo, Patient } from '../types'
import { testPatients } from '../test'
import PatientCard from './PatientCard'
import Header from '../pages/Header'
import '../css/Dashboard.css'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [nurseInfo, setNurseInfo] = useState<NurseInfo | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

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
        
        {/* My Schedule Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📅 My Schedule Today</h2>
            <span className="patient-count">{myScheduleToday.length} scheduled</span>
          </div>
          <div className="card-content">
            {myScheduleToday.length === 0 ? (
              <div className="empty-state-small">
                <p>No patients scheduled for today</p>
              </div>
            ) : (
              <div className="schedule-list">
                {myScheduleToday.map(patient => (
                  <div key={patient.id} className="schedule-item">
                    <div className="schedule-time">
                      {patient.scheduledTime ? new Date(patient.scheduledTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </div>
                    <div className="schedule-details">
                      <div className="patient-id">Patient {patient.initials}</div>
                      <div className="schedule-location">
                        {patient.location === 'ward' ? '🏥 Ward Bed' : '🏠 Home Visit'}
                      </div>
                    </div>
                    <Link to={`/assessment?patientId=${patient.id}`} className="btn btn-small btn-secondary">
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Patients Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>👥 My Patients</h2>
            <Link to="/assessment" className="btn btn-primary">
              + New Assessment
            </Link>
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
    </>
  )
}

export default Dashboard
