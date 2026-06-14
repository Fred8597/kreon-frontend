import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Copy,
  Wallet,
  ArrowDownToLine,
  ClipboardList,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Phone,
  Users,
  Share2,
  Gift,
  KeyRound,
  Send,
  Bell,
  Sparkles,
  Download,
  Lock,
  LogOut,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { formatXAF } from "../utils/format"
import { getStats } from "../services/walletService"
import { reclamerGiftCode } from "../services/giftCodeService"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const Profil = () => {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // ===== Code Cadeau =====
  const [giftCode, setGiftCode] = useState("")
  const [claiming, setClaiming] = useState(false)

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
      await refreshUser()
    } catch (error) {
      toast.error("Erreur de chargement des statistiques")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // ===== HANDLERS =====
  const handleCopyCode = () => {
    if (user?.codeParrainage) {
      navigator.clipboard.writeText(user.codeParrainage)
      toast.success("Code copié !")
    }
  }

  const handleLogout = () => {
    if (window.confirm("Es-tu sûr de vouloir te déconnecter ?")) {
      logout()
      navigate("/login")
      toast.success("À bientôt 👋")
    }
  }

  const handleNavigate = (path, existing = false) => {
    if (existing) {
      navigate(path)
    } else {
      toast(`Page "${path}" en construction 🚧`, { icon: "⏳" })
    }
  }

  // ===== Réclamer code cadeau =====
  const handleClaimGiftCode = async () => {
    if (!giftCode.trim()) {
      toast.error("Entrez un code")
      return
    }

    setClaiming(true)
    try {
      const result = await reclamerGiftCode(giftCode.trim())
      toast.success(result.message, { duration: 4000 })
      setGiftCode("")
      await refreshUser()
      await fetchStats()
    } catch (error) {
      toast.error(error.response?.data?.message || "Code invalide")
    } finally {
      setClaiming(false)
    }
  }

  // ===== 4 ACTIONS PRINCIPALES =====
  const mainActions = [
    { icon: Wallet, label: "Recharger", color: "#10b981", path: "/recharger", existing: true },
    { icon: ArrowDownToLine, label: "Retirer", color: "#34d399", path: "/retirer", existing: true },
    { icon: ClipboardList, label: "Recharges", color: "#06b6d4", path: "/recharges", existing: true },
    { icon: Receipt, label: "Retraits", color: "#f59e0b", path: "/retraits", existing: true },
  ]

  // ===== GRILLE 12 BOUTONS =====
  const gridButtons = [
    { icon: ShoppingBag, label: "Commandes", color: "#10b981", path: "/commandes", existing: true },
    { icon: TrendingUp, label: "Gains", color: "#34d399", path: "/gains", existing: true },
    { icon: Phone, label: "Numéros mobiles", color: "#06b6d4", path: "/mobile-money", existing: true },
    { icon: Users, label: "Équipe", color: "#8b5cf6", path: "/equipe", existing: true },
    { icon: Share2, label: "Inviter", color: "#ec4899", path: "/partager", existing: true },
    { icon: Gift, label: "Coffre au Trésor", color: "#f59e0b", path: "/coffre", existing: true },
    { icon: KeyRound, label: "Code PIN", color: "#10b981", path: "/code-pin", existing: true },
    { icon: Send, label: "Chaîne", color: "#3b82f6", path: "/chaine", existing: true },
    { icon: Bell, label: "Alertes", color: "#ef4444", path: "/alertes", existing: true },
    { icon: Sparkles, label: "Tirage", color: "#eab308", path: "/tirage", existing: true },
    { icon: Download, label: "Télécharger", color: "#34d399", path: "/telecharger", existing: true },
    { icon: Lock, label: "Mot de passe", color: "#8b5cf6", path: "/mot-de-passe", existing: true },
  ]

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
      <div style={styles.headerCard}>
        <div style={styles.avatarLarge}>
          {user?.nom?.charAt(0)?.toUpperCase() || <User size={32} color="#0a0f0d" />}
        </div>

        <h1 style={styles.userName}>{user?.nom}</h1>
        <p style={styles.userPhone}>+237 {user?.telephone}</p>

        <div style={styles.codeWrapper}>
          <span style={styles.codeLabel}>Code d'invitation :</span>
          <button onClick={handleCopyCode} style={styles.codeBtn}>
            <span style={styles.codeValue}>{user?.codeParrainage}</span>
            <Copy size={14} color="#86efac" />
          </button>
        </div>
      </div>

      {/* ===== KPIs ===== */}
      {loading ? (
        <LoadingSpinner text="Chargement des statistiques..." />
      ) : (
        <>
          <div style={styles.kpiBigBox}>
            <div style={styles.kpiBigItem}>
              <span style={styles.kpiBigLabel}>Solde total</span>
              <span style={styles.kpiBigValueGreen}>
                {formatXAF(stats?.soldePrincipal || 0)}
              </span>
            </div>
            <div style={styles.kpiBigSeparator} />
            <div style={styles.kpiBigItem}>
              <span style={styles.kpiBigLabel}>Revenu total</span>
              <span style={styles.kpiBigValueOrange}>
                {formatXAF(stats?.revenuTotal || 0)}
              </span>
            </div>
          </div>

          <div style={styles.kpiGrid}>
            <KpiCard label="Compte recharge" value={formatXAF(stats?.totalRecharges || 0)} color="#06b6d4" />
            <KpiCard label="Compte récompense" value={formatXAF(stats?.totalRecompenses || 0)} color="#10b981" />
            <KpiCard label="Retrait total" value={formatXAF(stats?.totalRetraits || 0)} color="#f59e0b" />
            <KpiCard label="Aujourd'hui" value={formatXAF(stats?.revenuAujourdhui || 0)} color="#ec4899" />
          </div>
        </>
      )}

      {/* ===== 4 ACTIONS PRINCIPALES ===== */}
      <div style={styles.mainActionsGrid}>
        {mainActions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button
              key={idx}
              style={styles.mainActionBtn}
              onClick={() => handleNavigate(action.path, action.existing)}
            >
              <div
                style={{
                  ...styles.mainActionIcon,
                  backgroundColor: `${action.color}15`,
                  border: `1px solid ${action.color}30`,
                }}
              >
                <Icon size={22} color={action.color} />
              </div>
              <span style={styles.mainActionLabel}>{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* ===== ÉCHANGER CODE CADEAU (FONCTIONNEL) ===== */}
      <div style={styles.codeCadeauBox}>
        <div style={styles.codeCadeauHeader}>
          <Gift size={18} color="#10b981" />
          <h3 style={styles.codeCadeauTitle}>Échanger le Code Cadeau</h3>
        </div>
        <p style={styles.codeCadeauHint}>
          Entrez le code pour réclamer les récompenses
        </p>
        <div style={styles.codeCadeauRow}>
          <input
            type="text"
            placeholder="EX: KRN-A1B2C3"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
            style={styles.codeCadeauInput}
            disabled={claiming}
            onKeyDown={(e) => e.key === "Enter" && handleClaimGiftCode()}
          />
          <button
            style={{
              ...styles.codeCadeauBtn,
              opacity: claiming ? 0.6 : 1,
              cursor: claiming ? "not-allowed" : "pointer",
            }}
            onClick={handleClaimGiftCode}
            disabled={claiming}
          >
            {claiming ? "..." : "Réclamer"}
          </button>
        </div>
      </div>

      {/* ===== GRILLE 12 BOUTONS ===== */}
      <div style={styles.gridContainer}>
        {gridButtons.map((btn, idx) => {
          const Icon = btn.icon
          return (
            <button
              key={idx}
              style={styles.gridBtn}
              onClick={() => handleNavigate(btn.path, btn.existing)}
            >
              <Icon size={22} color={btn.color} />
              <span style={styles.gridLabel}>{btn.label}</span>
            </button>
          )
        })}
      </div>

      {/* ===== DÉCONNEXION ===== */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <LogOut size={18} />
        <span>Quitter</span>
      </button>
    </div>
  )
}

const KpiCard = ({ label, value, color }) => (
  <div style={styles.kpiCard}>
    <span style={styles.kpiCardLabel}>{label}</span>
    <span style={{ ...styles.kpiCardValue, color }}>{value}</span>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", padding: "20px", paddingBottom: "100px" },
  headerCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "20px",
    padding: "24px 20px",
    textAlign: "center",
    marginBottom: "16px",
    background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(245,158,11,0.05))",
  },
  avatarLarge: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "#0a0f0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.2rem",
    fontWeight: 800,
    margin: "0 auto 14px",
    boxShadow: "0 0 30px rgba(16,185,129,0.4)",
  },
  userName: { fontSize: "1.3rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "4px" },
  userPhone: { fontSize: "0.85rem", color: "#86efac", marginBottom: "14px" },
  codeWrapper: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  codeLabel: { fontSize: "0.7rem", color: "#6b7280" },
  codeBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "20px",
    padding: "6px 14px",
    cursor: "pointer",
  },
  codeValue: { fontSize: "0.85rem", fontWeight: 700, color: "#10b981", letterSpacing: "0.05em" },
  kpiBigBox: {
    display: "flex",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
  },
  kpiBigItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  kpiBigSeparator: { width: "1px", backgroundColor: "rgba(16,185,129,0.15)", margin: "0 12px" },
  kpiBigLabel: { fontSize: "0.72rem", color: "#86efac" },
  kpiBigValueGreen: { fontSize: "1.3rem", fontWeight: 800, color: "#10b981" },
  kpiBigValueOrange: { fontSize: "1.3rem", fontWeight: 800, color: "#f59e0b" },
  kpiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  kpiCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  kpiCardLabel: { fontSize: "0.7rem", color: "#6b7280" },
  kpiCardValue: { fontSize: "0.95rem", fontWeight: 700 },
  mainActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  mainActionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  mainActionIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainActionLabel: { fontSize: "0.7rem", color: "#86efac", fontWeight: 500, textAlign: "center" },
  codeCadeauBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "20px",
    background: "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(16,185,129,0.03))",
  },
  codeCadeauHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  codeCadeauTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  codeCadeauHint: { fontSize: "0.72rem", color: "#86efac", marginBottom: "12px" },
  codeCadeauRow: { display: "flex", gap: "8px" },
  codeCadeauInput: {
    flex: 1,
    padding: "10px 14px",
    backgroundColor: "rgba(10,15,13,0.6)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "10px",
    color: "#f0fdf4",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  codeCadeauBtn: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.5)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  gridBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "14px 6px",
    backgroundColor: "rgba(10,15,13,0.5)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    minHeight: "70px",
  },
  gridLabel: { fontSize: "0.62rem", color: "#86efac", fontWeight: 500, textAlign: "center", lineHeight: 1.2 },
  logoutBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "14px",
    color: "#ef4444",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
}

export default Profil