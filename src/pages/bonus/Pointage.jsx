import { useState, useEffect } from "react"
import {
  CalendarCheck,
  CheckCircle2,
  Coins,
  Calendar,
  TrendingUp,
  Clock,
  Crown,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import {
  getStatutPointage,
  faireCheckin,
  getHistoriquePointage,
} from "../../services/pointageService"
import { formatXAF, formatDate } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Pointage = () => {
  const { user, refreshUser } = useAuth()

  const [statut, setStatut] = useState(null)
  const [historique, setHistorique] = useState([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const fetchData = async () => {
    try {
      const [statutData, histoData] = await Promise.all([
        getStatutPointage(),
        getHistoriquePointage(),
      ])
      setStatut(statutData)
      setHistorique(histoData)
    } catch (error) {
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCheckin = async () => {
    setChecking(true)
    try {
      const result = await faireCheckin()
      toast.success(result.message, { duration: 4000 })
      await refreshUser()
      await fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Pointage" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  const deja = statut?.pointeAujourdhui
  const isVIPActif = statut?.isVIPActif
  const isVIPSuspendu = statut?.isVIP && !statut?.isVIPActif

  return (
    <div style={styles.page}>
      <PageHeader title="Pointage quotidien" />

      <div style={styles.content}>
        {/* SOLDE */}
        <div style={styles.soldeBox}>
          <span style={styles.soldeLabel}>Mon solde</span>
          <span style={styles.soldeValue}>
            {formatXAF(user?.soldePrincipal || 0)}
          </span>
        </div>

        {/* CARTE PRINCIPALE */}
        <div
          style={{
            ...styles.mainCard,
            ...(deja ? styles.mainCardDone : {}),
          }}
        >
          <div
            style={{
              ...styles.iconWrapper,
              ...(deja ? styles.iconWrapperDone : {}),
            }}
          >
            {deja ? (
              <CheckCircle2 size={50} color="#10b981" />
            ) : (
              <CalendarCheck size={50} color="#f59e0b" />
            )}
          </div>

          <h2 style={styles.title}>
            {deja ? "✅ Pointé aujourd'hui !" : "🎁 Récompense du jour"}
          </h2>

          {/* DÉTAIL RÉCOMPENSE */}
          <div style={styles.rewardDetail}>
            <div style={styles.rewardRow}>
              <span style={styles.rewardLabel}>
                <Coins size={14} color="#f59e0b" />
                Pointage
              </span>
              <span style={styles.rewardValue}>
                +{formatXAF(statut?.montantPointage || 50)}
              </span>
            </div>

            {/* Salaire VIP si applicable */}
            {statut?.isVIP && (
              <div style={styles.rewardRow}>
                <span style={styles.rewardLabel}>
                  <Crown size={14} color={isVIPActif ? "#eab308" : "#6b7280"} />
                  Salaire {statut.nomVIP}
                  {isVIPSuspendu && <span style={styles.suspenduBadge}>SUSPENDU</span>}
                </span>
                <span
                  style={{
                    ...styles.rewardValue,
                    color: isVIPActif ? "#eab308" : "#6b7280",
                    textDecoration: isVIPSuspendu ? "line-through" : "none",
                  }}
                >
                  +{formatXAF(statut.salaireVIP || 0)}
                </span>
              </div>
            )}

            <div style={styles.totalSeparator} />

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total du jour</span>
              <span style={styles.totalValue}>
                +{formatXAF(statut?.totalAujourdhui || 50)}
              </span>
            </div>
          </div>

          {deja ? (
            <p style={styles.doneText}>
              🕒 Revenez demain pour pointer à nouveau
            </p>
          ) : (
            <p style={styles.hintText}>
              Cliquez ci-dessous pour récupérer votre bonus
            </p>
          )}

          {!deja && (
            <div style={{ marginTop: "16px" }}>
              <Button onClick={handleCheckin} loading={checking}>
                <CalendarCheck size={18} />
                Pointer maintenant
              </Button>
            </div>
          )}

          {deja && statut?.derniereDate && (
            <p style={styles.timestamp}>
              <Clock size={12} style={{ verticalAlign: "middle" }} /> Pointé à{" "}
              {new Date(statut.derniereDate).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <Calendar size={22} color="#10b981" />
            <div>
              <p style={styles.statLabel}>Total pointages</p>
              <p style={styles.statValue}>{statut?.totalCheckins || 0}</p>
            </div>
          </div>
          <div style={styles.statBox}>
            <TrendingUp size={22} color="#f59e0b" />
            <div>
              <p style={styles.statLabel}>Total gagné</p>
              <p style={styles.statValue}>
                {formatXAF(statut?.totalGagne || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* HISTORIQUE */}
        <div style={styles.historyBox}>
          <h3 style={styles.historyTitle}>📅 Historique récent</h3>
          {historique.length === 0 ? (
            <p style={styles.emptyText}>
              Aucun pointage encore. Commencez aujourd'hui !
            </p>
          ) : (
            <div style={styles.historyList}>
              {historique.map((h) => (
                <div key={h._id} style={styles.historyItem}>
                  <div style={styles.historyLeft}>
                    <div style={styles.historyDot} />
                    <div>
                      <p style={styles.historyDate}>
                        {formatDate(h.dateCheckin)}
                      </p>
                      <p style={styles.historyTime}>
                        {new Date(h.dateCheckin).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span style={styles.historyAmount}>
                    +{formatXAF(h.montant)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>💡 Comment ça marche ?</p>
          <ul style={styles.infoList}>
            <li>Connectez-vous chaque jour</li>
            <li>Cliquez sur "Pointer maintenant"</li>
            <li>Recevez 50 XAF + votre salaire VIP (si actif)</li>
            <li>Reset à minuit (00h00) chaque jour</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  soldeBox: {
    background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.05))",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "16px",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  soldeLabel: { fontSize: "0.8rem", color: "#86efac" },
  soldeValue: { fontSize: "1.15rem", fontWeight: 800, color: "#f59e0b" },
  mainCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "20px",
    padding: "28px 20px",
    textAlign: "center",
    marginBottom: "16px",
    background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(16,185,129,0.05))",
  },
  mainCardDone: {
    borderColor: "rgba(16,185,129,0.4)",
    background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.05))",
  },
  iconWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "rgba(245,158,11,0.15)",
    border: "2px solid rgba(245,158,11,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  iconWrapperDone: {
    backgroundColor: "rgba(16,185,129,0.15)",
    borderColor: "rgba(16,185,129,0.5)",
    boxShadow: "0 0 30px rgba(16,185,129,0.3)",
  },
  title: { fontSize: "1.25rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "16px" },
  // REWARD
  rewardDetail: {
    padding: "14px",
    backgroundColor: "rgba(10,15,13,0.5)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    marginBottom: "12px",
    textAlign: "left",
  },
  rewardRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  rewardLabel: {
    fontSize: "0.82rem",
    color: "#86efac",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  rewardValue: { fontSize: "0.95rem", fontWeight: 700, color: "#f59e0b" },
  suspenduBadge: {
    fontSize: "0.6rem",
    color: "#ef4444",
    fontWeight: 700,
    padding: "1px 6px",
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: "8px",
    marginLeft: "4px",
  },
  totalSeparator: {
    height: "1px",
    backgroundColor: "rgba(16,185,129,0.15)",
    margin: "8px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0",
  },
  totalLabel: { fontSize: "0.9rem", color: "#f0fdf4", fontWeight: 700 },
  totalValue: { fontSize: "1.2rem", fontWeight: 900, color: "#10b981" },
  // REST
  hintText: { fontSize: "0.82rem", color: "#86efac", marginBottom: "4px" },
  doneText: { fontSize: "0.85rem", color: "#10b981", fontWeight: 600 },
  timestamp: { fontSize: "0.75rem", color: "#6b7280", marginTop: "10px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  statBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
  },
  statLabel: { fontSize: "0.7rem", color: "#6b7280" },
  statValue: { fontSize: "1rem", fontWeight: 800, color: "#f0fdf4" },
  historyBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
  },
  historyTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "12px" },
  historyList: { display: "flex", flexDirection: "column", gap: "8px" },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
  },
  historyLeft: { display: "flex", alignItems: "center", gap: "10px" },
  historyDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 10px rgba(16,185,129,0.5)",
  },
  historyDate: { fontSize: "0.82rem", color: "#f0fdf4", fontWeight: 600 },
  historyTime: { fontSize: "0.7rem", color: "#6b7280", marginTop: "2px" },
  historyAmount: { fontSize: "0.9rem", fontWeight: 800, color: "#10b981" },
  emptyText: { fontSize: "0.82rem", color: "#6b7280", textAlign: "center", padding: "20px 0" },
  infoBox: {
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

export default Pointage