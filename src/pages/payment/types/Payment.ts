// Tipos para el módulo de pagos de clientes

// Estado del pedido respecto a pagos
export type OrderPaymentStatus = 'pendiente' | 'parcial' | 'pagado' | 'anulado';

// Métodos de pago disponibles
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';

// Ítem de un pedido
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Pedido con información de pagos
export interface Order {
  id: string;
  clientId: string;
  date: string;
  items: OrderItem[];
  total: number;
  paid: number;           // Monto ya pagado
  balance: number;        // total - paid (saldo pendiente)
  status: OrderPaymentStatus;
  deliveryAddress?: string;
  notes?: string;
}

// Distribución de pago a pedidos específicos
export interface OrderPaymentAllocation {
  orderId: string;
  amount: number;
}

// Registro de un pago realizado
export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  allocations: OrderPaymentAllocation[];  // Cómo se distribuyó el pago
  notes?: string;
  receiptNumber?: string;
  createdAt: string;
}

// Resumen de deuda de un cliente
export interface ClientDebtSummary {
  clientId: string;
  clientName: string;
  totalDebt: number;
  pendingOrders: number;
  oldestDebtDate?: string;
}

// Labels para métodos de pago
export const paymentMethodLabels: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  cheque: 'Cheque',
};

// Labels para estados de pedido
export const orderStatusLabels: Record<OrderPaymentStatus, string> = {
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  pagado: 'Pagado',
  anulado: 'Anulado',
};

// Configuración de variantes de badge por estado
export const orderStatusVariants: Record<OrderPaymentStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  pendiente: 'warning',
  parcial: 'neutral',
  pagado: 'success',
  anulado: 'error',
};