import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconEye,
  IconCash,
  IconBell,
  IconReceipt,
  IconX,
} from '@tabler/icons-react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import ActionButtons from '../../../components/ui/ActionButtons';
import Select from '../../../components/ui/Select';
import {
  getStatusLabel,
  getStatusVariant,
} from '../types/Debt';
import type { ClientDebt, DebtStatus, DebtFilters } from '../types/Debt';

interface DebtTableProps {
  clients: ClientDebt[];
  filters: DebtFilters;
  onViewDetail: (client: ClientDebt) => void;
  onRegisterPayment?: (client: ClientDebt) => void;
  onSendReminder?: (client: ClientDebt) => void;
  onUpdateFilter: <K extends keyof DebtFilters>(key: K, value: DebtFilters[K]) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'current', label: 'Al día' },
  { value: 'overdue', label: 'Moroso' },
  { value: 'in_collection', label: 'En gestión' },
];

const agingOptions = [
  { value: 'all', label: 'Todas las antigüedades' },
  { value: '0-30', label: '0 - 30 días' },
  { value: '31-60', label: '31 - 60 días' },
  { value: '61-90', label: '61 - 90 días' },
  { value: '90+', label: 'Más de 90 días' },
];

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

const formatDate = (date: Date | null): string => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};

// Mapeo de variantes para Badge
const statusVariantMap: Record<'success' | 'warning' | 'danger', 'success' | 'warning' | 'error'> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

const ScoreBar = ({ score }: { score: number }) => {
  let barColor = 'bg-red-500';
  if (score >= 75) barColor = 'bg-green-500';
  else if (score >= 40) barColor = 'bg-yellow-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 min-w-[24px]">
        {score}
      </span>
    </div>
  );
};

const columnHelper = createColumnHelper<ClientDebt>();

export const DebtTable = ({
  clients,
  filters,
  onViewDetail,
  onRegisterPayment,
  onSendReminder,
  onUpdateFilter,
  onClearFilters,
}: DebtTableProps) => {

  const [showFilters, setShowFilters] = useState(false);

  // Verificar si hay filtros activos
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.aging !== 'all';

  const columns = useMemo(
    () => [
      columnHelper.accessor('document', {
        header: 'Cédula',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'Cliente',
        cell: (info) => (
          <div>
            <p className="font-medium text-gray-900">{info.getValue()}</p>
            <p className="text-xs text-gray-500">{info.row.original.code}</p>
          </div>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Teléfono',
        cell: (info) => <span className="text-xs text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('currentDebt', {
        header: 'Deuda Actual',
        cell: (info) => (
          <span
            className={`font-medium ${
              info.getValue() > 0 ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('lastPayment', {
        header: 'Último Pago',
        cell: (info) => (
          <span className="text-xs text-gray-600">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('daysOverdue', {
        header: 'Días Atraso',
        cell: (info) => {
          const days = info.getValue();
          let colorClass = 'text-gray-500';
          if (days > 0 && days <= 30) colorClass = 'text-yellow-600';
          else if (days > 30 && days <= 60) colorClass = 'text-orange-600';
          else if (days > 60) colorClass = 'text-red-600';

          return (
            <span className={`font-medium ${colorClass}`}>
              {days > 0 ? days : '-'}
            </span>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const variant = getStatusVariant(status);
          return (
            <Badge variant={statusVariantMap[variant]} size="xxs">
              {getStatusLabel(status)}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('score', {
        header: 'Score',
        cell: (info) => <ScoreBar score={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const client = info.row.original;
          const actions = [
            {
              icon: <IconEye size={18} />,
              onClick: () => onViewDetail(client),
              label: 'Ver historial',
            },
          ];

          if (client.currentDebt > 0) {
            actions.push(
              {
                icon: <IconCash size={18} />,
                onClick: () => onRegisterPayment?.(client),
                label: 'Registrar pago',
              },
              {
                icon: <IconBell size={18} />,
                onClick: () => onSendReminder?.(client),
                label: 'Enviar recordatorio',
              }
            );
          }

          return <ActionButtons actions={actions} />;
        },
      }),
    ],
    [onViewDetail, onRegisterPayment, onSendReminder]
  );

  const handleExport = () => {
    console.log('Exportar historial de morosidad');
    // TODO: implementar exportación
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  // Panel de filtros
  const FilterPanel = showFilters ? (
    <div className="px-4 pb-4 pt-3 border-b border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Estado */}
        <Select
          label="Estado"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onUpdateFilter('status', value as DebtStatus | 'all')}
        />

        {/* Antigüedad */}
        <Select
          label="Antigüedad de deuda"
          options={agingOptions}
          value={filters.aging}
          onChange={(value) => onUpdateFilter('aging', value as typeof filters.aging)}
        />

        {/* Limpiar filtros */}
        <div className="flex items-end pb-1">
          <button
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconX size={14} />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <Table<ClientDebt>
      title={<IconReceipt />}
      data={clients}
      columns={columns}
      searchPlaceholder="Buscar por nombre, cédula o teléfono..."
      onExport={handleExport}
      onFilter={handleFilter}
      pageSize={5}
      filterPanel={FilterPanel}
      filterActive={hasActiveFilters || showFilters}
    />
  );
};