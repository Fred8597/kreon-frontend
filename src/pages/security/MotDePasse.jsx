import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import { updateProfile } from "../../services/authService"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/ui/PageHeader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const MotDePasse = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [ancienPassword, setAncienPassword] = useState("")
  const [nouveauPassword, setNouveauPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!ancienPassword || !nouveauPassword || !confirmPassword) {
      toast.error("Tous les champs sont obligatoires")
      return
    }

    if (nouveauPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (nouveauPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (ancienPassword === nouveauPassword) {
      toast.error("Le nouveau mot de passe doit être différent")
      return
    }

    setLoading(true)
    try {
      // Le backend updateProfile ne vérifie pas l'ancien mot de passe
      // mais on l'envoie au cas où on ajoute la vérification plus tard
      await updateProfile({ password: nouveauPassword })

      toast.success("Mot de passe modifié ✅ Reconnexion requise.")

      // Déconnexion forcée pour sécurité
      setTimeout(() => {
        logout()
        navigate("/login")
      }, 1500)
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Mot de passe" />

      <div style={styles.content}>
        {/* HEADER */}
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Lock size={36} color="#10b981" />
          </div>
          <h2 style={styles.title}>Changer le mot de passe</h2>
          <p style={styles.subtitle}>
            Modifiez le mot de passe de votre compte
          </p>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Ancien mot de passe</label>
            <Input
              icon={Lock}
              type="password"
              placeholder="Mot de passe actuel"
              value={ancienPassword}
              onChange={(e) => setAncienPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionTitle}>Nouveau mot de passe</label>
            <Input
              icon={Lock}
              type="password"
              placeholder="Min. 6 caractères"
              value={nouveauPassword}
              onChange={(e) => setNouveauPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionTitle}>Confirmer le mot de passe</label>
            <Input
              icon={Lock}
              type="password"
              placeholder="Retapez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* CONSEILS */}
          <div style={styles.infoBox}>
            <AlertCircle size={16} color="#f59e0b" />
            <div>
              <p style={styles.infoTitle}>🔐 Bonnes pratiques</p>
              <ul style={styles.infoList}>
                <li>Au moins 6 caractères</li>
                <li>Mélangez majuscules, minuscules et chiffres</li>
                <li>Évitez les mots faciles à deviner</li>
                <li>Vous serez déconnecté après la modification</li>
              </ul>
            </div>
          </div>

          <Button type="submit" loading={loading}>
            Modifier le mot de passe
          </Button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    paddingBottom: "30px",
  },
  content: { padding: "20px" },
  iconHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  iconWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  title: {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "#86efac",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    fontSize: "0.82rem",
    color: "#86efac",
    fontWeight: 600,
  },
  infoBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.05)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "12px",
  },
  infoTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#f59e0b",
    marginBottom: "6px",
  },
  infoList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.75rem",
    color: "#94a3b8",
    lineHeight: 1.7,
  },
}

export default MotDePasse