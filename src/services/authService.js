import api from "./api"

// ===== PROFIL =====
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile")
  return data
}

export const updateProfile = async (formData) => {
  const { data } = await api.put("/auth/profile", formData)
  return data
}

// ===== CODE PIN =====
export const definirPin = async (pin) => {
  const { data } = await api.post("/auth/pin", { pin })
  return data
}

export const modifierPin = async (ancienPin, nouveauPin) => {
  const { data } = await api.put("/auth/pin", { ancienPin, nouveauPin })
  return data
}

export const verifierPin = async (pin) => {
  const { data } = await api.post("/auth/pin/verifier", { pin })
  return data
}

export const getStatutPin = async () => {
  const { data } = await api.get("/auth/pin/statut")
  return data // { pinDefini: true/false }
}

// ===== MOBILE MONEY =====
export const getMobileMoney = async () => {
  const { data } = await api.get("/auth/mobile-money")
  return data
}

export const updateMobileMoney = async (numeroMobileMoney, operateurMobileMoney) => {
  const { data } = await api.put("/auth/mobile-money", {
    numeroMobileMoney,
    operateurMobileMoney,
  })
  return data
}