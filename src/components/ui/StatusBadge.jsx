const StatusBadge = ({ status }) => {
  const config = {
    EN_ATTENTE: {
      label: "En attente",
      bg: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      border: "rgba(245,158,11,0.4)",
    },
    VALIDEE: {
      label: "Validée",
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      border: "rgba(16,185,129,0.4)",
    },
    REFUSEE: {
      label: "Refusée",
      bg: "rgba(239,68,68,0.15)",
      color: "#ef4444",
      border: "rgba(239,68,68,0.4)",
    },
    PAYEE: {
      label: "Payée",
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      border: "rgba(16,185,129,0.4)",
    },
    ACTIF: {
      label: "Actif",
      bg: "rgba(59,130,246,0.15)",
      color: "#3b82f6",
      border: "rgba(59,130,246,0.4)",
    },
    TERMINE: {
      label: "Terminé",
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      border: "rgba(16,185,129,0.4)",
    },
    ANNULE: {
      label: "Annulé",
      bg: "rgba(107,114,128,0.15)",
      color: "#6b7280",
      border: "rgba(107,114,128,0.4)",
    },
    COMPLETEE: {
      label: "Complétée",
      bg: "rgba(16,185,129,0.15)",
      color: "#10b981",
      border: "rgba(16,185,129,0.4)",
    },
    ECHOUEE: {
      label: "Échouée",
      bg: "rgba(239,68,68,0.15)",
      color: "#ef4444",
      border: "rgba(239,68,68,0.4)",
    },
    ANNULEE: {
      label: "Annulée",
      bg: "rgba(107,114,128,0.15)",
      color: "#6b7280",
      border: "rgba(107,114,128,0.4)",
    },
  }

  const c = config[status] || config.EN_ATTENTE

  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.7rem",
        fontWeight: 700,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {c.label}
    </span>
  )
}

export default StatusBadge