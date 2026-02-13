import { useState, useMemo, useCallback } from 'react';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import CurrencyInput from '../../../components/ui/CurrencyInput';
import DateInput from '../../../components/ui/DateInput';
import type { SelectOption } from '../../../components/ui/Select';
import type { Order, Payment, PaymentMethod, OrderPaymentAllocation } from '../types/Payment';
import { IconInfoCircle } from '@tabler/icons-react';

interface PaymentFormProps {
  clientId: string;
  clientName: string;
  selectedOrders: Order[];
  totalSelected: number;
  onSubmit: (data: Omit<Payment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const paymentMethodOptions: SelectOption[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
  { value: 'cheque', label: 'Cheque' },
];

// Formateador de moneda
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PaymentForm({
  clientId,
  clientName,
  selectedOrders,
  totalSelected,
  onSubmit,
  onCancel,
  loading,
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: totalSelected,
    paymentMethod: 'efectivo' as PaymentMethod,
    notes: '',
    receiptNumber: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calcular distribución del pago (FIFO - más antiguo primero)
  // Memoizado con useCallback para satisfacer al React Compiler
  const calculateAllocations = useCallback(
    (paymentAmount: number): OrderPaymentAllocation[] => {
      const allocations: OrderPaymentAllocation[] = [];
      let remaining = paymentAmount;

      // Ordenar por fecha (más antiguo primero)
      const sortedOrders = [...selectedOrders].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      for (const order of sortedOrders) {
        if (remaining <= 0) break;

        const allocationAmount = Math.min(remaining, order.balance);
        if (allocationAmount > 0) {
          allocations.push({
            orderId: order.id,
            amount: allocationAmount,
          });
          remaining -= allocationAmount;
        }
      }

      return allocations;
    },
    [selectedOrders]
  );

  // Previsualización de la distribución
  const previewAllocations = useMemo(() => {
    return calculateAllocations(formData.amount);
  }, [calculateAllocations, formData.amount]);

  // Validaciones
  const isValidAmount = formData.amount > 0 && formData.amount <= totalSelected;
  const canSubmit = isValidAmount && formData.date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const allocations = calculateAllocations(formData.amount);

    const paymentData: Omit<Payment, 'id' | 'createdAt'> = {
      clientId,
      clientName,
      date: formData.date,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      allocations,
      notes: formData.notes || undefined,
      receiptNumber: formData.receiptNumber || undefined,
    };

    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen de selección */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <IconInfoCircle size={18} className="text-blue-600" />
          <span className="font-medium text-blue-800">Resumen de selección</span>
        </div>
        <div className="space-y-1 text-sm text-blue-700">
          <p>Cliente: <span className="font-semibold">{clientName}</span></p>
          <p>Pedidos seleccionados: <span className="font-semibold">{selectedOrders.length}</span></p>
          <p>Total a pagar: <span className="font-semibold">{formatCurrency(totalSelected)}</span></p>
        </div>
      </div>

      {/* Información del pago */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información del pago</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <DateInput
              label="Fecha de pago"
              value={formData.date}
              onChange={(value) => handleChange('date', value)}
              required
            />
            <Select
              label="Método de pago"
              options={paymentMethodOptions}
              value={formData.paymentMethod}
              onChange={(value) => handleChange('paymentMethod', value)}
              name="paymentMethod"
              required
            />
          </div>

          <CurrencyInput
            label="Monto del pago"
            value={formData.amount}
            onChange={(value) => handleChange('amount', value)}
            required
            className="mt-4"
          />
          
          {formData.amount > totalSelected && (
            <p className="text-xs text-red-500 mt-1">
              El monto no puede superar el total seleccionado ({formatCurrency(totalSelected)})
            </p>
          )}

          {formData.amount < totalSelected && formData.amount > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Pago parcial: quedará un saldo de {formatCurrency(totalSelected - formData.amount)}
            </p>
          )}
        </div>
      </div>

      {/* Distribución del pago */}
      {previewAllocations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Distribución del pago</h3>
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            {previewAllocations.map((allocation) => {
              const order = selectedOrders.find((o) => o.id === allocation.orderId);
              if (!order) return null;

              const willBeFullyPaid = allocation.amount >= order.balance;

              return (
                <div 
                  key={allocation.orderId}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <span className="text-gray-700">Pedido del {new Date(order.date + 'T00:00:00').toLocaleDateString('es-PY')}</span>
                    {willBeFullyPaid && (
                      <span className="ml-2 text-xs text-green-600 font-medium">✓ Saldado</span>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(allocation.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información adicional</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <TextArea
              label="Observaciones (opcional)"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              placeholder="Ej: Pago en cuotas acordado con el cliente"
            />
          </div>
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outlined"
          textColor="text-gray-600"
          bgColor="bg-gray-400"
          onClick={onCancel}
          disabled={loading}
          className="text-sm!"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="gradient"
          disabled={loading || !canSubmit}
          className="text-sm!"
        >
          {loading ? 'Procesando...' : `Registrar pago de ${formatCurrency(formData.amount)}`}
        </Button>
      </div>
    </form>
  );
}