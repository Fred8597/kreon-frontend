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
  const [showWin, setShowWin] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

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

  const handleTourner = async () => {
    if (!statut?.toursRestants || statut.toursRestants <= 0) {
      toast.error("Aucun tour disponible")
      return
    }

    setSpinning(true)
    setShowWin(null)
    setShowConfetti(false)

    try {
      const result = await tournerRoue()

      // Animation : 8 tours complets + position random
      const finalRotation = rotation + 360 * 8 + Math.random() * 360
      setRotation(finalRotation)

      // Attendre fin animation (5 secondes)
      setTimeout(async () => {
        setShowWin({ montant: result.montant })
        setShowConfetti(true)
        toast.success(result.message, { duration: 5000 })
        await refreshUser()
        await fetchData()
        setSpinning(false)

        // Confettis disparaissent après 3 secondes
        setTimeout(() => setShowConfetti(false), 3000)
      }, 5000)
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

  // Segments visuels (avec emojis, non liés aux vrais montants)
  const segments = [
    { label: "💎", color: "#10b981" },
    { label: "💰", color: "#f59e0b" },
    { label: "🎁", color: "#ec4899" },
    { label: "⭐", color: "#8b5cf6" },
    { label: "🏆", color: "#3b82f6" },
    { label: "🔥", color: "#ef4444" },
    { label: "✨", color: "#eab308" },
    { label: "🎯", color: "#06b6d4" },
  ]

  return (
    <div style={styles.page}>
      <PageHeader title="Roue de la Fortune" />

      <style>
        {`
          @keyframes pulse-go {
            0%, 100% { 
              box-shadow: 0 0 30px rgba(245,158,11,0.5), 0 0 60px rgba(245,158,11,0.3);
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              box-shadow: 0 0 50px rgba(245,158,11,0.8), 0 0 100px rgba(245,158,11,0.5);
              transform: translate(-50%, -50%) scale(1.05);
            }
          }
          @keyframes spinning-glow {
            0% { filter: drop-shadow(0 0 20px rgba(245,158,11,0.5)); }
            50% { filter: drop-shadow(0 0 40px rgba(16,185,129,0.7)); }
            100% { filter: drop-shadow(0 0 20px rgba(245,158,11,0.5)); }
          }
          @keyframes win-explosion {
            0% { transform: scale(0); opacity: 0; }
            40% { transform: scale(1.3); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            animation: confetti-fall 3s linear forwards;
            pointer-events: none;
          }
        `}
      </style>

      {/* CONFETTIS */}
      {showConfetti && (
        <div style={styles.confettiContainer}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6", "#eab308"][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div style={styles.content}>
        {/* HEADER */}
        <div style={styles.headerCard}>
          <Trophy size={28} color="#f59e0b" />
          <div style={{ flex: 1 }}>
            <p style={styles.headerTitle}>Tours disponibles</p>
            <p style={styles.headerValue}>{statut?.toursRestants || 0}</p>
          </div>
        </div>

        {/* ROUE */}
        <div style={styles.wheelWrapper}>
          {/* Pointeur du haut */}
          <div style={styles.pointer} />

          {/* Glow externe */}
          <div style={styles.wheelGlow} />

          {/* Roue */}
          <div
            style={{
              ...styles.wheel,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 5s cubic-bezier(0.17, 0.67, 0.32, 1.05)"
                : "none",
              animation: spinning ? "spinning-glow 1s ease-in-out infinite" : "none",
            }}
          >
            {segments.map((seg, idx) => {
              const angle = (360 / segments.length) * idx
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.segment,
                    background: `linear-gradient(135deg, ${seg.color}, ${seg.color}88)`,
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

            {/* Cercle central décoratif */}
            <div style={styles.centerRing} />
          </div>

          {/* Bouton GO au centre */}
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
                  ? "pulse-go 2s ease-in-out infinite"
                  : "none",
            }}
          >
            {spinning ? "..." : "GO"}
          </button>
        </div>

        {/* MESSAGE SUSPENSE PENDANT SPIN */}
        {spinning && (
          <div style={styles.suspenseBox}>
            <Sparkles size={20} color="#f59e0b" />
            <span style={styles.suspenseText}>
              La roue tourne... Quel sera votre gain ? 🎲
            </span>
          </div>
        )}

        {/* AFFICHAGE GAIN (après animation) */}
        {showWin && !spinning && (
          <div
            style={{
              ...styles.winBox,
              animation: "win-explosion 0.8s ease-out",
            }}
          >
            <div style={styles.winIconWrap}>
              <Trophy size={32} color="#f59e0b" />
            </div>
            <p style={styles.winLabel}>🎉 Félicitations ! 🎉</p>
            <p style={styles.winAmount}>+{formatXAF(showWin.montant)}</p>
            <p style={styles.winSub}>Crédité sur votre solde</p>
          </div>
        )}

        {/* MESSAGE SI PAS DE TOUR */}
        {(!statut?.toursRestants || statut.toursRestants === 0) && !spinning && !showWin && (
          <div style={styles.noTourBox}>
            <Info size={18} color="#86efac" />
            <p style={styles.noTourText}>
              Aucun tour disponible pour le moment. Restez actif sur la plateforme
              et l'administrateur pourra vous accorder des tours bonus !
            </p>
          </div>
        )}

        {/* STATS */}
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

        {/* HISTORIQUE */}
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

        {/* RÈGLES */}
        <div style={styles.rulesBox}>
          <h3 style={styles.rulesTitle}>📌 Comment ça marche ?</h3>
          <ul style={styles.rulesList}>
            <li>L'admin vous accorde des tours bonus</li>
            <li>Cliquez sur "GO" pour tourner la roue</li>
            <li>Découvrez votre gain à la fin du tour</li>
            <li>Le montant est crédité immédiatement</li>
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
    position: "relative",
    overflow: "hidden",
  },
  confettiContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 1000,
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
  // WHEEL
  wheelWrapper: {
    position: "relative",
    width: "300px",
    height: "300px",
    margin: "30px auto 30px",
  },
  pointer: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "18px solid transparent",
    borderRight: "18px solid transparent",
    borderTop: "30px solid #f59e0b",
    zIndex: 10,
    filter: "drop-shadow(0 4px 12px rgba(245,158,11,0.6))",
  },
  wheelGlow: {
    position: "absolute",
    top: "-20px",
    left: "-20px",
    right: "-20px",
    bottom: "-20px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  wheel: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "8px solid #f59e0b",
    background: "#0a0f0d",
    boxShadow:
      "0 0 50px rgba(245,158,11,0.4), inset 0 0 40px rgba(0,0,0,0.7)",
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
    borderRight: "2px solid rgba(0,0,0,0.3)",
  },
  segmentLabel: {
    fontSize: "2rem",
    marginLeft: "30px",
    marginTop: "15px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
  },
  centerRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#0a0f0d",
    border: "4px solid #f59e0b",
    zIndex: 3,
  },
  centerBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "4px solid #fff",
    color: "#0a0f0d",
    fontSize: "1.5rem",
    fontWeight: 900,
    zIndex: 5,
    transition: "all 0.3s",
    letterSpacing: "0.05em",
  },
  // SUSPENSE
  suspenseBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.1))",
    border: "1px solid rgba(245,158,11,0.4)",
    borderRadius: "14px",
    marginBottom: "16px",
    animation: "shake 0.3s ease-in-out infinite",
  },
  suspenseText: {
    fontSize: "0.95rem",
    color: "#f59e0b",
    fontWeight: 700,
    textAlign: "center",
  },
  // WIN
  winBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "24px 20px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.15))",
    border: "3px solid #f59e0b",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.2)",
  },
  winIconWrap: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 30px rgba(245,158,11,0.6)",
  },
  winLabel: {
    fontSize: "1rem",
    color: "#f59e0b",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  winAmount: {
    fontSize: "2.5rem",
    fontWeight: 900,
    color: "#10b981",
    textShadow: "0 0 20px rgba(16,185,129,0.5)",
  },
  winSub: {
    fontSize: "0.85rem",
    color: "#86efac",
  },
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