import { useState } from 'react';
import {
  IconUser,
  IconCalendar,
  IconReceipt,
  IconTag,
  IconCheck,
  IconX,
  IconLoader2,
  IconRepeat,
} from '@tabler/icons-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import type { Client, Location } from '../clients/types/Client';
import type { OrderItem, DiscountCode, RecurrenceConfig } from './types/order';
import { discountCodes } from './data/order';
import { weekDayLabels, ALL_WEEK_DAYS } from './types/order';

interface OrderSummaryProps {
  orderNumber: string;
  client: Client | null;
  location: Location | null;
  deliveryDate: string;
  items: OrderItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  discount: { code: string; amount: number } | null;
  total: number;
  recurrence?: RecurrenceConfig;
  onApplyDiscount: (code: DiscountCode, amount: number) => void;
  onRemoveDiscount: () => void;
  onConfirm: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const delinquencyLabels: Record<string, { text: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  al_dia: { text: 'Al día', variant: 'success' },
  pendiente: { text: 'Pendiente', variant: 'warning' },
  atrasado: { text: 'Atrasado', variant: 'error' },
  moroso: { text: 'Moroso', variant: 'error' },
};

export default function OrderSummary({
  orderNumber,
  client,
  location,
  deliveryDate,
  items,
  subtotal,
  packagingFee,
  deliveryFee,
  discount,
  total,
  recurrence,
  onApplyDiscount,
  onRemoveDiscount,
  onConfirm,
  onSaveDraft,
  isSubmitting = false,
}: OrderSummaryProps) {
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) {
      setDiscountError('Ingresa un código');
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError('');

    // Simular delay de validación
    setTimeout(() => {
      const foundCode = discountCodes.find(
        (dc) => dc.code.toLowerCase() === discountInput.trim().toLowerCase() && dc.active
      );

      if (!foundCode) {
        setDiscountError('Código inválido o expirado');
        setIsApplyingDiscount(false);
        return;
      }

      if (foundCode.minAmount && subtotal < foundCode.minAmount) {
        setDiscountError(`Mínimo ₲ ${formatCurrency(foundCode.minAmount)} para este código`);
        setIsApplyingDiscount(false);
        return;
      }

      let discountAmount = 0;
      if (foundCode.type === 'percentage') {
        discountAmount = Math.round(subtotal * (foundCode.value / 100));
        if (foundCode.maxDiscount) {
          discountAmount = Math.min(discountAmount, foundCode.maxDiscount);
        }
      } else {
        discountAmount = foundCode.value;
      }

      onApplyDiscount(foundCode, discountAmount);
      setDiscountInput('');
      setIsApplyingDiscount(false);
    }, 500);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PY', {
      day: 'numeric',
      month: 'short',
    });
  };

  const canConfirm = client && location && deliveryDate && items.length > 0 && 
    (!recurrence?.enabled || (recurrence.days.length > 0 && recurrence.startDate));

  const isRecurring = recurrence?.enabled && recurrence.days.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Resumen del Pedido
            </h3>
            <p className="text-sm text-gray-500">Nuevo Pedido #{orderNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            {isRecurring && (
              <Badge variant="info" size="xxs">
                RECURRENTE
              </Badge>
            )}
            <Badge variant="neutral" size="xxs">
              BORRADOR
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Cliente seleccionado */}
        {client ? (
          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
            <div className="p-2 bg-emerald-100 rounded-full">
              <IconUser size={18} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wide font-medium">
                Cliente Seleccionado
              </p>
              <p className="font-semibold text-gray-800 truncate">
                {client.firstName} {client.lastName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant={delinquencyLabels[client.delinquencyStatus].variant}
                  size="xxs"
                >
                  {delinquencyLabels[client.delinquencyStatus].text}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <IconUser size={18} className="text-gray-400" />
            <p className="text-sm text-gray-400">Sin cliente seleccionado</p>
          </div>
        )}

        {/* Fecha de entrega / Recurrencia */}
        {isRecurring ? (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <IconRepeat size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-blue-600 uppercase tracking-wide font-medium">
                Pedido Recurrente
              </p>
              <p className="font-semibold text-gray-800">
                {recurrence.days.length === ALL_WEEK_DAYS.length
                  ? 'Todos los días hábiles'
                  : recurrence.days.map((d) => weekDayLabels[d]).join(', ')}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Desde {formatShortDate(recurrence.startDate)}
                {recurrence.endDate && ` hasta ${formatShortDate(recurrence.endDate)}`}
              </p>
              {location && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {location.alias} - {location.address}
                </p>
              )}
            </div>
          </div>
        ) : deliveryDate ? (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <IconCalendar size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-blue-600 uppercase tracking-wide font-medium">
                Fecha de Entrega
              </p>
              <p className="font-semibold text-gray-800 capitalize">
                {formatDate(deliveryDate)}
              </p>
              {location && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {location.alias} - {location.address}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <IconCalendar size={18} className="text-gray-400" />
            <p className="text-sm text-gray-400">Sin fecha seleccionada</p>
          </div>
        )}

        {/* Detalle de items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Detalle del Pedido
            </p>
            {items.length > 0 && (
              <span className="text-xs text-gray-500">
                {items.reduce((acc, item) => acc + item.quantity, 0)} platos
                {isRecurring && ' / día'}
              </span>
            )}
          </div>

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-medium text-gray-600">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700">{item.categoryName}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    ₲ {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <IconReceipt size={24} className="mx-auto text-gray-300 mb-1" />
              <p className="text-sm text-gray-400">
                Agrega categorías al pedido
              </p>
            </div>
          )}
        </div>

        {/* Separador y totales */}
        {items.length > 0 && (
          <>
            <hr className="border-gray-200" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal {isRecurring && '(por día)'}</span>
                <span>₲ {formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Empaque</span>
                <span>₲ {formatCurrency(packagingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {deliveryFee === 0 ? 'GRATIS' : `₲ ${formatCurrency(deliveryFee)}`}
                </span>
              </div>

              {/* Descuento aplicado */}
              {discount && (
                <div className="flex justify-between text-emerald-600">
                  <div className="flex items-center gap-1">
                    <span>Descuento ({discount.code})</span>
                    <button
                      type="button"
                      onClick={onRemoveDiscount}
                      className="p-0.5 hover:bg-emerald-100 rounded transition-colors"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                  <span>-₲ {formatCurrency(discount.amount)}</span>
                </div>
              )}
            </div>

            {/* Input de código de descuento */}
            {!discount && (
              <div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <IconTag
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={discountInput}
                      onChange={(e) => {
                        setDiscountInput(e.target.value.toUpperCase());
                        setDiscountError('');
                      }}
                      placeholder="Código de descuento"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount}
                    className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
                  >
                    {isApplyingDiscount ? (
                      <IconLoader2 size={16} className="animate-spin" />
                    ) : (
                      'Aplicar'
                    )}
                  </button>
                </div>
                {discountError && (
                  <p className="mt-1 text-xs text-red-500">{discountError}</p>
                )}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-700 font-medium">
                Total {isRecurring && '/ día'}
              </span>
              <span className="text-2xl font-bold text-gray-800">
                ₲ {formatCurrency(total)}
              </span>
            </div>

            {/* Nota de recurrencia */}
            {isRecurring && (
              <p className="text-xs text-amber-600 text-center bg-amber-50 py-2 px-3 rounded-lg">
                Este monto se cobrará cada día programado
              </p>
            )}
          </>
        )}
      </div>

      {/* Botones de acción */}
      <div className="px-5 pb-5 space-y-3">
        <Button
          variant="gradient"
          icon={<IconCheck size={18} />}
          onClick={onConfirm}
          disabled={!canConfirm || isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : isRecurring ? 'Confirmar Pedido Recurrente' : 'Confirmar y Crear Pedido'}
        </Button>
        <Button
          variant="outlined"
          textColor="text-gray-600"
          bgColor="bg-gray-300"
          onClick={onSaveDraft}
          disabled={isSubmitting}
        >
          Guardar como Borrador
        </Button>
      </div>
    </div>
  );
}