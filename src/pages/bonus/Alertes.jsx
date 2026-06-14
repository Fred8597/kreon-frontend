import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  Check,
  Trash2,
  Inbox,
  CheckCheck,
  CreditCard,
  ArrowDownToLine,
  TrendingUp,
  Award,
  Gift,
  Package,
  CalendarCheck,
  Sparkles,
  Megaphone,
  AlertCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  getMesNotifications,
  marquerLue,
  marquerToutesLues,
  supprimerNotification,
  supprimerToutesLues,
} from "../../services/notificationService"
import { formatXAF, timeAgo } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Alertes = () => {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState("toutes") // toutes | non-lues

  // ===== CONFIG icons par type =====
  const typeConfig = {
    RECHARGE_VALIDEE: { icon: CreditCard, color: "#10b981" },
    RECHARGE_REFUSEE: { icon: CreditCard, color: "#ef4444" },
    RETRAIT_VALIDE: { icon: ArrowDownToLine, color: "#10b981" },
    RETRAIT_PAYE: { icon: ArrowDownToLine, color: "#10b981" },
    RETRAIT_REFUSE: { icon: ArrowDownToLine, color: "#ef4444" },
    ROI_VERSE: { icon: TrendingUp, color: "#f59e0b" },
    COMMISSION_RECUE: { icon: Award, color: "#ec4899" },
    BONUS_RECU: { icon: Gift, color: "#eab308" },
    INVESTISSEMENT_CREE: { icon: Package, color: "#8b5cf6" },
    POINTAGE: { icon: CalendarCheck, color: "#06b6d4" },
    GIFTCODE: { icon: Gift, color: "#f59e0b" },
    TIRAGE_GAIN: { icon: Sparkles, color: "#eab308" },
    COFFRE_OUVERT: { icon: Gift, color: "#f59e0b" },
    ANNONCE: { icon: Megaphone, color: "#3b82f6" },
    SYSTEM: { icon: AlertCircle, color: "#6b7280" },
  }

  // ===== FETCH =====
  const fetchNotifications = async () => {
    try {
      const filtreParam = filtre === "non-lues" ? "non-lues" : null
      const data = await getMesNotifications(filtreParam)
      setNotifications(data)
    } catch (error) {
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchNotifications()
  }, [filtre])

  // ===== HANDLERS =====
  const handleClickNotif = async (notif) => {
    // Marquer comme lue
    if (!notif.lu) {
      try {
        await marquerLue(notif._id)
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, lu: true } : n))
        )
      } catch (error) {
        console.error(error)
      }
    }

    // Naviguer si lien
    if (notif.lien) {
      navigate(notif.lien)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await marquerToutesLues()
      toast.success("Toutes les notifications marquées lues")
      fetchNotifications()
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await supprimerNotification(id)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      toast.success("Notification supprimée")
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const handleClearRead = async () => {
    if (!window.confirm("Supprimer toutes les notifications lues ?")) return
    try {
      await supprimerToutesLues()
      toast.success("Notifications lues supprimées")
      fetchNotifications()
    } catch (error) {
      toast.error("Erreur")
    }
  }

  // ===== Stats =====
  const nbNonLues = notifications.filter((n) => !n.lu).length
  const nbLues = notifications.filter((n) => n.lu).length

  return (
    <div style={styles.page}>
      <PageHeader title="Mes alertes" />

      <div style={styles.content}>
        {/* ===== HEADER STATS ===== */}
        <div style={styles.statsCard}>
          <div style={styles.statsLeft}>
            <Bell size={28} color="#10b981" />
            <div>
              <p style={styles.statsTitle}>
                {nbNonLues > 0
                  ? `${nbNonLues} notification${nbNonLues > 1 ? "s" : ""} non lue${nbNonLues > 1 ? "s" : ""}`
                  : "Tout est à jour ✓"}
              </p>
              <p style={styles.statsSubtitle}>
                {notifications.length} total{notifications.length > 1 ? "es" : ""}
              </p>
            </div>
          </div>

          {nbNonLues > 0 && (
            <button onClick={handleMarkAllRead} style={styles.markAllBtn}>
              <CheckCheck size={16} />
              <span>Tout lu</span>
            </button>
          )}
        </div>

        {/* ===== FILTRES ===== */}
        <div style={styles.filtersRow}>
          <button
            onClick={() => setFiltre("toutes")}
            style={{
              ...styles.filterBtn,
              ...(filtre === "toutes" ? styles.filterBtnActive : {}),
            }}
          >
            Toutes
          </button>
          <button
            onClick={() => setFiltre("non-lues")}
            style={{
              ...styles.filterBtn,
              ...(filtre === "non-lues" ? styles.filterBtnActive : {}),
            }}
          >
            Non lues ({nbNonLues})
          </button>

          {nbLues > 0 && (
            <button onClick={handleClearRead} style={styles.clearBtn}>
              <Trash2 size={14} />
              <span>Vider lues</span>
            </button>
          )}
        </div>

        {/* ===== LISTE ===== */}
        {loading ? (
          <LoadingSpinner text="Chargement..." />
        ) : notifications.length === 0 ? (
          <div style={styles.empty}>
            <Inbox size={60} color="#6b7280" />
            <p style={styles.emptyTitle}>
              {filtre === "non-lues"
                ? "Aucune notification non lue"
                : "Aucune notification"}
            </p>
            <p style={styles.emptyText}>
              Vous recevrez ici les alertes importantes de votre compte
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => {
              const cfg = typeConfig[notif.type] || typeConfig.SYSTEM
              const Icon = cfg.icon

              return (
                <div
                  key={notif._id}
                  onClick={() => handleClickNotif(notif)}
                  style={{
                    ...styles.notifCard,
                    ...(notif.lu ? styles.notifCardLu : styles.notifCardNonLu),
                    cursor: notif.lien ? "pointer" : "default",
                  }}
                >
                  {/* Pastille non-lu */}
                  {!notif.lu && <div style={styles.unreadDot} />}

                  {/* Icône */}
                  <div
                    style={{
                      ...styles.iconBox,
                      backgroundColor: `${cfg.color}15`,
                      border: `1px solid ${cfg.color}40`,
                    }}
                  >
                    <Icon size={20} color={cfg.color} />
                  </div>

                  {/* Contenu */}
                  <div style={styles.notifBody}>
                    <p
                      style={{
                        ...styles.notifTitle,
                        fontWeight: notif.lu ? 600 : 800,
                      }}
                    >
                      {notif.titre}
                    </p>
                    <p style={styles.notifMessage}>{notif.message}</p>

                    <div style={styles.notifFooter}>
                      <span style={styles.notifTime}>
                        {timeAgo(notif.createdAt)}
                      </span>

                      {notif.montant !== null && notif.montant !== undefined && (
                        <span
                          style={{
                            ...styles.notifMontant,
                            color: cfg.color,
                          }}
                        >
                          {notif.type.includes("REFUS") ? "" : "+"}
                          {formatXAF(notif.montant)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={(e) => handleDelete(notif._id, e)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={14} color="#6b7280" />
                  </button>
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
  // STATS
  statsCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    marginBottom: "14px",
    gap: "10px",
  },
  statsLeft: { display: "flex", alignItems: "center", gap: "12px" },
  statsTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#f0fdf4",
  },
  statsSubtitle: {
    fontSize: "0.72rem",
    color: "#86efac",
    marginTop: "2px",
  },
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "10px",
    color: "#10b981",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  // FILTRES
  filtersRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "20px",
    color: "#6b7280",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "1px solid #10b981",
  },
  clearBtn: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "20px",
    color: "#ef4444",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  // LISTE
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  notifCard: {
    position: "relative",
    display: "flex",
    gap: "12px",
    padding: "14px",
    border: "1px solid",
    borderRadius: "14px",
    transition: "all 0.3s",
  },
  notifCardNonLu: {
    backgroundColor: "rgba(16,185,129,0.06)",
    borderColor: "rgba(16,185,129,0.2)",
  },
  notifCardLu: {
    backgroundColor: "rgba(17,26,20,0.5)",
    borderColor: "rgba(16,185,129,0.08)",
  },
  unreadDot: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 8px rgba(16,185,129,0.6)",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifBody: { flex: 1, minWidth: 0 },
  notifTitle: {
    fontSize: "0.88rem",
    color: "#f0fdf4",
    marginBottom: "4px",
    paddingRight: "20px",
  },
  notifMessage: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.5,
    marginBottom: "8px",
  },
  notifFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  notifTime: {
    fontSize: "0.7rem",
    color: "#6b7280",
  },
  notifMontant: {
    fontSize: "0.85rem",
    fontWeight: 800,
  },
  deleteBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    backgroundColor: "rgba(10,15,13,0.5)",
    border: "1px solid rgba(107,114,128,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    alignSelf: "flex-start",
  },
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

export default Alertes