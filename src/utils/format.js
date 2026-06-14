// ===== FORMAT MONTANT XAF =====
// 100000 → "100 000 XAF"
export const formatXAF = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 XAF'
  return Number(amount).toLocaleString('fr-FR').replace(/,/g, ' ') + ' XAF'
}

// ===== FORMAT NUMBER (sans suffixe) =====
// 100000 → "100 000"
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0'
  return Number(amount).toLocaleString('fr-FR').replace(/,/g, ' ')
}

// ===== FORMAT DATE LONGUE =====
// 2026-06-12 → "12 juin 2026"
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// ===== FORMAT DATE + HEURE =====
// 2026-06-12 10:35 → "12/06/2026 10:35"
export const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ===== "IL Y A X TEMPS" =====
export const timeAgo = (date) => {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return "à l'instant"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return formatDate(date)
}

// ===== MASQUER NUMÉRO DE TÉLÉPHONE =====
// 672599783 → "****99783"
export const maskPhone = (phone) => {
  if (!phone) return ''
  const str = phone.toString()
  if (str.length <= 5) return str
  return '****' + str.slice(-5)
}

// ===== MASQUER EMAIL =====
// marie@test.com → "m***@test.com"
export const maskEmail = (email) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  return name[0] + '***@' + domain
}