import { useState, useEffect, type FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconPlus,
  IconMinus,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { sidebarData, type SidebarItem, type SidebarSubItem } from "./data/Sidebar";

interface SidebarProps {
  onAdd?: (itemId: string) => void;
  title?: string;
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const SubItem: FC<{
  subItem: SidebarSubItem;
  isActive: boolean;
  onNavigate: (path: string) => void;
}> = ({ subItem, isActive, onNavigate }) => (
  <button
    onClick={() => onNavigate(subItem.path)}
    className={`
      w-full text-left pl-12 pr-4 py-2 text-xs transition-colors
      ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
    `}
  >
    {subItem.label}
  </button>
);

const Item: FC<{
  item: SidebarItem;
  isExpanded: boolean;
  isCollapsed: boolean;
  activeSubPath?: string;
  onToggleExpand: () => void;
  onNavigate: (path: string) => void;
  onAdd?: (itemId: string) => void;
}> = ({ item, isExpanded, isCollapsed, activeSubPath, onToggleExpand, onNavigate, onAdd }) => {
  const Icon = item.icon;
  const hasSubItems = Boolean(item.subItems?.length);

  const handleClick = () => {
    if (hasSubItems && !isCollapsed) {
      onToggleExpand();
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <div className="mb-1">
      <div
        onClick={handleClick}
        className={`
          group flex items-center justify-between py-2.5 mx-2 rounded-xl cursor-pointer
          transition-all duration-300 hover:bg-gray-50
          ${isCollapsed ? "px-2 justify-center" : "px-3"}
        `}
      >
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "flex-1"}`}>
          <Icon size={18} stroke={1.5} className="text-gray-600" />
          {!isCollapsed && (
            <span className="text-xs font-medium text-gray-700">{item.label}</span>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-1">
            {item.addButton && (
              <button
                onClick={(e) => { e.stopPropagation(); onAdd?.(item.id); }}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconPlus size={16} stroke={1.5} className="text-gray-500" />
              </button>
            )}
            {hasSubItems && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                className="p-1 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <IconMinus size={16} stroke={2} className="text-gray-500" />
                ) : (
                  <IconPlus size={16} stroke={2} className="text-gray-500" />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {hasSubItems && isExpanded && !isCollapsed && (
        <div className="mt-1">
          {item.subItems?.map((subItem) => (
            <SubItem
              key={subItem.id}
              subItem={subItem}
              isActive={subItem.path === activeSubPath}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: FC<SidebarProps> = ({
  onAdd,
  title,
  className = "",
  isMobileOpen = false,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Cerrar sidebar mobile al cambiar de ruta
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Prevenir scroll del body cuando el sidebar mobile está abierto
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const mainItems = sidebarData.sections[0]?.items.filter((item) => item.id !== "log-out") || [];
  const logOutItem = sidebarData.sections[0]?.items.find((item) => item.id === "log-out");

  // Contenido del sidebar (reutilizado para desktop y mobile)
  const sidebarContent = (
    <>
      {/* Header */}
      <div
        className={`
          h-[65px] flex items-center justify-between border-b border-gray-100
          ${isCollapsed ? "justify-center px-2" : "px-4"}
        `}
      >
        {!isCollapsed ? (
          <>
            <h1 className="text-base font-semibold text-gray-800">
              {title || sidebarData.title}
            </h1>
            {/* Botón colapsar solo en desktop */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <IconChevronLeft size={18} stroke={1.5} />
            </button>
            {/* Botón cerrar solo en mobile */}
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <IconX size={18} stroke={1.5} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <IconChevronRight size={18} stroke={1.5} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-4">
        {mainItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            isCollapsed={isCollapsed}
            activeSubPath={activePath}
            onToggleExpand={() => toggleExpand(item.id)}
            onNavigate={handleNavigate}
            onAdd={(id) => onAdd?.(id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 py-2">
        {logOutItem && (
          <Item
            item={logOutItem}
            isExpanded={false}
            isCollapsed={isCollapsed}
            onToggleExpand={() => {}}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex h-screen bg-white border-r border-gray-200 flex-col shadow-sm
          transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} ${className}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;