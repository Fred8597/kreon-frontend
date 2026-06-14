import { BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react"
import PageHeader from "../../components/ui/PageHeader"

const Regles = () => {
  const sections = [
    {
      title: "📥 Recharges",
      items: [
        "Montant minimum : 1 000 XAF",
        "Méthodes acceptées : MTN Money, Orange Money",
        "Validation manuelle sous 24h",
        "Conservez votre référence de transaction",
      ],
    },
    {
      title: "📤 Retraits",
      items: [
        "Lundi-Vendredi : 6h - 18h",
        "Samedi : 6h - 14h",
        "Dimanche : fermé",
        "Maximum 2 retraits par jour",
        "Montant minimum : 1 000 XAF",
        "PIN obligatoire à 6 chiffres",
        "Validation sous 24-72h",
      ],
    },
    {
      title: "💰 Investissements",
      items: [
        "PIN obligatoire pour investir",
        "Argent bloqué jusqu'à expiration",
        "ROI versé en une fois à la fin",
        "Aucune annulation possible",
        "Commissions parrainage versées immédiatement",
      ],
    },
    {
      title: "🤝 Parrainage",
      items: [
        "Niveau 1 (direct) : 12%",
        "Niveau 2 : 8%",
        "Niveau 3 : 3%",
        "Niveau 4 : 1%",
        "Commissions à vie",
        "Versement automatique",
      ],
    },
  ]

  return (
    <div style={styles.page}>
      <PageHeader title="Règles de la plateforme" />

      <div style={styles.content}>
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <BookOpen size={44} color="#10b981" />
          </div>
          <h2 style={styles.title}>Règles & Conditions</h2>
          <p style={styles.subtitle}>
            Tout ce que vous devez savoir pour utiliser KREON
          </p>
        </div>

        {/* SECTIONS */}
        {sections.map((section, idx) => (
          <div key={idx} style={styles.section}>
            <h3 style={styles.sectionTitle}>{section.title}</h3>
            <ul style={styles.list}>
              {section.items.map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* AVERTISSEMENT */}
        <div style={styles.warningBox}>
          <AlertTriangle size={18} color="#f59e0b" />
          <div>
            <p style={styles.warningTitle}>⚠️ Important</p>
            <p style={styles.warningText}>
              L'investissement comporte des risques. Investissez uniquement ce que
              vous pouvez vous permettre. KREON ne garantit pas les gains au-delà
              de ce qui est explicitement annoncé sur chaque produit.
            </p>
          </div>
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
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  title: { fontSize: "1.25rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "6px" },
  subtitle: { fontSize: "0.85rem", color: "#86efac" },
  section: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "10px",
  },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "0.82rem",
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
  warningBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.05)",
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: "12px",
    marginTop: "14px",
  },
  warningTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", marginBottom: "6px" },
  warningText: { fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 },
}

export default Regles