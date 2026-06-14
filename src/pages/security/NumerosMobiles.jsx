import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Smartphone, CheckCircle2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import {
  getMobileMoney,
  updateMobileMoney,
} from "../../services/authService"
import PageHeader from "../../components/ui/PageHeader"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const NumerosMobiles = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [operateur, setOperateur] = useState("MTN")
  const [numero, setNumero] = useState("")
  const [existing, setExisting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMobileMoney()
        if (data?.numeroMobileMoney) {
          setNumero(data.numeroMobileMoney)
          setOperateur(data.operateurMobileMoney || "MTN")
          setExisting(true)
        }
      } catch (error) {
        // pas de numéro encore enregistré
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!numero) {
      toast.error("Numéro requis")
      return
    }

    // Validation locale
    const numClean = numero.replace(/\s/g, "").replace(/^\+?237/, "")
    if (!/^[6-9]\d{8}$/.test(numClean)) {
      toast.error("Numéro invalide (ex: 699999998)")
      return
    }

    setSaving(true)
    try {
      await updateMobileMoney(numClean, operateur)
      toast.success("Numéro enregistré ✅")
      setExisting(true)
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <PageHeader title="Numéros mobiles" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Numéros mobiles" />

      <div style={styles.content}>
        {/* ===== HEADER ===== */}
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Smartphone size={36} color="#10b981" />
          </div>
          <h2 style={styles.title}>Compte Mobile Money</h2>
          <p style={styles.subtitle}>
            Pour recevoir vos retraits automatiquement
          </p>
        </div>

        {/* ===== STATUT ACTUEL ===== */}
        {existing && (
          <div style={styles.currentBox}>
            <CheckCircle2 size={18} color="#10b981" />
            <div>
              <p style={styles.currentLabel}>Numéro actuel</p>
              <p style={styles.currentValue}>
                {operateur} • +237 {numero}
              </p>
            </div>
          </div>
        )}

        {/* ===== FORMULAIRE ===== */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Opérateur */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Opérateur</label>
            <div style={styles.opGrid}>
              {[
                { id: "MTN", label: "MTN Money", color: "#fbbf24" },
                { id: "ORANGE", label: "Orange Money", color: "#fb923c" },
              ].map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setOperateur(op.id)}
                  style={{
                    ...styles.opBtn,
                    ...(operateur === op.id ? styles.opBtnActive : {}),
                  }}
                >
                  <Smartphone size={22} color={op.color} />
                  <span style={styles.opLabel}>{op.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Numéro */}
          <div style={styles.section}>
            <label style={styles.sectionTitle}>Numéro Mobile Money</label>
            <Input
              icon={Smartphone}
              type="tel"
              prefix="+237"
              placeholder="699 999 998"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          {/* Info */}
          <div style={styles.infoBox}>
            <AlertCircle size={16} color="#f59e0b" />
            <div>
              <p style={styles.infoTitle}>ℹ️ Important</p>
              <ul style={styles.infoList}>
                <li>Ce numéro recevra vos paiements de retrait</li>
                <li>Vérifiez bien qu'il est correct</li>
                <li>Vous pouvez le modifier à tout moment</li>
                <li>Format attendu : 6XXXXXXXX (9 chiffres)</li>
              </ul>
            </div>
          </div>

          <Button type="submit" loading={saving}>
            {existing ? "Mettre à jour" : "Enregistrer"}
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
  content: { padding: "20px" },
  iconHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  iconWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  title: {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "#f0fdf4",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "0.82rem",
    color: "#86efac",
  },
  currentBox: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "14px",
    backgroundColor: "rgba(16,185,129,0.08)",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  currentLabel: { fontSize: "0.72rem", color: "#86efac", marginBottom: "2px" },
  currentValue: {
    fontSize: "0.95rem",
    fontWeight: 700,
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
  opGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  opBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.8)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  opBtnActive: {
    borderColor: "rgba(16,185,129,0.5)",
    backgroundColor: "rgba(16,185,129,0.1)",
    boxShadow: "0 0 12px rgba(16,185,129,0.2)",
  },
  opLabel: {
    fontSize: "0.85rem",
    color: "#f0fdf4",
    fontWeight: 600,
  },
  infoBox: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    backgroundColor: "rgba(245,158,11,0.05)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: "12px",
  },
  infoTitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#f59e0b",
    marginBottom: "6px",
  },
  infoList: {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "0.75rem",
    color: "#94a3b8",
    lineHeight: 1.7,
  },
}

export default NumerosMobiles