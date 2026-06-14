import { useState, useEffect } from "react"
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Inbox,
  Trophy,
  Gift,
  Info,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import {
  getStatutTirage,
  tournerRoue,
} from "../../services/tirageService"
import { formatXAF, formatDateTime } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Tirage = () => {
  const { refreshUser } = useAuth()
  const [statut, setStatut] = useState(null)
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showWin, setShowWin] = useState(null) // { montant }

  const fetchData = async () => {
    try {
      const data = await getStatutTirage()
      setStatut(data)
    } catch (error) {
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ===== TOURNER LA ROUE =====
  const handleTourner = async () => {
    if (!statut?.toursRestants || statut.toursRestants <= 0) {
      toast.error("Aucun tour disponible")
      return
    }

    setSpinning(true)
    setShowWin(null)

    try {
      // Lancer le tour côté backend
      const result = await tournerRoue()

      // Animation de la roue : 5 tours complets + position aléatoire
      const finalRotation = rotation + 360 * 5 + Math.random() * 360
      setRotation(finalRotation)

      // Attendre la fin de l'animation
      setTimeout(async () => {
        setShowWin({ montant: result.montant })
        toast.success(result.message, { duration: 4000 })
        await refreshUser()
        await fetchData()
        setSpinning(false)
      }, 4000)
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
      setSpinning(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Roue de la Fortune" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  // Segments visuels de la roue (montants prédéfinis pour le visuel)
  const segments = [
    { label: "500", color: "#10b981" },
    { label: "1000", color: "#f59e0b" },
    { label: "2500", color: "#ec4899" },
    { label: "5000", color: "#8b5cf6" },
    { label: "10K", color: "#3b82f6" },
    { label: "25K", color: "#eab308" },
    { label: "50K", color: "#ef4444" },
    { label: "100K", color: "#06b6d4" },
  ]

  return (
    <div style={styles.page}>
      <PageHeader title="Roue de la Fortune" />

      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.4); }
            50% { box-shadow: 0 0 50px rgba(245,158,11,0.7); }
          }
          @keyframes win-pop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.content}>
        {/* ===== HEADER ===== */}
        <div style={styles.headerCard}>
          <Trophy size={28} color="#f59e0b" />
          <div style={{ flex: 1 }}>
            <p style={styles.headerTitle}>Tours disponibles</p>
            <p style={styles.headerValue}>
              {statut?.toursRestants || 0}
            </p>
          </div>
          {statut?.toursRestants > 0 && (
            <div style={styles.nextBox}>
              <span style={styles.nextLabel}>Prochain gain</span>
              <span style={styles.nextValue}>
                {formatXAF(statut.prochaineMontant || 0)}
              </span>
            </div>
          )}
        </div>

        {/* ===== ROUE ===== */}
        <div style={styles.wheelWrapper}>
          {/* Pointeur */}
          <div style={styles.pointer} />

          {/* Roue */}
          <div
            style={{
              ...styles.wheel,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.32, 1.07)"
                : "none",
            }}
          >
            {segments.map((seg, idx) => {
              const angle = (360 / segments.length) * idx
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.segment,
                    backgroundColor: seg.color,
                    transform: `rotate(${angle}deg) skewY(-45deg)`,
                  }}
                >
                  <span
                    style={{
                      ...styles.segmentLabel,
                      transform: `skewY(45deg) rotate(22.5deg)`,
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              )
            })}

            {/* Centre */}
            <button
              onClick={handleTourner}
              disabled={spinning || !statut?.toursRestants}
              style={{
                ...styles.centerBtn,
                cursor:
                  spinning || !statut?.toursRestants ? "not-allowed" : "pointer",
                opacity: !statut?.toursRestants ? 0.5 : 1,
                animation:
                  statut?.toursRestants && !spinning
                    ? "pulse-glow 2s ease-in-out infinite"
                    : "none",
              }}
            >
              {spinning ? "..." : "GO"}
            </button>
          </div>
        </div>

        {/* ===== AFFICHAGE GAIN ===== */}
        {showWin && (
          <div style={{ ...styles.winBox, animation: "win-pop 0.5s ease-out" }}>
            <Sparkles size={28} color="#f59e0b" />
            <div>
              <p style={styles.winLabel}>Félicitations !</p>
              <p style={styles.winAmount}>+{formatXAF(showWin.montant)}</p>
            </div>
          </div>
        )}

        {/* ===== MESSAGE SI PAS DE TOUR ===== */}
        {(!statut?.toursRestants || statut.toursRestants === 0) && !spinning && (
          <div style={styles.noTourBox}>
            <Info size={18} color="#86efac" />
            <p style={styles.noTourText}>
              Aucun tour disponible pour le moment. Restez actif sur la plateforme
              et l'administrateur pourra vous accorder des tours bonus !
            </p>
          </div>
        )}

        {/* ===== STATS ===== */}
        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <TrendingUp size={20} color="#10b981" />
            <div>
              <p style={styles.statLabel}>Tours joués</p>
              <p style={styles.statValue}>{statut?.totalTours || 0}</p>
            </div>
          </div>
          <div style={styles.statSep} />
          <div style={styles.statItem}>
            <Gift size={20} color="#f59e0b" />
            <div>
              <p style={styles.statLabel}>Total gagné</p>
              <p style={styles.statValueOrange}>
                {formatXAF(statut?.totalGagne || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ===== HISTORIQUE ===== */}
        {statut?.historique?.length > 0 ? (
          <div style={styles.historyBox}>
            <h3 style={styles.historyTitle}>
              <Calendar size={16} color="#10b981" /> Historique
            </h3>
            <div style={styles.historyList}>
              {statut.historique.map((h) => (
                <div key={h._id} style={styles.historyItem}>
                  <div style={styles.historyLeft}>
                    <div style={styles.historyDot} />
                    <div>
                      <p style={styles.historyLabel}>Tirage Roue</p>
                      <p style={styles.historyDate}>
                        {formatDateTime(h.dateTour)}
                      </p>
                    </div>
                  </div>
                  <span style={styles.historyAmount}>
                    +{formatXAF(h.montant)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.emptyHistory}>
            <Inbox size={36} color="#6b7280" />
            <p style={styles.emptyText}>Aucun tirage encore</p>
          </div>
        )}

        {/* ===== RÈGLES ===== */}
        <div style={styles.rulesBox}>
          <h3 style={styles.rulesTitle}>📌 Comment ça marche ?</h3>
          <ul style={styles.rulesList}>
            <li>L'admin vous accorde des tours bonus</li>
            <li>Cliquez sur "GO" pour tourner la roue</li>
            <li>Le montant gagné est crédité immédiatement</li>
            <li>Plus vous êtes actif, plus vous recevez de tours</li>
          </ul>
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
  content: { padding: "20px" },
  // HEADER
  headerCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(16,185,129,0.05))",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  headerTitle: { fontSize: "0.78rem", color: "#86efac" },
  headerValue: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#f59e0b",
  },
  nextBox: {
    textAlign: "right",
    padding: "8px 12px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "10px",
  },
  nextLabel: { fontSize: "0.65rem", color: "#86efac", display: "block" },
  nextValue: { fontSize: "0.95rem", fontWeight: 800, color: "#10b981" },
  // WHEEL
  wheelWrapper: {
    position: "relative",
    width: "280px",
    height: "280px",
    margin: "20px auto 30px",
  },
  pointer: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    borderTop: "25px solid #f59e0b",
    zIndex: 10,
    filter: "drop-shadow(0 4px 8px rgba(245,158,11,0.5))",
  },
  wheel: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "6px solid #f59e0b",
    boxShadow: "0 0 40px rgba(245,158,11,0.3), inset 0 0 30px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  segment: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "50%",
    transformOrigin: "100% 100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentLabel: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 800,
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    marginLeft: "20px",
    marginTop: "10px",
  },
  centerBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "4px solid #fff",
    color: "#0a0f0d",
    fontSize: "1.3rem",
    fontWeight: 900,
    zIndex: 5,
    transition: "all 0.3s",
  },
  // WIN
  winBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(16,185,129,0.1))",
    border: "2px solid rgba(245,158,11,0.5)",
    borderRadius: "16px",
    marginBottom: "16px",
    boxShadow: "0 0 25px rgba(245,158,11,0.3)",
  },
  winLabel: { fontSize: "0.8rem", color: "#86efac" },
  winAmount: { fontSize: "1.6rem", fontWeight: 900, color: "#f59e0b" },
  // NO TOUR
  noTourBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px dashed rgba(16,185,129,0.3)",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  noTourText: { fontSize: "0.8rem", color: "#86efac", lineHeight: 1.5 },
  // STATS
  statsBox: {
    display: "flex",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  statItem: { flex: 1, display: "flex", alignItems: "center", gap: "10px" },
  statSep: {
    width: "1px",
    backgroundColor: "rgba(16,185,129,0.15)",
    margin: "0 14px",
  },
  statLabel: { fontSize: "0.7rem", color: "#86efac" },
  statValue: { fontSize: "1.05rem", fontWeight: 800, color: "#f0fdf4" },
  statValueOrange: { fontSize: "1.05rem", fontWeight: 800, color: "#f59e0b" },
  // HISTORY
  historyBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "16px",
  },
  historyTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "10px",
  },
  historyList: { display: "flex", flexDirection: "column", gap: "8px" },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "8px",
  },
  historyLeft: { display: "flex", gap: "8px", alignItems: "center" },
  historyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
  },
  historyLabel: { fontSize: "0.78rem", color: "#f0fdf4", fontWeight: 600 },
  historyDate: { fontSize: "0.68rem", color: "#6b7280", marginTop: "2px" },
  historyAmount: { fontSize: "0.85rem", color: "#f59e0b", fontWeight: 800 },
  emptyHistory: {
    padding: "30px 20px",
    textAlign: "center",
    backgroundColor: "rgba(17,26,20,0.4)",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  emptyText: { fontSize: "0.82rem", color: "#6b7280", marginTop: "8px" },
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

export default Tirage