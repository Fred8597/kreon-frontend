import { useState, useEffect } from "react"
import {
  Download,
  Smartphone,
  Apple,
  CheckCircle2,
  Sparkles,
  Zap,
  Bell,
  Wifi,
  Lock,
  Share2,
} from "lucide-react"
import toast from "react-hot-toast"
import PageHeader from "../../components/ui/PageHeader"
import Button from "../../components/ui/Button"
import { usePWAInstall } from "../../hooks/usePWAInstall"

const Telecharger = () => {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall()
  const [installing, setInstalling] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Détecter iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true)
      return
    }

    if (!canInstall) {
      toast(
        "L'installation n'est pas disponible. Essayez Chrome ou Edge sur mobile.",
        { icon: "ℹ️", duration: 5000 }
      )
      return
    }

    setInstalling(true)
    try {
      const result = await promptInstall()
      if (result.success) {
        toast.success("🎉 KREON installé avec succès !", { duration: 5000 })
      } else if (result.reason === "dismissed") {
        toast("Installation annulée", { icon: "ℹ️" })
      }
    } catch (error) {
      toast.error("Erreur lors de l'installation")
    } finally {
      setInstalling(false)
    }
  }

  return (
    <div style={styles.page}>
      <PageHeader title="Télécharger l'app" />

      <div style={styles.content}>
        {/* HEADER */}
        <div style={styles.iconHeader}>
          <div style={styles.iconWrapper}>
            <Download size={50} color="#10b981" />
          </div>
          <h2 style={styles.title}>Application KREON</h2>
          <p style={styles.subtitle}>
            Installez KREON sur votre écran d'accueil pour une expérience optimale
          </p>
        </div>

        {/* DÉJÀ INSTALLÉ */}
        {isInstalled && (
          <div style={styles.installedBox}>
            <CheckCircle2 size={32} color="#10b981" />
            <div>
              <p style={styles.installedTitle}>✅ App déjà installée !</p>
              <p style={styles.installedSub}>
                Vous utilisez actuellement la version installée de KREON
              </p>
            </div>
          </div>
        )}

        {/* BOUTON PRINCIPAL */}
        {!isInstalled && (
          <div style={styles.mainCTA}>
            <Button onClick={handleInstall} loading={installing}>
              <Download size={20} />
              {isIOS
                ? "Voir les instructions iOS"
                : canInstall
                ? "Installer KREON maintenant"
                : "Installation"}
            </Button>

            {!canInstall && !isIOS && (
              <p style={styles.installHint}>
                💡 Astuce : ouvrez ce site dans Chrome ou Edge sur mobile pour
                installer l'app
              </p>
            )}
          </div>
        )}

        {/* INSTRUCTIONS iOS */}
        {showIOSInstructions && (
          <div style={styles.iosBox}>
            <div style={styles.iosHeader}>
              <Apple size={20} color="#94a3b8" />
              <h3 style={styles.iosTitle}>Installation sur iPhone/iPad</h3>
            </div>
            <ol style={styles.iosSteps}>
              <li>
                Appuyez sur le bouton <Share2 size={14} style={{ verticalAlign: "middle" }} /> <strong>Partager</strong> en bas de Safari
              </li>
              <li>Faites défiler vers le bas</li>
              <li>
                Sélectionnez <strong>"Sur l'écran d'accueil"</strong>
              </li>
              <li>
                Appuyez sur <strong>"Ajouter"</strong> en haut à droite
              </li>
              <li>✅ L'icône KREON apparaîtra sur votre écran !</li>
            </ol>
          </div>
        )}

        {/* AVANTAGES */}
        <div style={styles.avantagesBox}>
          <h3 style={styles.avantagesTitle}>
            <Sparkles size={18} color="#f59e0b" /> Avantages de l'app
          </h3>

          <div style={styles.avantagesList}>
            <AvantageItem
              icon={<Zap size={20} color="#10b981" />}
              title="Démarrage instantané"
              desc="Lancez KREON en 1 clic depuis votre écran d'accueil"
            />
            <AvantageItem
              icon={<Bell size={20} color="#f59e0b" />}
              title="Notifications push"
              desc="Recevez les alertes même quand l'app est fermée"
            />
            <AvantageItem
              icon={<Wifi size={20} color="#06b6d4" />}
              title="Fonctionne hors ligne"
              desc="Consultez vos données même sans connexion"
            />
            <AvantageItem
              icon={<Lock size={20} color="#8b5cf6" />}
              title="Sécurisé"
              desc="Vos données sont chiffrées et protégées"
            />
          </div>
        </div>

        {/* INFOS PLATEFORMES */}
        <div style={styles.platformsBox}>
          <h3 style={styles.platformsTitle}>📱 Compatibilité</h3>

          <div style={styles.platformItem}>
            <Smartphone size={20} color="#34d399" />
            <div>
              <p style={styles.platformName}>Android</p>
              <p style={styles.platformDesc}>
                Chrome, Edge, Samsung Internet, Brave
              </p>
            </div>
            <span style={styles.platformStatus}>✅</span>
          </div>

          <div style={styles.platformItem}>
            <Apple size={20} color="#94a3b8" />
            <div>
              <p style={styles.platformName}>iOS (iPhone/iPad)</p>
              <p style={styles.platformDesc}>Safari uniquement</p>
            </div>
            <span style={styles.platformStatus}>✅</span>
          </div>

          <div style={styles.platformItem}>
            <Download size={20} color="#3b82f6" />
            <div>
              <p style={styles.platformName}>Ordinateur</p>
              <p style={styles.platformDesc}>
                Chrome, Edge, Brave (icône installation dans la barre URL)
              </p>
            </div>
            <span style={styles.platformStatus}>✅</span>
          </div>
        </div>

        {/* MISES À JOUR AUTO */}
        <div style={styles.updateBox}>
          <Sparkles size={18} color="#10b981" />
          <div>
            <p style={styles.updateTitle}>🔄 Mises à jour automatiques</p>
            <p style={styles.updateDesc}>
              L'app se met à jour automatiquement. Vous recevrez les nouvelles
              fonctionnalités dès qu'elles sont disponibles, sans rien
              télécharger !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const AvantageItem = ({ icon, title, desc }) => (
  <div style={styles.avantageItem}>
    <div style={styles.avantageIcon}>{icon}</div>
    <div>
      <p style={styles.avantageTitle}>{title}</p>
      <p style={styles.avantageDesc}>{desc}</p>
    </div>
  </div>
)

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0a0f0d", paddingBottom: "30px" },
  content: { padding: "20px" },
  iconHeader: { textAlign: "center", marginBottom: "24px" },
  iconWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "2px solid rgba(16,185,129,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 0 30px rgba(16,185,129,0.2)",
  },
  title: { fontSize: "1.3rem", fontWeight: 800, color: "#f0fdf4", marginBottom: "6px" },
  subtitle: { fontSize: "0.85rem", color: "#86efac", lineHeight: 1.5 },
  // INSTALLED
  installedBox: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    padding: "16px",
    background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.05))",
    border: "1px solid rgba(16,185,129,0.4)",
    borderRadius: "14px",
    marginBottom: "20px",
  },
  installedTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#10b981" },
  installedSub: { fontSize: "0.78rem", color: "#86efac", marginTop: "4px" },
  // CTA
  mainCTA: { marginBottom: "24px" },
  installHint: {
    marginTop: "12px",
    padding: "10px 12px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "10px",
    fontSize: "0.78rem",
    color: "#86efac",
    textAlign: "center",
  },
  // iOS
  iosBox: {
    padding: "16px",
    backgroundColor: "rgba(148,163,184,0.08)",
    border: "1px solid rgba(148,163,184,0.3)",
    borderRadius: "14px",
    marginBottom: "20px",
  },
  iosHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  iosTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#f0fdf4" },
  iosSteps: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "0.85rem",
    color: "#cbd5e1",
    lineHeight: 1.8,
  },
  // AVANTAGES
  avantagesBox: {
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  avantagesTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
  },
  avantagesList: { display: "flex", flexDirection: "column", gap: "12px" },
  avantageItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "12px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
  },
  avantageIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avantageTitle: { fontSize: "0.88rem", fontWeight: 700, color: "#f0fdf4" },
  avantageDesc: { fontSize: "0.72rem", color: "#94a3b8", marginTop: "3px", lineHeight: 1.5 },
  // PLATFORMS
  platformsBox: {
    padding: "16px",
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  platformsTitle: { fontSize: "1rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "12px" },
  platformItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "rgba(10,15,13,0.5)",
    borderRadius: "10px",
    marginBottom: "8px",
  },
  platformName: { fontSize: "0.88rem", fontWeight: 700, color: "#f0fdf4", flex: 1 },
  platformDesc: { fontSize: "0.72rem", color: "#86efac", marginTop: "2px" },
  platformStatus: { fontSize: "1.2rem" },
  // UPDATE BOX
  updateBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "14px",
    background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(245,158,11,0.04))",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "12px",
  },
  updateTitle: { fontSize: "0.88rem", fontWeight: 700, color: "#10b981", marginBottom: "4px" },
  updateDesc: { fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 },
}

export default Telecharger