import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getScoreLabel, getScoreVariant } from '../types/Debt';
import type { ClientDebt } from '../types/Debt';

interface SummaryTabProps {
  client: ClientDebt;
  chartData: {
    month: string;
    purchases: number;
    payments: number;
    overdue: number;
  }[];
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

const formatFullCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('PYG', 'Gs.');
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Días Atraso' ? entry.value : formatFullCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SummaryTab = ({ client, chartData }: SummaryTabProps) => {
  const scoreVariant = getScoreVariant(client.score);
  const scoreColor =
    scoreVariant === 'success'
      ? 'text-green-600'
      : scoreVariant === 'warning'
      ? 'text-yellow-600'
      : 'text-red-600';

  const scoreBarColor =
    scoreVariant === 'success'
      ? 'bg-green-500'
      : scoreVariant === 'warning'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  const onTimePercentage =
    client.purchaseCount > 0
      ? ((client.onTimePaymentCount / client.purchaseCount) * 100).toFixed(1)
      : '100';

  return (
    <div className="space-y-6">
      {/* Score Principal */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Score de Pago</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {client.score}
              </span>
              <span className="text-lg text-gray-400">/ 100</span>
            </div>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                scoreVariant === 'success'
                  ? 'bg-green-100 text-green-700'
                  : scoreVariant === 'warning'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {getScoreLabel(client.score)}
            </span>
          </div>

          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={
                  scoreVariant === 'success'
                    ? '#22C55E'
                    : scoreVariant === 'warning'
                    ? '#EAB308'
                    : '#EF4444'
                }
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(client.score / 100) * 251.2} 251.2`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${scoreColor}`}>
                {client.score}%
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
            style={{ width: `${client.score}%` }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Promedio Días de Pago
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {client.averagePaymentDays}
            <span className="text-sm font-normal text-gray-500 ml-1">días</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Pagos a Tiempo
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {onTimePercentage}
            <span className="text-sm font-normal text-gray-500 ml-1">%</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Histórico
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatFullCurrency(client.totalHistoric)}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total de Compras
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {client.purchaseCount}
            <span className="text-sm font-normal text-gray-500 ml-1">pedidos</span>
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Comportamiento de Pago - Últimos 6 Meses
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="purchases"
                name="Compras"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="payments"
                name="Pagos"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overdue"
                name="Días Atraso"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};