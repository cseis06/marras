import { useState } from 'react';
import {
  IconArrowDown,
  IconArrowUp,
  IconAdjustments,
} from '@tabler/icons-react';
import {
  //TransactionStatus,
  getTransactionStatusLabel,
  getTransactionStatusVariant,
} from '../types/Debt';
import type { Transaction } from '../types/Debt';

interface TransactionsTabProps {
  transactions: Transaction[];
}

type TransactionFilter = 'all' | 'purchase' | 'payment' | 'pending';

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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getBadgeClasses = (
  variant: 'success' | 'warning' | 'danger' | 'info'
): string => {
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
  switch (variant) {
    case 'success':
      return `${base} bg-green-100 text-green-700`;
    case 'warning':
      return `${base} bg-yellow-100 text-yellow-700`;
    case 'danger':
      return `${base} bg-red-100 text-red-700`;
    case 'info':
      return `${base} bg-blue-100 text-blue-700`;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'purchase':
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <IconArrowUp size={16} className="text-red-600" />
        </div>
      );
    case 'payment':
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <IconArrowDown size={16} className="text-green-600" />
        </div>
      );
    case 'adjustment':
      return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <IconAdjustments size={16} className="text-gray-600" />
        </div>
      );
  }
};

const filterOptions: { value: TransactionFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'purchase', label: 'Compras' },
  { value: 'payment', label: 'Pagos' },
  { value: 'pending', label: 'Pendientes' },
];

export const TransactionsTab = ({ transactions }: TransactionsTabProps) => {
  const [filter, setFilter] = useState<TransactionFilter>('all');

  const filteredTransactions = transactions.filter((t) => {
    switch (filter) {
      case 'purchase':
        return t.type === 'purchase';
      case 'payment':
        return t.type === 'payment';
      case 'pending':
        return t.status === 'pending' || t.status === 'overdue';
      default:
        return true;
    }
  });

  // Calcular totales
  const totalDebt = transactions
    .filter((t) => t.type === 'purchase' && t.status !== 'paid')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPayments = transactions
    .filter((t) => t.type === 'payment')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Resumen rápido */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <p className="text-xs text-red-600 font-medium">Deuda Pendiente</p>
          <p className="text-lg font-bold text-red-700">
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Total Pagado</p>
          <p className="text-lg font-bold text-green-700">
            {formatCurrency(totalPayments)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de transacciones */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay movimientos para mostrar
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                {getTypeIcon(transaction.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.concept}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        transaction.type === 'payment'
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {transaction.type === 'payment' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={getBadgeClasses(
                        getTransactionStatusVariant(transaction.status)
                      )}
                    >
                      {getTransactionStatusLabel(transaction.status)}
                    </span>
                    {transaction.daysOverdue > 0 && transaction.status !== 'paid' && (
                      <span className="text-xs text-red-600 font-medium">
                        {transaction.daysOverdue} días de atraso
                      </span>
                    )}
                    {transaction.paidAmount &&
                      transaction.paidAmount < transaction.amount && (
                        <span className="text-xs text-blue-600">
                          Pagado: {formatCurrency(transaction.paidAmount)}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {filteredTransactions.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-right">
            {filteredTransactions.length} movimiento
            {filteredTransactions.length !== 1 ? 's' : ''} encontrado
            {filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};