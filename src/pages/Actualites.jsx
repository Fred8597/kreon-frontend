import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Newspaper, Inbox, Eye, Pin } from "lucide-react"
import toast from "react-hot-toast"
import { getAllNews } from "../services/newsService"
import { formatDate } from "../utils/format"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Logo from "../components/ui/Logo"

const Actualites = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("ALL")

  const categories = [
    { id: "ALL", label: "Tout" },
    { id: "NOUVEAUTE", label: "Nouveautés" },
    { id: "TECH", label: "Tech" },
    { id: "MARCHE", label: "Marché" },
    { id: "PROMO", label: "Promos" },
    { id: "ANNONCE", label: "Annonces" },
  ]

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const cat = activeCategory === "ALL" ? null : activeCategory
        const data = await getAllNews(cat)
        setNews(data)
      } catch (error) {
        toast.error("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeCategory])

  const badgeColors = {
    HOT: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", border: "#ef4444" },
    NOUVEAU: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "#3b82f6" },
    URGENT: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "#f59e0b" },
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <Logo size="small" showSlogan={false} />
          <div style={styles.headerIconBox}>
            <Newspaper size={18} color="#10b981" />
          </div>
        </div>
        <h1 style={styles.headerTitle}>📰 Actualités</h1>
        <p style={styles.headerSubtitle}>Restez informé des dernières nouvelles</p>
      </header>

      {/* CATÉGORIES */}
      <div style={styles.categoriesRow}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              ...styles.catBtn,
              ...(activeCategory === cat.id ? styles.catBtnActive : {}),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* LISTE NEWS */}
      <div style={styles.content}>
        {loading ? (
          <LoadingSpinner text="Chargement des actualités..." />
        ) : news.length === 0 ? (
          <div style={styles.empty}>
            <Inbox size={50} color="#6b7280" />
            <p style={styles.emptyTitle}>Aucune actualité</p>
            <p style={styles.emptyText}>Revenez plus tard pour découvrir du nouveau</p>
          </div>
        ) : (
          <div style={styles.list}>
            {news.map((item) => {
              const badge = item.badge ? badgeColors[item.badge] : null
              return (
                <div
                  key={item._id}
                  style={styles.card}
                  onClick={() => navigate(`/actualite/${item._id}`)}
                >
                  {/* Image */}
                  {item.image && (
                    <div style={styles.imageWrapper}>
                      <img
                        src={item.image}
                        alt={item.titre}
                        style={styles.image}
                        onError={(e) => (e.target.parentElement.style.display = "none")}
                      />
                      {item.epingle && (
                        <div style={styles.pinIcon}>
                          <Pin size={14} color="#fff" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenu */}
                  <div style={styles.cardBody}>
                    <div style={styles.cardTopRow}>
                      <span style={styles.cardCategorie}>{item.categorie}</span>
                      {badge && (
                        <span
                          style={{
                            ...styles.cardBadge,
                            backgroundColor: badge.bg,
                            color: badge.color,
                            borderColor: badge.border,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 style={styles.cardTitle}>{item.titre}</h3>

                    {item.extrait && (
                      <p style={styles.cardExtrait}>{item.extrait}</p>
                    )}

                    <div style={styles.cardFooter}>
                      <span style={styles.cardDate}>
                        📅 {formatDate(item.createdAt)}
                      </span>
                      <span style={styles.cardViews}>
                        <Eye size={12} /> {item.vues || 0}
                      </span>
                    </div>
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
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "20px" },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    backgroundColor: "rgba(10,15,13,0.95)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 40,
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  headerIconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "2px",
  },
  headerSubtitle: { fontSize: "0.75rem", color: "#86efac" },
  categoriesRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "14px 20px",
  },
  catBtn: {
    padding: "8px 16px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "20px",
    color: "#6b7280",
    fontSize: "0.78rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  catBtnActive: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "1px solid #10b981",
  },
  content: { padding: "0 20px" },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  imageWrapper: {
    width: "100%",
    height: "180px",
    backgroundColor: "rgba(10,15,13,0.5)",
    position: "relative",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  pinIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "rgba(245,158,11,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: "14px" },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  cardCategorie: {
    fontSize: "0.7rem",
    color: "#10b981",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  cardBadge: {
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "0.65rem",
    fontWeight: 700,
    border: "1px solid",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "6px",
    lineHeight: 1.4,
  },
  cardExtrait: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    marginBottom: "10px",
    lineHeight: 1.5,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.7rem",
    color: "#6b7280",
  },
  cardDate: {},
  cardViews: { display: "flex", alignItems: "center", gap: "4px" },
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

export default Actualites