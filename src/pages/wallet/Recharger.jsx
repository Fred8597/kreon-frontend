import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Smartphone, Hash, FileText, Image as ImageIcon } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { demanderRecharge } from "../../services/walletService"
import { formatXAF } from "../../utils/format"
import PageHeader from "../../components/ui/PageHeader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const Recharger = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [methode, setMethode] = useState("MTN")
  const [montant, setMontant] = useState("")
  const [numeroPayeur, setNumeroPayeur] = useState(user?.telephone || "")
  const [referencePaiement, setReferencePaiement] = useState("")
  const [preuvePaiement, setPreuvePaiement] = useState("")
  const [loading, setLoading] = useState(false)

  // Montants suggérés
  const montantsSuggeres = [1000, 5000, 10000, 25000, 50000, 100000]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!montant || !methode || !numeroPayeur) {
      toast.error("Tous les champs obligatoires doivent être remplis")
      return
    }

    if (parseInt(montant) < 1000) {
      toast.error("Le montant minimum est de 1 000 XAF")
      return
    }

    setLoading(true)
    try {
      await demanderRecharge({
        montant: parseInt(montant),
        methode,
        numeroPayeur: numeroPayeur.replace(/\s/g, ""),
        referencePaiement,
        preuvePaiement,
      })
      toast.success("Demande envoyée ! En attente de validation 🕒")
      navigate("/recharges")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur de recharge")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <PageHeader
        title="Recharger"
        showHistory
        onHistoryClick={() => navigate("/recharges")}
      />

      <div style={styles.content}>
        {/* ===== INFO SOLDE ===== */}
        <div style={styles.infoBox}>
          <span style={styles.infoLabel}>Solde actuel</span>
          <span style={styles.infoValue}>
            {formatXAF(user?.soldePrincipal || 0)}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* ===== MÉTHODE ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Méthode de paiement</label>
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
            <label style={styles.sectionTitle}>Montant (XAF)</label>
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

          {/* ===== NUMÉRO PAYEUR ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>
              Numéro qui paye{" "}
              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                (votre numéro Mobile Money)
              </span>
            </label>
            <Input
              icon={Smartphone}
              type="tel"
              prefix="+237"
              placeholder="699 999 999"
              value={numeroPayeur}
              onChange={(e) => setNumeroPayeur(e.target.value)}
            />
          </div>

          {/* ===== RÉFÉRENCE (optionnel) ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>
              Numéro de transaction{" "}
              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                (optionnel)
              </span>
            </label>
            <Input
              icon={Hash}
              type="text"
              placeholder="Ex: TX123456789"
              value={referencePaiement}
              onChange={(e) => setReferencePaiement(e.target.value)}
            />
          </div>

          {/* ===== URL PREUVE (optionnel) ===== */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>
              Lien preuve de paiement{" "}
              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                (optionnel)
              </span>
            </label>
            <Input
              icon={ImageIcon}
              type="text"
              placeholder="https://..."
              value={preuvePaiement}
              onChange={(e) => setPreuvePaiement(e.target.value)}
            />
          </div>

          {/* ===== INSTRUCTIONS ===== */}
          <div style={styles.instructionsBox}>
            <FileText size={16} color="#10b981" />
            <div>
              <p style={styles.instructionsTitle}>📋 Instructions</p>
              <ul style={styles.instructionsList}>
                <li>Effectuez le paiement Mobile Money vers le numéro KREON</li>
                <li>Notez la référence de transaction</li>
                <li>Remplissez le formulaire ci-dessus</li>
                <li>Validation manuelle sous 24h</li>
                <li>Montant minimum : 1 000 XAF</li>
              </ul>
            </div>
          </div>

          {/* ===== BOUTON ===== */}
          <Button type="submit" loading={loading}>
            Confirmer la recharge
          </Button>
        </form>
      </div>
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
  infoBox: {
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  infoLabel: {
    fontSize: "0.78rem",
    color: "#86efac",
  },
  infoValue: {
    fontSize: "1rem",
    fontWeight: 800,
    color: "#10b981",
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
  instructionsBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
  },
  instructionsTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "6px",
  },
  instructionsList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.75rem",
    color: "#94a3b8",
    lineHeight: 1.7,
  },
}

export default Recharger