import { Send, MessageCircle, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"

const Chaine = () => {
  const telegramLink = "https://t.me/kreon_officiel"
  const whatsappLink = "https://chat.whatsapp.com/kreon_groupe"

  const handleOpenTelegram = () => {
    window.open(telegramLink, "_blank")
  }

  const handleOpenWhatsapp = () => {
    window.open(whatsappLink, "_blank")
  }

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link)
    toast.success("Lien copié !")
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Nos chaînes" />

      <div style={styles.content}>
        {/* HEADER */}
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Send size={50} color="#3b82f6" />
          </div>
          <h2 style={styles.title}>Rejoignez la communauté KREON</h2>
          <p style={styles.subtitle}>
            Restez connecté avec notre équipe et les autres investisseurs
          </p>
        </div>

        {/* TELEGRAM */}
        <div style={styles.channelCard}>
          <div style={styles.channelHeader}>
            <div style={{ ...styles.channelIcon, backgroundColor: "rgba(59,130,246,0.15)" }}>
              <Send size={24} color="#3b82f6" />
            </div>
            <div style={styles.channelInfo}>
              <p style={styles.channelTitle}>Canal Telegram</p>
              <p style={styles.channelDesc}>Annonces officielles et mises à jour</p>
            </div>
          </div>

          <div style={styles.linkBox}>
            <span style={styles.linkText}>{telegramLink}</span>
          </div>

          <div style={styles.actions}>
            <Button onClick={handleOpenTelegram}>
              <ExternalLink size={16} />
              Rejoindre
            </Button>
            <button
              onClick={() => handleCopy(telegramLink)}
              style={styles.copyBtn}
            >
              Copier
            </button>
          </div>
        </div>

        {/* WHATSAPP */}
        <div style={styles.channelCard}>
          <div style={styles.channelHeader}>
            <div style={{ ...styles.channelIcon, backgroundColor: "rgba(16,185,129,0.15)" }}>
              <MessageCircle size={24} color="#10b981" />
            </div>
            <div style={styles.channelInfo}>
              <p style={styles.channelTitle}>Groupe WhatsApp</p>
              <p style={styles.channelDesc}>Échanger avec la communauté</p>
            </div>
          </div>

          <div style={styles.linkBox}>
            <span style={styles.linkText}>{whatsappLink}</span>
          </div>

          <div style={styles.actions}>
            <Button onClick={handleOpenWhatsapp}>
              <ExternalLink size={16} />
              Rejoindre
            </Button>
            <button
              onClick={() => handleCopy(whatsappLink)}
              style={styles.copyBtn}
            >
              Copier
            </button>
          </div>
        </div>

        {/* INFO */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>📢 Pourquoi nous rejoindre ?</p>
          <ul style={styles.infoList}>
            <li>Annonces des nouvelles fonctionnalités</li>
            <li>Promotions exclusives</li>
            <li>Conseils d'investissement</li>
            <li>Support communautaire</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  iconHeader: { textAlign: "center", marginBottom: "20px" },
  iconWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "rgba(59,130,246,0.1)",
    border: "2px solid rgba(59,130,246,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: { fontSize: "1.25rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "6px" },
  subtitle: { fontSize: "0.85rem", color: "#86efac", lineHeight: 1.5 },
  channelCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "14px",
  },
  channelHeader: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px" },
  channelIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  channelInfo: { flex: 1 },
  channelTitle: { fontSize: "1rem", fontWeight: 700, color: "#f0fdf4" },
  channelDesc: { fontSize: "0.78rem", color: "#86efac", marginTop: "2px" },
  linkBox: {
    padding: "10px 12px",
    backgroundColor: "rgba(10,15,13,0.5)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "10px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  linkText: {
    fontSize: "0.75rem",
    color: "#86efac",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
  actions: { display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" },
  copyBtn: {
    padding: "12px 18px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "12px",
    color: "#10b981",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
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

export default Chaine