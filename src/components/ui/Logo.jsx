// Composant Logo KREON (variant C - Cyber/Matrix)
// Tailles disponibles : small | medium | large
const Logo = ({ size = "medium", showSlogan = true }) => {
  // Configuration des tailles
  const sizes = {
    small: { width: 130, height: 45 },
    medium: { width: 200, height: 70 },
    large: { width: 280, height: 100 },
  }

  const dimensions = sizes[size] || sizes.medium

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 140"
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: "block", margin: "0 auto" }}
      >
        <defs>
          <linearGradient id="kreonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="kreonBars" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="kreonGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Barres de graphique ascendantes (gauche) */}
        <rect x="20" y="80" width="8" height="20" fill="url(#kreonBars)" rx="2" opacity="0.7" />
        <rect x="32" y="68" width="8" height="32" fill="url(#kreonBars)" rx="2" opacity="0.85" />
        <rect x="44" y="55" width="8" height="45" fill="url(#kreonBars)" rx="2" />

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
          fill="url(#kreonGrad)"
          filter="url(#kreonGlow)"
          letterSpacing="8"
        >
          KREON
        </text>

        {/* Ligne horizontale matrix */}
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
        <rect x="348" y="55" width="8" height="45" fill="url(#kreonBars)" rx="2" />
        <rect x="360" y="68" width="8" height="32" fill="url(#kreonBars)" rx="2" opacity="0.85" />
        <rect x="372" y="80" width="8" height="20" fill="url(#kreonBars)" rx="2" opacity="0.7" />

        {/* Points décoratifs */}
        <circle cx="115" cy="110" r="2" fill="#10b981" />
        <circle cx="200" cy="115" r="2" fill="#f59e0b" />
        <circle cx="285" cy="110" r="2" fill="#10b981" />

        {/* Slogan optionnel */}
        {showSlogan && (
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
    </div>
  )
}

export default Logo