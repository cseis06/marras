import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Clients from "../pages/clients/Clients";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/clients",
    element: <Clients />,
  },
]);