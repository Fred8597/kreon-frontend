import LogoKreon from "../components/ui/LogoKreon"

const LogoPreview = () => {
  const variants = [
    { id: "A", name: "Variant A — Minimaliste Tech", description: "Crochets + dégradé tricolore + glow" },
    { id: "B", name: "Variant B — Premium Diamant", description: "Diamant 3D + dégradé vert + élégant" },
    { id: "C", name: "Variant C — Cyber Matrix", description: "Barres graphique + monospace + flèche montante" },
  ]

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🎨 Logos KREON — Prévisualisation</h1>
      <p style={styles.subtitle}>Choisis ton favori</p>

      <div style={styles.grid}>
        {variants.map((v) => (
          <div key={v.id} style={styles.card}>
            <h2 style={styles.cardTitle}>{v.name}</h2>
            <p style={styles.cardDesc}>{v.description}</p>

            {/* Logo sur fond sombre */}
            <div style={styles.preview}>
              <LogoKreon variant={v.id} size={300} showSubtitle />
            </div>

            {/* Logo en petit (header style) */}
            <div style={styles.previewSmall}>
              <p style={styles.previewLabel}>Petit (header) :</p>
              <LogoKreon variant={v.id} size={150} />
            </div>

            {/* Code à utiliser */}
            <div style={styles.codeBox}>
              <p style={styles.codeLabel}>Code à copier :</p>
              <code style={styles.code}>
                {`<LogoKreon variant="${v.id}" size={200} />`}
              </code>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.exportBox}>
        <h3 style={styles.exportTitle}>📥 Comment exporter en PNG/SVG ?</h3>
        <ol style={styles.exportList}>
          <li>Une fois ton logo choisi, ouvre la console du navigateur (F12)</li>
          <li>Clique droit sur le SVG → "Inspecter"</li>
          <li>Clic droit sur l'élément <code>&lt;svg&gt;</code> → "Copy" → "Copy outerHTML"</li>
          <li>Va sur <strong>https://www.svgviewer.dev/svg-to-png</strong></li>
          <li>Colle ton SVG → choisis la résolution → télécharge en PNG</li>
        </ol>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    padding: "40px 20px",
    color: "#f0fdf4",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 900,
    textAlign: "center",
    background: "linear-gradient(135deg, #10b981, #f59e0b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#86efac",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gap: "30px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "rgba(17,26,20,0.7)",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "20px",
    padding: "30px",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#10b981",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginBottom: "20px",
  },
  preview: {
    backgroundColor: "#0a0f0d",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "14px",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "16px",
    minHeight: "150px",
  },
  previewSmall: {
    backgroundColor: "rgba(10,15,13,0.6)",
    border: "1px solid rgba(16,185,129,0.1)",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  previewLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  codeBox: {
    padding: "12px 14px",
    backgroundColor: "rgba(16,185,129,0.05)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "10px",
  },
  codeLabel: {
    fontSize: "0.72rem",
    color: "#86efac",
    marginBottom: "6px",
  },
  code: {
    fontFamily: "monospace",
    fontSize: "0.82rem",
    color: "#10b981",
    background: "rgba(10,15,13,0.5)",
    padding: "6px 10px",
    borderRadius: "6px",
    display: "block",
  },
  exportBox: {
    maxWidth: "900px",
    margin: "40px auto 0",
    padding: "20px",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "14px",
  },
  exportTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f59e0b",
    marginBottom: "12px",
  },
  exportList: {
    paddingLeft: "20px",
    fontSize: "0.85rem",
    color: "#cbd5e1",
    lineHeight: 1.8,
  },
}

export default LogoPreview