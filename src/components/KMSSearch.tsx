import React, { useState } from 'react'
import '../css/KMSSearch.css'

interface KMSSearchProps {
  isOpen: boolean
  onClose: () => void
}

const KMSSearch: React.FC<KMSSearchProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to KMS registry backend
    console.log('Searching KMS for:', searchQuery)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content kms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📚 Knowledge Management System</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="kms-body">
          <form onSubmit={handleSearch} className="kms-search-form">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols, drug guides, procedures..."
              className="kms-search-input"
              autoFocus
            />
            <button type="submit" className="kms-search-btn">Search</button>
          </form>

          <div className="kms-placeholder">
            <div className="kms-icon">📚</div>
            <h3>KMS Integration Coming Soon</h3>
            <p>This will search your clinical knowledge base for:</p>
            <ul className="kms-features">
              <li>Clinical protocols and guidelines</li>
              <li>Drug dosing and interactions</li>
              <li>Symptom management procedures</li>
              <li>Palliative care best practices</li>
              <li>Emergency procedures</li>
            </ul>
            <p className="kms-note">Backend integration required</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KMSSearch
