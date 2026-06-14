import api from "./api"

export const getStatutVIP = async () => {
  const { data } = await api.get("/vip/statut")
  return data
}

export const upgradeVIP = async () => {
  const { data } = await api.post("/vip/upgrade")
  return data
}

export const getHistoriqueSalaire = async () => {
  const { data } = await api.get("/vip/historique-salaire")
  return data
}