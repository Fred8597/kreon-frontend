import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Crown,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Wallet,
  UserCheck,
  Coins,
  ArrowUp,
  AlertTriangle,
  Sparkles,
  Lock,
  Calendar,
  Timer,
  Target,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import {
  getStatutVIP,
  upgradeVIP,
} from "../../services/vipService"
import { formatXAF, formatNumber, formatDate } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const VIP = () => {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const [statut, setStatut] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  const fetchData = async () => {
    try {
      const data = await getStatutVIP()
      setStatut(data)
    } catch (error) {
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpgrade = async () => {
    if (!window.confirm("Confirmer la mise à niveau VIP ?")) return

    setUpgrading(true)
    try {
      const result = await upgradeVIP()
      toast.success(result.message, { duration: 4000 })
      await refreshUser()
      await fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Niveaux VIP" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  const { niveauActuel, prochainNiveau, statutVIP, stats, quotaHebdo, tousNiveaux } =
    statut
  const isVIP = niveauActuel.niveau > 0
  const isSuspendu = statutVIP === "SUSPENDU"
  const isMaxLevel = !prochainNiveau

  const getColorByLevel = (niveau) => {
    if (niveau === 0) return "#6b7280"
    if (niveau <= 3) return "#10b981"
    if (niveau <= 6) return "#f59e0b"
    if (niveau <= 8) return "#ec4899"
    return "#eab308"
  }

  const currentColor = getColorByLevel(niveauActuel.niveau)

  return (
    <div style={styles.page}>
      <PageHeader title="Niveaux VIP" />

      <div style={styles.content}>
        {/* HEADER NIVEAU */}
        <div
          style={{
            ...styles.headerCard,
            background: `linear-gradient(135deg, ${currentColor}25, ${currentColor}05)`,
            borderColor: `${currentColor}50`,
          }}
        >
          <div style={styles.headerTop}>
            <Crown size={32} color={currentColor} />
            <span
              style={{
                ...styles.statusBadge,
                ...(isSuspendu
                  ? styles.statusSuspendu
                  : isVIP
                  ? styles.statusActif
                  : styles.statusNormal),
              }}
            >
              {isSuspendu
                ? "⚠️ Suspendu"
                : isVIP
                ? "✅ Actif"
                : "👤 Standard"}
            </span>
          </div>
          <p style={styles.headerLabel}>Votre niveau actuel</p>
          <h2 style={{ ...styles.headerTitle, color: currentColor }}>
            {niveauActuel.nom}
          </h2>
          {isVIP && (
            <div style={styles.salaireBox}>
              <Coins size={16} color={isSuspendu ? "#6b7280" : "#f59e0b"} />
              <span
                style={{
                  ...styles.salaireText,
                  color: isSuspendu ? "#6b7280" : "#f59e0b",
                  textDecoration: isSuspendu ? "line-through" : "none",
                }}
              >
                {formatXAF(niveauActuel.salaireJour)} / jour
              </span>
              {isSuspendu && <span style={styles.suspenduLabel}>SUSPENDU</span>}
            </div>
          )}
        </div>

        {/* ===== JAUGE QUOTA HEBDO (NOUVEAU) ===== */}
        {isVIP && quotaHebdo && (
          <div style={styles.quotaCard}>
            <div style={styles.quotaHeader}>
              <Target size={20} color="#10b981" />
              <div style={{ flex: 1 }}>
                <p style={styles.quotaTitle}>Quota hebdomadaire</p>
                <p style={styles.quotaSubtitle}>
                  Cette semaine ({quotaHebdo.semaineEnCours.joursRestants} j restant{quotaHebdo.semaineEnCours.joursRestants > 1 ? "s" : ""})
                </p>
              </div>
              <div style={styles.quotaCount}>
                <span
                  style={{
                    ...styles.quotaCurrent,
                    color: quotaHebdo.semaineEnCours.atteint ? "#10b981" : "#f59e0b",
                  }}
                >
                  {quotaHebdo.semaineEnCours.actuel}
                </span>
                <span style={styles.quotaSlash}>/</span>
                <span style={styles.quotaRequis}>
                  {quotaHebdo.semaineEnCours.requis}
                </span>
              </div>
            </div>

            {/* Barre de progression */}
            <div style={styles.progressBarLarge}>
              <div
                style={{
                  ...styles.progressFillLarge,
                  width: `${Math.min(
                    100,
                    (quotaHebdo.semaineEnCours.actuel /
                      quotaHebdo.semaineEnCours.requis) *
                      100
                  )}%`,
                  background: quotaHebdo.semaineEnCours.atteint
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                }}
              />
            </div>

            {/* Message */}
            <div style={styles.quotaMessage}>
              {quotaHebdo.semaineEnCours.atteint ? (
                <>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span style={{ color: "#10b981" }}>
                    Quota atteint ! Salaire sécurisé pour la semaine prochaine.
                  </span>
                </>
              ) : (
                <>
                  <Timer size={14} color="#f59e0b" />
                  <span style={{ color: "#f59e0b" }}>
                    Encore{" "}
                    <strong>
                      {quotaHebdo.semaineEnCours.requis -
                        quotaHebdo.semaineEnCours.actuel}
                    </strong>{" "}
                    sub direct(s) à ramener cette semaine
                  </span>
                </>
              )}
            </div>

            {/* Semaine dernière (statut) */}
            {quotaHebdo.semaineDerniere && quotaHebdo.semaineDerniere.verifiee && (
              <div
                style={{
                  ...styles.weekStatus,
                  ...(quotaHebdo.semaineDerniere.atteint
                    ? styles.weekOk
                    : styles.weekFail),
                }}
              >
                <Calendar size={12} />
                <span>
                  Semaine dernière : {quotaHebdo.semaineDerniere.actuel}/
                  {quotaHebdo.semaineDerniere.requis}{" "}
                  {quotaHebdo.semaineDerniere.atteint ? "✓" : "✗"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ALERTE SUSPENSION */}
        {isSuspendu && (
          <div style={styles.alertBox}>
            <AlertTriangle size={18} color="#ef4444" />
            <div>
              <p style={styles.alertTitle}>Salaire suspendu</p>
              <p style={styles.alertText}>
                Vous n'avez pas atteint votre quota la semaine dernière. Atteignez
                le quota de cette semaine pour réactiver votre salaire.
              </p>
            </div>
          </div>
        )}

        {/* STATS GLOBALES */}
        <div style={styles.statsGrid}>
          <StatCard
            icon={<Wallet size={18} color="#10b981" />}
            label="Recharge perso"
            value={formatXAF(stats.rechargePerso)}
          />
          <StatCard
            icon={<UserCheck size={18} color="#f59e0b" />}
            label="Sub directs"
            value={formatNumber(stats.subDirects)}
          />
          <StatCard
            icon={<Users size={18} color="#3b82f6" />}
            label="Membres équipe"
            value={formatNumber(stats.membresEquipe)}
          />
          <StatCard
            icon={<TrendingUp size={18} color="#ec4899" />}
            label="Recharge équipe"
            value={formatXAF(stats.rechargeEquipe)}
          />
        </div>

        {/* PROCHAINE PROMO */}
        {!isMaxLevel && (
          <div style={styles.upgradeCard}>
            <div style={styles.upgradeHeader}>
              <ArrowUp size={20} color="#10b981" />
              <div>
                <p style={styles.upgradeLabel}>Prochain niveau</p>
                <p style={styles.upgradeTitle}>{prochainNiveau.niveau.nom}</p>
              </div>
              <div style={styles.upgradeReward}>
                <span style={styles.upgradeRewardLabel}>Salaire</span>
                <span style={styles.upgradeRewardValue}>
                  {formatXAF(prochainNiveau.niveau.salaireJour)}
                </span>
              </div>
            </div>

            <div style={styles.conditionsList}>
              <ConditionRow
                label="Recharge personnelle"
                actuel={prochainNiveau.conditions.recharge.actuel}
                requis={prochainNiveau.conditions.recharge.requis}
                ok={prochainNiveau.conditions.recharge.ok}
                format="xaf"
              />
              {prochainNiveau.conditions.subDirects.requis > 0 && (
                <ConditionRow
                  label="Subordonnés directs"
                  actuel={prochainNiveau.conditions.subDirects.actuel}
                  requis={prochainNiveau.conditions.subDirects.requis}
                  ok={prochainNiveau.conditions.subDirects.ok}
                />
              )}
              {prochainNiveau.conditions.membresEquipe.requis > 0 && (
                <ConditionRow
                  label="Membres d'équipe"
                  actuel={prochainNiveau.conditions.membresEquipe.actuel}
                  requis={prochainNiveau.conditions.membresEquipe.requis}
                  ok={prochainNiveau.conditions.membresEquipe.ok}
                />
              )}
              <ConditionRow
                label="Recharge équipe"
                actuel={prochainNiveau.conditions.rechargeEquipe.actuel}
                requis={prochainNiveau.conditions.rechargeEquipe.requis}
                ok={prochainNiveau.conditions.rechargeEquipe.ok}
                format="xaf"
              />
            </div>

            <div style={styles.quotaInfo}>
              <Sparkles size={14} color="#86efac" />
              <span>
                Quota hebdo : {prochainNiveau.niveau.quotaHebdo} nouveaux sub
                directs/semaine
              </span>
            </div>

            <div style={{ marginTop: "14px" }}>
              <Button
                onClick={handleUpgrade}
                loading={upgrading}
                disabled={!prochainNiveau.eligible}
              >
                {prochainNiveau.eligible
                  ? `🚀 Devenir ${prochainNiveau.niveau.nom}`
                  : "Conditions non remplies"}
              </Button>
            </div>
          </div>
        )}

        {isMaxLevel && (
          <div style={styles.maxLevelBox}>
            <Crown size={32} color="#eab308" />
            <p style={styles.maxLevelText}>🏆 Vous êtes au niveau maximum !</p>
          </div>
        )}

        {/* TOUS LES NIVEAUX */}
        <h3 style={styles.sectionTitle}>📋 Tous les niveaux VIP</h3>

        <div style={styles.levelsList}>
          {tousNiveaux
            .filter((l) => l.niveau > 0)
            .map((lvl) => {
              const isCurrent = lvl.niveau === niveauActuel.niveau
              const isUnlocked = lvl.niveau <= niveauActuel.niveau
              const color = getColorByLevel(lvl.niveau)

              return (
                <div
                  key={lvl.niveau}
                  style={{
                    ...styles.levelCard,
                    ...(isCurrent
                      ? { borderColor: color, borderWidth: "2px" }
                      : {}),
                    ...(isUnlocked ? {} : styles.levelLocked),
                  }}
                >
                  <div style={styles.levelHeader}>
                    <div style={styles.levelLeft}>
                      <Crown size={20} color={color} />
                      <div>
                        <p style={styles.levelName}>{lvl.nom}</p>
                        <p style={styles.levelSalaire}>
                          {formatXAF(lvl.salaireJour)} / jour
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span
                        style={{
                          ...styles.currentBadge,
                          backgroundColor: `${color}20`,
                          color,
                          border: `1px solid ${color}50`,
                        }}
                      >
                        Vous
                      </span>
                    )}
                    {!isUnlocked && !isCurrent && <Lock size={16} color="#6b7280" />}
                  </div>

                  <div style={styles.levelDetails}>
                    <DetailRow
                      label="Recharge"
                      value={formatXAF(lvl.rechargeMin)}
                    />
                    {lvl.subDirectsMin > 0 && (
                      <DetailRow
                        label="Sub directs"
                        value={formatNumber(lvl.subDirectsMin)}
                      />
                    )}
                    {lvl.membresEquipeMin > 0 && (
                      <DetailRow
                        label="Équipe N1"
                        value={formatNumber(lvl.membresEquipeMin)}
                      />
                    )}
                    <DetailRow
                      label="Recharge équipe"
                      value={formatXAF(lvl.rechargeEquipeMin)}
                    />
                    <DetailRow
                      label="Quota hebdo"
                      value={`${lvl.quotaHebdo} sub./sem`}
                    />
                  </div>
                </div>
              )
            })}
        </div>

        {/* RÈGLES */}
        <div style={styles.rulesBox}>
          <h3 style={styles.rulesTitle}>📌 Règles VIP</h3>
          <ul style={styles.rulesList}>
            <li>Conditions cumulables d'un niveau à l'autre</li>
            <li>
              <strong>Sub direct</strong> = filleul N1 ayant investi
            </li>
            <li>
              <strong>Membre équipe</strong> = filleul N1 (peu importe)
            </li>
            <li>Salaire VIP versé via le pointage journalier</li>
            <li>
              <strong>Quota hebdo</strong> : nouveaux sub directs ramenés par vous
              OU votre équipe (N1→N4)
            </li>
            <li>
              Semaine : <strong>Lundi → Dimanche</strong>
            </li>
            <li>
              Si quota S-1 non atteint → salaire <strong>suspendu</strong>{" "}
              (jusqu'à rattrapage)
            </li>
            <li>Rang VIP conservé même en suspension</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ===== Sous-composants =====
const StatCard = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    {icon}
    <div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  </div>
)

const ConditionRow = ({ label, actuel, requis, ok, format }) => {
  const formatVal = (v) => (format === "xaf" ? formatXAF(v) : formatNumber(v))
  const progressPercent = Math.min(100, (actuel / requis) * 100)

  return (
    <div style={styles.conditionRow}>
      <div style={styles.conditionTop}>
        <div style={styles.conditionLabelBox}>
          {ok ? (
            <CheckCircle2 size={14} color="#10b981" />
          ) : (
            <XCircle size={14} color="#ef4444" />
          )}
          <span style={styles.conditionLabel}>{label}</span>
        </div>
        <span
          style={{
            ...styles.conditionValues,
            color: ok ? "#10b981" : "#94a3b8",
          }}
        >
          {formatVal(actuel)} / {formatVal(requis)}
        </span>
      </div>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progressPercent}%`,
            backgroundColor: ok ? "#10b981" : "#f59e0b",
          }}
        />
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }) => (
  <div style={styles.detailRow}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value}</span>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  headerCard: {
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid",
    marginBottom: "16px",
    textAlign: "center",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 700,
    border: "1px solid",
  },
  statusActif: {
    backgroundColor: "rgba(16,185,129,0.15)",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.4)",
  },
  statusSuspendu: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#ef4444",
    borderColor: "rgba(239,68,68,0.4)",
  },
  statusNormal: {
    backgroundColor: "rgba(107,114,128,0.15)",
    color: "#94a3b8",
    borderColor: "rgba(107,114,128,0.4)",
  },
  headerLabel: { fontSize: "0.78rem", color: "#86efac", marginBottom: "4px" },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: 900,
    marginBottom: "10px",
    letterSpacing: "0.05em",
  },
  salaireBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    backgroundColor: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "20px",
  },
  salaireText: { fontSize: "0.95rem", fontWeight: 700 },
  suspenduLabel: {
    fontSize: "0.65rem",
    color: "#ef4444",
    fontWeight: 700,
    marginLeft: "4px",
  },
  // ===== QUOTA CARD (NOUVEAU) =====
  quotaCard: {
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  quotaHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  quotaTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  quotaSubtitle: { fontSize: "0.72rem", color: "#86efac", marginTop: "2px" },
  quotaCount: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  quotaCurrent: { fontSize: "1.6rem", fontWeight: 900 },
  quotaSlash: { fontSize: "1rem", color: "#6b7280" },
  quotaRequis: { fontSize: "1rem", color: "#94a3b8", fontWeight: 700 },
  progressBarLarge: {
    width: "100%",
    height: "10px",
    backgroundColor: "rgba(10,15,13,0.6)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressFillLarge: {
    height: "100%",
    transition: "width 0.5s ease",
    borderRadius: "10px",
  },
  quotaMessage: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.78rem",
    padding: "8px 10px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "8px",
  },
  weekStatus: {
    marginTop: "10px",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "0.72rem",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  weekOk: {
    backgroundColor: "rgba(16,185,129,0.08)",
    color: "#10b981",
    border: "1px solid rgba(16,185,129,0.2)",
  },
  weekFail: {
    backgroundColor: "rgba(239,68,68,0.08)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.2)",
  },
  // ALERTE
  alertBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  alertTitle: { fontSize: "0.85rem", color: "#ef4444", fontWeight: 700 },
  alertText: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    lineHeight: 1.5,
    marginTop: "4px",
  },
  // STATS
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "16px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  statLabel: { fontSize: "0.68rem", color: "#86efac" },
  statValue: {
    fontSize: "0.85rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginTop: "2px",
  },
  // UPGRADE
  upgradeCard: {
    padding: "16px",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(245,158,11,0.04))",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  upgradeHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
  },
  upgradeLabel: { fontSize: "0.7rem", color: "#86efac" },
  upgradeTitle: { fontSize: "1.1rem", fontWeight: 800, color: "#f0fdf4" },
  upgradeReward: {
    marginLeft: "auto",
    textAlign: "right",
    padding: "6px 10px",
    backgroundColor: "rgba(245,158,11,0.1)",
    borderRadius: "8px",
  },
  upgradeRewardLabel: {
    fontSize: "0.65rem",
    color: "#86efac",
    display: "block",
  },
  upgradeRewardValue: {
    fontSize: "0.85rem",
    color: "#f59e0b",
    fontWeight: 800,
  },
  conditionsList: { display: "flex", flexDirection: "column", gap: "12px" },
  conditionRow: { display: "flex", flexDirection: "column", gap: "4px" },
  conditionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conditionLabelBox: { display: "flex", alignItems: "center", gap: "6px" },
  conditionLabel: { fontSize: "0.78rem", color: "#f0fdf4" },
  conditionValues: { fontSize: "0.78rem", fontWeight: 600 },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(10,15,13,0.6)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progressFill: { height: "100%", transition: "width 0.5s ease" },
  quotaInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "12px",
    padding: "8px 10px",
    backgroundColor: "rgba(16,185,129,0.05)",
    borderRadius: "8px",
    fontSize: "0.72rem",
    color: "#86efac",
  },
  maxLevelBox: {
    padding: "30px 20px",
    textAlign: "center",
    background:
      "linear-gradient(135deg, rgba(234,179,8,0.1), rgba(245,158,11,0.05))",
    border: "1px solid rgba(234,179,8,0.3)",
    borderRadius: "16px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  maxLevelText: { fontSize: "1rem", fontWeight: 700, color: "#eab308" },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "12px",
  },
  levelsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  levelCard: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    padding: "12px",
  },
  levelLocked: { opacity: 0.6 },
  levelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
  },
  levelLeft: { display: "flex", gap: "10px", alignItems: "center" },
  levelName: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  levelSalaire: { fontSize: "0.72rem", color: "#f59e0b", marginTop: "2px" },
  currentBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.65rem",
    fontWeight: 700,
  },
  levelDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 8px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "6px",
  },
  detailLabel: { fontSize: "0.7rem", color: "#86efac" },
  detailValue: { fontSize: "0.7rem", color: "#f0fdf4", fontWeight: 600 },
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

export default VIP