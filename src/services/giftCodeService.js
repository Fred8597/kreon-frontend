import api from "./api"

// Réclamer un code cadeau (user)
export const reclamerGiftCode = async (code) => {
  const { data } = await api.post("/giftcodes/reclamer", { code })
  return data
}