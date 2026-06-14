import { Building2, Shield, TrendingUp, Globe } from "lucide-react"
import PageHeader from "../../components/ui/PageHeader"

const Entreprise = () => {
  return (
    <div style={styles.page}>
      <PageHeader title="À propos de KREON" />

      <div style={styles.content}>
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Building2 size={50} color="#10b981" />
          </div>
          <h2 style={styles.title}>KREON</h2>
          <p style={styles.tagline}>Investis • Génère • Prospère</p>
        </div>

        {/* MISSION */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎯 Notre mission</h3>
          <p style={styles.cardText}>
            KREON est une plateforme d'investissement dédiée à la location de
            puissance de calcul GPU pour l'intelligence artificielle. Notre
            mission : permettre à tous d'investir intelligemment dans les
            technologies de demain, avec des rendements clairs et garantis.
          </p>
        </div>

        {/* VALEURS */}
        <div style={styles.valuesGrid}>
          <ValueCard
            icon={Shield}
            color="#10b981"
            title="Sécurité"
            text="Vos fonds protégés"
          />
          <ValueCard
            icon={TrendingUp}
            color="#f59e0b"
            title="Rentabilité"
            text="Rendements garantis"
          />
          <ValueCard
            icon={Globe}
            color="#3b82f6"
            title="Innovation"
            text="Tech de pointe"
          />
        </div>

        {/* INFOS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📜 Informations légales</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Plateforme</span>
            <span style={styles.infoValue}>KREON Investment</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Devise</span>
            <span style={styles.infoValue}>XAF (Franc CFA)</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Année</span>
            <span style={styles.infoValue}>© 2026</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Support</span>
            <span style={styles.infoValue}>@kreon_support</span>
          </div>
        </div>

        <p style={styles.footer}>
          Merci de faire confiance à KREON pour vos investissements 💚
        </p>
      </div>
    </div>
  )
}

const ValueCard = ({ icon: Icon, color, title, text }) => (
  <div style={styles.valueCard}>
    <div style={{ ...styles.valueIcon, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
      <Icon size={20} color={color} />
    </div>
    <p style={styles.valueTitle}>{title}</p>
    <p style={styles.valueText}>{text}</p>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  iconHeader: { textAlign: "center", marginBottom: "24px" },
  iconWrapper: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 900,
    color: "#10b981",
    letterSpacing: "0.05em",
    marginBottom: "4px",
  },
  tagline: { fontSize: "0.85rem", color: "#86efac", letterSpacing: "0.1em" },
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "14px",
  },
  cardTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "10px" },
  cardText: { fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6 },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "14px",
  },
  valueCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    padding: "14px 10px",
    textAlign: "center",
  },
  valueIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 8px",
  },
  valueTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "2px" },
  valueText: { fontSize: "0.7rem", color: "#86efac" },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(16,185,129,0.08)",
  },
  infoLabel: { fontSize: "0.82rem", color: "#86efac" },
  infoValue: { fontSize: "0.85rem", color: "#f0fdf4", fontWeight: 600 },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.85rem",
    color: "#10b981",
    fontStyle: "italic",
  },
}

export default Entreprise