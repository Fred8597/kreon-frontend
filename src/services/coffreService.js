import api from "./api"

export const getStatutCoffre = async () => {
  const { data } = await api.get("/coffre/statut")
  return data
}

export const getHistoriqueCoffres = async () => {
  const { data } = await api.get("/coffre/historique")
  return data
}