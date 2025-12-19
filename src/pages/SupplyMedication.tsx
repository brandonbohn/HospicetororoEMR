import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SecureNoteAccess from '../components/SecureNoteAccess'
import Header from './Header'
import type { NurseInfo } from '../types'
import '../css/Dashboard.css'
import '../css/SupplyMedication.css'

const SupplyMedication: React.FC = () => {
  const navigate = useNavigate()
  const [nurseInfo, setNurseInfo] = useState<NurseInfo | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnline] = useState(navigator.onLine)

  useEffect(() => {
    const stored = sessionStorage.getItem('nurseInfo')
    if (stored) {
      setNurseInfo(JSON.parse(stored))
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('nurseInfo')
    navigate('/')
  }

  if (!nurseInfo) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <SecureNoteAccess
        onAuthenticated={() => setIsAuthenticated(true)}
        onCancel={() => navigate('/dashboard')}
      />
    )
  }

  return (
    <>
      <Header nurseInfo={nurseInfo} isOnline={isOnline} onLogout={handleLogout} />
      <div className="container">
        <div className="dashboard-container">
          
          {/* Page Header */}
          <div className="page-header">
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
            <h1>📦 Supply & Medication Management</h1>
            <p className="page-subtitle">Secure access to patient medication records and inventory</p>
          </div>

          {/* Current Inventory Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📊 Current Inventory Levels</h2>
              <button className="btn btn-primary btn-small">Refresh Stock</button>
            </div>
            <div className="card-content">
              <div className="inventory-grid">
                
                {/* Opioids */}
                <div className="inventory-category">
                  <h3>💊 Opioids (Controlled)</h3>
                  <div className="inventory-items">
                    <div className="inventory-item">
                      <span className="item-name">Morphine 10mg/mL (IV)</span>
                      <span className="item-stock stock-good">24 vials</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">Fentanyl Patches 25mcg/hr</span>
                      <span className="item-stock stock-low">3 patches</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">Oxycodone 5mg (Oral)</span>
                      <span className="item-stock stock-good">180 tablets</span>
                    </div>
                  </div>
                </div>

                {/* Other Medications */}
                <div className="inventory-category">
                  <h3>💉 Other Medications</h3>
                  <div className="inventory-items">
                    <div className="inventory-item">
                      <span className="item-name">Metoclopramide 10mg (IV)</span>
                      <span className="item-stock stock-good">15 ampoules</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">Dexamethasone 4mg (Oral)</span>
                      <span className="item-stock stock-good">120 tablets</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">Diazepam 5mg (IV)</span>
                      <span className="item-stock stock-critical">1 ampoule</span>
                    </div>
                  </div>
                </div>

                {/* Medical Supplies */}
                <div className="inventory-category">
                  <h3>🏥 Medical Supplies</h3>
                  <div className="inventory-items">
                    <div className="inventory-item">
                      <span className="item-name">Sterile Gauze (4x4)</span>
                      <span className="item-stock stock-good">45 packs</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">IV Catheters (22G)</span>
                      <span className="item-stock stock-low">8 units</span>
                    </div>
                    <div className="inventory-item">
                      <span className="item-name">Wound Dressings</span>
                      <span className="item-stock stock-good">22 units</span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="inventory-note">
                ℹ️ Inventory synced with Kobo Forms. Last updated: Today at 14:30
              </div>
            </div>
          </div>

          {/* Patient Medication History */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Patient Medication Administration Records</h2>
              <input 
                type="search" 
                placeholder="Search by Patient ID..." 
                className="search-input"
              />
            </div>
            <div className="card-content">
              <div className="mar-list">
                
                {/* Sample MAR Entry */}
                <div className="mar-entry">
                  <div className="mar-header">
                    <h3>Patient #001</h3>
                    <span className="mar-date">December 19, 2025</span>
                  </div>
                  <div className="mar-items">
                    <div className="mar-item">
                      <span className="mar-time">08:00</span>
                      <span className="mar-drug">Morphine 10mg (IV)</span>
                      <span className="mar-staff">Nurse Sarah</span>
                      <span className="mar-status status-given">✓ Given</span>
                    </div>
                    <div className="mar-item">
                      <span className="mar-time">14:00</span>
                      <span className="mar-drug">Morphine 10mg (IV)</span>
                      <span className="mar-staff">Nurse Sarah</span>
                      <span className="mar-status status-given">✓ Given</span>
                    </div>
                    <div className="mar-item">
                      <span className="mar-time">20:00</span>
                      <span className="mar-drug">Morphine 10mg (IV)</span>
                      <span className="mar-staff">-</span>
                      <span className="mar-status status-pending">⏱ Pending</span>
                    </div>
                  </div>
                </div>

                <div className="mar-entry">
                  <div className="mar-header">
                    <h3>Patient #002</h3>
                    <span className="mar-date">December 19, 2025</span>
                  </div>
                  <div className="mar-items">
                    <div className="mar-item">
                      <span className="mar-time">09:30</span>
                      <span className="mar-drug">Fentanyl Patch 25mcg/hr</span>
                      <span className="mar-staff">Nurse Mary</span>
                      <span className="mar-status status-given">✓ Applied</span>
                    </div>
                    <div className="mar-item">
                      <span className="mar-time">12:00</span>
                      <span className="mar-drug">Dexamethasone 4mg (Oral)</span>
                      <span className="mar-staff">Nurse Mary</span>
                      <span className="mar-status status-given">✓ Given</span>
                    </div>
                  </div>
                </div>

                <div className="wireframe-note">
                  📝 This data will integrate with your Kobo Forms for medication administration tracking
                </div>

              </div>
            </div>
          </div>

          {/* Reorder Alerts */}
          <div className="alert-banner alert-warning">
            <strong>⚠️ Low Stock Alerts:</strong> 
            <span>Fentanyl Patches (3 remaining)</span>
            <span>IV Catheters 22G (8 remaining)</span>
            <span>Diazepam 5mg (1 remaining - CRITICAL)</span>
            <button className="btn btn-small btn-secondary">Request Restock</button>
          </div>

        </div>
      </div>
    </>
  )
}

export default SupplyMedication
