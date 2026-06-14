import api from "./api"

export const getAllNews = async (categorie = null) => {
  const params = categorie ? { categorie } : {}
  const { data } = await api.get("/news", { params })
  return data
}

export const getNewsById = async (id) => {
  const { data } = await api.get(`/news/${id}`)
  return data
}