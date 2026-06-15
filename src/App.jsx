import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import MainLayout from "./components/layout/MainLayout"

// Pages publiques
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import MotDePasseOublie from "./pages/auth/MotDePasseOublie"

// Pages protégées (5 onglets)
import Accueil from "./pages/Accueil"
import Actualites from "./pages/Actualites"
import Equipe from "./pages/Equipe"
import Partager from "./pages/Partager"
import Profil from "./pages/Profil"

// Sous-pages produit
import DetailProduit from "./pages/DetailProduit"
import DetailActualite from "./pages/DetailActualite"

// Sous-pages wallet
import Recharger from "./pages/wallet/Recharger"
import Retirer from "./pages/wallet/Retirer"
import Recharges from "./pages/wallet/Recharges"
import Retraits from "./pages/wallet/Retraits"

// Sous-pages user
import Commandes from "./pages/user/Commandes"
import Gains from "./pages/user/Gains"

// Sous-pages sécurité
import CodePin from "./pages/security/CodePin"
import NumerosMobiles from "./pages/security/NumerosMobiles"
import MotDePasse from "./pages/security/MotDePasse"

// Sous-pages bonus
import Coffre from "./pages/bonus/Coffre"
import Tirage from "./pages/bonus/Tirage"
import Chaine from "./pages/bonus/Chaine"
import Alertes from "./pages/bonus/Alertes"
import Telecharger from "./pages/bonus/Telecharger"
import Pointage from "./pages/bonus/Pointage"
import VIP from "./pages/bonus/VIP"
import Entreprise from "./pages/bonus/Entreprise"
import Regles from "./pages/bonus/Regles"
import Activite from "./pages/bonus/Activite"

const App = () => {
  // ===== PING ANTI-VEILLE RENDER (toutes les 14 min) =====
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    const pingURL = baseURL.replace("/api", "/")

    const ping = () => {
      fetch(pingURL).catch(() => {
        // ignore erreurs
      })
    }

    ping() // ping immédiat
    const interval = setInterval(ping, 14 * 60 * 1000) // toutes les 14 min
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIQUES ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />

          {/* ===== AVEC BOTTOMNAV ===== */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Accueil />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/partager" element={<Partager />} />
            <Route path="/profil" element={<Profil />} />
          </Route>

          {/* ===== SOUS-PAGES SANS BOTTOMNAV ===== */}
          <Route path="/produit/:id" element={<ProtectedRoute><DetailProduit /></ProtectedRoute>} />
          <Route path="/actualite/:id" element={<ProtectedRoute><DetailActualite /></ProtectedRoute>} />

          {/* Wallet */}
          <Route path="/recharger" element={<ProtectedRoute><Recharger /></ProtectedRoute>} />
          <Route path="/retirer" element={<ProtectedRoute><Retirer /></ProtectedRoute>} />
          <Route path="/recharges" element={<ProtectedRoute><Recharges /></ProtectedRoute>} />
          <Route path="/retraits" element={<ProtectedRoute><Retraits /></ProtectedRoute>} />

          {/* User */}
          <Route path="/commandes" element={<ProtectedRoute><Commandes /></ProtectedRoute>} />
          <Route path="/gains" element={<ProtectedRoute><Gains /></ProtectedRoute>} />

          {/* Sécurité */}
          <Route path="/code-pin" element={<ProtectedRoute><CodePin /></ProtectedRoute>} />
          <Route path="/mobile-money" element={<ProtectedRoute><NumerosMobiles /></ProtectedRoute>} />
          <Route path="/mot-de-passe" element={<ProtectedRoute><MotDePasse /></ProtectedRoute>} />

          {/* Bonus */}
          <Route path="/coffre" element={<ProtectedRoute><Coffre /></ProtectedRoute>} />
          <Route path="/tirage" element={<ProtectedRoute><Tirage /></ProtectedRoute>} />
          <Route path="/chaine" element={<ProtectedRoute><Chaine /></ProtectedRoute>} />
          <Route path="/alertes" element={<ProtectedRoute><Alertes /></ProtectedRoute>} />
          <Route path="/telecharger" element={<ProtectedRoute><Telecharger /></ProtectedRoute>} />
          <Route path="/pointage" element={<ProtectedRoute><Pointage /></ProtectedRoute>} />
          <Route path="/vip" element={<ProtectedRoute><VIP /></ProtectedRoute>} />
          <Route path="/entreprise" element={<ProtectedRoute><Entreprise /></ProtectedRoute>} />
          <Route path="/regles" element={<ProtectedRoute><Regles /></ProtectedRoute>} />
          <Route path="/activite" element={<ProtectedRoute><Activite /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App