import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layout";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import "styles/glocal.scss";
import HomePage from "pages/client/home";
import { App, ConfigProvider } from "antd";
import { AppProvider } from "components/context/app.context";
import ProtectedRoute from "components/auth";
import ManageOrderPage from "pages/admin/manage.order";
import ManageBookPage from "pages/admin/manage.book";
import DashBoardPage from "pages/admin/dashboard";
import ManageUserPage from "pages/admin/manage.user";
import enUS from "antd/locale/en_US";
import LayoutAdmin from "components/layout/layout.admin";
// import viVN from "antd/locale/vi_VN";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book/:id",
        element: <BookPage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
      {
        path: "/checkout", // thanh toan
        element: (
          <ProtectedRoute>
            <div>checkout page</div>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
