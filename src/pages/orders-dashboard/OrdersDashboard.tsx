import { useState, useMemo, useRef, useEffect } from 'react';
import {
  IconShoppingCart,
  IconCash,
  IconReceipt,
  IconCircleCheck,
  IconCircleX,
  IconArrowLeft,
  IconRefresh,
} from '@tabler/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// Componentes
import StatCard from '../../components/ui/StatCard';
import ChartCard from './components/ChartCard';
import PeriodSelector from './components/PeriodSelector';
import RankingTable from './components/RankingTable';

// Datos y helpers
import {
  orders,
  filterOrdersByPeriod,
  calculateStats,
  getCategoryStats,
  getChefStats,
  getDeliveryStats,
  getDailyStats,
  getStatusStats,
  getTopClients,
} from './data/Orders';

// Tipos
import type { TimePeriod } from './types/Order';
import { orderStatusLabels } from './types/Order';

// Formateador de moneda
const formatCurrency = (value: number): string => {
  if (value === undefined || value === null) return '₲ 0';
  if (value >= 1000000) {
    return `₲ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₲ ${(value / 1000).toFixed(0)}K`;
  }
  return `₲ ${value.toLocaleString('es-PY')}`;
};

const formatFullCurrency = (value: number): string => {
  if (value === undefined || value === null) return '₲ 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('PYG', '₲');
};

// Colores para gráficos
const CHART_COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444',
  gradient: ['#10b981', '#059669'],
};

const STATUS_CHART_COLORS: Record<string, string> = {
  borrador: '#9ca3af',
  pendiente: '#f59e0b',
  confirmado: '#3b82f6',
  en_preparacion: '#8b5cf6',
  listo: '#14b8a6',
  en_camino: '#f97316',
  entregado: '#10b981',
  cancelado: '#ef4444',
};

