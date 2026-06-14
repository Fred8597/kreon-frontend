import { useNavigate } from "react-router-dom"
import { ArrowLeft, History } from "lucide-react"

const PageHeader = ({ title, onHistoryClick, showHistory = false }) => {
  const navigate = useNavigate()

  return (
    <header style={styles.header}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={20} color="#86efac" />
      </button>
      <h1 style={styles.title}>{title}</h1>
      {showHistory ? (
        <button onClick={onHistoryClick} style={styles.actionBtn}>
          <History size={20} color="#86efac" />
        </button>
      ) : (
        <div style={{ width: "36px" }} />
      )}
    </header>
  )
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "rgba(10,15,13,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#f0fdf4",
  },
  actionBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}

export default PageHeader