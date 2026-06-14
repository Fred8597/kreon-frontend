import { useRef, useState, useEffect } from "react"

const PinInput = ({ value, onChange, length = 6, autoFocus = true }) => {
  const inputsRef = useRef([])
  const [digits, setDigits] = useState(Array(length).fill(""))

  // Sync depuis le parent (si on reset)
  useEffect(() => {
    if (!value) {
      setDigits(Array(length).fill(""))
    }
  }, [value, length])

  // Auto-focus première case
  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      setTimeout(() => inputsRef.current[0]?.focus(), 100)
    }
  }, [autoFocus])

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "") // que des chiffres

    if (val.length > 1) {
      // Coller un PIN entier
      const pasted = val.slice(0, length).split("")
      const newDigits = [...digits]
      pasted.forEach((d, i) => {
        if (i < length) newDigits[i] = d
      })
      setDigits(newDigits)
      onChange(newDigits.join(""))
      // Focus dernière case remplie
      const lastIndex = Math.min(pasted.length, length - 1)
      inputsRef.current[lastIndex]?.focus()
      return
    }

    const newDigits = [...digits]
    newDigits[index] = val
    setDigits(newDigits)
    onChange(newDigits.join(""))

    // Auto-focus case suivante
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div style={styles.container}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          style={{
            ...styles.input,
            ...(digit ? styles.inputFilled : {}),
          }}
        />
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px 0",
  },
  input: {
    width: "44px",
    height: "54px",
    borderRadius: "12px",
    backgroundColor: "rgba(10,15,13,0.6)",
    border: "1px solid rgba(16,185,129,0.2)",
    textAlign: "center",
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#10b981",
    outline: "none",
    transition: "all 0.3s",
  },
  inputFilled: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderColor: "rgba(16,185,129,0.5)",
    boxShadow: "0 0 12px rgba(16,185,129,0.3)",
  },
}

export default PinInput