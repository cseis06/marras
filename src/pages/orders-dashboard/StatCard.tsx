import { type ReactNode } from 'react';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  success: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  error: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  info: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const styles = variantStyles[variant];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <IconTrendingUp size={14} />;
    if (trend.value < 0) return <IconTrendingDown size={14} />;
    return <IconMinus size={14} />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-emerald-600 bg-emerald-50';
    if (trend.value < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div
      className={`
        bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
        hover:shadow-md transition-shadow duration-300
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <span className={styles.iconColor}>{icon}</span>
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${getTrendColor()}
              `}
            >
              {getTrendIcon()}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}