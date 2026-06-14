import api from "./api"

// ===== SOLDE =====
export const getSolde = async () => {
  const { data } = await api.get("/wallet/solde")
  return data
}

// ===== STATS COMPLÈTES (pour profil) =====
export const getStats = async () => {
  const { data } = await api.get("/wallet/stats")
  return data
}

// ===== RECHARGES =====
export const demanderRecharge = async (formData) => {
  const { data } = await api.post("/wallet/recharge", formData)
  return data
}

export const getMesRecharges = async () => {
  const { data } = await api.get("/wallet/recharges")
  return data
}

// ===== RETRAITS =====
export const demanderRetrait = async (formData) => {
  const { data } = await api.post("/wallet/withdrawal", formData)
  return data
}

export const getMesRetraits = async () => {
  const { data } = await api.get("/wallet/withdrawals")
  return data
}

// ===== TRANSACTIONS =====
export const getMesTransactions = async () => {
  const { data } = await api.get("/wallet/transactions")
  return data
}