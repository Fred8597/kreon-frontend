import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Smartphone,
  Hash,
  Image as ImageIcon,
  Copy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { demanderRecharge } from "../../services/walletService"
import { getPublicSettings } from "../../services/settingsService"
import { formatXAF } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const Recharger = () => {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  // ===== ÉTAPES =====
  // 1 = Choix méthode + montant
  // 2 = Page paiement (instructions)
  // 3 = Saisir référence + preuve
  const [etape, setEtape] = useState(1)

  // ===== DATA =====
  const [settings, setSettings] = useState(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  // ===== FORM =====
  const [methode, setMethode] = useState("MTN")
  const [montant, setMontant] = useState("")
  const [numeroPayeur, setNumeroPayeur] = useState(user?.telephone || "")
  const [referencePaiement, setReferencePaiement] = useState("")
  const [preuvePaiement, setPreuvePaiement] = useState("")
  const [loading, setLoading] = useState(false)

  const montantsSuggeres = [1000, 5000, 10000, 25000, 50000, 100000]

  // ===== Charger les settings (numéros agents) =====
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()
        setSettings(data)
      } catch (error) {
        toast.error("Erreur de chargement des paramètres")
      } finally {
        setLoadingSettings(false)
      }
    }
    fetchSettings()
  }, [])

  // ===== HANDLERS =====
  const handleEtape1Next = () => {
    if (!montant || parseInt(montant) < 1000) {
      toast.error("Montant minimum : 1 000 XAF")
      return
    }
    if (!numeroPayeur) {
      toast.error("Numéro de téléphone requis")
      return
    }
    setEtape(2)
  }

  const handleCopier = (texte, label) => {
    navigator.clipboard.writeText(texte)
    toast.success(`${label} copié !`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!referencePaiement.trim()) {
      toast.error("Le numéro de transaction est obligatoire")
      return
    }

    if (referencePaiement.trim().length < 8) {
      toast.error("Numéro de transaction invalide (min 8 caractères)")
      return
    }

    setLoading(true)
    try {
      const result = await demanderRecharge({
        montant: parseInt(montant),
        methode,
        numeroPayeur: numeroPayeur.replace(/\s/g, ""),
        referencePaiement: referencePaiement.trim(),
        preuvePaiement: preuvePaiement || "",
      })

      if (result.autoValidee) {
        toast.success(result.message, { duration: 5000, icon: "⚡" })
        await refreshUser()
      } else {
        toast.success(result.message, { duration: 5000, icon: "✅" })
      }

      navigate("/recharges")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  if (loadingSettings) {
    return (
      <div style={styles.page}>
        <PageHeader title="Recharger" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  const numeroAgent = methode === "MTN" ? settings?.numeroAgentMTN : settings?.numeroAgentORANGE
  const nomAgent = methode === "MTN" ? settings?.nomAgentMTN : settings?.nomAgentORANGE

  return (
    <div style={styles.page}>
      <PageHeader
        title="Recharger"
        showHistory
        onHistoryClick={() => navigate("/recharges")}
      />

      <div style={styles.content}>
        {/* PROGRESS BAR */}
        <div style={styles.stepsBar}>
          <StepDot active={etape >= 1} done={etape > 1} label="1" text="Montant" />
          <div style={{ ...styles.stepLine, ...(etape > 1 ? styles.stepLineActive : {}) }} />
          <StepDot active={etape >= 2} done={etape > 2} label="2" text="Paiement" />
          <div style={{ ...styles.stepLine, ...(etape > 2 ? styles.stepLineActive : {}) }} />
          <StepDot active={etape >= 3} label="3" text="Validation" />
        </div>

        {/* SOLDE */}
        <div style={styles.soldeBox}>
          <span style={styles.soldeLabel}>Solde actuel</span>
          <span style={styles.soldeValue}>
            {formatXAF(user?.soldePrincipal || 0)}
          </span>
        </div>

        {/* ===== ÉTAPE 1 : CHOIX MÉTHODE + MONTANT ===== */}
        {etape === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>1. Choisissez votre méthode</h2>

            <div style={styles.section}>
              <label style={styles.sectionTitle}>Opérateur Mobile Money</label>
              <div style={styles.methodGrid}>
                {[
                  { id: "MTN", label: "MTN Money", color: "#fbbf24" },
                  { id: "ORANGE", label: "Orange Money", color: "#fb923c" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethode(m.id)}
                    style={{
                      ...styles.methodBtn,
                      ...(methode === m.id ? styles.methodBtnActive : {}),
                    }}
                  >
                    <Smartphone size={22} color={m.color} />
                    <span style={styles.methodLabel}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.sectionTitle}>Montant à recharger (XAF) *</label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
              <div style={styles.suggestionsRow}>
                {montantsSuggeres.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMontant(m.toString())}
                    style={styles.suggestionBtn}
                  >
                    {formatXAF(m)}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <label style={styles.sectionTitle}>Votre numéro Mobile Money *</label>
              <Input
                icon={Smartphone}
                type="tel"
                prefix="+237"
                placeholder="699 999 999"
                value={numeroPayeur}
                onChange={(e) => setNumeroPayeur(e.target.value)}
              />
            </div>

            <Button onClick={handleEtape1Next}>
              Continuer <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* ===== ÉTAPE 2 : PAGE PAIEMENT ===== */}
        {etape === 2 && (
          <div style={styles.card}>
            <button onClick={() => setEtape(1)} style={styles.backBtn}>
              <ArrowLeft size={14} /> Modifier
            </button>

            <h2 style={styles.cardTitle}>2. Effectuez le paiement</h2>

            {/* Récap */}
            <div style={styles.recapBox}>
              <div style={styles.recapRow}>
                <span style={styles.recapLabel}>Opérateur</span>
                <span style={styles.recapValue}>{methode} Money</span>
              </div>
              <div style={styles.recapRow}>
                <span style={styles.recapLabel}>Montant à payer</span>
                <span style={styles.recapValueBig}>{formatXAF(parseInt(montant))}</span>
              </div>
            </div>

            {/* Instructions */}
            <div style={styles.instructionsBox}>
              <div style={styles.instructionsHeader}>
                <Info size={18} color="#10b981" />
                <h3 style={styles.instructionsTitle}>Instructions</h3>
              </div>
              <ol style={styles.instructionsList}>
                <li>Ouvrez votre application <strong>{methode} Money</strong></li>
                <li>Faites un transfert au numéro ci-dessous</li>
                <li>Entrez le montant exact : <strong>{formatXAF(parseInt(montant))}</strong></li>
                <li><strong>Notez bien le numéro de transaction</strong> que vous recevrez par SMS</li>
                <li>Revenez sur KREON et entrez ce numéro à l'étape suivante</li>
              </ol>
            </div>

            {/* Numéro agent à copier */}
            <div style={styles.agentBox}>
              <span style={styles.agentLabel}>Numéro à payer</span>
              <button
                onClick={() => handleCopier(numeroAgent, "Numéro")}
                style={styles.agentNumberBtn}
              >
                <span style={styles.agentNumber}>{numeroAgent}</span>
                <Copy size={16} color="#10b981" />
              </button>
              <span style={styles.agentName}>Nom : {nomAgent}</span>
            </div>

            {/* Avertissement */}
            <div style={styles.warningBox}>
              <AlertCircle size={16} color="#f59e0b" />
              <p style={styles.warningText}>
                Après avoir effectué la transaction, notez le numéro de transaction fourni par votre opérateur.
                Vous devrez le mentionner pour que votre recharge soit vérifiée et approuvée.
              </p>
            </div>

            <Button onClick={() => setEtape(3)}>
              J'ai payé, continuer <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* ===== ÉTAPE 3 : SAISIE RÉFÉRENCE ===== */}
        {etape === 3 && (
          <div style={styles.card}>
            <button onClick={() => setEtape(2)} style={styles.backBtn}>
              <ArrowLeft size={14} /> Retour
            </button>

            <h2 style={styles.cardTitle}>3. Validation de votre recharge</h2>

            {/* Récap */}
            <div style={styles.recapBox}>
              <div style={styles.recapRow}>
                <span style={styles.recapLabel}>Méthode</span>
                <span style={styles.recapValue}>{methode}</span>
              </div>
              <div style={styles.recapRow}>
                <span style={styles.recapLabel}>Montant</span>
                <span style={styles.recapValueBig}>{formatXAF(parseInt(montant))}</span>
              </div>
              <div style={styles.recapRow}>
                <span style={styles.recapLabel}>Payé à</span>
                <span style={styles.recapValue}>{numeroAgent}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* RÉFÉRENCE PAIEMENT */}
              <div style={styles.section}>
                <label style={styles.sectionTitle}>
                  Numéro de transaction * ⚠️
                </label>
                <Input
                  icon={Hash}
                  type="text"
                  placeholder={methode === "MTN" ? "Ex: 17381367485" : "Ex: CI230612.1234.B12345"}
                  value={referencePaiement}
                  onChange={(e) => setReferencePaiement(e.target.value)}
                />
                <p style={styles.fieldHint}>
                  Ce numéro vous a été envoyé par SMS par {methode}. Vérifiez bien qu'il est correct.
                </p>
              </div>

              {/* PREUVE IMAGE */}
              <div style={styles.section}>
                <label style={styles.sectionTitle}>
                  Lien preuve de paiement (optionnel)
                </label>
                <Input
                  icon={ImageIcon}
                  type="text"
                  placeholder="URL de l'image du SMS reçu"
                  value={preuvePaiement}
                  onChange={(e) => setPreuvePaiement(e.target.value)}
                />
                <p style={styles.fieldHint}>
                  Si vous voulez, vous pouvez ajouter le lien d'une image du message SMS.
                </p>
              </div>

              {/* INFO MATCHING AUTO */}
              <div style={styles.infoBox}>
                <CheckCircle2 size={16} color="#10b981" />
                <p style={styles.infoText}>
                  <strong>Validation automatique :</strong> si le numéro correspond à celui reçu par notre admin, votre recharge sera créditée immédiatement.
                </p>
              </div>

              <Button type="submit" loading={loading}>
                Confirmer la recharge
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== Sous-composant Step =====
const StepDot = ({ active, done, label, text }) => (
  <div style={styles.stepDot}>
    <div
      style={{
        ...styles.stepCircle,
        backgroundColor: done
          ? "#10b981"
          : active
          ? "rgba(16,185,129,0.2)"
          : "rgba(107,114,128,0.15)",
        color: done ? "#0a0f0d" : active ? "#10b981" : "#6b7280",
        border: `2px solid ${
          done ? "#10b981" : active ? "rgba(16,185,129,0.4)" : "transparent"
        }`,
      }}
    >
      {done ? "✓" : label}
    </div>
    <span
      style={{
        ...styles.stepText,
        color: active ? "#10b981" : "#6b7280",
      }}
    >
      {text}
    </span>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  // STEPS
  stepsBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  stepDot: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    fontWeight: 800,
    transition: "all 0.3s",
  },
  stepText: { fontSize: "0.68rem", fontWeight: 600 },
  stepLine: {
    flex: 1,
    maxWidth: "40px",
    height: "2px",
    backgroundColor: "rgba(107,114,128,0.3)",
    marginBottom: "16px",
  },
  stepLineActive: { backgroundColor: "#10b981" },
  // SOLDE
  soldeBox: {
    background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.05))",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "12px",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  soldeLabel: { fontSize: "0.78rem", color: "#86efac" },
  soldeValue: { fontSize: "1rem", fontWeight: 800, color: "#10b981" },
  // CARD
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardTitle: { fontSize: "1.1rem", fontWeight: 800, color: "#f0fdf4" },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "8px",
    color: "#86efac",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  section: { display: "flex", flexDirection: "column", gap: "10px" },
  sectionTitle: { fontSize: "0.82rem", color: "#86efac", fontWeight: 600 },
  methodGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  methodBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  methodBtnActive: {
    borderColor: "rgba(16,185,129,0.5)",
    backgroundColor: "rgba(16,185,129,0.1)",
    boxShadow: "0 0 12px rgba(16,185,129,0.2)",
  },
  methodLabel: { fontSize: "0.85rem", color: "#f0fdf4", fontWeight: 600 },
  suggestionsRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  suggestionBtn: {
    padding: "6px 12px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "8px",
    color: "#86efac",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  // RECAP
  recapBox: {
    padding: "14px",
    backgroundColor: "rgba(10,15,13,0.5)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  recapRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  recapLabel: { fontSize: "0.78rem", color: "#86efac" },
  recapValue: { fontSize: "0.88rem", color: "#f0fdf4", fontWeight: 600 },
  recapValueBig: { fontSize: "1.1rem", color: "#f59e0b", fontWeight: 800 },
  // INSTRUCTIONS
  instructionsBox: {
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "12px",
  },
  instructionsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  instructionsTitle: { fontSize: "0.92rem", fontWeight: 700, color: "#10b981" },
  instructionsList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "0.82rem",
    color: "#cbd5e1",
    lineHeight: 1.8,
  },
  // AGENT
  agentBox: {
    padding: "18px",
    background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(16,185,129,0.05))",
    border: "2px solid rgba(245,158,11,0.4)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  agentLabel: { fontSize: "0.78rem", color: "#86efac", fontWeight: 600 },
  agentNumberBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    backgroundColor: "rgba(10,15,13,0.8)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  agentNumber: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "#f59e0b",
    letterSpacing: "0.1em",
  },
  agentName: { fontSize: "0.78rem", color: "#86efac" },
  // WARNING
  warningBox: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "10px",
  },
  warningText: { fontSize: "0.78rem", color: "#fbbf24", lineHeight: 1.5 },
  // FORM
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldHint: { fontSize: "0.7rem", color: "#6b7280", marginTop: "4px" },
  // INFO
  infoBox: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: "10px",
  },
  infoText: { fontSize: "0.78rem", color: "#86efac", lineHeight: 1.5 },
}

export default Recharger