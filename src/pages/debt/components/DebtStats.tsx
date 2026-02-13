import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  IconCash,
  IconUsers,
  IconPercentage,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import type { DebtStats as Stats } from '../types/Debt';

interface DebtStatsProps {
  stats: Stats;
}

interface StatCardProps {
  title: string;
  value: string;
  previousValue: number;
  currentValue: number;
  icon: React.ReactNode;
  iconBgColor: string;
  prefix?: string;
  suffix?: string;
  invertTrend?: boolean; // Para métricas donde bajar es bueno
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toLocaleString('es-PY');
};

const StatCard = ({
  title,
  value,
  previousValue,
  currentValue,
  icon,
  iconBgColor,
  prefix = '',
  suffix = '',
  invertTrend = false,
}: StatCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const difference = currentValue - previousValue;
  const percentChange =
    previousValue !== 0 ? ((difference / previousValue) * 100).toFixed(1) : '0';
  
  const isPositive = invertTrend ? difference < 0 : difference > 0;
  const isNegative = invertTrend ? difference > 0 : difference < 0;

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {value}
            {suffix}
          </p>
          <div className="flex items-center mt-2 gap-1">
            {difference !== 0 && (
              <>
                {isPositive ? (
                  <IconTrendingUp size={16} className="text-green-500" />
                ) : isNegative ? (
                  <IconTrendingDown size={16} className="text-red-500" />
                ) : null}
                <span
                  className={`text-xs font-medium ${
                    isPositive
                      ? 'text-green-600'
                      : isNegative
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {difference > 0 ? '+' : ''}
                  {percentChange}%
                </span>
                <span className="text-xs text-gray-400">vs periodo anterior</span>
              </>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export const DebtStats = ({ stats }: DebtStatsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div className="stat-card">
        <StatCard
          title="Total Pendiente"
          value={formatCurrency(stats.totalPending)}
          previousValue={stats.totalPendingPrevious}
          currentValue={stats.totalPending}
          prefix="Gs. "
          icon={<IconCash size={24} className="text-red-600" />}
          iconBgColor="bg-red-50"
          invertTrend={true}
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Clientes Morosos"
          value={stats.overdueClients.toString()}
          previousValue={stats.overdueClientsPrevious}
          currentValue={stats.overdueClients}
          icon={<IconUsers size={24} className="text-amber-600" />}
          iconBgColor="bg-amber-50"
          invertTrend={true}
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Tasa de Morosidad"
          value={stats.overdueRate.toFixed(1)}
          previousValue={stats.overdueRatePrevious}
          currentValue={stats.overdueRate}
          suffix="%"
          icon={<IconPercentage size={24} className="text-orange-600" />}
          iconBgColor="bg-orange-50"
          invertTrend={true}
        />
      </div>
      <div className="stat-card">
        <StatCard
          title="Recuperado (Período)"
          value={formatCurrency(stats.recoveredPeriod)}
          previousValue={stats.recoveredPeriodPrevious}
          currentValue={stats.recoveredPeriod}
          prefix="Gs. "
          icon={<IconTrendingUp size={24} className="text-green-600" />}
          iconBgColor="bg-green-50"
        />
      </div>
    </div>
  );
};