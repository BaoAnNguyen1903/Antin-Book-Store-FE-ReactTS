import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import AppFooter from "./components/layout/app.footer"


const Layout = () => {
  return (
    <div>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  )
}

export default Layout
