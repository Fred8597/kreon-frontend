import { useState, useEffect } from "react"
import { Package, Inbox, Calendar, TrendingUp } from "lucide-react"
import toast from "react-hot-toast"
import { getMesInvestissements } from "../../services/investmentService"
import { formatXAF, formatDateTime } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import StatusBadge from "../../components/ui/StatusBadge"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Commandes = () => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const data = await getMesInvestissements()
        setInvestments(data)
      } catch (error) {
        toast.error("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetchInvestments()
  }, [])

  // ===== Filtrage par onglet =====
  const filtered = investments.filter((inv) => {
    if (activeTab === "all") return true
    if (activeTab === "actif") return inv.statut === "ACTIF"
    if (activeTab === "termine") return inv.statut === "TERMINE"
    return true
  })

  // ===== Calcul progression % =====
  const calculerProgression = (inv) => {
    const debut = new Date(inv.dateDebut).getTime()
    const fin = new Date(inv.dateExpiration).getTime()
    const maintenant = Date.now()

    if (inv.statut === "TERMINE") return 100
    if (maintenant >= fin) return 100
    if (maintenant <= debut) return 0

    return Math.floor(((maintenant - debut) / (fin - debut)) * 100)
  }

  // ===== Jours restants =====
  const joursRestants = (inv) => {
    if (inv.statut === "TERMINE") return 0
    const diff = new Date(inv.dateExpiration).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // ===== Stats globales =====
  const totalInvesti = investments.reduce((sum, inv) => sum + inv.montantInvesti, 0)
  const totalARecevoir = investments.reduce(
    (sum, inv) => sum + inv.montantTotalARecevoir,
    0
  )
  const nbActifs = investments.filter((inv) => inv.statut === "ACTIF").length
  const nbTermines = investments.filter((inv) => inv.statut === "TERMINE").length

  return (
    <div style={styles.page}>
      <PageHeader title="Mes commandes" />

      <div style={styles.content}>
        {loading ? (
          <LoadingSpinner text="Chargement..." />
        ) : (
          <>
            {/* ===== STATS GLOBALES ===== */}
            <div style={styles.statsCard}>
              <div style={styles.statsHeader}>
                <Package size={18} color="#10b981" />
                <span style={styles.statsTitle}>Aperçu des locations</span>
                <span style={styles.statsBadge}>{investments.length}</span>
              </div>

              <div style={styles.statsGrid}>
                <StatItem
                  label="Total investi"
                  value={formatXAF(totalInvesti)}
                  color="#86efac"
                />
                <StatItem
                  label="Total à recevoir"
                  value={formatXAF(totalARecevoir)}
                  color="#f59e0b"
                />
              </div>

              <div style={styles.statsCounters}>
                <CounterBox label="Actifs" value={nbActifs} color="#3b82f6" />
                <CounterBox label="Terminés" value={nbTermines} color="#10b981" />
              </div>
            </div>

            {/* ===== ONGLETS ===== */}
            <div style={styles.tabsRow}>
              {[
                { id: "all", label: "Tous" },
                { id: "actif", label: "En cours" },
                { id: "termine", label: "Terminés" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tabBtn,
                    ...(activeTab === tab.id ? styles.tabBtnActive : {}),
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ===== LISTE ===== */}
            {filtered.length === 0 ? (
              <div style={styles.empty}>
                <Inbox size={50} color="#6b7280" />
                <p style={styles.emptyTitle}>Aucune location</p>
                <p style={styles.emptyText}>
                  Commencez votre première location depuis l'accueil
                </p>
              </div>
            ) : (
              <div style={styles.list}>
                {filtered.map((inv) => {
                  const progression = calculerProgression(inv)
                  const jours = joursRestants(inv)

                  return (
                    <div key={inv._id} style={styles.card}>
                      {/* Header */}
                      <div style={styles.cardHeader}>
                        <div>
                          <p style={styles.productName}>{inv.nomProduit}</p>
                          <p style={styles.cardDate}>
                            {formatDateTime(inv.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={inv.statut} />
                      </div>

                      {/* Specs */}
                      <div style={styles.specsRow}>
                        <SpecBox
                          icon={<Calendar size={14} color="#f59e0b" />}
                          label="Durée"
                          value={`${inv.dureeJours}j`}
                        />
                        <SpecBox
                          icon={<TrendingUp size={14} color="#10b981" />}
                          label="ROI"
                          value={`${inv.roiPourcentage}%`}
                        />
                        <SpecBox
                          icon={<Package size={14} color="#34d399" />}
                          label="Mise"
                          value={formatXAF(inv.montantInvesti)}
                        />
                      </div>

                      {/* Montants */}
                      <div style={styles.amountBox}>
                        <div>
                          <span style={styles.amountLabel}>À recevoir</span>
                          <p style={styles.amountValue}>
                            {formatXAF(inv.montantTotalARecevoir)}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={styles.amountLabel}>
                            {inv.statut === "TERMINE" ? "Terminé" : "Reste"}
                          </span>
                          <p style={styles.daysValue}>
                            {inv.statut === "TERMINE" ? "✅" : `${jours}j`}
                          </p>
                        </div>
                      </div>

                      {/* Barre progression */}
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${progression}%`,
                          }}
                        />
                      </div>
                      <p style={styles.progressText}>
                        Progression : <strong>{progression}%</strong>
                      </p>

                      {/* Date complétion */}
                      {inv.dateCompletion && (
                        <p style={styles.completionDate}>
                          ✅ Crédité le {formatDateTime(inv.dateCompletion)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ===== Sous-composants =====
const StatItem = ({ label, value, color }) => (
  <div style={styles.statItem}>
    <span style={styles.statLabel}>{label}</span>
    <span style={{ ...styles.statValue, color }}>{value}</span>
  </div>
)

const CounterBox = ({ label, value, color }) => (
  <div style={styles.counter}>
    <span style={{ ...styles.counterValue, color }}>{value}</span>
    <span style={styles.counterLabel}>{label}</span>
  </div>
)

const SpecBox = ({ icon, label, value }) => (
  <div style={styles.specBox}>
    {icon}
    <div>
      <span style={styles.specLabel}>{label}</span>
      <p style={styles.specValue}>{value}</p>
    </div>
  </div>
)

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    paddingBottom: "30px",
  },
  content: { padding: "20px" },
  // STATS
  statsCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
  },
  statsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  statsTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#f0fdf4",
    flex: 1,
  },
  statsBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    color: "#10b981",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "12px",
  },
  statItem: {
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  statLabel: { fontSize: "0.7rem", color: "#6b7280" },
  statValue: { fontSize: "0.95rem", fontWeight: 800 },
  statsCounters: { display: "flex", gap: "10px" },
  counter: {
    flex: 1,
    padding: "10px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  counterValue: { fontSize: "1.3rem", fontWeight: 800 },
  counterLabel: { fontSize: "0.7rem", color: "#6b7280" },
  // ONGLETS
  tabsRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  tabBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "10px",
    color: "#6b7280",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
  },
  tabBtnActive: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "1px solid #10b981",
  },
  // LISTE
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    padding: "14px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  productName: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "2px",
  },
  cardDate: { fontSize: "0.7rem", color: "#6b7280" },
  specsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },
  specBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "8px",
  },
  specLabel: { fontSize: "0.65rem", color: "#6b7280", display: "block" },
  specValue: { fontSize: "0.8rem", fontWeight: 700, color: "#f0fdf4" },
  amountBox: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "10px",
  },
  amountLabel: { fontSize: "0.7rem", color: "#86efac", display: "block" },
  amountValue: { fontSize: "1.05rem", fontWeight: 800, color: "#f59e0b" },
  daysValue: { fontSize: "1.05rem", fontWeight: 800, color: "#10b981" },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "rgba(10,15,13,0.6)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "6px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #10b981, #34d399)",
    transition: "width 0.5s ease",
  },
  progressText: { fontSize: "0.72rem", color: "#86efac", textAlign: "center" },
  completionDate: {
    marginTop: "8px",
    fontSize: "0.72rem",
    color: "#10b981",
    textAlign: "center",
  },
  // EMPTY
  empty: {
    padding: "60px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  emptyTitle: { fontSize: "1rem", fontWeight: 700, color: "#86efac" },
  emptyText: { fontSize: "0.82rem", color: "#6b7280" },
}

export default Commandes