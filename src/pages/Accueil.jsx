import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  Wallet,
  ArrowDownToLine,
  CalendarCheck,
  Building2,
  UserPlus,
  Activity,
  BookOpen,
  Crown,
  Package,
  User,
  Volume2,
  Sparkles,
  Zap,
  Timer,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { formatXAF } from "../utils/format"
import { getProduits } from "../services/productService"
import { getCompteurNonLues } from "../services/notificationService"
import Logo from "../components/ui/Logo"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import ProductCard from "../components/ui/ProductCard"
import toast from "react-hot-toast"

const Accueil = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("IA")
  const [notifCount, setNotifCount] = useState(0)

  // ===== ACTIONS RAPIDES =====
  const quickActions = [
    { icon: Wallet, label: "Recharger", color: "#10b981", path: "/recharger", existing: true },
    { icon: ArrowDownToLine, label: "Retirer", color: "#34d399", path: "/retirer", existing: true },
    { icon: CalendarCheck, label: "Pointage", color: "#f59e0b", path: "/pointage", existing: true },
    { icon: Building2, label: "Entreprise", color: "#8b5cf6", path: "/entreprise", existing: true },
    { icon: UserPlus, label: "Inviter", color: "#ec4899", path: "/partager", existing: true },
    { icon: Activity, label: "Activité", color: "#06b6d4", path: "/activite", existing: true },
    { icon: BookOpen, label: "Règles", color: "#f97316", path: "/regles", existing: true },
    { icon: Crown, label: "VIP", color: "#eab308", path: "/vip", existing: true },
  ]

  // ===== CATÉGORIES (selon nouveau modèle) =====
  const categories = [
    { id: "IA", label: "IA", icon: Zap, color: "#10b981" },
    { id: "NVIP", label: "NVIP", icon: Crown, color: "#eab308" },
    { id: "SUPER_IA", label: "Super IA", icon: Sparkles, color: "#8b5cf6" },
    { id: "DUREE_LIMITEE", label: "Durée limitée", icon: Timer, color: "#ec4899" },
  ]

  // ===== CHARGER LES PRODUITS =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProduits(activeCategory)
        setProducts(data)
      } catch (error) {
        toast.error("Erreur de chargement des produits")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory])

  // ===== COMPTEUR NOTIFICATIONS =====
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count } = await getCompteurNonLues()
        setNotifCount(count)
      } catch (error) {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (path, existing = false) => {
    if (existing) navigate(path)
    else toast(`Page "${path}" en construction 🚧`, { icon: "⏳" })
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <Logo size="small" showSlogan={false} />
        <button style={styles.bellBtn} onClick={() => navigate("/alertes")}>
          <Bell
            size={22}
            color={notifCount > 0 ? "#10b981" : "#86efac"}
            strokeWidth={notifCount > 0 ? 2.5 : 2}
          />
          {notifCount > 0 && (
            <span style={styles.bellBadge}>
              {notifCount > 99 ? "99+" : notifCount}
            </span>
          )}
        </button>
      </header>

      {/* CARTE SOLDE */}
      <div style={styles.walletCard}>
        <div style={styles.walletLeft}>
          <div style={styles.avatar}>
            <User size={22} color="#0a0f0d" />
          </div>
          <div>
            <p style={styles.greeting}>Bonjour 👋</p>
            <p style={styles.userName}>{user?.nom || "Utilisateur"}</p>
          </div>
        </div>
        <div style={styles.walletRight}>
          <p style={styles.soldeLabel}>Mon solde</p>
          <p style={styles.soldeAmount}>{formatXAF(user?.soldePrincipal || 0)}</p>
        </div>
      </div>

      {/* ACTIONS RAPIDES */}
      <div style={styles.quickGrid}>
        {quickActions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button
              key={idx}
              style={styles.quickItem}
              onClick={() => handleQuickAction(action.path, action.existing)}
            >
              <div
                style={{
                  ...styles.quickIcon,
                  backgroundColor: `${action.color}15`,
                  border: `1px solid ${action.color}30`,
                }}
              >
                <Icon size={22} color={action.color} />
              </div>
              <span style={styles.quickLabel}>{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* BANNIÈRE */}
      <div style={styles.banner}>
        <Volume2 size={18} color="#10b981" />
        <p style={styles.bannerText}>
          Parrainez vos amis et gagnez des commissions sur 4 niveaux ! 💰
        </p>
      </div>

      {/* CATÉGORIES en 2x2 */}
      <div style={styles.categoryGrid}>
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                ...styles.categoryBtn,
                ...(isActive
                  ? {
                      background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                      borderColor: cat.color,
                      boxShadow: `0 4px 15px ${cat.color}40`,
                    }
                  : {}),
              }}
            >
              <Icon size={18} color={isActive ? "#fff" : cat.color} />
              <span
                style={{
                  ...styles.categoryLabel,
                  color: isActive ? "#fff" : "#86efac",
                }}
              >
                {cat.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* TITRE */}
      <div style={styles.sectionTitle}>
        <Package size={18} color="#10b981" />
        <span>
          {categories.find((c) => c.id === activeCategory)?.label}
        </span>
        {!loading && (
          <span style={styles.productCount}>{products.length}</span>
        )}
      </div>

      {/* LISTE PRODUITS */}
      <div style={styles.productsList}>
        {loading ? (
          <LoadingSpinner text="Chargement..." />
        ) : products.length === 0 ? (
          <div style={styles.emptyBox}>
            <Package size={40} color="#6b7280" />
            <p style={styles.emptyTitle}>
              {activeCategory === "SUPER_IA" ? "Prochainement" : "Aucun produit"}
            </p>
            <p style={styles.emptyText}>
              {activeCategory === "SUPER_IA"
                ? "Cette catégorie sera bientôt enrichie"
                : "Aucun produit disponible dans cette catégorie"}
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", padding: "0" },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "rgba(10,15,13,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bellBtn: {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
  },
  bellBadge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "10px",
    backgroundColor: "#ef4444",
    color: "white",
    fontSize: "0.65rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px",
    boxShadow: "0 0 8px rgba(239,68,68,0.5)",
    border: "2px solid #0a0f0d",
  },
  walletCard: {
    margin: "16px 20px 0",
    padding: "18px 20px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.05))",
    border: "1px solid rgba(16,185,129,0.25)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletLeft: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 12px rgba(16,185,129,0.4)",
  },
  greeting: { fontSize: "0.72rem", color: "#86efac" },
  userName: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  walletRight: { textAlign: "right" },
  soldeLabel: { fontSize: "0.68rem", color: "#86efac" },
  soldeAmount: { fontSize: "1.15rem", fontWeight: 800, color: "#f59e0b" },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    padding: "20px",
  },
  quickItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  quickIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: "0.68rem", color: "#86efac", fontWeight: 500 },
  banner: {
    margin: "0 20px 20px",
    padding: "12px 16px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  bannerText: { fontSize: "0.78rem", color: "#86efac", flex: 1 },
  // CATÉGORIES en grille 2x2
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    padding: "0 20px 16px",
  },
  categoryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    borderRadius: "14px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  categoryLabel: { fontSize: "0.9rem", fontWeight: 700 },
  sectionTitle: {
    padding: "0 20px 14px",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  productCount: {
    marginLeft: "auto",
    fontSize: "0.75rem",
    color: "#86efac",
    fontWeight: 600,
    backgroundColor: "rgba(16,185,129,0.1)",
    padding: "2px 10px",
    borderRadius: "20px",
  },
  productsList: {
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    paddingBottom: "100px",
  },
  emptyBox: {
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "rgba(17,26,20,0.6)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  emptyTitle: { fontSize: "1rem", fontWeight: 700, color: "#86efac" },
  emptyText: { fontSize: "0.82rem", color: "#6b7280" },
}

export default Accueil