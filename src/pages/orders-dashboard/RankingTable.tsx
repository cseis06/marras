import { type ReactNode } from 'react';

interface RankingItem {
  id: string;
  rank: number;
  label: string;
  sublabel?: string;
  value: string | number;
  icon?: ReactNode;
  progress?: number; // 0-100
}

interface RankingTableProps {
  items: RankingItem[];
  valueLabel?: string;
  emptyMessage?: string;
  className?: string;
}

const rankColors = [
  'bg-gradient-to-r from-amber-400 to-amber-500 text-white', // 1st
  'bg-gradient-to-r from-gray-300 to-gray-400 text-white',    // 2nd
  'bg-gradient-to-r from-orange-300 to-orange-400 text-white', // 3rd
];

export default function RankingTable({
  items,
  valueLabel = 'Valor',
  emptyMessage = 'Sin datos',
  className = '',
}: RankingTableProps) {
  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {/* Rank badge */}
          <div
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
              ${index < 3 ? rankColors[index] : 'bg-gray-200 text-gray-600'}
            `}
          >
            {item.rank}
          </div>

          {/* Icon opcional */}
          {item.icon && (
            <div className="flex-shrink-0 text-gray-400">
              {item.icon}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {item.label}
            </p>
            {item.sublabel && (
              <p className="text-xs text-gray-500 truncate">{item.sublabel}</p>
            )}
            
            {/* Progress bar opcional */}
            {item.progress !== undefined && (
              <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              {valueLabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}