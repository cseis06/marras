// Enums
export type DebtStatus = 'current' | 'overdue' | 'in_collection';
export type DebtSeverity = 'low' | 'moderate' | 'critical';
export type TransactionType = 'purchase' | 'payment' | 'adjustment';
export type TransactionStatus = 'paid' | 'pending' | 'overdue' | 'partial';

// Interfaces principales
export interface ClientDebt {
  id: string;
  code: string;
  document: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  status: DebtStatus;
  currentDebt: number;
  lastPurchase: Date | null;
  lastPayment: Date | null;
  daysOverdue: number;
  score: number; // 0-100
  totalHistoric: number;
  purchaseCount: number;
  onTimePaymentCount: number;
  averagePaymentDays: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  date: Date;
  type: TransactionType;
  concept: string;
  amount: number;
  status: TransactionStatus;
  daysOverdue: number;
  dueDate: Date;
  paidAmount?: number;
}

export interface CollectionNote {
  id: string;
  clientId: string;
  date: Date;
  type: 'call' | 'visit' | 'whatsapp' | 'email' | 'other';
  description: string;
  result: 'successful' | 'no_response' | 'payment_promise' | 'rejected';
  nextFollowUp?: Date;
  createdBy: string;
}

export interface PaymentRecord {
  clientId: string;
  amount: number;
  date: Date;
  appliedTransactions: string[]; // IDs de transacciones
  notes?: string;
}

// Estadísticas
export interface DebtStats {
  totalPending: number;
  totalPendingPrevious: number;
  overdueClients: number;
  overdueClientsPrevious: number;
  overdueRate: number;
  overdueRatePrevious: number;
  recoveredPeriod: number;
  recoveredPeriodPrevious: number;
}

export interface ClientRanking {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  score: number;
  totalHistoric?: number;
  pendingDebt?: number;
  daysOverdue?: number;
  severity?: DebtSeverity;
}

export const getFullName = (client: { firstName: string; lastName: string }): string => {
  return `${client.firstName} ${client.lastName}`.trim();
};

// Filtros
export interface DebtFilters {
  search: string;
  status: DebtStatus | 'all';
  aging: 'all' | '0-30' | '31-60' | '61-90' | '90+';
  startDate: Date | null;
  endDate: Date | null;
}

// Helpers
export const getStatusLabel = (status: DebtStatus): string => {
  const labels: Record<DebtStatus, string> = {
    current: 'Al día',
    overdue: 'Moroso',
    in_collection: 'En gestión',
  };
  return labels[status];
};

export const getStatusVariant = (status: DebtStatus): 'success' | 'danger' | 'warning' => {
  const variants: Record<DebtStatus, 'success' | 'danger' | 'warning'> = {
    current: 'success',
    overdue: 'danger',
    in_collection: 'warning',
  };
  return variants[status];
};

export const getSeverityFromDays = (days: number): DebtSeverity => {
  if (days <= 30) return 'low';
  if (days <= 60) return 'moderate';
  return 'critical';
};

export const getSeverityLabel = (severity: DebtSeverity): string => {
  const labels: Record<DebtSeverity, string> = {
    low: 'Leve',
    moderate: 'Moderado',
    critical: 'Crítico',
  };
  return labels[severity];
};

export const getSeverityVariant = (severity: DebtSeverity): 'warning' | 'danger' => {
  if (severity === 'low') return 'warning';
  return 'danger';
};

export const getTransactionStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<TransactionStatus, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
    overdue: 'Vencido',
    partial: 'Pago parcial',
  };
  return labels[status];
};

export const getTransactionStatusVariant = (
  status: TransactionStatus
): 'success' | 'warning' | 'danger' | 'info' => {
  const variants: Record<TransactionStatus, 'success' | 'warning' | 'danger' | 'info'> = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
    partial: 'info',
  };
  return variants[status];
};

export const calculateScore = (client: {
  purchaseCount: number;
  onTimePaymentCount: number;
  daysOverdue: number;
  averagePaymentDays: number;
}): number => {
  // Score base por % de pagos a tiempo
  const onTimePercentage =
    client.purchaseCount > 0
      ? (client.onTimePaymentCount / client.purchaseCount) * 100
      : 100;

  // Penalización por días de atraso actual
  const overduePenalty = Math.min(client.daysOverdue * 0.5, 30);

  // Penalización por promedio de días de pago
  const averagePenalty = Math.min(client.averagePaymentDays * 0.3, 20);

  const score = Math.max(0, Math.min(100, onTimePercentage - overduePenalty - averagePenalty));

  return Math.round(score);
};

export const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Muy bueno';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Regular';
  return 'Crítico';
};

export const getScoreVariant = (score: number): 'success' | 'warning' | 'danger' => {
  if (score >= 75) return 'success';
  if (score >= 40) return 'warning';
  return 'danger';
};