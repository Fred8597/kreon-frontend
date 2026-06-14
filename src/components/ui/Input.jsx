import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const Input = ({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  prefix,
  maxLength,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(10,15,13,0.6)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "14px",
        transition: "all 0.3s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(16,185,129,0.6)"
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {/* Icône à gauche */}
      {Icon && (
        <div
          style={{
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <Icon size={18} color="#10b981" />
        </div>
      )}

      {/* Préfixe (ex: +237) */}
      {prefix && (
        <div
          style={{
            paddingLeft: Icon ? "10px" : "16px",
            color: "#86efac",
            fontSize: "0.9rem",
            fontWeight: 600,
            borderRight: "1px solid rgba(16,185,129,0.15)",
            paddingRight: "10px",
            marginRight: "4px",
          }}
        >
          {prefix}
        </div>
      )}

      {/* Input */}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        autoComplete={autoComplete}
        style={{
          flex: 1,
          padding: "16px",
          paddingLeft: Icon || prefix ? "8px" : "16px",
          paddingRight: isPassword ? "48px" : "16px",
          background: "transparent",
          border: "none",
          color: "#f0fdf4",
          fontSize: "0.95rem",
          outline: "none",
        }}
      />

      {/* Œil pour password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "14px",
            background: "none",
            border: "none",
            color: "#86efac",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}

export default Input