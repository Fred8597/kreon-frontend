import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Eye, Calendar, User as UserIcon } from "lucide-react"
import toast from "react-hot-toast"
import { getNewsById } from "../services/newsService"
import { formatDate } from "../utils/format"
import PageHeader from "../components/ui/PageHeader"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const DetailActualite = () => {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNewsById(id)
        setNews(data)
      } catch (error) {
        toast.error("Actualité introuvable")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Actualité" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  if (!news) {
    return (
      <div style={styles.page}>
        <PageHeader title="Actualité" />
        <p style={{ padding: 20, color: "#86efac", textAlign: "center" }}>
          Actualité introuvable
        </p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Actualité" />

      {/* IMAGE */}
      {news.image && (
        <div style={styles.imageWrapper}>
          <img
            src={news.image}
            alt={news.titre}
            style={styles.image}
            onError={(e) => (e.target.parentElement.style.display = "none")}
          />
        </div>
      )}

      <div style={styles.content}>
        {/* CATÉGORIE + BADGE */}
        <div style={styles.topRow}>
          <span style={styles.categorie}>{news.categorie}</span>
          {news.badge && <span style={styles.badge}>{news.badge}</span>}
        </div>

        {/* TITRE */}
        <h1 style={styles.title}>{news.titre}</h1>

        {/* META */}
        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <UserIcon size={14} color="#10b981" />
            <span>{news.auteur?.nom || "KREON"}</span>
          </div>
          <div style={styles.metaItem}>
            <Calendar size={14} color="#f59e0b" />
            <span>{formatDate(news.createdAt)}</span>
          </div>
          <div style={styles.metaItem}>
            <Eye size={14} color="#86efac" />
            <span>{news.vues} vues</span>
          </div>
        </div>

        {/* EXTRAIT */}
        {news.extrait && (
          <div style={styles.extrait}>
            <p>{news.extrait}</p>
          </div>
        )}

        {/* CONTENU */}
        <div style={styles.body}>
          {news.contenu.split("\n").map((para, idx) =>
            para.trim() ? (
              <p key={idx} style={styles.paragraph}>
                {para}
              </p>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  imageWrapper: {
    width: "100%",
    height: "240px",
    backgroundColor: "rgba(10,15,13,0.5)",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  content: { padding: "20px" },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  categorie: {
    padding: "4px 12px",
    backgroundColor: "rgba(16,185,129,0.1)",
    color: "#10b981",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  badge: {
    padding: "4px 12px",
    backgroundColor: "rgba(245,158,11,0.15)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.4)",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 700,
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#f0fdf4",
    lineHeight: 1.3,
    marginBottom: "14px",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(16,185,129,0.15)",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.78rem",
    color: "#86efac",
  },
  extrait: {
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "0.88rem",
    color: "#f0fdf4",
    fontStyle: "italic",
    lineHeight: 1.6,
  },
  body: { display: "flex", flexDirection: "column", gap: "12px" },
  paragraph: {
    fontSize: "0.92rem",
    color: "#cbd5e1",
    lineHeight: 1.7,
  },
}

export default DetailActualite