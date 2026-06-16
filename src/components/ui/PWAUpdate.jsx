import { useEffect, useState } from "react"
import { useRegisterSW } from "virtual:pwa-register/react"
import { RefreshCw, X } from "lucide-react"

const PWAUpdate = () => {
  const [showUpdate, setShowUpdate] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check updates toutes les heures
      r &&
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    if (needRefresh) setShowUpdate(true)
  }, [needRefresh])

  const handleUpdate = () => updateServiceWorker(true)

  const handleDismiss = () => {
    setShowUpdate(false)
    setNeedRefresh(false)
  }

  if (!showUpdate) return null

  return (
    <>
      <style>
        {`
          @keyframes slideDownPWA {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.banner}>
        <RefreshCw size={20} color="#f59e0b" />
        <div style={styles.content}>
          <p style={styles.title}>🎉 Nouvelle version disponible !</p>
          <p style={styles.subtitle}>Rechargez pour profiter des nouveautés</p>
        </div>
        <div style={styles.actions}>
          <button onClick={handleUpdate} style={styles.updateBtn}>
            Mettre à jour
          </button>
          <button onClick={handleDismiss} style={styles.dismissBtn}>
            <X size={14} color="#fbbf24" />
          </button>
        </div>
      </div>
    </>
  )
}

const styles = {
  banner: {
    position: "fixed",
    top: "16px",
    left: "16px",
    right: "16px",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "12px 14px",
    background:
      "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(10,15,13,0.95))",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(245,158,11,0.4)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(245,158,11,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 9999,
    animation: "slideDownPWA 0.5s ease-out",
  },
  content: { flex: 1, minWidth: 0 },
  title: { fontSize: "0.82rem", fontWeight: 700, color: "#f0fdf4", marginBottom: "2px" },
  subtitle: { fontSize: "0.68rem", color: "#fbbf24" },
  actions: { display: "flex", gap: "6px", flexShrink: 0 },
  updateBtn: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "none",
    borderRadius: "8px",
    color: "#0a0f0d",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  dismissBtn: {
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    backgroundColor: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}

export default PWAUpdate