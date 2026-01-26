import type { ReactNode } from 'react';

interface Action {
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  variant?: 'default' | 'danger';
}

interface ActionButtonsProps {
  actions: Action[];
}

export default function ActionButtons({ actions }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          title={action.label}
          className={`p-1.5 rounded-lg transition-colors ${
            action.variant === 'danger'
              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}