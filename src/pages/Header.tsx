import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NurseInfo } from '../types'
import '../css/Header.css'

interface HeaderProps {
  nurseInfo: NurseInfo;
  isOnline: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ nurseInfo, isOnline, onLogout }) => {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Hospice Tororo EMR</h1>
          </div>

          <nav className="header-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/pending" 
              className={`nav-link ${location.pathname === '/pending' ? 'active' : ''}`}
            >
              Pending Sync
            </Link>
          </nav>

          <div className="header-right">
            <div className="nurse-info">
              <span className="nurse-name">{nurseInfo.name}</span>
              <span className="nurse-id">{nurseInfo.role === 'doctor' ? 'Dr.' : 'Nurse'} • ID: {nurseInfo.id}</span>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
