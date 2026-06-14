import { Construction } from "lucide-react"
import PageHeader from "./PageHeader"

const PlaceholderPage = ({
  title,
  icon: Icon = Construction,
  color = "#10b981",
  description,
  features = [],
  comingSoon = true,
}) => {
  return (
    <div style={styles.page}>
      <PageHeader title={title} />

      <div style={styles.content}>
        {/* ICÔNE PRINCIPALE */}
        <div style={styles.iconHeader}>
          <div
            style={{
              ...styles.iconWrapper,
              backgroundColor: `${color}15`,
              borderColor: `${color}40`,
            }}
          >
            <Icon size={50} color={color} />
          </div>

          {comingSoon && <span style={styles.comingBadge}>Bientôt disponible</span>}

          <h2 style={styles.title}>{title}</h2>

          {description && <p style={styles.description}>{description}</p>}
        </div>

        {/* LISTE DES FEATURES */}
        {features.length > 0 && (
          <div style={styles.featuresBox}>
            <h3 style={styles.featuresTitle}>✨ Ce qui arrive bientôt</h3>
            <ul style={styles.featuresList}>
              {features.map((feat, idx) => (
                <li key={idx} style={styles.featureItem}>
                  <span style={{ color }}>•</span> {feat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MESSAGE FINAL */}
        <div style={styles.endNote}>
          <p style={styles.endText}>
            🚧 Cette fonctionnalité est en cours de développement.
            <br />
            Reviens bientôt pour la découvrir !
          </p>
        </div>
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
  content: {
    padding: "20px",
  },
  iconHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  iconWrapper: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 0 40px rgba(16,185,129,0.15)",
  },
  comingBadge: {
    display: "inline-block",
    padding: "4px 14px",
    backgroundColor: "rgba(245,158,11,0.15)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.4)",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "8px",
  },
  description: {
    fontSize: "0.9rem",
    color: "#86efac",
    lineHeight: 1.5,
    maxWidth: "400px",
    margin: "0 auto",
  },
  featuresBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "20px",
  },
  featuresTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "12px",
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  featureItem: {
    fontSize: "0.85rem",
    color: "#cbd5e1",
    paddingLeft: "10px",
    lineHeight: 1.5,
  },
  endNote: {
    padding: "16px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px dashed rgba(16,185,129,0.3)",
    borderRadius: "12px",
    textAlign: "center",
  },
  endText: {
    fontSize: "0.82rem",
    color: "#86efac",
    lineHeight: 1.6,
  },
}

export default PlaceholderPage