export default function OrdersDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const mainChartsRef = useRef<HTMLDivElement>(null);
  const barChartsRef = useRef<HTMLDivElement>(null);
  const rankingsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animación del botón "Volver"
      tl.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4 }
      );

      // Animación del header (título y descripción)
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );

      // Animación de las acciones (PeriodSelector + botón refresh)
      tl.fromTo(
        actionsRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4 },
        '-=0.3'
      );

      // Animación de las StatCards (stagger)
      tl.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08 },
        '-=0.2'
      );

      // Animación de los gráficos principales (stagger)
      tl.fromTo(
        mainChartsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
        '-=0.2'
      );

      // Animación de los gráficos de barras (stagger)
      tl.fromTo(
        barChartsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
        '-=0.3'
      );

      // Animación de los rankings (stagger)
      tl.fromTo(
        rankingsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1 },
        '-=0.3'
      );

      // Animación del footer
      tl.fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Datos filtrados
  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(orders, period),
    [period]
  );

  // Estadísticas calculadas
  const stats = useMemo(() => calculateStats(filteredOrders), [filteredOrders]);
  const categoryStats = useMemo(() => getCategoryStats(filteredOrders), [filteredOrders]);
  const chefStats = useMemo(() => getChefStats(filteredOrders), [filteredOrders]);
  const deliveryStats = useMemo(() => getDeliveryStats(filteredOrders), [filteredOrders]);
  const statusStats = useMemo(() => getStatusStats(filteredOrders), [filteredOrders]);
  const topClients = useMemo(() => getTopClients(filteredOrders, 5), [filteredOrders]);

  // Datos para gráfico de tendencia
  const dailyStats = useMemo(() => {
    const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    return getDailyStats(orders, days);
  }, [period]);

  // Datos formateados para gráficos
  const areaChartData = useMemo(() => {
    return dailyStats.map((d) => ({
      ...d,
      dateFormatted: new Date(d.date + 'T00:00:00').toLocaleDateString('es-PY', {
        day: 'numeric',
        month: 'short',
      }),
    }));
  }, [dailyStats]);

  const categoryChartData = useMemo(() => {
    return categoryStats.slice(0, 6).map((c) => ({
      name: c.categoryName,
      cantidad: c.totalQuantity,
      ingresos: c.totalRevenue,
    }));
  }, [categoryStats]);

  const statusChartData = useMemo(() => {
    return statusStats.map((s) => ({
      name: orderStatusLabels[s.status as keyof typeof orderStatusLabels],
      value: s.count,
      color: STATUS_CHART_COLORS[s.status],
    }));
  }, [statusStats]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Custom Tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'ingresos' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Top categorías para ranking
  const topCategories = categoryStats.slice(0, 5).map((cat, idx) => ({
    id: cat.categoryId,
    rank: idx + 1,
    label: cat.categoryName,
    sublabel: `${cat.orderCount} pedidos`,
    value: formatCurrency(cat.totalRevenue),
    progress: (cat.totalQuantity / categoryStats[0]?.totalQuantity) * 100 || 0,
  }));

  // Top clientes para ranking
  const topClientsRanking = topClients.map((client, idx) => ({
    id: client.clientId,
    rank: idx + 1,
    label: client.clientName,
    sublabel: `${client.totalOrders} pedidos`,
    value: formatCurrency(client.totalRevenue),
    progress: (client.totalRevenue / topClients[0]?.totalRevenue) * 100 || 0,
  }));

  // Top chefs para ranking
  const topChefsRanking = chefStats.slice(0, 5).map((chef, idx) => ({
    id: chef.chefId,
    rank: idx + 1,
    label: chef.chefName,
    sublabel: `${chef.totalOrders} pedidos preparados`,
    value: formatCurrency(chef.totalRevenue),
    progress: (chef.totalOrders / chefStats[0]?.totalOrders) * 100 || 0,
  }));

  // Top repartidores para ranking
  const topDeliveryRanking = deliveryStats.slice(0, 5).map((d, idx) => ({
    id: d.deliveryPersonId,
    rank: idx + 1,
    label: d.deliveryPersonName,
    sublabel: d.zone,
    value: `${d.totalDeliveries}`,
    progress: (d.totalDeliveries / deliveryStats[0]?.totalDeliveries) * 100 || 0,
  }));

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <button
              ref={backButtonRef}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3 opacity-0"
            >
              <IconArrowLeft size={20} />
              <span className="text-sm">Volver</span>
            </button>
            <div ref={headerRef} className="opacity-0">
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard de Pedidos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Estadísticas y métricas de rendimiento
              </p>
            </div>
          </div>

          <div ref={actionsRef} className="flex items-center gap-3 opacity-0">
            <PeriodSelector value={period} onChange={setPeriod} />
            <button
              onClick={handleRefresh}
              className={`
                p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500
                hover:text-gray-700 hover:border-gray-300 transition-all
                ${isRefreshing ? 'animate-spin' : ''}
              `}
              title="Actualizar datos"
            >
              <IconRefresh size={20} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="opacity-0">
            <StatCard
              title="Total Pedidos"
              value={stats.totalOrders}
              subtitle="En el período"
              icon={<IconShoppingCart size={20} />}
              variant="default"
            />
          </div>
          <div className="opacity-0">
            <StatCard
              title="Ingresos"
              value={formatCurrency(stats.totalRevenue)}
              subtitle="Facturado"
              icon={<IconCash size={20} />}
              variant="success"
            />
          </div>
          <div className="opacity-0">
            <StatCard
              title="Ticket Promedio"
              value={formatCurrency(stats.averageOrderValue)}
              subtitle="Por pedido"
              icon={<IconReceipt size={20} />}
              variant="info"
            />
          </div>
          <div className="opacity-0">
            <StatCard
              title="Entregados"
              value={stats.deliveredOrders}
              subtitle={`${stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(0) : 0}% del total`}
              icon={<IconCircleCheck size={20} />}
              variant="success"
            />
          </div>
          <div className="opacity-0">
            <StatCard
              title="Cancelados"
              value={stats.cancelledOrders}
              subtitle={`${stats.totalOrders > 0 ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(0) : 0}% del total`}
              icon={<IconCircleX size={20} />}
              variant="error"
            />
          </div>
        </div>

        {/* Gráficos principales */}
        <div ref={mainChartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 opacity-0">
            <ChartCard
              title="Tendencia de Pedidos"
              subtitle={`Últimos ${period === 'day' ? '24 horas' : period === 'week' ? '7 días' : period === 'month' ? '30 días' : '12 meses'}`}
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaChartData}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="dateFormatted"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(v) => formatCurrency(v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      name="Pedidos"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      fill="url(#colorOrders)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      name="ingresos"
                      stroke={CHART_COLORS.secondary}
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Estado de pedidos */}
          <div className="opacity-0">
            <ChartCard title="Estado de Pedidos" subtitle="Distribución actual">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value ?? 0} pedidos`, '']}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Categorías más pedidas - Gráfico de barras */}
        <div ref={barChartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="opacity-0">
            <ChartCard
              title="Categorías Más Pedidas"
              subtitle="Por cantidad de platos"
              action={
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                  Top 6
                </span>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="cantidad"
                      name="Cantidad"
                      fill={CHART_COLORS.primary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="opacity-0">
            <ChartCard
              title="Ingresos por Categoría"
              subtitle="Contribución al revenue"
              action={
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                  Top 6
                </span>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(v) => formatCurrency(v)}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                     formatter={(value) => [formatFullCurrency(Number(value) || 0), 'Ingresos']}
                    />
                    <Bar
                      dataKey="ingresos"
                      name="Ingresos"
                      fill={CHART_COLORS.secondary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Rankings */}
        <div ref={rankingsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="opacity-0">
            <ChartCard title="Top Clientes" subtitle="Por ingresos generados">
              <RankingTable
                items={topClientsRanking}
                valueLabel="Ingresos"
                emptyMessage="Sin datos de clientes"
              />
            </ChartCard>
          </div>

          <div className="opacity-0">
            <ChartCard title="Top Categorías" subtitle="Por ingresos generados">
              <RankingTable
                items={topCategories}
                valueLabel="Ingresos"
                emptyMessage="Sin datos de categorías"
              />
            </ChartCard>
          </div>

          <div className="opacity-0">
            <ChartCard title="Top Chefs" subtitle="Por pedidos preparados">
              <RankingTable
                items={topChefsRanking}
                valueLabel="Ingresos"
                emptyMessage="Sin datos de chefs"
              />
            </ChartCard>
          </div>

          <div className="opacity-0">
            <ChartCard title="Top Repartidores" subtitle="Por entregas realizadas">
              <RankingTable
                items={topDeliveryRanking}
                valueLabel="Entregas"
                emptyMessage="Sin datos de repartidores"
              />
            </ChartCard>
          </div>
        </div>

        {/* Footer info */}
        <div ref={footerRef} className="mt-8 text-center opacity-0">
          <p className="text-xs text-gray-400">
            Última actualización:{' '}
            {new Date().toLocaleString('es-PY')}
          </p>
        </div>
      </div>
    </div>
  );
}