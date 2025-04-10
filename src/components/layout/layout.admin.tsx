import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar } from "antd";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import type { MenuProps } from "antd";
import { logoutAPI } from "@/services/api";

type MenuItem = Required<MenuProps>["items"][number];

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const { user, setUser, setIsAuthenticated, isAuthenticated, setCarts } =
    useCurrentApp();

  const location = useLocation();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "/admin",
      icon: <AppstoreOutlined />
    },
    {
      label: <span>Manage Users</span>,
      key: "/admin/user",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "/admin/user",
          icon: <TeamOutlined />
        }
      ]
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "/admin/book",
      icon: <ExceptionOutlined />
    },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "/admin/order",
      icon: <DollarCircleOutlined />
    }
  ];

  useEffect(() => {
    const active: any =
      items.find((item) => location.pathname === (item!.key as any)) ??
      "/admin";
    setActiveMenu(active.key);
  }, [location]);

  const handleLogout = async () => {
    //todo
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setCarts([]);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("carts");
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account"
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home"
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout"
    }
  ];

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  if (isAuthenticated === false) {
    return <Outlet />;
  }

  const isAdminRoute = location.pathname.includes("admin");
  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role === "USER") {
      return <Outlet />;
    }
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            Admin
          </div>
          <Menu
            // defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout>
          <div
            className="admin-header"
            style={{
              height: "50px",
              borderBottom: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 15px"
            }}
          >
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed)
                }
              )}
            </span>
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={urlAvatar} />
                {user?.fullName}
              </Space>
            </Dropdown>
          </div>
          <Content style={{ padding: "15px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutAdmin;
