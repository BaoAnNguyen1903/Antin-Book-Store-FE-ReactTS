import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"
import { useEffect } from "react"
import { fetchAccountAPI } from "services/api"
import { useCurrentApp } from "components/context/app.context"


const Layout = () => {
  const {setUser, isAppLoading, setIsAppLoading} = useCurrentApp()

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user)
      }
      setIsAppLoading(false)
    }

    fetchAccount();
  }, []) // [] là gọi 1 lần. useEffect là render giao diện rr mới chạy vào
  return (
    <div>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  )
}

export default Layout
