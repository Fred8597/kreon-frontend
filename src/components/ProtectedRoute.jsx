import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Pendant le chargement initial, on n'affiche rien (évite le flash)
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0f0d',
          color: '#10b981',
          fontSize: '1rem',
        }}
      >
        Chargement...
      </div>
    )
  }

  // Pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Connecté → on affiche le contenu
  return children
}

export default ProtectedRoute