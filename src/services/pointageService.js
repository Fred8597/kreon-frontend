import api from "./api"

// Statut du pointage du jour
export const getStatutPointage = async () => {
  const { data } = await api.get("/pointage/statut")
  return data
}

// Effectuer le pointage
export const faireCheckin = async () => {
  const { data } = await api.post("/pointage")
  return data
}

// Historique des pointages
export const getHistoriquePointage = async () => {
  const { data } = await api.get("/pointage/historique")
  return data
}