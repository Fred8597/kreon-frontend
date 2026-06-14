import { useState } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Phone, Lock, User, Mail, Gift } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import Logo from "../../components/ui/Logo"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const Register = () => {
  const [searchParams] = useSearchParams()
  const codeFromUrl = searchParams.get("code") || ""

  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [codeParrainage, setCodeParrainage] = useState(codeFromUrl)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validations
    if (!nom || !email || !telephone || !password) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    // Nettoyer le téléphone
    const telNettoye = telephone.replace(/\s/g, "").replace(/^\+?237/, "")
    if (!/^[6-9]\d{8}$/.test(telNettoye)) {
      toast.error("Numéro de téléphone invalide (ex: 699999998)")
      return
    }

    setLoading(true)
    const result = await register({
      nom,
      email,
      telephone: telNettoye,
      password,
      codeParrainage: codeParrainage || undefined,
    })
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
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.container}>
        <div style={styles.logoSection}>
          <Logo size="large" showSlogan />
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Inscription</h2>
          <p style={styles.subtitle}>Rejoins KREON et commence à investir 🚀</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Nom complet */}
            <div style={styles.field}>
              <label style={styles.label}>Nom complet *</label>
              <Input
                icon={User}
                type="text"
                placeholder="Jean Dupont"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email *</label>
              <Input
                icon={Mail}
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Téléphone */}
            <div style={styles.field}>
              <label style={styles.label}>Numéro de téléphone *</label>
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
              <label style={styles.label}>Mot de passe *</label>
              <Input
                icon={Lock}
                type="password"
                placeholder="Min. 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Confirmation mot de passe */}
            <div style={styles.field}>
              <label style={styles.label}>Confirmer le mot de passe *</label>
              <Input
                icon={Lock}
                type="password"
                placeholder="Retape ton mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Code parrainage (optionnel) */}
            <div style={styles.field}>
              <label style={styles.label}>
                Code de parrainage{" "}
                <span style={{ color: "#6b7280", fontWeight: 400 }}>
                  (optionnel)
                </span>
              </label>
              <Input
                icon={Gift}
                type="text"
                placeholder="Ex: KRNT3SWK"
                value={codeParrainage}
                onChange={(e) => setCodeParrainage(e.target.value.toUpperCase())}
              />
            </div>

            {/* Bouton submit */}
            <Button type="submit" loading={loading}>
              Créer mon compte
            </Button>
          </form>

          {/* Lien login */}
          <div style={styles.loginRow}>
            <span style={styles.loginText}>Déjà inscrit ?</span>
            <Link to="/login" style={styles.loginLink}>
              Se connecter
            </Link>
          </div>
        </div>

        <p style={styles.footer}>🔒 Plateforme sécurisée • KREON © 2026</p>
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
    padding: "30px 0",
  },
  logoSection: {
    marginBottom: "24px",
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
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.8rem",
    color: "#86efac",
    fontWeight: 600,
  },
  loginRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    marginTop: "20px",
    fontSize: "0.85rem",
  },
  loginText: {
    color: "#94a3b8",
  },
  loginLink: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: 700,
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.75rem",
    color: "#6b7280",
  },
}

export default Register