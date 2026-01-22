import {
  IconLayoutDashboard,
  IconSettings,
  IconBowlSpoon,
  IconUser,
  IconBusinessplan,
  IconUsersGroup,
  IconChartBar,
  IconChartPie,
  IconArrowRightFromArc,
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
              id: "create-dish",
              label: "Crear plato",
              path: "/dishes/create-dish",
            },
            {
              id: "weekly-menu",
              label: "Menú semanal",
              path: "/dishes/weekly-menu",
            },
            {
              id: "sale",
              label: "Promos",
              path: "/dishes/sale",
            },
          ],
        },
        {
          id: "clients",
          label: "Clientes",
          path: "/clients",
          icon: IconUser,
          expandable: true,
          subItems: [
            {
              id: "create-client",
              label: "Crear clientes",
              path: "/clientes/create-client",
            },
            {
              id: "client-debt",
              label: "Historial de morosidad",
              path: "/clientes/client-debt",
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
              path: "/management/payment",
            },
            {
              id: "bills",
              label: "Gastos",
              path: "/management/bills",
            },
            {
              id: "bills",
              label: "Proveedores",
              path: "/management/bills",
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
          id: "statistics",
          label: "Estadísticas",
          path: "/statistics",
          icon: IconChartPie,
          expandable: true,
          subItems: [
            {
              id: "employees",
              label: "Empleados",
              path: "/statistics/employees",
            },
          ],
        },
        {
          id: "data",
          label: "Informes",
          path: "/data",
          icon: IconChartBar,
          expandable: true,
          subItems: [
            {
              id: "employees",
              label: "Empleados",
              path: "/data/employees",
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