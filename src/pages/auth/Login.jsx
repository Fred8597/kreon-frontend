import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Phone, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import Logo from "../../components/ui/Logo"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const Login = () => {
  const [telephone, setTelephone] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!telephone || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    if (!acceptTerms) {
      toast.error("Vous devez accepter les conditions")
      return
    }

    setLoading(true)
    const result = await login(telephone, password)
    setLoading(false)

    if (result.success) {
      toast.success(`Bienvenue ${result.data.nom} ! 🎉`)
      navigate("/")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div style={styles.page}>
      {/* Glow effets background */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Contenu */}
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <Logo size="large" showSlogan />
        </div>

        {/* Carte formulaire */}
        <div style={styles.card}>
          <h2 style={styles.title}>Connexion</h2>
          <p style={styles.subtitle}>Heureux de te revoir 👋</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Téléphone */}
            <div style={styles.field}>
              <label style={styles.label}>Numéro de téléphone</label>
              <Input
                icon={Phone}
                type="tel"
                prefix="+237"
                placeholder="699 999 998"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            {/* Mot de passe */}
            <div style={styles.field}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Mot de passe</label>
                <Link to="/mot-de-passe-oublie" style={styles.forgotLink}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Conditions */}
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxLabel}>
                J'accepte les{" "}
                <span style={styles.termsLink}>
                  Conditions de service et politique de confidentialité
                </span>
              </span>
            </label>

            {/* Bouton submit */}
            <Button type="submit" loading={loading}>
              Se connecter
            </Button>
          </form>

          {/* Séparateur */}
          <div style={styles.separator}>
            <div style={styles.separatorLine} />
            <span style={styles.separatorText}>ou</span>
            <div style={styles.separatorLine} />
          </div>

          {/* Lien inscription */}
          <Link to="/register" style={styles.registerLink}>
            <Button variant="secondary">Créer un compte</Button>
          </Link>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          🔒 Plateforme sécurisée • KREON © 2026
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    top: "-200px",
    left: "-150px",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: "-200px",
    right: "-150px",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 1,
  },
  logoSection: {
    marginBottom: "30px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(17,26,20,0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "24px",
    padding: "32px 24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#86efac",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "0.8rem",
    color: "#86efac",
    fontWeight: 600,
  },
  forgotLink: {
    fontSize: "0.75rem",
    color: "#34d399",
    textDecoration: "none",
    fontWeight: 600,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
    marginTop: "4px",
  },
  checkbox: {
    marginTop: "2px",
    cursor: "pointer",
    accentColor: "#10b981",
  },
  checkboxLabel: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  termsLink: {
    color: "#10b981",
    textDecoration: "underline",
    cursor: "pointer",
  },
  separator: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  separatorLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "rgba(16,185,129,0.2)",
  },
  separatorText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontWeight: 600,
  },
  registerLink: {
    textDecoration: "none",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "0.75rem",
    color: "#6b7280",
  },
}

export default Login