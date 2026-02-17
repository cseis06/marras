import { useState } from 'react';
import type { TimePeriod } from '../types/Expense';
import { timePeriodLabels } from '../types/Expense';
import { IconRefresh } from '@tabler/icons-react';

interface PeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  onRefresh?: () => void;
  className?: string;
}

const periods: TimePeriod[] = ['day', 'week', 'month', 'year'];

export default function PeriodSelector({
  value,
  onChange,
  onRefresh,
  className = '',
}: PeriodSelectorProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    onRefresh();
    // Simular tiempo de refresh
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {onRefresh && (
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                     border border-gray-200 rounded-xl transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          title="Actualizar"
        >
          <IconRefresh
            size={18}
            className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      )}
      <div className="inline-flex bg-gray-100 rounded-xl p-1">
        {periods.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => onChange(period)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
              ${
                value === period
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {timePeriodLabels[period]}
          </button>
        ))}
      </div>
    </div>
  );
}