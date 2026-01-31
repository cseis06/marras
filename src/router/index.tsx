import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Clients from "../pages/clients/Clients";
import DishCategories from "../pages/platos/DishCategories";
import Error404 from '../pages/error/Error404';
import CreateOrder from "../pages/orders/CreateOrder";

export const router = createBrowserRouter([
  // No Sidebar
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
    ],
    // errorElement: <Error404 />
  },

  // con Sidebar
  {
    element: <MainLayout />,
    children: [
      { path: "/*", element: <Error404 /> },
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Home /> },

      { path: "/clients", element: <Clients /> },
      
      { path: "/dishes/dish-categories", element: <DishCategories /> },
      
      { path: "/orders/create-order", element: <CreateOrder /> },
    ],
    // errorElement: <Error404 />
  },
]);

export default router;