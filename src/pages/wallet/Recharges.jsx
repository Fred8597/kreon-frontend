import { useState, useEffect } from "react"
import { Wallet, Inbox } from "lucide-react"
import toast from "react-hot-toast"
import { getMesRecharges } from "../../services/walletService"
import { formatXAF, formatDateTime } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import StatusBadge from "../../components/ui/StatusBadge"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Recharges = () => {
  const [recharges, setRecharges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecharges = async () => {
      try {
        const data = await getMesRecharges()
        setRecharges(data)
      } catch (error) {
        toast.error("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetchRecharges()
  }, [])

  return (
    <div style={styles.page}>
      <PageHeader title="Historique des recharges" />

      <div style={styles.content}>
        {loading ? (
          <LoadingSpinner text="Chargement..." />
        ) : recharges.length === 0 ? (
          <div style={styles.empty}>
            <Inbox size={50} color="#6b7280" />
            <p style={styles.emptyTitle}>Aucune recharge</p>
            <p style={styles.emptyText}>
              Vous n'avez pas encore effectué de recharge
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {recharges.map((r) => (
              <div key={r._id} style={styles.card}>
                {/* Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.cardLeft}>
                    <div style={styles.iconBox}>
                      <Wallet size={18} color="#10b981" />
                    </div>
                    <div>
                      <p style={styles.method}>{r.methode}</p>
                      <p style={styles.ref}>
                        {r.referencePaiement || "Sans référence"}
                      </p>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <p style={styles.amount}>+{formatXAF(r.montant)}</p>
                    <StatusBadge status={r.statut} />
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.cardFooter}>
                  <span style={styles.date}>📅 {formatDateTime(r.createdAt)}</span>
                  {r.numeroPayeur && (
                    <span style={styles.tel}>📞 {r.numeroPayeur}</span>
                  )}
                </div>

                {/* Commentaire admin (si refusé) */}
                {r.commentaireAdmin && (
                  <div style={styles.adminComment}>
                    <strong>Note admin :</strong> {r.commentaireAdmin}
                  </div>
                )}
              </div>
            ))}
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
  content: {
    padding: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
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
  cardLeft: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  method: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "2px",
  },
  ref: {
    fontSize: "0.7rem",
    color: "#6b7280",
  },
  cardRight: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
  },
  amount: {
    fontSize: "1rem",
    fontWeight: 800,
    color: "#10b981",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    paddingTop: "10px",
    borderTop: "1px solid rgba(16,185,129,0.08)",
    fontSize: "0.7rem",
    color: "#6b7280",
    flexWrap: "wrap",
  },
  date: {},
  tel: {},
  adminComment: {
    marginTop: "10px",
    padding: "8px 10px",
    backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "8px",
    fontSize: "0.75rem",
    color: "#fca5a5",
  },
  empty: {
    padding: "60px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  emptyTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#86efac",
  },
  emptyText: {
    fontSize: "0.82rem",
    color: "#6b7280",
  },
}

export default Recharges