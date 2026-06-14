const LoadingSpinner = ({ size = "medium", text = "Chargement..." }) => {
  const sizes = {
    small: { width: "24px", height: "24px", border: "2px" },
    medium: { width: "40px", height: "40px", border: "3px" },
    large: { width: "60px", height: "60px", border: "4px" },
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.container}>
        <div
          style={{
            width: sizes[size].width,
            height: sizes[size].height,
            border: `${sizes[size].border} solid rgba(16,185,129,0.15)`,
            borderTopColor: "#10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        {text && <p style={styles.text}>{text}</p>}
      </div>
    </>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "40px 20px",
  },
  text: {
    color: "#86efac",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
}

export default LoadingSpinner