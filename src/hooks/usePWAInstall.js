import { useState, useEffect } from "react"

// Hook pour gérer l'installation PWA depuis n'importe où
let globalDeferredPrompt = null
const subscribers = new Set()

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    globalDeferredPrompt = e
    subscribers.forEach((cb) => cb(true))
  })

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null
    subscribers.forEach((cb) => cb(false))
  })
}

export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(!!globalDeferredPrompt)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Vérifier si déjà installé (mode standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Subscribe aux changements
    const subscriber = (available) => setCanInstall(available)
    subscribers.add(subscriber)

    return () => subscribers.delete(subscriber)
  }, [])

  const promptInstall = async () => {
    if (!globalDeferredPrompt) {
      return { success: false, reason: "not-available" }
    }

    globalDeferredPrompt.prompt()
    const { outcome } = await globalDeferredPrompt.userChoice

    if (outcome === "accepted") {
      globalDeferredPrompt = null
      subscribers.forEach((cb) => cb(false))
      return { success: true }
    }

    return { success: false, reason: "dismissed" }
  }

  return { canInstall, isInstalled, promptInstall }
}