const Logo = ({ size = "large", showSlogan = true }) => {
  const sizes = {
    small: { fontSize: "1.4rem", letterSpacing: "0.08em" },
    medium: { fontSize: "2rem", letterSpacing: "0.1em" },
    large: { fontSize: "2.8rem", letterSpacing: "0.12em" },
  }

  const sloganSize = {
    small: "0.65rem",
    medium: "0.75rem",
    large: "0.85rem",
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1
        style={{
          ...sizes[size],
          fontWeight: 900,
          background: "linear-gradient(135deg, #10b981, #34d399, #f59e0b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: showSlogan ? "6px" : 0,
          filter: "drop-shadow(0 0 20px rgba(16,185,129,0.3))",
        }}
      >
        KREON
      </h1>
      {showSlogan && (
        <p
          style={{
            fontSize: sloganSize[size],
            color: "#86efac",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Investis • Génère • Prospère
        </p>
      )}
    </div>
  )
}

export default Logo