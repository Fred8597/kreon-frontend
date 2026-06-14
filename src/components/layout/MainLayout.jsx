import { Outlet } from "react-router-dom"
import BottomNav from "./BottomNav"

const MainLayout = () => {
  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0a0f0d",
    color: "#f0fdf4",
    position: "relative",
  },
  main: {
    paddingBottom: "90px", // espace pour BottomNav
    minHeight: "100vh",
  },
}

export default MainLayout