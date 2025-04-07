import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"
import { useEffect } from "react"
import { fetchAccountAPI } from "services/api"
import { useCurrentApp } from "components/context/app.context"
import PacmanLoader from "react-spinners/PacmanLoader"


const Layout = () => {
  const {setUser, isAppLoading, setIsAppLoading, setIsAuthenticated} = useCurrentApp()

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user)
        setIsAuthenticated(true)
      }
      setIsAppLoading(false)
    }

    fetchAccount();
  }, []) // [] là gọi 1 lần. useEffect là render giao diện rr mới chạy vào
  return (
    <>
      {isAppLoading === false ? (
        <div>
          <AppHeader />
          <Outlet />
          <AppFooter />
        </div>
      ) : (
        // src nằm giữa màn hình
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <PacmanLoader size={30} color="#36d6b4"/>
        </div>
      )}
    </>
  )
}

export default Layout
