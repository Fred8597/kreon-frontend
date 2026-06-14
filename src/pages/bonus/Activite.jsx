import { Activity } from "lucide-react"
import PlaceholderPage from "../../components/ui/PlaceholderPage"

const Activite = () => (
  <PlaceholderPage
    title="Centre d'activités"
    icon={Activity}
    color="#06b6d4"
    description="Toutes les activités et événements spéciaux de KREON regroupés en un seul endroit."
    features={[
      "Roue de la fortune quotidienne",
      "Coffre au trésor (récompenses)",
      "Pointage journalier",
      "Codes cadeaux exclusifs",
      "Événements spéciaux (concours, etc.)",
      "Promotions temporaires",
    ]}
  />
)

export default Activite