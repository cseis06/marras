import { type ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  className = '',
  noPadding = false,
}: ChartCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
        ${className}
      `}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}