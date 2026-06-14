import { useState, useEffect } from "react"
import { Users, UserCheck, TrendingUp, Inbox, Award } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { getMonEquipe } from "../services/teamService"
import { formatXAF, formatDate, maskPhone } from "../utils/format"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Logo from "../components/ui/Logo"

const Equipe = () => {
  const { user } = useAuth()
  const [equipe, setEquipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMonEquipe()
        setEquipe(data)
      } catch (error) {
        toast.error("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const levels = [
    { id: 1, label: "Niveau 1", percent: "12%", color: "#10b981" },
    { id: 2, label: "Niveau 2", percent: "8%", color: "#34d399" },
    { id: 3, label: "Niveau 3", percent: "3%", color: "#f59e0b" },
    { id: 4, label: "Niveau 4", percent: "1%", color: "#ec4899" },
  ]

  const getFilleulsForLevel = (lvl) => {
    if (!equipe) return []
    if (lvl === 1) return equipe.niveau1
    if (lvl === 2) return equipe.niveau2
    if (lvl === 3) return equipe.niveau3
    if (lvl === 4) return equipe.niveau4
    return []
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <Logo size="small" showSlogan={false} />
          <div style={styles.headerIconBox}>
            <Users size={18} color="#10b981" />
          </div>
        </div>
        <h1 style={styles.headerTitle}>👥 Mon Équipe</h1>
        <p style={styles.headerSubtitle}>
          Gains parrainage : {formatXAF(user?.totalGainsParrainage || 0)}
        </p>
      </header>

      {loading ? (
        <LoadingSpinner text="Chargement de votre équipe..." />
      ) : (
        <div style={styles.content}>
          {/* STATS GLOBALES */}
          <div style={styles.statsCard}>
            <div style={styles.statsTotal}>
              <Award size={26} color="#f59e0b" />
              <div>
                <p style={styles.statsTotalLabel}>Équipe totale</p>
                <p style={styles.statsTotalValue}>{equipe?.total || 0} membres</p>
              </div>
            </div>

            <div style={styles.statsGrid}>
              {levels.map((lvl) => (
                <div key={lvl.id} style={styles.statBox}>
                  <span
                    style={{ ...styles.statBoxLabel, color: lvl.color }}
                  >
                    {lvl.label}
                  </span>
                  <span style={styles.statBoxValue}>
                    {equipe?.stats[`n${lvl.id}`] || 0}
                  </span>
                  <span style={styles.statBoxPercent}>{lvl.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SÉLECTEUR NIVEAUX */}
          <div style={styles.levelsRow}>
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.id)}
                style={{
                  ...styles.levelBtn,
                  ...(activeLevel === lvl.id
                    ? { ...styles.levelBtnActive, borderColor: lvl.color }
                    : {}),
                }}
              >
                <span style={{ color: activeLevel === lvl.id ? lvl.color : "#86efac" }}>
                  N{lvl.id}
                </span>
              </button>
            ))}
          </div>

          {/* LISTE FILLEULS */}
          <div style={styles.filleulsList}>
            {getFilleulsForLevel(activeLevel).length === 0 ? (
              <div style={styles.empty}>
                <Inbox size={50} color="#6b7280" />
                <p style={styles.emptyTitle}>Aucun filleul</p>
                <p style={styles.emptyText}>
                  {activeLevel === 1
                    ? "Invitez des amis pour commencer"
                    : `Vous n'avez pas encore de filleul niveau ${activeLevel}`}
                </p>
              </div>
            ) : (
              getFilleulsForLevel(activeLevel).map((f) => (
                <div key={f._id} style={styles.filleulCard}>
                  <div style={styles.filleulAvatar}>
                    {f.nom?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div style={styles.filleulInfo}>
                    <p style={styles.filleulName}>{f.nom}</p>
                    <p style={styles.filleulPhone}>{maskPhone(f.telephone)}</p>
                    <p style={styles.filleulDate}>
                      Inscrit le {formatDate(f.createdAt)}
                    </p>
                    {f.parrainId?.nom && activeLevel > 1 && (
                      <p style={styles.filleulParent}>
                        Parrain : {f.parrainId.nom}
                      </p>
                    )}
                  </div>
                  <div style={styles.filleulStats}>
                    <div style={styles.miniStat}>
                      <UserCheck size={12} color="#10b981" />
                      <span>{f.totalInvites || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "20px" },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
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
  headerSubtitle: { fontSize: "0.78rem", color: "#86efac" },
  content: { padding: "20px" },
  // STATS
  statsCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "20px",
  },
  statsTotal: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "12px",
    marginBottom: "14px",
  },
  statsTotalLabel: { fontSize: "0.75rem", color: "#86efac" },
  statsTotalValue: { fontSize: "1.2rem", fontWeight: 800, color: "#f59e0b" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  statBox: {
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
    padding: "10px 6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  statBoxLabel: { fontSize: "0.6rem", fontWeight: 600 },
  statBoxValue: { fontSize: "1.1rem", fontWeight: 800, color: "#f0fdf4" },
  statBoxPercent: { fontSize: "0.6rem", color: "#6b7280" },
  // LEVELS
  levelsRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  levelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 700,
    transition: "all 0.3s",
  },
  levelBtnActive: {
    borderWidth: "2px",
    backgroundColor: "rgba(16,185,129,0.05)",
  },
  // FILLEULS
  filleulsList: { display: "flex", flexDirection: "column", gap: "10px" },
  filleulCard: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    alignItems: "center",
  },
  filleulAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "#0a0f0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: 800,
    flexShrink: 0,
  },
  filleulInfo: { flex: 1, minWidth: 0 },
  filleulName: { fontSize: "0.9rem", fontWeight: 700, color: "#f0fdf4" },
  filleulPhone: { fontSize: "0.72rem", color: "#86efac", marginTop: "2px" },
  filleulDate: { fontSize: "0.68rem", color: "#6b7280", marginTop: "2px" },
  filleulParent: { fontSize: "0.65rem", color: "#94a3b8", marginTop: "2px" },
  filleulStats: { display: "flex", flexDirection: "column", gap: "4px" },
  miniStat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.72rem",
    color: "#10b981",
    fontWeight: 700,
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

export default Equipe