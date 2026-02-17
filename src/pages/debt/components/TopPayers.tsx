import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IconTrophy, IconMedal } from '@tabler/icons-react';
import { getScoreLabel, getFullName } from '../types/Debt';
import type { ClientRanking } from '../types/Debt';

interface TopPayersProps {
  payers: ClientRanking[];
  onViewClient?: (clientId: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('PYG', 'Gs.');
};

const getMedalColor = (position: number): string => {
  switch (position) {
    case 1:
      return 'text-yellow-500';
    case 2:
      return 'text-gray-400';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-gray-300';
  }
};

const getScoreBadgeColor = (score: number): string => {
  if (score >= 90) return 'bg-green-100 text-green-700';
  if (score >= 75) return 'bg-emerald-100 text-emerald-700';
  if (score >= 60) return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

export const TopPayers = ({ payers, onViewClient }: TopPayersProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const rows = containerRef.current.querySelectorAll('.payer-row');
      gsap.fromTo(
        rows,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <IconTrophy size={20} className="text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Top 5 Mejores Pagadores</h3>
      </div>

      <div ref={containerRef} className="divide-y divide-gray-50">
        {payers.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          payers.map((payer, index) => (
            <div
              key={payer.id}
              className="payer-row px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
              onClick={() => onViewClient?.(payer.id)}
            >
              {/* Posición */}
              <div className="flex-shrink-0 w-8 flex justify-center">
                {index < 3 ? (
                  <IconMedal size={24} className={getMedalColor(index + 1)} />
                ) : (
                  <span className="text-sm font-medium text-gray-400">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Info del cliente */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getFullName(payer)}
                </p>
                <p className="text-xs text-gray-500">{payer.code}</p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {payer.score}
                  </div>
                  <div className="text-xs text-gray-500">puntos</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(
                    payer.score
                  )}`}
                >
                  {getScoreLabel(payer.score)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {payers.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Total histórico del #1:{' '}
            <span className="font-medium text-gray-700">
              {formatCurrency(payers[0]?.totalHistoric || 0)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};