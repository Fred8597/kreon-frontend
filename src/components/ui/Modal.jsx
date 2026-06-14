import { X } from "lucide-react"

const Modal = ({ isOpen, onClose, title, children, showClose = true }) => {
  if (!isOpen) return null

  return (
    <>
      <style>
        {`
          @keyframes modalSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose}>
        {/* Container (stoppe la propagation) */}
        <div style={styles.container} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          {(title || showClose) && (
            <div style={styles.header}>
              {title && <h2 style={styles.title}>{title}</h2>}
              {showClose && (
                <button onClick={onClose} style={styles.closeBtn}>
                  <X size={20} color="#86efac" />
                </button>
              )}
            </div>
          )}

          {/* Contenu */}
          <div style={styles.body}>{children}</div>
        </div>
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: "0",
    animation: "modalFadeIn 0.3s ease-out",
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#111a14",
    border: "1px solid rgba(16,185,129,0.25)",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    maxHeight: "90vh",
    overflowY: "auto",
    animation: "modalSlideUp 0.3s ease-out",
    boxShadow: "0 -10px 60px rgba(16,185,129,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 20px 12px",
    borderBottom: "1px solid rgba(16,185,129,0.08)",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#f0fdf4",
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.08)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  body: {
    padding: "20px",
  },
}

export default Modal