import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconRefresh,
  IconChefHat,
  IconUsers,
  IconCircleCheck,
  IconClock,
  IconCalendar,
} from '@tabler/icons-react';
import gsap from 'gsap';

// Componentes UI (ajustar rutas según tu proyecto)
import StatCard from '../../components/ui/StatCard';
import Select from '../../components/ui/Select';

// Componentes locales
import CategoryPostIt from './components/CategoryPostit';
import CustomOrderPostIt from './components/CustomOrderPostit';

// Datos y helpers
import {
  getChefTasksFiltered,
  calculateKitchenStats,
  getChefOptions,
  getTodayString,
  getTomorrowString,
  formatDateDisplay,
  chefs,
} from './data/Kitchen';

// Tipos
import { chefColorStyles } from './types/Kitchen';

export default function KitchenManagement() {
  const navigate = useNavigate();
  
  // Estados de filtros - iniciar con la primera cocinera disponible
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedChefId, setSelectedChefId] = useState<string>(chefs.find(c => c.available)?.id || chefs[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs para animaciones
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const refreshBtnRef = useRef<HTMLButtonElement>(null);

  // Datos filtrados - siempre una cocinera seleccionada
  const tasks = useMemo(
    () => getChefTasksFiltered(selectedDate, selectedChefId),
    [selectedDate, selectedChefId]
  );

  // Tarea actual de la cocinera seleccionada
  const currentTask = tasks[0] || null;

  // Estadísticas de la cocinera seleccionada
  const stats = useMemo(() => calculateKitchenStats(tasks), [tasks]);

  // Opciones para select de cocineras (sin "Todas")
  const chefOptions = useMemo(() => {
    const options = getChefOptions(selectedDate);
    return options.map((opt) => ({
      value: opt.value,
      label: `${opt.label} (${opt.count})`,
    }));
  }, [selectedDate]);

  // Opciones para select de fecha
  const dateOptions = [
    { value: getTodayString(), label: 'Hoy' },
    { value: getTomorrowString(), label: 'Mañana' },
  ];

  // Animación inicial
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }

      if (filtersRef.current) {
        tl.fromTo(
          filtersRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.3'
        );
      }

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
          },
          '-=0.2'
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Animación cuando cambian los filtros
  useEffect(() => {
    if (gridRef.current) {
      // Animar salida y entrada de los post-its
      const postIts = gridRef.current.querySelectorAll('.post-it');
      gsap.fromTo(
        postIts,
        { opacity: 0, y: 20, scale: 0.9, rotate: -2 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        }
      );
    }
  }, [selectedDate, selectedChefId]);

  // Handler para refresh
  const handleRefresh = () => {
    setIsRefreshing(true);

    if (refreshBtnRef.current) {
      gsap.to(refreshBtnRef.current, {
        rotate: 360,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(refreshBtnRef.current, { rotate: 0 });
        },
      });
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Handler para cambio de cocinera
  const handleChefChange = (value: string) => {
    setSelectedChefId(value);
  };

  // Handler para cambio de fecha
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  // Obtener color de la cocinera actual
  const currentChefColor = currentTask?.chefColor || 'amber';
  const colorStyles = chefColorStyles[currentChefColor];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3"
            >
              <IconArrowLeft size={20} />
              <span className="text-sm">Volver</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Cocina
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Asignaciones por cocinera • {formatDateDisplay(selectedDate)}
            </p>
          </div>

          {/* Botón refresh */}
          <button
            ref={refreshBtnRef}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              p-3 rounded-xl bg-white border border-gray-200 shadow-sm
              hover:bg-gray-50 hover:border-gray-300 transition-all
              ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <IconRefresh size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Filtros - z-index alto para que el dropdown no quede tapado */}
        <div
          ref={filtersRef}
          className="relative z-20 flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          {/* Filtro de fecha */}
          <div className="flex-1 sm:max-w-xs">
            <Select
              label="Fecha"
              value={selectedDate}
              onChange={handleDateChange}
              options={dateOptions}
              icon={<IconCalendar size={18} />}
            />
          </div>

          {/* Filtro de cocinera */}
          <div className="flex-1 sm:max-w-xs">
            <Select
              label="Cocinera"
              value={selectedChefId}
              onChange={handleChefChange}
              options={chefOptions}
              icon={<IconChefHat size={18} />}
            />
          </div>
        </div>

        {/* Stats Cards - z-index menor que filtros */}
        <div
          ref={statsRef}
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            title="Total Platos"
            value={stats.totalDishes}
            icon={<IconChefHat size={20} />}
          />
          <StatCard
            title="Cocineras Activas"
            value={stats.activeChefs}
            icon={<IconUsers size={20} />}
          />
          <StatCard
            title="Completados"
            value={stats.completedDishes}
            icon={<IconCircleCheck size={20} />}
          />
          <StatCard
            title="Pendientes"
            value={stats.pendingDishes}
            icon={<IconClock size={20} />}
          />
        </div>

        {/* Header de cocinera seleccionada */}
        {currentTask && (
          <div className={`mb-6 p-4 rounded-2xl ${colorStyles.bg} border-l-4 ${colorStyles.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${colorStyles.accent} text-white font-bold text-lg flex items-center justify-center`}>
                {currentTask.chefName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{currentTask.chefName}</h2>
                <p className="text-sm text-gray-500">
                  {currentTask.categories.length} categorías • {currentTask.customOrders.length} pedidos personalizados
                </p>
              </div>
              <div className="ml-auto">
                <div className={`px-4 py-2 rounded-xl ${colorStyles.accent} text-white font-bold`}>
                  {currentTask.totalDishes} platos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Post-its */}
        <div ref={gridRef}>
          {currentTask ? (
            <div className="space-y-8">
              {/* Sección: Categorías */}
              {currentTask.categories.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <IconChefHat size={16} />
                    Categorías Asignadas ({currentTask.categories.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentTask.categories.map((category, index) => (
                      <CategoryPostIt
                        key={category.id}
                        assignment={category}
                        color={currentTask.chefColor}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Sección: Pedidos Personalizados */}
              {currentTask.customOrders.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <IconUsers size={16} />
                    Pedidos Personalizados ({currentTask.customOrders.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentTask.customOrders.map((order, index) => (
                      <CustomOrderPostIt
                        key={order.id}
                        order={order}
                        color={currentTask.chefColor}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Sin pedidos personalizados */}
              {currentTask.customOrders.length === 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <IconUsers size={16} />
                    Pedidos Personalizados
                  </h3>
                  <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400">Sin pedidos personalizados para hoy</p>
                  </div>
                </section>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Última actualización: {new Date().toLocaleString('es-PY')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente para estado vacío
function EmptyState() {
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emptyRef.current) {
      gsap.fromTo(
        emptyRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div
      ref={emptyRef}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <IconChefHat size={40} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Sin asignaciones
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        No hay asignaciones de cocina para esta cocinera en la fecha seleccionada.
      </p>
    </div>
  );
}