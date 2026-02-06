import type { TimePeriod } from './types/Order';
import { timePeriodLabels } from './types/Order';

interface PeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  className?: string;
}

const periods: TimePeriod[] = ['day', 'week', 'month', 'year'];

export default function PeriodSelector({
  value,
  onChange,
  className = '',
}: PeriodSelectorProps) {
  return (
    <div className={`inline-flex bg-gray-100 rounded-xl p-1 ${className}`}>
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${
              value === period
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }
          `}
        >
          {timePeriodLabels[period]}
        </button>
      ))}
    </div>
  );
}