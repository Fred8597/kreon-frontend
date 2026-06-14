import { Copy, Share2, MessageCircle, Send } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { formatXAF } from "../utils/format"
import Logo from "../components/ui/Logo"

const Partager = () => {
  const { user } = useAuth()

  const lienInvitation = `${window.location.origin}/register?code=${user?.codeParrainage || ""}`

  // QR Code via API gratuite (qrserver.com)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(lienInvitation)}&bgcolor=0a0f0d&color=10b981`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user?.codeParrainage || "")
    toast.success("Code copié !")
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lienInvitation)
    toast.success("Lien copié !")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rejoins-moi sur KREON",
          text: `Rejoins-moi sur KREON et commence à investir ! Mon code : ${user?.codeParrainage}`,
          url: lienInvitation,
        })
      } catch (error) {
        // Annulé
      }
    } else {
      handleCopyLink()
    }
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `🚀 Rejoins-moi sur KREON et commence à investir intelligemment !\n\nMon code parrainage : ${user?.codeParrainage}\n\nInscris-toi ici : ${lienInvitation}`
    )
    window.open(`https://wa.me/?text=${msg}`, "_blank")
  }

  const commissions = [
    { niveau: 1, percent: 12, color: "#10b981", label: "Filleuls directs" },
    { niveau: 2, percent: 8, color: "#34d399", label: "2ème niveau" },
    { niveau: 3, percent: 3, color: "#f59e0b", label: "3ème niveau" },
    { niveau: 4, percent: 1, color: "#ec4899", label: "4ème niveau" },
  ]

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <Logo size="small" showSlogan={false} />
          <div style={styles.headerIconBox}>
            <Share2 size={18} color="#10b981" />
          </div>
        </div>
        <h1 style={styles.headerTitle}>🔗 Inviter des amis</h1>
        <p style={styles.headerSubtitle}>
          Gagnez sur 4 niveaux à vie 💰
        </p>
      </header>

      <div style={styles.content}>
        {/* QR CODE */}
        <div style={styles.qrCard}>
          <div style={styles.qrWrapper}>
            <img src={qrUrl} alt="QR Code parrainage" style={styles.qr} />
          </div>
          <p style={styles.qrLabel}>Scanner pour rejoindre</p>
        </div>

        {/* CODE PARRAINAGE */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Mon code d'invitation</p>
          <button style={styles.codeBtn} onClick={handleCopyCode}>
            <span style={styles.codeText}>{user?.codeParrainage}</span>
            <div style={styles.copyBox}>
              <Copy size={16} color="#10b981" />
              <span style={styles.copyText}>Copier</span>
            </div>
          </button>
        </div>

        {/* LIEN INVITATION */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Lien d'invitation</p>
          <button style={styles.linkBtn} onClick={handleCopyLink}>
            <span style={styles.linkText}>{lienInvitation}</span>
            <Copy size={14} color="#86efac" />
          </button>
        </div>

        {/* BOUTONS PARTAGE */}
        <div style={styles.shareGrid}>
          <button style={styles.shareWa} onClick={handleWhatsApp}>
            <MessageCircle size={20} color="#10b981" />
            <span style={styles.shareLabel}>WhatsApp</span>
          </button>
          <button style={styles.shareGen} onClick={handleShare}>
            <Send size={20} color="#10b981" />
            <span style={styles.shareLabel}>Partager</span>
          </button>
        </div>

        {/* MES REVENUS PARRAINAGE */}
        <div style={styles.revenusBox}>
          <p style={styles.revenusLabel}>Mes gains parrainage</p>
          <p style={styles.revenusValue}>
            {formatXAF(user?.totalGainsParrainage || 0)}
          </p>
          <p style={styles.revenusFilleuls}>
            {user?.totalInvites || 0} filleul{(user?.totalInvites || 0) > 1 ? "s" : ""} direct{(user?.totalInvites || 0) > 1 ? "s" : ""}
          </p>
        </div>

        {/* COMMISSIONS 4 NIVEAUX */}
        <div style={styles.commissionsBox}>
          <h3 style={styles.commissionsTitle}>💎 Commissions par niveau</h3>
          {commissions.map((c) => (
            <div key={c.niveau} style={styles.commissionRow}>
              <div style={styles.commissionLeft}>
                <div
                  style={{
                    ...styles.commissionBadge,
                    backgroundColor: `${c.color}15`,
                    border: `1px solid ${c.color}40`,
                    color: c.color,
                  }}
                >
                  N{c.niveau}
                </div>
                <span style={styles.commissionLabel}>{c.label}</span>
              </div>
              <span style={{ ...styles.commissionPercent, color: c.color }}>
                {c.percent}%
              </span>
            </div>
          ))}
        </div>

        {/* RÈGLES */}
        <div style={styles.rulesBox}>
          <h4 style={styles.rulesTitle}>📌 Comment ça marche ?</h4>
          <ul style={styles.rulesList}>
            <li>Partagez votre code à vos amis</li>
            <li>Ils s'inscrivent avec votre code</li>
            <li>Quand ils investissent, vous gagnez immédiatement</li>
            <li>Commissions valables sur 4 niveaux de parrainage</li>
            <li>Paiement automatique sur votre solde</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "20px" },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  headerIconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: "1.3rem", fontWeight: 800, color: "#f0fdf4" },
  headerSubtitle: { fontSize: "0.78rem", color: "#86efac" },
  content: { padding: "20px" },
  // QR
  qrCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  qrWrapper: {
    padding: "12px",
    backgroundColor: "rgba(16,185,129,0.05)",
    borderRadius: "16px",
    border: "1px solid rgba(16,185,129,0.2)",
  },
  qr: { width: "200px", height: "200px", display: "block" },
  qrLabel: { fontSize: "0.78rem", color: "#86efac" },
  // SECTIONS
  section: { marginBottom: "16px" },
  sectionLabel: {
    fontSize: "0.78rem",
    color: "#86efac",
    fontWeight: 600,
    marginBottom: "8px",
  },
  codeBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  codeText: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#10b981",
    letterSpacing: "0.1em",
  },
  copyBox: { display: "flex", alignItems: "center", gap: "5px" },
  copyText: { fontSize: "0.78rem", color: "#10b981", fontWeight: 600 },
  linkBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    cursor: "pointer",
    gap: "10px",
  },
  linkText: {
    fontSize: "0.75rem",
    color: "#86efac",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    textAlign: "left",
  },
  // SHARE
  shareGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  shareWa: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  shareGen: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  shareLabel: { fontSize: "0.85rem", color: "#f0fdf4", fontWeight: 600 },
  // REVENUS
  revenusBox: {
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(245,158,11,0.05))",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
  },
  revenusLabel: { fontSize: "0.78rem", color: "#86efac", marginBottom: "6px" },
  revenusValue: {
    fontSize: "2rem",
    fontWeight: 900,
    color: "#f59e0b",
    marginBottom: "4px",
  },
  revenusFilleuls: { fontSize: "0.78rem", color: "#86efac" },
  // COMMISSIONS
  commissionsBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "20px",
  },
  commissionsTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "12px",
  },
  commissionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(16,185,129,0.08)",
  },
  commissionLeft: { display: "flex", alignItems: "center", gap: "10px" },
  commissionBadge: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 800,
  },
  commissionLabel: { fontSize: "0.85rem", color: "#f0fdf4" },
  commissionPercent: { fontSize: "1.1rem", fontWeight: 800 },
  // RULES
  rulesBox: {
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  rulesTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "8px",
  },
  rulesList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.8,
  },
}

export default Partager