import { useState, useEffect } from "react"
import {
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  Package,
  Gift,
  Award,
  Inbox,
} from "lucide-react"
import toast from "react-hot-toast"
import { getMesTransactions } from "../../services/walletService"
import { formatXAF, formatDateTime } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import StatusBadge from "../../components/ui/StatusBadge"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Gains = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const data = await getMesTransactions()
        setTransactions(data)
      } catch (error) {
        toast.error("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetchTx()
  }, [])

  // ===== FILTRES =====
  const filters = [
    { id: "all", label: "Tout", types: [] },
    { id: "gains", label: "Gains", types: ["GAIN_ROI", "BONUS"] },
    { id: "commissions", label: "Commissions", types: ["COMMISSION"] },
    { id: "depots", label: "Dépôts", types: ["RECHARGE"] },
    { id: "retraits", label: "Retraits", types: ["RETRAIT"] },
    { id: "invest", label: "Investis.", types: ["INVESTISSEMENT"] },
  ]

  const filtered = transactions.filter((tx) => {
    if (activeFilter === "all") return true
    const f = filters.find((f) => f.id === activeFilter)
    return f && f.types.includes(tx.type)
  })

  // ===== CONFIG TYPE =====
  const typeConfig = {
    RECHARGE: {
      icon: Wallet,
      label: "Recharge",
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
    },
    RETRAIT: {
      icon: ArrowDownToLine,
      label: "Retrait",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
    INVESTISSEMENT: {
      icon: Package,
      label: "Investissement",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
    },
    GAIN_ROI: {
      icon: TrendingUp,
      label: "Gain ROI",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    COMMISSION: {
      icon: Award,
      label: "Commission",
      color: "#ec4899",
      bg: "rgba(236,72,153,0.1)",
    },
    BONUS: {
      icon: Gift,
      label: "Bonus",
      color: "#eab308",
      bg: "rgba(234,179,8,0.1)",
    },
    REMBOURSEMENT: {
      icon: Wallet,
      label: "Remboursement",
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
    },
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Historique des gains" />

      <div style={styles.content}>
        {/* ===== FILTRES ===== */}
        <div style={styles.filtersRow}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f.id ? styles.filterBtnActive : {}),
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ===== LISTE ===== */}
        {loading ? (
          <LoadingSpinner text="Chargement..." />
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <Inbox size={50} color="#6b7280" />
            <p style={styles.emptyTitle}>Aucune transaction</p>
            <p style={styles.emptyText}>
              Vous n'avez pas encore de transaction dans cette catégorie
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((tx) => {
              const cfg = typeConfig[tx.type] || typeConfig.BONUS
              const Icon = cfg.icon
              const isPositive = tx.montant > 0

              return (
                <div key={tx._id} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <div
                      style={{
                        ...styles.iconBox,
                        backgroundColor: cfg.bg,
                        border: `1px solid ${cfg.color}40`,
                      }}
                    >
                      <Icon size={18} color={cfg.color} />
                    </div>
                    <div style={styles.cardInfo}>
                      <p style={styles.cardLabel}>{cfg.label}</p>
                      <p style={styles.cardDesc}>{tx.description}</p>
                      <p style={styles.cardDate}>
                        {formatDateTime(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <p
                      style={{
                        ...styles.amount,
                        color: isPositive ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {isPositive ? "+" : ""}
                      {formatXAF(tx.montant)}
                    </p>
                    <StatusBadge status={tx.statut} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
  // FILTRES
  filtersRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    marginBottom: "16px",
    paddingBottom: "4px",
  },
  filterBtn: {
    padding: "8px 16px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "20px",
    color: "#6b7280",
    fontSize: "0.78rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "1px solid #10b981",
    boxShadow: "0 2px 10px rgba(16,185,129,0.3)",
  },
  // LISTE
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "12px",
  },
  cardLeft: {
    display: "flex",
    gap: "10px",
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "2px",
  },
  cardDesc: {
    fontSize: "0.7rem",
    color: "#86efac",
    marginBottom: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardDate: { fontSize: "0.68rem", color: "#6b7280" },
  cardRight: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  amount: { fontSize: "0.95rem", fontWeight: 800 },
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

export default Gains