import { useMemo, useState, useCallback } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  IconArrowLeft,
  IconCash,
  IconReceipt,
  IconChecks,
  IconClock,
  IconCalendar,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SlidePanel from '../../components/ui/SlidePanel';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatCard from '../../components/ui/StatCard';
import ClientSelector from './components/ClientSelector';
import PaymentForm from './components/PaymentForm';
import { orders as initialOrders } from './data/Orders';
import { payments as initialPayments, generateReceiptNumber } from './data/Payments';
import { clients } from '../clients/data/Clients';
import type { Order, Payment, OrderPaymentStatus } from './types/Payment';
import type { Client } from '../clients/types/Client';

const columnHelper = createColumnHelper<Order>();

// Configuración de estados
const statusConfig: Record<OrderPaymentStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pendiente: { label: 'Pendiente', variant: 'warning' },
  parcial: { label: 'Parcial', variant: 'neutral' },
  pagado: { label: 'Pagado', variant: 'success' },
  anulado: { label: 'Anulado', variant: 'error' },
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

// Formateador de moneda compacta para cards
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

export default function Payments() {
  const navigate = useNavigate();

  // Estado de datos
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [, setPayments] = useState<Payment[]>(initialPayments);

  // Estado de selección de cliente
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Estado de selección de pedidos (checkboxes)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Estado del SlidePanel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del ConfirmDialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<Omit<Payment, 'id' | 'createdAt'> | null>(null);

  // Pedidos pendientes del cliente seleccionado
  const clientOrders = useMemo(() => {
    if (!selectedClient) return [];
    return orders.filter(
      (order) =>
        order.clientId === selectedClient.id &&
        order.status !== 'pagado' &&
        order.status !== 'anulado'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedClient, orders]);

  // Pedidos seleccionados
  const selectedOrders = useMemo(() => {
    return clientOrders.filter((order) => selectedOrderIds.has(order.id));
  }, [clientOrders, selectedOrderIds]);

  // Calcular totales
  const totalDebt = useMemo(() => {
    return clientOrders.reduce((sum, order) => sum + order.balance, 0);
  }, [clientOrders]);

  const totalSelected = useMemo(() => {
    return selectedOrders.reduce((sum, order) => sum + order.balance, 0);
  }, [selectedOrders]);

  // Handlers de selección de cliente
  const handleSelectClient = (client: Client | null) => {
    setSelectedClient(client);
    setSelectedOrderIds(new Set());
  };

  // Handlers de selección de pedidos
  const handleToggleOrder = useCallback((orderId: string) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedOrderIds.size === clientOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(clientOrders.map((o) => o.id)));
    }
  }, [clientOrders, selectedOrderIds.size]);

  // Handlers del pago
  const handleOpenPaymentPanel = () => {
    if (selectedOrders.length === 0) return;
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handlePaymentSubmit = (data: Omit<Payment, 'id' | 'createdAt'>) => {
    setPendingPayment(data);
    setIsConfirmOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!pendingPayment) return;

    setIsSubmitting(true);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Crear el nuevo pago
    const newPayment: Payment = {
      ...pendingPayment,
      id: `pay-${Date.now()}`,
      receiptNumber: pendingPayment.receiptNumber || generateReceiptNumber(),
      createdAt: new Date().toISOString(),
    };

    // Actualizar los pedidos con los pagos aplicados
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        const allocation = pendingPayment.allocations.find((a) => a.orderId === order.id);
        if (!allocation) return order;

        const newPaid = order.paid + allocation.amount;
        const newBalance = order.total - newPaid;
        const newStatus: OrderPaymentStatus = newBalance <= 0 ? 'pagado' : 'parcial';

        return {
          ...order,
          paid: newPaid,
          balance: Math.max(0, newBalance),
          status: newStatus,
        };
      });
    });

    // Agregar el pago al historial
    setPayments((prev) => [newPayment, ...prev]);

    // Limpiar estados
    setSelectedOrderIds(new Set());
    setIsSubmitting(false);
    setIsConfirmOpen(false);
    setPendingPayment(null);
    setIsPanelOpen(false);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setPendingPayment(null);
  };

  // Columnas de la tabla
  const columns = useMemo(
    () => [
      // Columna de checkbox
      columnHelper.display({
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={selectedOrderIds.size === clientOrders.length && clientOrders.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 
                       focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
        ),
        cell: (info) => (
          <input
            type="checkbox"
            checked={selectedOrderIds.has(info.row.original.id)}
            onChange={() => handleToggleOrder(info.row.original.id)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 
                       focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Fecha',
        cell: (info) => (
          <span className="flex items-center gap-1.5 text-xs">
            <IconCalendar size={14} className="text-gray-400" />
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: (info) => (
          <span className="font-medium text-gray-700">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('paid', {
        header: 'Pagado',
        cell: (info) => (
          <span className="text-green-600">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('balance', {
        header: 'Saldo',
        cell: (info) => (
          <span className="font-semibold text-gray-800">
            {formatCurrency(info.getValue())}
          </span>
        ),
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
        id: 'items',
        header: 'Detalle',
        cell: (info) => (
          <span className="text-xs text-gray-500">
            {info.row.original.items.length} {info.row.original.items.length === 1 ? 'ítem' : 'ítems'}
          </span>
        ),
      }),
    ],
    [selectedOrderIds, clientOrders.length, handleSelectAll, handleToggleOrder]
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-2 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <IconArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Registro de Pagos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los pagos de clientes y sus pedidos pendientes
          </p>
        </div>
      </div>

      {/* Selector de cliente */}
      <ClientSelector
        clients={clients}
        selectedClient={selectedClient}
        onSelect={handleSelectClient}
      />

      {/* Contenido cuando hay cliente seleccionado */}
      {selectedClient && (
        <>
          {/* Cards de resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Deuda Total"
              value={formatCurrencyCompact(totalDebt)}
              subtitle={`${clientOrders.length} pedidos pendientes`}
              icon={<IconReceipt size={22} />}
              variant="default"
            />
            <StatCard
              title="Seleccionado"
              value={formatCurrencyCompact(totalSelected)}
              subtitle={`${selectedOrders.length} pedidos seleccionados`}
              icon={<IconChecks size={22} />}
              variant={selectedOrders.length > 0 ? 'success' : 'default'}
            />
            <StatCard
              title="Saldo Restante"
              value={formatCurrencyCompact(totalDebt - totalSelected)}
              subtitle="Después del pago"
              icon={<IconClock size={22} />}
              variant={totalDebt - totalSelected > 0 ? 'warning' : 'success'}
            />
          </div>

          {/* Tabla de pedidos y botón de pago */}
          <div className="flex flex-col gap-4">
            {/* Botón de registrar pago */}
            <div className="flex justify-end">
              <Button
                variant="gradient"
                icon={<IconCash size={18} />}
                onClick={handleOpenPaymentPanel}
                disabled={selectedOrders.length === 0}
                className="text-sm!"
              >
                Registrar Pago ({formatCurrency(totalSelected)})
              </Button>
            </div>

            {/* Tabla de pedidos pendientes */}
            {clientOrders.length > 0 ? (
              <Table<Order>
                title={<IconReceipt />}
                data={clientOrders}
                columns={columns}
                searchPlaceholder="Buscar pedido..."
                pageSize={5}
              />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <IconChecks size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ¡Sin deudas pendientes!
                </h3>
                <p className="text-gray-500">
                  Este cliente no tiene pedidos pendientes de pago.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mensaje cuando no hay cliente seleccionado */}
      {!selectedClient && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <IconCash size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Selecciona un cliente
          </h3>
          <p className="text-gray-500">
            Busca un cliente para ver sus pedidos pendientes y registrar pagos.
          </p>
        </div>
      )}

      {/* SlidePanel para registrar pago */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title="Registrar Pago"
        width="w-full max-w-xl"
      >
        {selectedClient && selectedOrders.length > 0 && (
          <PaymentForm
            clientId={selectedClient.id}
            clientName={`${selectedClient.firstName} ${selectedClient.lastName}`}
            selectedOrders={selectedOrders}
            totalSelected={totalSelected}
            onSubmit={handlePaymentSubmit}
            onCancel={handleClosePanel}
            loading={isSubmitting}
          />
        )}
      </SlidePanel>

      {/* ConfirmDialog para confirmar pago */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmPayment}
        title="Confirmar pago"
        message={
          <>
            ¿Confirmas el registro del pago de{' '}
            <span className="font-semibold">
              {pendingPayment ? formatCurrency(pendingPayment.amount) : ''}
            </span>{' '}
            para <span className="font-semibold">{pendingPayment?.clientName}</span>?
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Se aplicará a {pendingPayment?.allocations.length} pedido(s).
            </span>
          </>
        }
        confirmText="Confirmar Pago"
        cancelText="Cancelar"
        variant="success"
        loading={isSubmitting}
      />
    </div>
  );
}