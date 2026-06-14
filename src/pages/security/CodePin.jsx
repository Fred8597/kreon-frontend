import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"
import {
  getStatutPin,
  definirPin,
  modifierPin,
} from "../../services/authService"
import PageHeader from "../../components/ui/PageHeader"
import PinInput from "../../components/ui/PinInput"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

const CodePin = () => {
  const navigate = useNavigate()

  const [pinExist, setPinExist] = useState(null) // null = chargement
  const [step, setStep] = useState(1) // 1 = ancien, 2 = nouveau, 3 = confirmer

  const [ancienPin, setAncienPin] = useState("")
  const [nouveauPin, setNouveauPin] = useState("")
  const [confirmerPin, setConfirmerPin] = useState("")
  const [loading, setLoading] = useState(false)

  // ===== Vérifier si PIN existe =====
  useEffect(() => {
    const checkPin = async () => {
      try {
        const { pinDefini } = await getStatutPin()
        setPinExist(pinDefini)
        // Si pas de PIN, on saute l'étape "ancien PIN"
        if (!pinDefini) setStep(2)
      } catch (error) {
        toast.error("Erreur de vérification PIN")
      }
    }
    checkPin()
  }, [])

  // ===== HANDLERS =====
  const handleNext = () => {
    if (step === 1 && ancienPin.length !== 6) {
      toast.error("PIN à 6 chiffres requis")
      return
    }
    if (step === 2 && nouveauPin.length !== 6) {
      toast.error("PIN à 6 chiffres requis")
      return
    }
    if (step === 2 && nouveauPin === ancienPin && pinExist) {
      toast.error("Le nouveau PIN doit être différent")
      return
    }
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (confirmerPin.length !== 6) {
      toast.error("PIN à 6 chiffres requis")
      return
    }
    if (nouveauPin !== confirmerPin) {
      toast.error("Les PINs ne correspondent pas")
      return
    }

    setLoading(true)
    try {
      if (pinExist) {
        await modifierPin(ancienPin, nouveauPin)
        toast.success("Code PIN modifié avec succès ✅")
      } else {
        await definirPin(nouveauPin)
        toast.success("Code PIN créé avec succès ✅")
      }
      navigate("/profil")
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur")
      // Si erreur sur ancien PIN, retour étape 1
      if (
        pinExist &&
        error.response?.data?.message?.toLowerCase().includes("incorrect")
      ) {
        setStep(1)
        setAncienPin("")
      }
    } finally {
      setLoading(false)
    }
  }

  if (pinExist === null) {
    return (
      <div style={styles.page}>
        <PageHeader title="Code PIN" />
        <LoadingSpinner text="Chargement..." />
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <PageHeader title={pinExist ? "Modifier le PIN" : "Créer un PIN"} />

      <div style={styles.content}>
        {/* ===== ICÔNE PRINCIPALE ===== */}
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Shield size={40} color="#10b981" />
          </div>
          <h2 style={styles.title}>
            {pinExist ? "Modifier votre code PIN" : "Créer votre code PIN"}
          </h2>
          <p style={styles.subtitle}>
            Le PIN protège vos retraits et investissements
          </p>
        </div>

        {/* ===== INDICATEUR D'ÉTAPES ===== */}
        <div style={styles.stepsRow}>
          {pinExist && <StepDot active={step >= 1} done={step > 1} label="1" />}
          <StepDot active={step >= 2} done={step > 2} label={pinExist ? "2" : "1"} />
          <StepDot active={step >= 3} done={false} label={pinExist ? "3" : "2"} />
        </div>

        {/* ===== ÉTAPE 1 : Ancien PIN ===== */}
        {step === 1 && pinExist && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>
              <KeyRound size={18} color="#f59e0b" /> Ancien code PIN
            </h3>
            <p style={styles.stepHint}>
              Entrez votre PIN actuel pour confirmer votre identité
            </p>
            <PinInput value={ancienPin} onChange={setAncienPin} length={6} />
            <Button onClick={handleNext}>Continuer</Button>
          </div>
        )}

        {/* ===== ÉTAPE 2 : Nouveau PIN ===== */}
        {step === 2 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>
              <KeyRound size={18} color="#10b981" />{" "}
              {pinExist ? "Nouveau code PIN" : "Choisir votre code PIN"}
            </h3>
            <p style={styles.stepHint}>Choisissez 6 chiffres faciles à retenir</p>
            <PinInput value={nouveauPin} onChange={setNouveauPin} length={6} />
            <Button onClick={handleNext}>Continuer</Button>
          </div>
        )}

        {/* ===== ÉTAPE 3 : Confirmation ===== */}
        {step === 3 && (
          <div style={styles.stepBox}>
            <h3 style={styles.stepTitle}>
              <CheckCircle2 size={18} color="#10b981" /> Confirmer le PIN
            </h3>
            <p style={styles.stepHint}>Retapez le même PIN pour confirmer</p>
            <PinInput value={confirmerPin} onChange={setConfirmerPin} length={6} />
            <Button onClick={handleSubmit} loading={loading}>
              {pinExist ? "Modifier le PIN" : "Créer le PIN"}
            </Button>
          </div>
        )}

        {/* ===== INFOS SÉCURITÉ ===== */}
        <div style={styles.infoBox}>
          <AlertCircle size={16} color="#f59e0b" />
          <div>
            <p style={styles.infoTitle}>⚠️ Conseils de sécurité</p>
            <ul style={styles.infoList}>
              <li>Ne partagez jamais votre PIN</li>
              <li>Évitez les codes faciles (123456, 000000)</li>
              <li>N'utilisez pas votre date de naissance</li>
              <li>En cas d'oubli, contactez le support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const StepDot = ({ active, done, label }) => (
  <div
    style={{
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.85rem",
      fontWeight: 800,
      backgroundColor: done
        ? "#10b981"
        : active
        ? "rgba(16,185,129,0.2)"
        : "rgba(107,114,128,0.15)",
      color: done ? "#0a0f0d" : active ? "#10b981" : "#6b7280",
      border: `2px solid ${
        done ? "#10b981" : active ? "rgba(16,185,129,0.4)" : "transparent"
      }`,
      transition: "all 0.3s",
    }}
  >
    {done ? "✓" : label}
  </div>
)

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
    width: "80px",
    height: "80px",
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
  stepsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  stepBox: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "18px",
    padding: "24px 20px",
    marginBottom: "16px",
  },
  stepTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  stepHint: {
    fontSize: "0.8rem",
    color: "#86efac",
    marginBottom: "10px",
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

export default CodePin