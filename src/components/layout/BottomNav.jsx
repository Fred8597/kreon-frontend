import { NavLink } from "react-router-dom"
import { Home, Newspaper, Users, Share2, User } from "lucide-react"

const BottomNav = () => {
  const items = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/actualites", label: "Actualités", icon: Newspaper },
    { path: "/equipe", label: "Équipe", icon: Users },
    { path: "/partager", label: "Partager", icon: Share2 },
    { path: "/profil", label: "Profil", icon: User },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                ...styles.item,
                color: isActive ? "#10b981" : "#6b7280",
              })}
            >
              {({ isActive }) => (
                <>
                  <div
                    style={{
                      ...styles.iconWrapper,
                      ...(isActive && styles.iconActive),
                    }}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span
                    style={{
                      ...styles.label,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </span>
                  {isActive && <div style={styles.activeDot} />}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "rgba(10,15,13,0.92)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(16,185,129,0.15)",
    boxShadow: "0 -4px 30px rgba(0,0,0,0.5)",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    padding: "10px 0 14px",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    textDecoration: "none",
    position: "relative",
    transition: "all 0.3s",
    padding: "4px 0",
  },
  iconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
  },
  iconActive: {
    backgroundColor: "rgba(16,185,129,0.12)",
    boxShadow: "0 0 12px rgba(16,185,129,0.2)",
  },
  label: {
    fontSize: "0.68rem",
    letterSpacing: "0.02em",
    transition: "all 0.3s",
  },
  activeDot: {
    position: "absolute",
    top: "-1px",
    width: "20px",
    height: "3px",
    backgroundColor: "#10b981",
    borderRadius: "0 0 6px 6px",
    boxShadow: "0 0 10px rgba(16,185,129,0.8)",
  },
}

export default BottomNav
