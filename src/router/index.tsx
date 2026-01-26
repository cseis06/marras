import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Clients from "../pages/clients/Clients";

export const router = createBrowserRouter([
  // No Sidebar
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
    ],
  },

  // con Sidebar
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Home /> },
      { path: "/clients", element: <Clients /> },
    ],
  },
]);

export default router;