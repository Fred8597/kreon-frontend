import api from "./api"

// ===== LISTE =====
export const getMesNotifications = async (filtre = null) => {
  const params = filtre ? { filtre } : {}
  const { data } = await api.get("/notifications", { params })
  return data
}

// ===== COMPTEUR =====
export const getCompteurNonLues = async () => {
  const { data } = await api.get("/notifications/compteur")
  return data
}

// ===== MARQUER LUE =====
export const marquerLue = async (id) => {
  const { data } = await api.put(`/notifications/${id}/lue`)
  return data
}

// ===== MARQUER TOUTES LUES =====
export const marquerToutesLues = async () => {
  const { data } = await api.put("/notifications/lues")
  return data
}

// ===== SUPPRIMER UNE =====
export const supprimerNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`)
  return data
}

// ===== SUPPRIMER TOUTES LUES =====
export const supprimerToutesLues = async () => {
  const { data } = await api.delete("/notifications/lues")
  return data
}