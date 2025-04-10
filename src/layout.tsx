import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useState } from "react";

function Layout() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div>
      <AppHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
    </div>
  );
}

export default Layout;
