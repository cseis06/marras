import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconReceipt,
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconCheck,
} from '@tabler/icons-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ActionButtons from '../../components/ui/ActionButtons';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatCard from '../../components/ui/StatCard';
import PeriodSelector from './PeriodSelector';
import ExpenseForm from './ExpenseForm';
import { expenses as initialExpenses } from './data/Expenses';
import type { Expense, ExpenseCategory, PaymentMethod, ExpenseStatus, TimePeriod } from './types/Expense';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Expense>();

const statusConfig: Record<ExpenseStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pagado: { label: 'Pagado', variant: 'success' },
  pendiente: { label: 'Pendiente', variant: 'warning' },
  anulado: { label: 'Anulado', variant: 'error' },
};

const categoryConfig: Record<ExpenseCategory, { label: string; color: string }> = {
  ingredientes: { label: 'Ingredientes', color: 'text-green-600' },
  servicios: { label: 'Servicios', color: 'text-blue-600' },
  salarios: { label: 'Salarios', color: 'text-purple-600' },
  alquiler: { label: 'Alquiler', color: 'text-orange-600' },
  mantenimiento: { label: 'Mantenimiento', color: 'text-yellow-600' },
  marketing: { label: 'Marketing', color: 'text-pink-600' },
  equipamiento: { label: 'Equipamiento', color: 'text-indigo-600' },
  impuestos: { label: 'Impuestos', color: 'text-red-600' },
  otros: { label: 'Otros', color: 'text-gray-600' },
};

const paymentMethodConfig: Record<PaymentMethod, { label: string }> = {
  efectivo: { label: 'Efectivo' },
  transferencia: { label: 'Transferencia' },
  tarjeta: { label: 'Tarjeta' },
  cheque: { label: 'Cheque' },
};

// Formateador de moneda para guaraníes
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formateador de moneda compacta para cards (ej: ₲ 270K)
const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `₲ ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₲ ${Math.round(amount / 1000)}K`;
  }
  return `₲ ${amount}`;
};

// Formateador de fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Helper para obtener el rango de fechas según el período
const getDateRange = (period: TimePeriod): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      start.setDate(now.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};

// Filtrar gastos por período
const filterExpensesByPeriod = (expenses: Expense[], period: TimePeriod): Expense[] => {
  const { start, end } = getDateRange(period);

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date + 'T00:00:00');
    return expenseDate >= start && expenseDate <= end;
  });
};

export default function Expenses() {
  const navigate = useNavigate();

  // Estado de datos
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  // Estado del período
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers del SlidePanel
  const handleCreate = () => {
    setSelectedExpense(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedExpense(null);
  };

  const handleSubmit = async (data: Omit<Expense, 'id'>) => {
    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedExpense) {
      // Editar
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === selectedExpense.id ? { ...data, id: selectedExpense.id } : e
        )
      );
    } else {
      // Crear
      const newExpense: Expense = {
        ...data,
        id: `${Date.now()}`,
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }

    setIsSubmitting(false);
    handleClosePanel();
  };

  // Handlers del ConfirmDialog
  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 600));

    setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Otros handlers
  const handleExport = () => {
    console.log('Exportar gastos');
    // TODO: descargar excel
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // TODO: modal de filtros
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Fecha',
        cell: (info) => (
          <span className="flex items-center gap-1.5 text-xs">
            <IconCalendar size={14} className="text-gray-400" />
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Categoría',
        cell: (info) => {
          const category = info.getValue();
          const config = categoryConfig[category];
          return (
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      }),
      columnHelper.accessor('description', {
        header: 'Descripción',
        cell: (info) => (
          <div>
            <p className="text-xs text-gray-800 line-clamp-1">{info.getValue()}</p>
            {info.row.original.supplierName && (
              <p className="text-xs text-gray-500">{info.row.original.supplierName}</p>
            )}
          </div>
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Monto',
        cell: (info) => (
          <span className="font-semibold text-gray-800">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Método',
        cell: (info) => {
          const method = info.getValue();
          const config = paymentMethodConfig[method];
          return <span className="text-xs text-gray-600">{config.label}</span>;
        },
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const config = statusConfig[status];
          return <Badge variant={config.variant} size="xxs">{config.label}</Badge>;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <ActionButtons
            actions={[
              {
                icon: <IconEdit size={18} />,
                onClick: () => handleEdit(info.row.original),
                label: 'Editar',
              },
              {
                icon: <IconTrash size={18} />,
                onClick: () => handleDeleteClick(info.row.original),
                label: 'Eliminar',
                variant: 'danger',
              },
            ]}
          />
        ),
      }),
    ],
    []
  );

  // Calcular totales filtrados por período
  const filteredExpenses = useMemo(
    () => filterExpensesByPeriod(expenses, selectedPeriod),
    [expenses, selectedPeriod]
  );

  const totalPagado = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.status === 'pagado')
        .reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const totalPendiente = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.status === 'pendiente')
        .reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const totalGeneral = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.status !== 'anulado')
        .reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const handleRefresh = () => {
    // TODO: Recargar datos del servidor
    console.log('Actualizando datos...');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-2 lg:px-6 py-8">
      {/* Header con botón crear */}
      <div className="flex items-start justify-between">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Gastos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registra y administra los gastos del negocio
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PeriodSelector
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            onRefresh={handleRefresh}
          />
          <Button
            variant="gradient"
            icon={<IconPlus size={18} />}
            onClick={handleCreate}
            className="max-w-50 text-sm!"
          >
            Nuevo Gasto
          </Button>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total del Período"
          value={formatCurrencyCompact(totalGeneral)}
          subtitle={`${filteredExpenses.filter((e) => e.status !== 'anulado').length} gastos registrados`}
          icon={<IconReceipt size={22} />}
          variant="default"
        />
        <StatCard
          title="Total Pagado"
          value={formatCurrencyCompact(totalPagado)}
          subtitle={`${filteredExpenses.filter((e) => e.status === 'pagado').length} gastos pagados`}
          icon={<IconCheck size={22} />}
          variant="success"
        />
        <StatCard
          title="Total Pendiente"
          value={formatCurrencyCompact(totalPendiente)}
          subtitle={`${filteredExpenses.filter((e) => e.status === 'pendiente').length} gastos pendientes`}
          icon={<IconClock size={22} />}
          variant="warning"
        />
      </div>

      {/* Tabla */}
      <Table<Expense>
        title={<IconReceipt />}
        data={expenses}
        columns={columns}
        searchPlaceholder="Buscar gasto..."
        onExport={handleExport}
        onFilter={handleFilter}
        pageSize={5}
      />

      {/* SlidePanel para Crear/Editar */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
        width="w-full max-w-xl"
      >
        <ExpenseForm
          key={selectedExpense?.id ?? 'new'}
          expense={selectedExpense}
          onSubmit={handleSubmit}
          onCancel={handleClosePanel}
          loading={isSubmitting}
        />
      </SlidePanel>

      {/* ConfirmDialog para Eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar gasto"
        message={
          <>
            ¿Estás seguro de eliminar el gasto{' '}
            <span className="font-semibold">"{expenseToDelete?.description}"</span> por{' '}
            <span className="font-semibold">{expenseToDelete ? formatCurrency(expenseToDelete.amount) : ''}</span>?
            Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}