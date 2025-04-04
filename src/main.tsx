import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from '@/layout';
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import "styles/glocal.scss";
import HomePage from './pages/client/home';

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
        path: "/book",
        element: <BookPage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
