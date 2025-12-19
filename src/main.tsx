import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import './css/index.css'
import { registerSW } from './utils/registerSW'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA
registerSW()
