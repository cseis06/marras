import {
  IconLayoutDashboard,
  IconSettings,
  IconBowlSpoon,
  IconUsers,
  IconBusinessplan,
  IconUsersGroup,
  IconChartPie,
  IconArrowRightFromArc,
  IconBoxSeam,
} from "@tabler/icons-react";
import { type ComponentType } from "react";

export interface SidebarSubItem {
  id: string;
  label: string;
  path: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: ComponentType<{ size?: number; stroke?: number; className?: string}>;
  expandable?: boolean;
  addButton?: boolean;
  subItems?: SidebarSubItem[];
}

export interface SidebarSection {
  id: string;
  items: SidebarItem[];
}

export interface SidebarData {
  title: string;
  sections: SidebarSection[];
}

export const sidebarData: SidebarData = {
  title: "Marra's",
  sections: [
    {
      id: "main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          path: "/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          id: "dishes",
          label: "Platos",
          path: "/platos",
          icon: IconBowlSpoon,
          expandable: true,
          subItems: [
            {
              id: "dish-categories",
              label: "Categorías de Platos",
              path: "/dishes/dish-categories",
            },
            {
              id: "discounts",
              label: "Descuentos",
              path: "/dishes/discounts",
            },
          ],
        },
        {
          id: "clients",
          label: "Clientes",
          path: "/clients",
          icon: IconUsers,
          expandable: true,
          subItems: [
            {
              id: "clients",
              label: "Clientes",
              path: "/clients",
            },
            {
              id: "debt",
              label: "Historial de morosidad",
              path: "/clients/debt",
            },
          ],
        },
        {
          id: "orders",
          label: "Pedidos",
          path: "/orders",
          icon: IconBoxSeam,
          expandable: true,
          subItems: [
            {
              id: "create-order",
              label: "Crear pedido",
              path: "/orders/create-order",
            },
          ],
        },
        {
          id: "management",
          label: "Gestión",
          path: "/management",
          icon: IconBusinessplan,
          expandable: true,
          subItems: [
            {
              id: "payment",
              label: "Pagos",
              path: "/management/payments",
            },
            {
              id: "bills",
              label: "Gastos",
              path: "/management/expenses",
            },
            {
              id: "suppliers",
              label: "Proveedores",
              path: "/management/suppliers",
            },
          ],
        },
        {
          id: "hrm",
          label: "Recursos Humanos",
          path: "/hrm",
          icon: IconUsersGroup,
          expandable: true,
          subItems: [
            {
              id: "employees",
              label: "Empleados",
              path: "/hrm/employees",
            },
          ],
        },
        {
          id: "stats",
          label: "Informes",
          path: "/stats",
          icon: IconChartPie,
          expandable: true,
          subItems: [
            {
              id: "orders",
              label: "Ver pedidos",
              path: "/stats/orders",
            },
          ],
        },
        {
          id: "settings",
          label: "Configuración",
          path: "/settings",
          icon: IconSettings,
          expandable: true,
        },
        {
          id: "log-out",
          label: "Cerrar sesión",
          path: "/",
          icon: IconArrowRightFromArc,
          expandable: true,
        },
      ],
    },
  ],
};

export default sidebarData;