// 3 versions de logo KREON
// Usage : <LogoKreon variant="A" size={200} />

const LogoKreon = ({ variant = "A", size = 200, showSubtitle = false }) => {
  // ===== VARIANT A : Minimaliste Tech =====
  if (variant === "A") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 120"
        width={size}
        height={size * 0.3}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glowA" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Crochets décoratifs */}
        <path
          d="M 10 30 L 10 10 L 30 10"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 10 90 L 10 110 L 30 110"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 390 30 L 390 10 L 370 10"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 390 90 L 390 110 L 370 110"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Texte KREON */}
        <text
          x="200"
          y="78"
          textAnchor="middle"
          fontFamily="'Arial Black', sans-serif"
          fontSize="68"
          fontWeight="900"
          fill="url(#gradA)"
          filter="url(#glowA)"
          letterSpacing="6"
        >
          KREON
        </text>

        {/* Points décoratifs */}
        <circle cx="50" cy="60" r="3" fill="#10b981" opacity="0.6" />
        <circle cx="350" cy="60" r="3" fill="#f59e0b" opacity="0.6" />
      </svg>
    )
  }

  // ===== VARIANT B : Premium avec diamant =====
  if (variant === "B") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 140"
        width={size}
        height={size * 0.35}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="gradB" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="diamondB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glowB">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Diamant arrière-plan */}
        <polygon
          points="200,15 350,70 200,125 50,70"
          fill="url(#diamondB)"
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Ligne intérieure */}
        <polygon
          points="200,30 320,70 200,110 80,70"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Texte KREON */}
        <text
          x="200"
          y="88"
          textAnchor="middle"
          fontFamily="'Arial Black', sans-serif"
          fontSize="48"
          fontWeight="900"
          fill="url(#gradB)"
          filter="url(#glowB)"
          letterSpacing="4"
        >
          KREON
        </text>

        {showSubtitle && (
          <text
            x="200"
            y="108"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="9"
            fontWeight="600"
            fill="#86efac"
            letterSpacing="3"
          >
            INVESTIS • GÉNÈRE • PROSPÈRE
          </text>
        )}
      </svg>
    )
  }

  // ===== VARIANT C : Cyber/Matrix avec barres montantes =====
  if (variant === "C") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 140"
        width={size}
        height={size * 0.35}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="gradC" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="barsC" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glowC">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Barres de graphique ascendantes (gauche) */}
        <rect x="20" y="80" width="8" height="20" fill="url(#barsC)" rx="2" opacity="0.7" />
        <rect x="32" y="68" width="8" height="32" fill="url(#barsC)" rx="2" opacity="0.85" />
        <rect x="44" y="55" width="8" height="45" fill="url(#barsC)" rx="2" />

        {/* Flèche montante */}
        <path
          d="M 56 55 L 70 35 L 78 43 L 70 51 Z"
          fill="#f59e0b"
          opacity="0.9"
        />

        {/* Texte KREON */}
        <text
          x="200"
          y="78"
          textAnchor="middle"
          fontFamily="'Courier New', monospace"
          fontSize="56"
          fontWeight="900"
          fill="url(#gradC)"
          filter="url(#glowC)"
          letterSpacing="8"
        >
          KREON
        </text>

        {/* Ligne horizontale (effet matrix) */}
        <line
          x1="100"
          y1="98"
          x2="300"
          y2="98"
          stroke="#10b981"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="3,3"
        />

        {/* Barres de graphique (droite, miroir) */}
        <rect x="348" y="55" width="8" height="45" fill="url(#barsC)" rx="2" />
        <rect x="360" y="68" width="8" height="32" fill="url(#barsC)" rx="2" opacity="0.85" />
        <rect x="372" y="80" width="8" height="20" fill="url(#barsC)" rx="2" opacity="0.7" />

        {/* Petits points décoratifs */}
        <circle cx="115" cy="110" r="2" fill="#10b981" />
        <circle cx="200" cy="115" r="2" fill="#f59e0b" />
        <circle cx="285" cy="110" r="2" fill="#10b981" />

        {showSubtitle && (
          <text
            x="200"
            y="128"
            textAnchor="middle"
            fontFamily="'Courier New', monospace"
            fontSize="8"
            fontWeight="600"
            fill="#86efac"
            letterSpacing="3"
          >
            &lt;/&gt; INVESTIS • GÉNÈRE • PROSPÈRE &lt;/&gt;
          </text>
        )}
      </svg>
    )
  }

  return null
}

export default LogoKreon