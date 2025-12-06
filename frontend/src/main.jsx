import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Configure axios base URL for production
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://16.16.65.200:5000'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
