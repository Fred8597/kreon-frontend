import api from "./api"

export const getStatutTirage = async () => {
  const { data } = await api.get("/tirage/statut")
  return data
}

export const tournerRoue = async () => {
  const { data } = await api.post("/tirage/tourner")
  return data
}