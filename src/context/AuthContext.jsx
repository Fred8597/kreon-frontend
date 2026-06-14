import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ===== RESTAURATION SESSION AU DÉMARRAGE =====
  useEffect(() => {
    const token = localStorage.getItem('kreon_token')
    const userData = localStorage.getItem('kreon_user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        localStorage.removeItem('kreon_token')
        localStorage.removeItem('kreon_user')
      }
    }
    setLoading(false)
  }, [])

  // ===== INSCRIPTION =====
  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData)
      localStorage.setItem('kreon_token', data.token)
      localStorage.setItem('kreon_user', JSON.stringify(data))
      setUser(data)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur d'inscription",
      }
    }
  }

  // ===== CONNEXION =====
  const login = async (telephone, password) => {
    try {
      const { data } = await api.post('/auth/login', { telephone, password })
      localStorage.setItem('kreon_token', data.token)
      localStorage.setItem('kreon_user', JSON.stringify(data))
      setUser(data)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion',
      }
    }
  }

  // ===== DÉCONNEXION =====
  const logout = () => {
    localStorage.removeItem('kreon_token')
    localStorage.removeItem('kreon_user')
    setUser(null)
  }

  // ===== RAFRAÎCHIR USER (solde, etc.) =====
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/profile')
      const updated = { ...user, ...data }
      localStorage.setItem('kreon_user', JSON.stringify(updated))
      setUser(updated)
      return data
    } catch (error) {
      console.error('Erreur refresh user', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }
  return context
}