import api from "./api"

export const getMonEquipe = async () => {
  const { data } = await api.get("/auth/mon-equipe")
  return data
}