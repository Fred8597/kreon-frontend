import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Clock,
  Package,
  Users,
  Crown,
  Lock,
  Timer,
  AlertCircle,
} from "lucide-react"
import { formatXAF } from "../../utils/format"
import { calculerTotal, calculerRendement } from "../../services/productService"

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(null)

  // Couleurs par catégorie
  const catColors = {
    IA: "#10b981",
    NVIP: "#eab308",
    SUPER_IA: "#8b5cf6",
    DUREE_LIMITEE: "#ec4899",
  }
  const color = catColors[product.categorie] || "#10b981"

  // ===== COMPTE À REBOURS pour DUREE_LIMITEE =====
  useEffect(() => {
    if (product.categorie !== "DUREE_LIMITEE" || !product.dateDebut) return

    const target = new Date(product.dateDebut).getTime()

    const update = () => {
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setCountdown(null) // Lancement effectif
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [product])

  // ===== STATUTS =====
  const isEpuise = product.stock === 0
  const isAvantLancement = product.categorie === "DUREE_LIMITEE" && countdown !== null
  const isTermine =
    product.categorie === "DUREE_LIMITEE" &&
    product.dateFin &&
    new Date() > new Date(product.dateFin)

  const total = calculerTotal(product.prix, product.montantRetour)
  const rendement = calculerRendement(product.prix, product.montantRetour)

  const handleClick = () => {
    if (isAvantLancement) return // pas cliquable avant lancement
    navigate(`/produit/${product._id}`)
  }

  return (
    <div
      style={{
        ...styles.card,
        ...(isEpuise || isTermine ? styles.cardDisabled : {}),
        cursor: isAvantLancement ? "default" : "pointer",
      }}
      onClick={handleClick}
    >
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <h3 style={styles.nom}>{product.nom}</h3>
        </div>
        <span style={{ ...styles.durBadge, color }}>
          <Clock size={11} /> {product.dureeJours}j
        </span>
      </div>

      {/* IMAGE */}
      {product.image && (
        <div style={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.nom}
            style={styles.image}
            onError={(e) => (e.target.parentElement.style.display = "none")}
          />
          {/* Overlay statut */}
          {isEpuise && (
            <div style={styles.overlayBox}>
              <span style={styles.overlayText}>ÉPUISÉ</span>
            </div>
          )}
          {isTermine && (
            <div style={styles.overlayBox}>
              <span style={styles.overlayText}>TERMINÉ</span>
            </div>
          )}
          {/* Badge marketing */}
          {product.badge && (
            <div style={styles.markBadge}>{product.badge}</div>
          )}
          {/* VIP requis */}
          {product.niveauVIPRequis > 0 && (
            <div style={styles.vipBadge}>
              <Crown size={11} color="#eab308" /> NVIP{product.niveauVIPRequis}+
            </div>
          )}
        </div>
      )}

      {/* INFO ROW (stock + limite) */}
      <div style={styles.infoRow}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Stock</span>
          <span
            style={{
              ...styles.infoValue,
              color: product.stock === 0 ? "#ef4444" : "#10b981",
            }}
          >
            {product.stock}
          </span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Limite</span>
          <span style={styles.infoValue}>
            {product.limiteAchat || "∞"}
          </span>
        </div>
      </div>

      {/* PRIX */}
      <div style={styles.priceRow}>
        <div>
          <span style={styles.priceLabel}>Revenu total</span>
          <p style={styles.returnValue}>{formatXAF(product.montantRetour)}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={styles.priceLabel}>Montant location</span>
          <p style={styles.priceValue}>{formatXAF(product.prix)}</p>
        </div>
      </div>

      {/* COMPTE À REBOURS (DUREE_LIMITEE) */}
      {isAvantLancement && countdown && (
        <div style={styles.countdownBox}>
          <Timer size={14} color="#ec4899" />
          <span style={styles.countdownLabel}>Lancement dans :</span>
          <div style={styles.countdownTimer}>
            {countdown.days > 0 && (
              <span style={styles.countdownUnit}>{countdown.days}j</span>
            )}
            <span style={styles.countdownUnit}>
              {String(countdown.hours).padStart(2, "0")}h
            </span>
            <span style={styles.countdownUnit}>
              {String(countdown.minutes).padStart(2, "0")}m
            </span>
            <span style={styles.countdownUnit}>
              {String(countdown.seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>
      )}

      {/* FILLEULS REQUIS (SUPER_IA) */}
      {product.categorie === "SUPER_IA" && product.filleulsRequis > 0 && (
        <div style={styles.filleulsBox}>
          <Users size={12} color="#8b5cf6" />
          <span>{product.filleulsRequis} filleuls requis</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "all 0.3s",
  },
  cardDisabled: { opacity: 0.6 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  nom: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  durBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 700,
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  imageWrapper: {
    width: "100%",
    height: "150px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "rgba(10,15,13,0.5)",
    position: "relative",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  overlayBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    fontSize: "1.5rem",
    fontWeight: 900,
    color: "#ef4444",
    letterSpacing: "0.1em",
    textShadow: "0 0 20px rgba(239,68,68,0.6)",
  },
  markBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.65rem",
    fontWeight: 800,
    backgroundColor: "rgba(239,68,68,0.9)",
    color: "#fff",
  },
  vipBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.65rem",
    fontWeight: 800,
    backgroundColor: "rgba(234,179,8,0.9)",
    color: "#0a0f0d",
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
  infoRow: { display: "flex", gap: "10px" },
  infoItem: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 10px",
    backgroundColor: "rgba(10,15,13,0.4)",
    borderRadius: "8px",
    fontSize: "0.75rem",
  },
  infoLabel: { color: "#6b7280" },
  infoValue: { fontWeight: 700 },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
  },
  priceLabel: {
    fontSize: "0.68rem",
    color: "#6b7280",
    display: "block",
    marginBottom: "2px",
  },
  priceValue: { fontSize: "0.95rem", fontWeight: 800, color: "#f59e0b" },
  returnValue: { fontSize: "0.95rem", fontWeight: 800, color: "#10b981" },
  countdownBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 10px",
    backgroundColor: "rgba(236,72,153,0.08)",
    border: "1px solid rgba(236,72,153,0.3)",
    borderRadius: "10px",
    flexWrap: "wrap",
  },
  countdownLabel: { fontSize: "0.7rem", color: "#ec4899", fontWeight: 600 },
  countdownTimer: { display: "flex", gap: "4px", marginLeft: "auto" },
  countdownUnit: {
    padding: "2px 6px",
    backgroundColor: "rgba(236,72,153,0.2)",
    borderRadius: "6px",
    fontSize: "0.72rem",
    fontWeight: 800,
    color: "#ec4899",
    fontFamily: "monospace",
  },
  filleulsBox: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 10px",
    backgroundColor: "rgba(139,92,246,0.08)",
    border: "1px solid rgba(139,92,246,0.3)",
    borderRadius: "8px",
    fontSize: "0.72rem",
    color: "#8b5cf6",
    fontWeight: 600,
  },
}

export default ProductCard