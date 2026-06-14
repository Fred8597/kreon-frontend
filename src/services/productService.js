import api from "./api"

// ===== RÉCUPÉRER TOUS LES PRODUITS =====
export const getProduits = async (categorie = null) => {
  const params = categorie ? { categorie } : {}
  const { data } = await api.get("/products", { params })
  return data
}

// ===== RÉCUPÉRER UN PRODUIT PAR ID =====
export const getProduitById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// ===== CALCULS =====
export const calculerTotal = (prix, montantRetour) => {
  return (prix || 0) + (montantRetour || 0)
}

export const calculerRendement = (prix, montantRetour) => {
  if (!prix || prix === 0) return 0
  return Math.round((montantRetour / prix) * 100)
}