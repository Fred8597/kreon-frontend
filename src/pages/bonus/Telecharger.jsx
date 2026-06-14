import { Download, Smartphone, Apple } from "lucide-react"
import toast from "react-hot-toast"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"

const Telecharger = () => {
  const handleDownloadAndroid = () => {
    toast("APK Android bientôt disponible 📱", { icon: "⏳" })
  }

  const handleDownloadIOS = () => {
    toast("App iOS bientôt disponible 🍎", { icon: "⏳" })
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Télécharger l'app" />

      <div style={styles.content}>
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Download size={50} color="#10b981" />
          </div>
          <h2 style={styles.title}>Application KREON</h2>
          <p style={styles.subtitle}>
            Profitez de KREON depuis votre smartphone pour une expérience optimale
          </p>
        </div>

        {/* ANDROID */}
        <div style={styles.platformCard}>
          <div style={styles.platformHeader}>
            <div style={{ ...styles.platformIcon, backgroundColor: "rgba(52,211,153,0.15)" }}>
              <Smartphone size={28} color="#34d399" />
            </div>
            <div>
              <p style={styles.platformTitle}>Android</p>
              <p style={styles.platformVersion}>Version 1.0.0 • APK</p>
            </div>
          </div>
          <Button onClick={handleDownloadAndroid}>
            <Download size={16} />
            Télécharger l'APK
          </Button>
        </div>

        {/* IOS */}
        <div style={styles.platformCard}>
          <div style={styles.platformHeader}>
            <div style={{ ...styles.platformIcon, backgroundColor: "rgba(148,163,184,0.15)" }}>
              <Apple size={28} color="#94a3b8" />
            </div>
            <div>
              <p style={styles.platformTitle}>iOS</p>
              <p style={styles.platformVersion}>Bientôt sur l'App Store</p>
            </div>
          </div>
          <Button onClick={handleDownloadIOS} variant="secondary">
            <Download size={16} />
            App Store (bientôt)
          </Button>
        </div>

        {/* INFO */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>💡 Avantages de l'app</p>
          <ul style={styles.infoList}>
            <li>Notifications push en temps réel</li>
            <li>Connexion plus rapide</li>
            <li>Interface optimisée mobile</li>
            <li>Mode hors ligne (lecture)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  iconHeader: { textAlign: "center", marginBottom: "24px" },
  iconWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: { fontSize: "1.3rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "6px" },
  subtitle: { fontSize: "0.85rem", color: "#86efac", lineHeight: 1.5 },
  platformCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "14px",
  },
  platformHeader: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px" },
  platformIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  platformTitle: { fontSize: "1rem", fontWeight: 700, color: "#f0fdf4" },
  platformVersion: { fontSize: "0.78rem", color: "#86efac", marginTop: "2px" },
  infoBox: {
    marginTop: "16px",
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  infoTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#10b981", marginBottom: "8px" },
  infoList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.8,
  },
}

export default Telecharger