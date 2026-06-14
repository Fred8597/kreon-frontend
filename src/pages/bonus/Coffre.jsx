import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Gift,
  Users,
  Sparkles,
  TrendingUp,
  Calendar,
  Lock,
  CheckCircle2,
  Share2,
  Info,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  getStatutCoffre,
  getHistoriqueCoffres,
} from "../../services/coffreService"
import { formatXAF, formatDateTime } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Coffre = () => {
  const navigate = useNavigate()

  const [statut, setStatut] = useState(null)
  const [historique, setHistorique] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statutData, histoData] = await Promise.all([
        getStatutCoffre(),
        getHistoriqueCoffres(),
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

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Coffre au Trésor" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Coffre au Trésor" />

      <div style={styles.content}>
        {/* ===== HEADER ÉVÉNEMENT ===== */}
        <div style={styles.eventBox}>
          <div style={styles.eventLeft}>
            <Sparkles size={20} color="#f59e0b" />
            <div>
              <p style={styles.eventTitle}>Événement Quotidien</p>
              <p style={styles.eventSubtitle}>
                Crédité automatiquement 🎁
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/partager")}
            style={styles.inviteBtn}
          >
            <Share2 size={14} />
            Inviter
          </button>
        </div>

        {/* ===== INFO BOX ===== */}
        <div style={styles.infoCard}>
          <Info size={16} color="#10b981" />
          <p style={styles.infoText}>
            Les coffres sont <strong>crédités automatiquement</strong> dès qu'un
            de vos filleuls inscrits aujourd'hui effectue son <strong>premier investissement</strong>.
          </p>
        </div>

        {/* ===== COMPTEUR ===== */}
        <div style={styles.counterBox}>
          <div style={styles.counterCol}>
            <p style={styles.counterLabel}>Filleuls inscrits</p>
            <p style={styles.counterValueGris}>
              {statut?.filleulsTotalAujourdhui || 0}
            </p>
            <p style={styles.counterHint}>aujourd'hui</p>
          </div>

          <div style={styles.counterSep} />

          <div style={styles.counterCol}>
            <p style={styles.counterLabelGreen}>Qualifiés (ont investi)</p>
            <p style={styles.counterValueGreen}>
              {statut?.invitesAujourdhui || 0}
            </p>
            <p style={styles.counterHint}>débloquent les coffres</p>
          </div>
        </div>

        {/* ===== GAGNÉ AUJOURD'HUI ===== */}
        {statut?.gagneAujourdhui > 0 && (
          <div style={styles.gagneBox}>
            <Gift size={20} color="#f59e0b" />
            <div>
              <p style={styles.gagneLabel}>Gagné aujourd'hui</p>
              <p style={styles.gagneValue}>
                {formatXAF(statut.gagneAujourdhui)}
              </p>
            </div>
          </div>
        )}

        {/* ===== TITRE ===== */}
        <h2 style={styles.sectionTitle}>
          <Gift size={18} color="#f59e0b" /> Paliers de récompenses
        </h2>

        {/* ===== GRILLE COFFRES ===== */}
        <div style={styles.grid}>
          {statut?.coffres?.map((c) => (
            <CoffreCard
              key={c.palier}
              palier={c.palier}
              montant={c.montant}
              credite={c.credite}
              debloque={c.debloque}
              invitesActuels={statut.invitesAujourdhui}
            />
          ))}
        </div>

        {/* ===== STATS GLOBALES ===== */}
        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <TrendingUp size={20} color="#10b981" />
            <div>
              <p style={styles.statLabel}>Coffres reçus</p>
              <p style={styles.statValue}>
                {statut?.totalCoffresOuverts || 0}
              </p>
            </div>
          </div>
          <div style={styles.statSep} />
          <div style={styles.statItem}>
            <Gift size={20} color="#f59e0b" />
            <div>
              <p style={styles.statLabel}>Total gagné</p>
              <p style={styles.statValueOrange}>
                {formatXAF(statut?.totalGagne || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ===== HISTORIQUE ===== */}
        {historique.length > 0 && (
          <div style={styles.historyBox}>
            <h3 style={styles.historyTitle}>
              <Calendar size={16} color="#10b981" /> Historique
            </h3>
            <div style={styles.historyList}>
              {historique.slice(0, 10).map((h) => (
                <div key={h._id} style={styles.historyItem}>
                  <div style={styles.historyLeft}>
                    <div style={styles.historyDot} />
                    <div>
                      <p style={styles.historyPalier}>
                        Coffre {h.palier} invité{h.palier > 1 ? "s" : ""}
                      </p>
                      <p style={styles.historyDate}>
                        {formatDateTime(h.dateOuverture)}
                      </p>
                    </div>
                  </div>
                  <span style={styles.historyAmount}>
                    +{formatXAF(h.montant)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RÈGLES ===== */}
        <div style={styles.rulesBox}>
          <h3 style={styles.rulesTitle}>📌 Comment ça marche ?</h3>
          <ul style={styles.rulesList}>
            <li>Invitez vos amis avec votre code parrainage</li>
            <li>
              <strong>Important :</strong> ils doivent investir au moins 1 fois
              pour débloquer vos coffres
            </li>
            <li>Les récompenses sont <strong>créditées automatiquement</strong></li>
            <li>Réinitialisation chaque jour à minuit (00h00)</li>
            <li>Plus d'invités qualifiés = plus de récompenses cumulées !</li>
          </ul>
        </div>

        {/* BOUTON */}
        <div style={{ marginTop: "16px" }}>
          <Button onClick={() => navigate("/partager")}>
            <Share2 size={16} />
            Inviter des amis
          </Button>
        </div>
      </div>
    </div>
  )
}

// ===== SOUS-COMPOSANT : Carte coffre =====
const CoffreCard = ({ palier, montant, credite, debloque, invitesActuels }) => {
  const manque = palier - invitesActuels

  return (
    <div
      style={{
        ...styles.card,
        ...(credite ? styles.cardCredite : {}),
        ...(debloque && !credite ? styles.cardReady : {}),
        ...(!debloque ? styles.cardLocked : {}),
      }}
    >
      <div style={styles.cardPalier}>
        <Users size={11} />
        <span>{palier}</span>
      </div>

      <div
        style={{
          ...styles.cardIcon,
          ...(credite
            ? styles.cardIconCredite
            : debloque
            ? styles.cardIconReady
            : styles.cardIconLocked),
        }}
      >
        {credite ? (
          <CheckCircle2 size={28} color="#10b981" />
        ) : !debloque ? (
          <Lock size={26} color="#6b7280" />
        ) : (
          <Gift size={28} color="#f59e0b" />
        )}
      </div>

      <p
        style={{
          ...styles.cardAmount,
          color: credite ? "#10b981" : debloque ? "#f59e0b" : "#6b7280",
        }}
      >
        {formatXAF(montant)}
      </p>

      {credite ? (
        <p style={styles.cardStatusCredite}>✅ Reçu</p>
      ) : debloque ? (
        <p style={styles.cardStatusReady}>⏳ En cours...</p>
      ) : (
        <p style={styles.cardLockText}>
          Encore {manque} invité{manque > 1 ? "s" : ""}
        </p>
      )}
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
  // ÉVÉNEMENT
  eventBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(16,185,129,0.05))",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "14px",
    marginBottom: "14px",
  },
  eventLeft: { display: "flex", alignItems: "center", gap: "10px" },
  eventTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#f0fdf4" },
  eventSubtitle: { fontSize: "0.72rem", color: "#86efac", marginTop: "2px" },
  inviteBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "8px 12px",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    border: "none",
    borderRadius: "10px",
    color: "#0a0f0d",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  // INFO
  infoCard: {
    display: "flex",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "rgba(16,185,129,0.06)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "12px",
    marginBottom: "14px",
  },
  infoText: { fontSize: "0.78rem", color: "#86efac", lineHeight: 1.5 },
  // COUNTER
  counterBox: {
    display: "flex",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    marginBottom: "14px",
  },
  counterCol: {
    flex: 1,
    textAlign: "center",
  },
  counterSep: {
    width: "1px",
    backgroundColor: "rgba(16,185,129,0.15)",
    margin: "0 12px",
  },
  counterLabel: { fontSize: "0.7rem", color: "#6b7280", marginBottom: "4px" },
  counterLabelGreen: { fontSize: "0.7rem", color: "#86efac", marginBottom: "4px" },
  counterValueGris: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#94a3b8",
    lineHeight: 1,
  },
  counterValueGreen: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#10b981",
    lineHeight: 1,
  },
  counterHint: {
    fontSize: "0.62rem",
    color: "#6b7280",
    marginTop: "4px",
  },
  // GAGNÉ
  gagneBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  gagneLabel: { fontSize: "0.75rem", color: "#86efac" },
  gagneValue: { fontSize: "1.2rem", fontWeight: 800, color: "#f59e0b" },
  // SECTION
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  // GRID
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "16px",
    padding: "14px 12px",
    textAlign: "center",
    position: "relative",
    transition: "all 0.3s",
  },
  cardCredite: {
    borderColor: "rgba(16,185,129,0.5)",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.02))",
    boxShadow: "0 0 15px rgba(16,185,129,0.15)",
  },
  cardReady: {
    borderColor: "rgba(245,158,11,0.4)",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))",
  },
  cardLocked: { opacity: 0.6 },
  cardPalier: {
    position: "absolute",
    top: "8px",
    right: "8px",
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "3px 8px",
    backgroundColor: "rgba(10,15,13,0.8)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "20px",
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#86efac",
  },
  cardIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "8px auto 10px",
  },
  cardIconCredite: {
    backgroundColor: "rgba(16,185,129,0.15)",
    border: "2px solid rgba(16,185,129,0.5)",
    boxShadow: "0 0 15px rgba(16,185,129,0.3)",
  },
  cardIconReady: {
    backgroundColor: "rgba(245,158,11,0.15)",
    border: "2px solid rgba(245,158,11,0.4)",
  },
  cardIconLocked: {
    backgroundColor: "rgba(107,114,128,0.1)",
    border: "2px solid rgba(107,114,128,0.2)",
  },
  cardAmount: {
    fontSize: "1.05rem",
    fontWeight: 800,
    marginBottom: "8px",
  },
  cardStatusCredite: {
    fontSize: "0.72rem",
    color: "#10b981",
    fontWeight: 700,
  },
  cardStatusReady: {
    fontSize: "0.7rem",
    color: "#f59e0b",
    fontStyle: "italic",
  },
  cardLockText: {
    fontSize: "0.7rem",
    color: "#6b7280",
    fontStyle: "italic",
  },
  // STATS
  statsBox: {
    display: "flex",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  statItem: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  statSep: {
    width: "1px",
    backgroundColor: "rgba(16,185,129,0.15)",
    margin: "0 14px",
  },
  statLabel: { fontSize: "0.7rem", color: "#86efac" },
  statValue: { fontSize: "1.05rem", fontWeight: 800, color: "#f0fdf4" },
  statValueOrange: { fontSize: "1.05rem", fontWeight: 800, color: "#f59e0b" },
  // HISTORY
  historyBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "16px",
  },
  historyTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "10px",
  },
  historyList: { display: "flex", flexDirection: "column", gap: "8px" },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "8px",
  },
  historyLeft: { display: "flex", gap: "8px", alignItems: "center" },
  historyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
  },
  historyPalier: { fontSize: "0.78rem", color: "#f0fdf4", fontWeight: 600 },
  historyDate: { fontSize: "0.68rem", color: "#6b7280", marginTop: "2px" },
  historyAmount: { fontSize: "0.85rem", color: "#f59e0b", fontWeight: 800 },
  // RULES
  rulesBox: {
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  rulesTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "8px",
  },
  rulesList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.8,
  },
}

export default Coffre