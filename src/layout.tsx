import { Outlet } from "react-router-dom";
import AppFooter from "components/layout/app.footer";
import AppHeader from "components/layout/app.header";

const Layout = () => {
  return (
    <div>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  );
};

export default Layout;
