import React from 'react'
import type { Patient } from '../types'

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const formatTime = (timestamp: string | undefined): string => {
    if (!timestamp) return 'Not recorded'
    const date = new Date(timestamp)
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPainLevelClass = (level: number | undefined): string => {
    if (!level) return 'pain-none'
    if (level <= 3) return 'pain-low'
    if (level <= 6) return 'pain-medium'
    return 'pain-high'
  }

  const getLocationDisplay = (location: 'ward' | 'home'): string => {
    return location === 'ward' ? 'Ward Bed' : 'Home Visit'
  }

  const getLocationIcon = (location: 'ward' | 'home'): string => {
    return location === 'ward' ? '🏥' : '🏠'
  }

  const handleSecureClick = (e: React.MouseEvent, patientId: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/patient/${patientId}/secure-notes`
  }

  return (
    <div className="patient-card-big">
      <div className="patient-card-header">
        <div>
          <h3>Patient {patient.initials}</h3>
          <span className={`location-badge ${patient.location}`}>
            {getLocationIcon(patient.location)} {getLocationDisplay(patient.location)}
          </span>
        </div>
      </div>

      <div className="patient-card-body">
        {/* Summary Paragraph - Actions History */}
        {(patient.lastAction || patient.lastAssessment) && (
          <div className="patient-summary">
            {patient.lastAction && <p className="summary-text">{patient.lastAction}</p>}
            <div className="summary-meta">
              {patient.lastAssessment && (
                <span>{formatTime(patient.lastAssessment)}</span>
              )}
              {patient.lastStaffName && (
                <span>by {patient.lastStaffName}</span>
              )}
              {patient.currentPainLevel !== undefined && (
                <span className={`pain-badge-inline ${getPainLevelClass(patient.currentPainLevel)}`}>
                  Pain: {patient.currentPainLevel}/10
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recent Medications */}
        {patient.recentMedications && patient.recentMedications.length > 0 && (
          <div className="info-row-vertical">
            <span className="info-label">Medications:</span>
            <div className="medication-tags">
              {patient.recentMedications.map((med, idx) => (
                <span key={idx} className="medication-tag">{med}</span>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Notes Preview */}
        {patient.notes && (
          <div className="notes-section">
            <div className="notes-label">Clinical Notes:</div>
            <p className="notes-preview-text">
              {patient.notes.length > 120 ? patient.notes.substring(0, 120) + '...' : patient.notes}
            </p>
            <button 
              onClick={(e) => handleSecureClick(e, patient.id)}
              className="btn-read-more"
            >
              🔒 Read Full Notes (Secure Login Required)
            </button>
          </div>
        )}

        {!patient.notes && (
          <div className="notes-section">
            <button 
              onClick={(e) => handleSecureClick(e, patient.id)}
              className="btn-read-more"
            >
              🔒 View Full Details (Secure Login Required)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientCard
