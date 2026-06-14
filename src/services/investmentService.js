import api from "./api"

// ===== INVESTIR DANS UN PRODUIT =====
// body : { productId, montant, pin }
export const investir = async (productId, montant, pin) => {
  const { data } = await api.post("/investments", { productId, montant, pin })
  return data
}

// ===== MES INVESTISSEMENTS =====
export const getMesInvestissements = async () => {
  const { data } = await api.get("/investments")
  return data
}

// ===== DÉTAIL D'UN INVESTISSEMENT =====
export const getInvestmentById = async (id) => {
  const { data } = await api.get(`/investments/${id}`)
  return data
}