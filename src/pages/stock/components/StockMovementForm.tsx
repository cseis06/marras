import { useState, useEffect, useMemo } from 'react';
import FloatingInput from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
//import Toggle from '../../../components/ui/Toggle';
import { IconPackageImport, IconPackageExport, IconX } from '@tabler/icons-react';
import type { StockItem, StockMovement, MovementType, MovementReason } from '../types/Stock';
import { movementReasonLabels, unitAbbreviations } from '../types/Stock';

interface StockMovementFormProps {
  item: StockItem; // Producto al que se le registra el movimiento
  onSubmit: (data: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialType?: MovementType; // Tipo inicial (entrada o salida)
}

// Razones según tipo de movimiento
const entryReasons: MovementReason[] = ['compra', 'devolucion_proveedor', 'ajuste_inventario', 'otro'];
const exitReasons: MovementReason[] = ['uso_cocina', 'merma', 'vencimiento', 'ajuste_inventario', 'otro'];

export default function StockMovementForm({
  item,
  onSubmit,
  onCancel,
  loading,
  initialType = 'salida',
}: StockMovementFormProps) {
  // Estado del formulario
  const [type, setType] = useState<MovementType>(initialType);
  const [reason, setReason] = useState<MovementReason>(initialType === 'entrada' ? 'compra' : 'uso_cocina');
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [registeredBy, setRegisteredBy] = useState('');

  // Estado de errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Opciones de razón según tipo
  const reasonOptions = useMemo(() => {
    const reasons = type === 'entrada' ? entryReasons : exitReasons;
    return reasons.map((r) => ({
      value: r,
      label: movementReasonLabels[r],
    }));
  }, [type]);

  // Actualizar razón por defecto cuando cambia el tipo
  useEffect(() => {
    setReason(type === 'entrada' ? 'compra' : 'uso_cocina');
  }, [type]);

  // Validación
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const qty = parseFloat(quantity);

    if (!quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Ingrese una cantidad válida mayor a 0';
    }

    // Si es salida, validar que no exceda el stock actual
    if (type === 'salida' && qty > item.currentQuantity) {
      newErrors.quantity = `No puede retirar más de ${item.currentQuantity} ${unitAbbreviations[item.unit]}`;
    }

    if (!date) {
      newErrors.date = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler del submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      stockItemId: item.id,
      type,
      reason,
      quantity: parseFloat(quantity),
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
      registeredBy: registeredBy.trim() || undefined,
    });
  };

  // Calcular nueva cantidad después del movimiento
  const newQuantity = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    if (type === 'entrada') {
      return item.currentQuantity + qty;
    } else {
      return Math.max(0, item.currentQuantity - qty);
    }
  }, [quantity, type, item.currentQuantity]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1 space-y-5">
        {/* Info del producto */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium">{item.code}</p>
              <p className="text-lg font-semibold text-gray-800 mt-0.5">{item.name}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Stock actual</p>
              <p className="text-2xl font-bold text-gray-800">
                {item.currentQuantity}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {unitAbbreviations[item.unit]}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Toggle tipo de movimiento */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Tipo de movimiento
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('entrada')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                type === 'entrada'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <IconPackageImport size={20} />
              <span className="font-medium">Entrada</span>
            </button>
            <button
              type="button"
              onClick={() => setType('salida')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                type === 'salida'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <IconPackageExport size={20} />
              <span className="font-medium">Salida</span>
            </button>
          </div>
        </div>

        {/* Cantidad y razón */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Detalles del movimiento
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingInput
                label={`Cantidad (${unitAbbreviations[item.unit]})`}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={errors.quantity}
                min={0}
                step="0.01"
                autoFocus
              />
            </div>
            <Select
              label="Razón"
              options={reasonOptions}
              value={reason}
              onChange={(val) => setReason(val as MovementReason)}
            />
          </div>

          {/* Preview del resultado */}
          {quantity && parseFloat(quantity) > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Resultado del movimiento:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{item.currentQuantity}</span>
                  <span
                    className={`font-medium ${
                      type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {type === 'entrada' ? '+' : '-'} {parseFloat(quantity) || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">=</span>
                  <span className="text-xl font-bold text-gray-800">
                    {newQuantity}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {unitAbbreviations[item.unit]}
                    </span>
                  </span>
                </div>
              </div>

              {/* Alerta si queda bajo */}
              {type === 'salida' && newQuantity <= item.minQuantity && newQuantity > 0 && (
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  El stock quedará por debajo del mínimo ({item.minQuantity} {unitAbbreviations[item.unit]})
                </p>
              )}
              {type === 'salida' && newQuantity === 0 && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  El stock quedará agotado
                </p>
              )}
            </div>
          )}
        </div>

        {/* Fecha y responsable */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Información adicional
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Fecha"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
            />
            <FloatingInput
              label="Registrado por"
              value={registeredBy}
              onChange={(e) => setRegisteredBy(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ej: Pedido de la mañana, reposición semanal..."
            />
          </div>
        </div>
      </div>

      {/* Botones de acción - fijos abajo */}
      <div className="flex-shrink-0 flex gap-3 pt-4 mt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          icon={<IconX size={18} />}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant='filled'
          loading={loading}
          icon={type === 'entrada' ? <IconPackageImport size={18} /> : <IconPackageExport size={18} />}
          className="flex-1"
        >
          Registrar {type === 'entrada' ? 'entrada' : 'salida'}
        </Button>
      </div>
    </form>
  );
}