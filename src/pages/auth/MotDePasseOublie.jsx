import { Link } from "react-router-dom"
import { ArrowLeft, MessageCircle } from "lucide-react"
import Logo from "../../components/ui/Logo"
import Button from "../../components/ui/Button"

const MotDePasseOublie = () => {
  return (
    <div style={styles.page}>
      <div style={styles.glowTop} />

      <div style={styles.container}>
        <div style={styles.logoSection}>
          <Logo size="medium" showSlogan={false} />
        </div>

        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <MessageCircle size={40} color="#10b981" />
          </div>

          <h2 style={styles.title}>Mot de passe oublié ?</h2>
          <p style={styles.text}>
            Pas de panique 🙌
            <br />
            <br />
            Pour réinitialiser ton mot de passe, contacte notre équipe support
            sur Telegram. Nous t'aiderons à récupérer ton accès rapidement.
          </p>

          <div style={styles.contactBox}>
            <p style={styles.contactLabel}>Support KREON</p>
            <p style={styles.contactValue}>@kreon_support</p>
          </div>

          <Link to="/login" style={styles.backLink}>
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Retour à la connexion
            </Button>
          </Link>
        </div>
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
    left: "50%",
    transform: "translateX(-50%)",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent)",
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
    marginBottom: "24px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(17,26,20,0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "24px",
    padding: "40px 28px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "16px",
  },
  text: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    lineHeight: 1.6,
    marginBottom: "24px",
  },
  contactBox: {
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "24px",
  },
  contactLabel: {
    fontSize: "0.75rem",
    color: "#86efac",
    marginBottom: "4px",
    fontWeight: 600,
  },
  contactValue: {
    fontSize: "1.1rem",
    color: "#10b981",
    fontWeight: 700,
  },
  backLink: {
    textDecoration: "none",
    display: "block",
  },
}

export default MotDePasseOublie