import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import SupplyMedication from './SupplyMedication'
import '../css/App.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/supply-medication" element={<SupplyMedication />} />
      </Routes>
    </Router>
  )
}

export default App
