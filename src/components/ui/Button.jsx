const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}) => {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
    },
    secondary: {
      background: "transparent",
      color: "#10b981",
      border: "1px solid rgba(16,185,129,0.4)",
      boxShadow: "none",
    },
    ghost: {
      background: "rgba(16,185,129,0.08)",
      color: "#86efac",
      border: "1px solid rgba(16,185,129,0.2)",
    },
  }

  const baseStyle = {
    width: fullWidth ? "100%" : "auto",
    padding: "16px 24px",
    borderRadius: "14px",
    fontSize: "0.95rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    transition: "all 0.3s",
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    ...variants[variant],
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(16,185,129,0.45)"
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.3)"
        }
      }}
    >
      {loading ? "Chargement..." : children}
    </button>
  )
}

export default Button