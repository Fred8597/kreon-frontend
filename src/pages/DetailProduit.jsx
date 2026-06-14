import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Package,
  Calendar,
  Wallet,
  CheckCircle2,
  Crown,
  Users,
  Timer,
  AlertCircle,
  Lock,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { formatXAF, formatDateTime } from "../utils/format"
import { getProduitById, calculerTotal, calculerRendement } from "../services/productService"
import { investir } from "../services/investmentService"
import { getStatutPin } from "../services/authService"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Modal from "../components/ui/Modal"
import PinInput from "../components/ui/PinInput"
import Button from "../components/ui/Button"

const DetailProduit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const [investing, setInvesting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [investmentResult, setInvestmentResult] = useState(null)
  const [countdown, setCountdown] = useState(null)

  // ===== FETCH =====
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduitById(id)
        setProduct(data)
      } catch (error) {
        toast.error("Produit introuvable")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  // ===== COMPTE À REBOURS =====
  useEffect(() => {
    if (!product || product.categorie !== "DUREE_LIMITEE" || !product.dateDebut) return

    const target = new Date(product.dateDebut).getTime()

    const update = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setCountdown(null)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown({ days, hours, minutes, seconds })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [product])

  // ===== LOUER =====
  const handleLouer = async () => {
    if (!product) return

    if (product.stock === 0) {
      toast.error("Ce produit est épuisé")
      return
    }

    if (user.soldePrincipal < product.prix) {
      toast.error("Solde insuffisant. Rechargez votre compte.")
      return
    }

    // Vérification niveau VIP
    if (product.categorie === "NVIP" && user.niveauVIP < product.niveauVIPRequis) {
      toast.error(`Réservé aux NVIP${product.niveauVIPRequis} et plus`)
      return
    }

    // Limite d'achat
    if (product.limiteAchat > 0 && product.achatsUser >= product.limiteAchat) {
      toast.error(`Limite d'achat atteinte (${product.limiteAchat})`)
      return
    }

    // PIN
    try {
      const { pinDefini } = await getStatutPin()
      if (!pinDefini) {
        toast.error("Créez d'abord un code PIN dans votre profil")
        navigate("/profil")
        return
      }
    } catch (error) {
      toast.error("Erreur de vérification PIN")
      return
    }

    setPin("")
    setShowPinModal(true)
  }

  // ===== SUBMIT PIN =====
  const handleSubmitPin = async () => {
    if (pin.length !== 6) {
      toast.error("PIN à 6 chiffres requis")
      return
    }

    setInvesting(true)
    try {
      const result = await investir(product._id, product.prix, pin)
      setInvestmentResult(result)
      setShowPinModal(false)
      setShowSuccessModal(true)
      await refreshUser()
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur d'investissement")
    } finally {
      setInvesting(false)
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    navigate("/")
  }

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  if (!product) return null

  // ===== STATUTS =====
  const isEpuise = product.stock === 0
  const isAvantLancement = product.categorie === "DUREE_LIMITEE" && countdown !== null
  const isTermine =
    product.categorie === "DUREE_LIMITEE" &&
    product.dateFin &&
    new Date() > new Date(product.dateFin)
  const isVipInsuffisant =
    product.categorie === "NVIP" && user?.niveauVIP < product.niveauVIPRequis
  const isLimiteAtteinte =
    product.limiteAchat > 0 && (product.achatsUser || 0) >= product.limiteAchat

  const canBuy =
    !isEpuise &&
    !isAvantLancement &&
    !isTermine &&
    !isVipInsuffisant &&
    !isLimiteAtteinte

  const total = calculerTotal(product.prix, product.montantRetour)
  const rendement = calculerRendement(product.prix, product.montantRetour)

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} color="#86efac" />
        </button>
        <h1 style={styles.headerTitle}>Détail Produit</h1>
        <div style={{ width: "36px" }} />
      </header>

      {/* IMAGE */}
      {product.image && (
        <div style={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.nom}
            style={styles.image}
            onError={(e) => (e.target.parentElement.style.display = "none")}
          />
          {isEpuise && (
            <div style={styles.overlayBox}>
              <span style={styles.overlayText}>ÉPUISÉ</span>
            </div>
          )}
          {isTermine && (
            <div style={styles.overlayBox}>
              <span style={styles.overlayText}>TERMINÉ</span>
            </div>
          )}
        </div>
      )}

      {/* CARTE PRINCIPALE */}
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <div>
            <h2 style={styles.productName}>{product.nom}</h2>
            <p style={styles.productCategorie}>{product.categorie}</p>
          </div>
          {product.badge && <span style={styles.badge}>{product.badge}</span>}
        </div>

        {/* SPECS */}
        <div style={styles.specsList}>
          <SpecRow
            icon={<Calendar size={16} color="#f59e0b" />}
            label="Cycle"
            value={`${product.dureeJours} jour${product.dureeJours > 1 ? "s" : ""}`}
          />
          <SpecRow
            icon={<Wallet size={16} color="#34d399" />}
            label="Montant location"
            value={formatXAF(product.prix)}
          />
          <SpecRow
            icon={<TrendingUp size={16} color="#10b981" />}
            label="Revenu total"
            value={formatXAF(product.montantRetour)}
            highlight
          />
          <SpecRow
            icon={<Package size={16} color="#f59e0b" />}
            label="Total à recevoir"
            value={formatXAF(total)}
            big
          />
        </div>

        {/* CALCUL */}
        <div style={styles.calculBox}>
          <p style={styles.calculText}>
            <span style={{ color: "#86efac" }}>{formatXAF(product.prix)}</span> +{" "}
            <span style={{ color: "#10b981" }}>{formatXAF(product.montantRetour)}</span> ={" "}
            <span style={{ color: "#f59e0b", fontWeight: 800 }}>{formatXAF(total)}</span>
            <span style={styles.rendementInline}>+{rendement}%</span>
          </p>
        </div>

        {/* INFO STOCK/LIMITE */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <span style={styles.infoLabel}>Stock</span>
            <span
              style={{
                ...styles.infoVal,
                color: product.stock === 0 ? "#ef4444" : "#10b981",
              }}
            >
              {product.stock}
            </span>
          </div>
          <div style={styles.infoCard}>
            <span style={styles.infoLabel}>Limite d'achat</span>
            <span style={styles.infoVal}>
              {product.limiteAchat > 0
                ? `${product.achatsUser || 0}/${product.limiteAchat}`
                : "∞"}
            </span>
          </div>
        </div>

        {/* NIVEAU VIP REQUIS */}
        {product.categorie === "NVIP" && product.niveauVIPRequis > 0 && (
          <div
            style={{
              ...styles.alertBox,
              ...(isVipInsuffisant ? styles.alertBoxRed : styles.alertBoxGreen),
            }}
          >
            <Crown size={16} color={isVipInsuffisant ? "#ef4444" : "#10b981"} />
            <span>
              Réservé aux <strong>NVIP{product.niveauVIPRequis} et plus</strong>
              {isVipInsuffisant && (
                <span style={{ color: "#ef4444", marginLeft: "6px" }}>
                  (votre niveau insuffisant)
                </span>
              )}
            </span>
          </div>
        )}

        {/* FILLEULS REQUIS */}
        {product.categorie === "SUPER_IA" && product.filleulsRequis > 0 && (
          <div style={styles.alertBox}>
            <Users size={16} color="#8b5cf6" />
            <span>
              Nécessite <strong>{product.filleulsRequis} filleuls</strong>
            </span>
          </div>
        )}

        {/* COMPTE À REBOURS */}
        {isAvantLancement && countdown && (
          <div style={styles.countdownBig}>
            <Timer size={20} color="#ec4899" />
            <div>
              <p style={styles.countdownLabel}>⏳ Lancement dans</p>
              <div style={styles.countdownTimer}>
                {countdown.days > 0 && (
                  <span style={styles.countdownUnit}>{countdown.days}j</span>
                )}
                <span style={styles.countdownUnit}>
                  {String(countdown.hours).padStart(2, "0")}h
                </span>
                <span style={styles.countdownUnit}>
                  {String(countdown.minutes).padStart(2, "0")}m
                </span>
                <span style={styles.countdownUnit}>
                  {String(countdown.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DATES DUREE LIMITEE */}
        {product.categorie === "DUREE_LIMITEE" && (
          <div style={styles.datesBox}>
            <p style={styles.datesLabel}>📅 Disponibilité</p>
            {product.dateDebut && (
              <p style={styles.datesText}>
                Début : {formatDateTime(product.dateDebut)}
              </p>
            )}
            {product.dateFin && (
              <p style={styles.datesText}>
                Fin : {formatDateTime(product.dateFin)}
              </p>
            )}
          </div>
        )}

        {/* DESCRIPTION */}
        {product.description && (
          <div style={styles.descriptionBox}>
            <h3 style={styles.descTitle}>📝 Description</h3>
            <p style={styles.descText}>{product.description}</p>
          </div>
        )}
      </div>

      {/* FOOTER FIXE */}
      <div style={styles.footerFixed}>
        <div style={styles.footerLeft}>
          <span style={styles.footerLabel}>Prix de location</span>
          <span style={styles.footerAmount}>{formatXAF(product.prix)}</span>
        </div>
        <button
          onClick={handleLouer}
          style={{
            ...styles.louerBtn,
            ...(canBuy ? {} : styles.louerBtnDisabled),
          }}
          disabled={!canBuy}
        >
          {isEpuise
            ? "Épuisé"
            : isTermine
            ? "Terminé"
            : isAvantLancement
            ? "Pas encore lancé"
            : isVipInsuffisant
            ? "Niveau insuffisant"
            : isLimiteAtteinte
            ? "Limite atteinte"
            : "🚀 Louer maintenant"}
        </button>
      </div>

      {/* MODAL PIN */}
      <Modal
        isOpen={showPinModal}
        onClose={() => !investing && setShowPinModal(false)}
        title="🔐 Confirmer avec PIN"
      >
        <div style={{ textAlign: "center" }}>
          <p style={styles.modalText}>
            Investir{" "}
            <strong style={{ color: "#f59e0b" }}>{formatXAF(product.prix)}</strong>{" "}
            dans <strong style={{ color: "#10b981" }}>{product.nom}</strong>
          </p>
          <PinInput value={pin} onChange={setPin} length={6} />
          <p style={styles.modalHint}>Entrez votre code PIN à 6 chiffres</p>
          <Button onClick={handleSubmitPin} loading={investing}>
            Confirmer l'investissement
          </Button>
        </div>
      </Modal>

      {/* MODAL SUCCÈS */}
      <Modal isOpen={showSuccessModal} onClose={handleCloseSuccess} showClose={false}>
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={styles.successIconWrapper}>
            <CheckCircle2 size={48} color="#10b981" />
          </div>
          <h2 style={styles.successTitle}>Investissement réussi ! 🎉</h2>
          <p style={styles.successText}>
            Votre location est active.
            <br />
            Vous recevrez automatiquement
          </p>
          <p style={styles.successAmount}>
            {formatXAF(investmentResult?.montantTotalARecevoir || 0)}
          </p>
          <p style={styles.successDate}>
            le {new Date(investmentResult?.dateExpiration).toLocaleDateString("fr-FR")}
          </p>
          <div style={{ marginTop: "20px" }}>
            <Button onClick={handleCloseSuccess}>Retour à l'accueil</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const SpecRow = ({ icon, label, value, highlight, big }) => (
  <div style={styles.specRow}>
    <div style={styles.specLeft}>
      {icon}
      <span style={styles.specLabel}>{label}</span>
    </div>
    <span
      style={{
        ...styles.specValue,
        ...(highlight ? { color: "#10b981" } : {}),
        ...(big ? { fontSize: "1.1rem", color: "#f59e0b", fontWeight: 800 } : {}),
      }}
    >
      {value}
    </span>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "100px" },
  loadingPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  header: {
    position: "sticky", top: 0, zIndex: 50,
    backgroundColor: "rgba(10,15,13,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    padding: "14px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  backBtn: {
    width: "36px", height: "36px", borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  headerTitle: { fontSize: "1.05rem", fontWeight: 700, color: "#f0fdf4" },
  imageWrapper: { width: "100%", height: "220px", overflow: "hidden", margin: "0 0 20px", position: "relative" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  overlayBox: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  overlayText: { fontSize: "2rem", fontWeight: 900, color: "#ef4444", letterSpacing: "0.1em" },
  card: {
    margin: "0 20px 20px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "20px",
    padding: "20px",
  },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", gap: "10px" },
  productName: { fontSize: "1.2rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "4px" },
  productCategorie: { fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 },
  badge: {
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.7rem", fontWeight: 700,
    backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.4)",
  },
  specsList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  specRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 12px", backgroundColor: "rgba(10,15,13,0.5)", borderRadius: "10px",
  },
  specLeft: { display: "flex", alignItems: "center", gap: "8px" },
  specLabel: { fontSize: "0.82rem", color: "#86efac" },
  specValue: { fontSize: "0.9rem", fontWeight: 700, color: "#f0fdf4" },
  calculBox: {
    padding: "14px", backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", textAlign: "center",
    marginBottom: "14px",
  },
  calculText: { fontSize: "0.95rem", fontWeight: 700 },
  rendementInline: { marginLeft: "10px", padding: "2px 10px", borderRadius: "20px", backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "0.78rem" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  infoCard: {
    padding: "12px", backgroundColor: "rgba(10,15,13,0.5)", borderRadius: "10px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
  },
  infoLabel: { fontSize: "0.7rem", color: "#6b7280" },
  infoVal: { fontSize: "1rem", fontWeight: 800 },
  alertBox: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 14px", borderRadius: "10px",
    fontSize: "0.82rem", color: "#f0fdf4",
    backgroundColor: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)",
    marginBottom: "10px",
  },
  alertBoxRed: { backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" },
  alertBoxGreen: { backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" },
  countdownBig: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px",
    backgroundColor: "rgba(236,72,153,0.1)",
    border: "1px solid rgba(236,72,153,0.4)",
    borderRadius: "14px", marginBottom: "14px",
  },
  countdownLabel: { fontSize: "0.78rem", color: "#ec4899", fontWeight: 700 },
  countdownTimer: { display: "flex", gap: "6px", marginTop: "6px" },
  countdownUnit: {
    padding: "4px 10px", backgroundColor: "rgba(236,72,153,0.2)",
    borderRadius: "8px", fontSize: "0.85rem", fontWeight: 800,
    color: "#ec4899", fontFamily: "monospace",
  },
  datesBox: {
    padding: "12px", backgroundColor: "rgba(236,72,153,0.05)",
    border: "1px solid rgba(236,72,153,0.2)", borderRadius: "10px",
    marginBottom: "14px",
  },
  datesLabel: { fontSize: "0.78rem", color: "#ec4899", fontWeight: 700, marginBottom: "6px" },
  datesText: { fontSize: "0.78rem", color: "#86efac" },
  descriptionBox: {
    marginTop: "14px", padding: "14px",
    backgroundColor: "rgba(10,15,13,0.4)",
    border: "1px solid rgba(16,185,129,0.08)", borderRadius: "12px",
  },
  descTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#10b981", marginBottom: "8px" },
  descText: { fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 },
  footerFixed: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(10,15,13,0.95)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(16,185,129,0.2)",
    padding: "14px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    gap: "12px", zIndex: 100,
  },
  footerLeft: { display: "flex", flexDirection: "column" },
  footerLabel: { fontSize: "0.7rem", color: "#6b7280" },
  footerAmount: { fontSize: "1rem", fontWeight: 800, color: "#f59e0b" },
  louerBtn: {
    flex: 1, maxWidth: "230px",
    padding: "14px 20px", borderRadius: "14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none", color: "#ffffff",
    fontSize: "0.92rem", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
  },
  louerBtnDisabled: {
    background: "rgba(107,114,128,0.3)",
    color: "#6b7280", cursor: "not-allowed", boxShadow: "none",
  },
  modalText: { fontSize: "0.9rem", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.6 },
  modalHint: { fontSize: "0.75rem", color: "#6b7280", marginBottom: "20px" },
  successIconWrapper: {
    width: "80px", height: "80px", borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.15)",
    border: "2px solid rgba(16,185,129,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  successTitle: { fontSize: "1.3rem", fontWeight: 800, color: "#10b981", marginBottom: "12px" },
  successText: { fontSize: "0.88rem", color: "#94a3b8", marginBottom: "10px", lineHeight: 1.6 },
  successAmount: { fontSize: "1.8rem", fontWeight: 900, color: "#f59e0b", margin: "8px 0" },
  successDate: { fontSize: "0.85rem", color: "#86efac" },
}

export default DetailProduit