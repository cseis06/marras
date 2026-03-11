import { type FC } from "react";
import { useLocation } from "react-router-dom";
import { IconBell, IconChevronDown, IconMenu2 } from "@tabler/icons-react";

// Mapeo de rutas a nombres de página
const pageNames: Record<string, string> = {
  "/": "Inicio",
  "/dashboard": "Dashboard",
  "/dishes/dish-categories": "Categorías de Platos",
  "/dishes/discounts": "Descuentos",
  "/clients": "Clientes",
  "/clientes/debt": "Historial de Morosidad",
  "/orders/create-order": "Crear Pedido",
  "/orders": "Ver Pedidos",
  "/management/expenses": "Gastos",
  "/management/suppliers": "Proveedores",
  "/hrm/employees": "Empleados",
};

// Mock user data (reemplazar con datos reales)
const currentUser = {
  name: "Marra Pellón",
  role: "Administrador",
  avatar: null as string | null,
};

interface HeaderProps {
  className?: string;
  onMenuToggle?: () => void;
}

export const Header: FC<HeaderProps> = ({ className = "", onMenuToggle }) => {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "Página";

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`
        h-[65px] bg-white border-b border-gray-200 px-4 sm:px-6
        flex items-center justify-between
        ${className}
      `}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Abrir menú"
        >
          <IconMenu2 size={22} stroke={1.5} />
        </button>

        {/* Page name */}
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
          {pageName}
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <IconBell size={20} stroke={1.5} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider - hidden on small screens */}
        <div className="hidden sm:block h-8 w-px bg-gray-200" />

        {/* User */}
        <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg py-1.5 px-1.5 sm:px-2 transition-colors">
          {/* Avatar */}
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-emerald-700">
                {getInitials(currentUser.name)}
              </span>
            </div>
          )}

          {/* Name & Role - hidden on small screens */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
          </div>

          <IconChevronDown size={16} className="hidden sm:block text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;