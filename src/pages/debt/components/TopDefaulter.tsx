import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IconAlertTriangle, IconEye } from '@tabler/icons-react';
import { getSeverityLabel } from '../types/Debt';
import type { ClientRanking, DebtSeverity } from '../types/Debt';

interface TopDefaulterProps {
  defaulters: ClientRanking[];
  onViewClient?: (clientId: string) => void;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `Gs. ${(value / 1000000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('PYG', 'Gs.');
};

const getSeverityColor = (severity: DebtSeverity): string => {
  switch (severity) {
    case 'low':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'moderate':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200';
  }
};

const getBarColor = (severity: DebtSeverity): string => {
  switch (severity) {
    case 'low':
      return 'bg-yellow-400';
    case 'moderate':
      return 'bg-orange-400';
    case 'critical':
      return 'bg-red-500';
  }
};

export const TopDefaulter = ({ defaulters, onViewClient }: TopDefaulterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular el máximo para la barra proporcional
  const maxDebt = Math.max(...defaulters.map((d) => d.pendingDebt || 0), 1);

  useEffect(() => {
    if (containerRef.current) {
      const rows = containerRef.current.querySelectorAll('.defaulter-row');
      gsap.fromTo(
        rows,
        { opacity: 0, x: 20 },
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
        <IconAlertTriangle size={20} className="text-red-500" />
        <h3 className="font-semibold text-gray-900">Top 5 Mayor Morosidad</h3>
      </div>

      <div ref={containerRef} className="divide-y divide-gray-50">
        {defaulters.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500">
            <IconAlertTriangle size={32} className="mx-auto text-green-400 mb-2" />
            <p>¡Excelente! No hay clientes morosos</p>
          </div>
        ) : (
          defaulters.map((defaulter) => (
            <div
              key={defaulter.id}
              className="defaulter-row px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                {/* Info del cliente */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {defaulter.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{defaulter.code}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-red-600 font-medium">
                      {defaulter.daysOverdue} días de atraso
                    </span>
                  </div>
                </div>

                {/* Severidad y acciones */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(
                      defaulter.severity as DebtSeverity
                    )}`}
                  >
                    {getSeverityLabel(defaulter.severity as DebtSeverity)}
                  </span>
                  <button
                    onClick={() => onViewClient?.(defaulter.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver detalle"
                  >
                    <IconEye size={16} />
                  </button>
                </div>
              </div>

              {/* Barra de deuda */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                      defaulter.severity as DebtSeverity
                    )}`}
                    style={{
                      width: `${((defaulter.pendingDebt || 0) / maxDebt) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 min-w-[100px] text-right">
                  {formatCurrency(defaulter.pendingDebt || 0)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {defaulters.length > 0 && (
        <div className="px-5 py-3 bg-red-50 border-t border-red-100">
          <p className="text-xs text-red-700 text-center">
            Deuda total crítica:{' '}
            <span className="font-semibold">
              {formatCurrency(
                defaulters.reduce((acc, d) => acc + (d.pendingDebt || 0), 0)
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};