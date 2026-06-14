import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#111a14',
          color: '#f0fdf4',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px',
          fontSize: '0.85rem',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#0a0f0d',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#0a0f0d',
          },
        },
      }}
    />
  </StrictMode>
)