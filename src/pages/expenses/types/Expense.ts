export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export const timePeriodLabels: Record<TimePeriod, string> = {
  day: 'Hoy',
  week: 'Esta Semana',
  month: 'Este Mes',
  year: 'Este Año',
};

export type ExpenseCategory =
  | 'ingredientes'
  | 'servicios'
  | 'salarios'
  | 'alquiler'
  | 'mantenimiento'
  | 'marketing'
  | 'equipamiento'
  | 'impuestos'
  | 'otros';

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';

export type ExpenseStatus = 'pendiente' | 'pagado' | 'anulado';

export interface Expense {
  id: string;
  date: string;                // Fecha del gasto (ISO string)
  category: ExpenseCategory;
  description: string;
  amount: number;              // Monto en guaraníes
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  supplierName?: string;       // Nombre del proveedor (opcional)
  invoiceNumber?: string;      // Número de factura/comprobante (opcional)
  notes?: string;              // Observaciones (opcional)
}