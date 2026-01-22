import { useState, type FC } from "react";
import {
  IconBell,
  IconPlus,
  IconMinus,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { sidebarData, type SidebarItem, type SidebarSubItem } from "./data/Sidebar";

interface SidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  onAdd?: (itemId: string) => void;
  title?: string;
  className?: string;
}

const SidebarSubItemComponent: FC<{
  subItem: SidebarSubItem;
  isActive: boolean;
  onNavigate: (path: string) => void;
}> = ({ subItem, isActive, onNavigate }) => (
  <button
    onClick={() => onNavigate(subItem.path)}
    className={`
      w-full text-left pl-12 pr-4 py-2 text-xs transition-all duration-200
      hover:bg-gray-100
      ${isActive ? "bg-gray-100 text-gray-900 font-normal" : "text-gray-600 hover:text-gray-900"}
    `}
  >
    {subItem.label}
  </button>
);

const SidebarItemComponent: FC<{
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  isCollapsed: boolean;
  activeSubPath?: string;
  onToggleExpand: () => void;
  onNavigate: (path: string) => void;
  onAdd?: (itemId: string) => void;
}> = ({ item, isExpanded, isCollapsed, activeSubPath, onToggleExpand, onNavigate, onAdd }) => {
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
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
          group flex items-center justify-between py-2.5 mx-2 rounded-xl
          cursor-pointer transition-all duration-300
          ${isCollapsed ? "px-2 justify-center" : "px-3"}
        `}
      >
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "flex-1"}`}>
          <Icon
            size={18}
            stroke={1.5}
          />
          <span
            className={`
              text-xs font-medium whitespace-nowrap transition-all duration-300
              ${isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
            `}
          >
            {item.label}
          </span>
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-1">
            {item.addButton && (
              <button
                onClick={(e) => { e.stopPropagation(); onAdd?.(item.id); }}
                className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-200`}
              >
                <IconPlus size={16} stroke={1.5} className="text-gray-500" />
              </button>
            )}

            {hasSubItems && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                className={`p-1 rounded-md transition-all duration-200 `}
              >
                {isExpanded ? <IconMinus size={16} stroke={2} /> : <IconPlus size={16} stroke={2} />}
              </button>
            )}
          </div>
        )}
      </div>

      {hasSubItems && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-0.5">
          {item.subItems?.map((subItem) => (
            <SidebarSubItemComponent
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
  activePath = "",
  onNavigate,
  onAdd,
  title,
  className = "",
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Separar log-out del resto de items
  const mainItems = sidebarData.sections[0]?.items.filter((item) => item.id !== "log-out") || [];
  const logOutItem = sidebarData.sections[0]?.items.find((item) => item.id === "log-out");

  return (
    <aside
      className={`
        h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center border-b border-gray-100 transition-all duration-300
          ${isCollapsed ? "justify-center px-2 py-4" : "justify-between px-4 py-4"}
        `}
      >
        <h1
          className={`
            text-base font-semibold text-gray-800 whitespace-nowrap
            transition-all duration-300 overflow-hidden
            ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}
        >
          {title || sidebarData.title}
        </h1>

        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <IconBell size={18} stroke={1.5} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-4">
        {mainItems.map((item) => (
          <SidebarItemComponent
            key={item.id}
            item={item}
            isActive={item.path === activePath}
            isExpanded={expandedItems.has(item.id)}
            isCollapsed={isCollapsed}
            activeSubPath={activePath}
            onToggleExpand={() => handleToggleExpand(item.id)}
            onNavigate={(path) => onNavigate?.(path)}
            onAdd={(id) => onAdd?.(id)}
          />
        ))}
      </nav>

      {/* Footer: Log-out + Collapse button */}
      <div className="border-t border-gray-100 py-2">
        {logOutItem && (
          <SidebarItemComponent
            item={logOutItem}
            isActive={false}
            isExpanded={false}
            isCollapsed={isCollapsed}
            onToggleExpand={() => {}}
            onNavigate={(path) => onNavigate?.(path)}
          />
        )}

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            flex items-center gap-3 py-2.5 mx-2 rounded-xl w-[calc(100%-16px)]
            cursor-pointer transition-all duration-300 text-gray-500 hover:bg-gray-50
            ${isCollapsed ? "px-2 justify-center" : "px-3"}
          `}
        >
          {isCollapsed ? (
            <IconChevronRight size={18} stroke={1.5} />
          ) : (
            <>
              <IconChevronLeft size={18} stroke={1.5} />
              <span className="text-xs font-medium">Ocultar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;