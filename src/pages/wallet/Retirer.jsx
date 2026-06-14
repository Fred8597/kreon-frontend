import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Smartphone, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { demanderRetrait } from "../../services/walletService"
import { getStatutPin } from "../../services/authService"
import { formatXAF } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import Modal from "../../components/ui/Modal"
import PinInput from "../../components/ui/PinInput"

const Retirer = () => {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const [methode, setMethode] = useState("MTN")
  const [montant, setMontant] = useState("")
  const [numeroBeneficiaire, setNumeroBeneficiaire] = useState(
    user?.telephone || ""
  )
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)

  // Montants suggérés
  const montantsSuggeres = [1000, 5000, 10000, 25000, 50000]

  // ===== STEP 1 : valider le formulaire et ouvrir PIN =====
  const handleOpenPin = async (e) => {
    e.preventDefault()

    if (!montant || !methode || !numeroBeneficiaire) {
      toast.error("Tous les champs sont obligatoires")
      return
    }

    if (parseInt(montant) < 1000) {
      toast.error("Le montant minimum est de 1 000 XAF")
      return
    }

    if (parseInt(montant) > (user?.soldePrincipal || 0)) {
      toast.error("Solde insuffisant")
      return
    }

    // Vérifier PIN défini
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

  // ===== STEP 2 : envoyer la demande de retrait =====
  const handleSubmitRetrait = async () => {
    if (pin.length !== 6) {
      toast.error("PIN à 6 chiffres requis")
      return
    }

    setLoading(true)
    try {
      await demanderRetrait({
        montant: parseInt(montant),
        methode,
        numeroBeneficiaire: numeroBeneficiaire.replace(/\s/g, ""),
        pin,
      })
      toast.success("Demande de retrait envoyée ! 🕒")
      await refreshUser()
      setShowPinModal(false)
      navigate("/retraits")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur de retrait")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <PageHeader
        title="Retirer"
        showHistory
        onHistoryClick={() => navigate("/retraits")}
      />

      <div style={styles.content}>
        {/* ===== INFO SOLDE ===== */}
        <div style={styles.soldeBox}>
          <span style={styles.soldeLabel}>Montant disponible</span>
          <span style={styles.soldeValue}>
            {formatXAF(user?.soldePrincipal || 0)}
          </span>
        </div>

        <form onSubmit={handleOpenPin} style={styles.form}>
          {/* ===== MÉTHODE ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Méthode de retrait</label>
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
                  <Smartphone size={20} color={m.color} />
                  <span style={styles.methodLabel}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ===== MONTANT ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Montant à retirer (XAF)</label>
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
                  style={{
                    ...styles.suggestionBtn,
                    opacity: m > (user?.soldePrincipal || 0) ? 0.4 : 1,
                  }}
                  disabled={m > (user?.soldePrincipal || 0)}
                >
                  {formatXAF(m)}
                </button>
              ))}
            </div>
          </div>

          {/* ===== NUMÉRO BÉNÉFICIAIRE ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>
              Numéro bénéficiaire{" "}
              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                (où recevoir)
              </span>
            </label>
            <Input
              icon={Smartphone}
              type="tel"
              prefix="+237"
              placeholder="699 999 999"
              value={numeroBeneficiaire}
              onChange={(e) => setNumeroBeneficiaire(e.target.value)}
            />
          </div>

          {/* ===== RÈGLES ===== */}
          <div style={styles.rulesBox}>
            <AlertCircle size={16} color="#f59e0b" />
            <div>
              <p style={styles.rulesTitle}>⏰ Règles de retrait</p>
              <ul style={styles.rulesList}>
                <li>Lundi-Vendredi : 6h - 18h</li>
                <li>Samedi : 6h - 14h</li>
                <li>Dimanche : fermé</li>
                <li>Maximum 2 retraits par jour</li>
                <li>Validation manuelle sous 24-72h</li>
                <li>Montant minimum : 1 000 XAF</li>
              </ul>
            </div>
          </div>

          {/* ===== BOUTON ===== */}
          <Button type="submit">Confirmer le retrait</Button>
        </form>
      </div>

      {/* ===== MODAL PIN ===== */}
      <Modal
        isOpen={showPinModal}
        onClose={() => !loading && setShowPinModal(false)}
        title="🔐 Confirmer avec PIN"
      >
        <div style={{ textAlign: "center" }}>
          <p style={styles.modalText}>
            Retirer{" "}
            <strong style={{ color: "#f59e0b" }}>
              {formatXAF(parseInt(montant) || 0)}
            </strong>
            <br />
            vers <strong style={{ color: "#10b981" }}>{numeroBeneficiaire}</strong>{" "}
            ({methode})
          </p>

          <PinInput value={pin} onChange={setPin} length={6} />

          <Button onClick={handleSubmitRetrait} loading={loading}>
            Confirmer le retrait
          </Button>
        </div>
      </Modal>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    paddingBottom: "30px",
  },
  content: {
    padding: "20px",
  },
  soldeBox: {
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.05))",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "16px",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  soldeLabel: {
    fontSize: "0.8rem",
    color: "#86efac",
  },
  soldeValue: {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "#f59e0b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    fontSize: "0.82rem",
    color: "#86efac",
    fontWeight: 600,
  },
  methodGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
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
  methodLabel: {
    fontSize: "0.85rem",
    color: "#f0fdf4",
    fontWeight: 600,
  },
  suggestionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
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
  rulesBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.05)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "12px",
  },
  rulesTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#f59e0b",
    marginBottom: "6px",
  },
  rulesList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.75rem",
    color: "#94a3b8",
    lineHeight: 1.7,
  },
  modalText: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginBottom: "10px",
    lineHeight: 1.6,
  },
}

export default Retirer