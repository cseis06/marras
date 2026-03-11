import { useState, useEffect } from 'react';
import FloatingInput from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import CurrencyInput from '../../../components/ui/CurrencyInput';
import Button from '../../../components/ui/Button';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import type { StockItem, UnitType } from '../types/Stock';
import { unitLabels, stockCategories, calculateStockStatus } from '../types/Stock';

interface StockFormProps {
  item: StockItem | null;
  onSubmit: (data: Omit<StockItem, 'id' | 'status' | 'lastUpdated' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Opciones para el select de unidades
const unitOptions = Object.entries(unitLabels).map(([value, label]) => ({
  value,
  label,
}));

// Opciones para el select de categorías
const categoryOptions = stockCategories.map((cat) => ({
  value: cat,
  label: cat,
}));

export default function StockForm({ item, onSubmit, onCancel, loading }: StockFormProps) {
  // Estado del formulario
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState<UnitType>('unidad');
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [costPerUnit, setCostPerUnit] = useState<number>(0);
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Estado de errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (item) {
      setCode(item.code);
      setName(item.name);
      setCategory(item.category);
      setUnit(item.unit);
      setCurrentQuantity(item.currentQuantity);
      setMinQuantity(item.minQuantity);
      setCostPerUnit(item.costPerUnit);
      setSupplier(item.supplier || '');
      setLocation(item.location || '');
      setNotes(item.notes || '');
    } else {
      // Limpiar formulario para nuevo producto
      setCode('');
      setName('');
      setCategory('');
      setUnit('unidad');
      setCurrentQuantity(0);
      setMinQuantity(0);
      setCostPerUnit(0);
      setSupplier('');
      setLocation('');
      setNotes('');
    }
    setErrors({});
  }, [item]);

  // Auto-generar código desde el nombre
  useEffect(() => {
    if (!item && name && !code) {
      // Generar código automático basado en categoría y nombre
      const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRO';
      const suffix = name.substring(0, 3).toUpperCase();
      const random = Math.floor(Math.random() * 900) + 100;
      setCode(`${prefix}-${suffix}${random}`);
    }
  }, [name, category, item, code]);

  // Validación
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'El código es requerido';
    }

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (minQuantity < 0) {
      newErrors.minQuantity = 'La cantidad mínima no puede ser negativa';
    }

    if (currentQuantity < 0) {
      newErrors.currentQuantity = 'La cantidad actual no puede ser negativa';
    }

    if (costPerUnit < 0) {
      newErrors.costPerUnit = 'El costo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler del submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      code: code.trim(),
      name: name.trim(),
      category,
      unit,
      currentQuantity,
      minQuantity,
      costPerUnit,
      supplier: supplier.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  // Calcular estado preview
  const previewStatus = calculateStockStatus(currentQuantity, minQuantity);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1 space-y-5">
        {/* Sección: Información básica */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Información básica
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
              disabled={!!item} // No editable si estamos editando
            />
            <Select
              label="Categoría"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              error={errors.category}
            />
          </div>
          <div className="mt-4">
            <FloatingInput
              label="Nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          </div>
        </div>

        {/* Sección: Cantidades */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Cantidades y unidades
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Unidad"
              options={unitOptions}
              value={unit}
              onChange={(val) => setUnit(val as UnitType)}
            />
            <FloatingInput
              label="Cantidad actual"
              type="number"
              value={currentQuantity.toString()}
              onChange={(e) => setCurrentQuantity(Number(e.target.value))}
              error={errors.currentQuantity}
              min={0}
              step="0.01"
            />
            <FloatingInput
              label="Cantidad mínima"
              type="number"
              value={minQuantity.toString()}
              onChange={(e) => setMinQuantity(Number(e.target.value))}
              error={errors.minQuantity}
              min={0}
              step="0.01"
            />
          </div>

          {/* Preview del estado */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Estado del stock:</p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  previewStatus === 'disponible'
                    ? 'bg-green-500'
                    : previewStatus === 'bajo'
                    ? 'bg-yellow-500'
                    : previewStatus === 'critico'
                    ? 'bg-red-500'
                    : 'bg-gray-400'
                }`}
              ></span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {previewStatus === 'disponible'
                  ? 'Disponible'
                  : previewStatus === 'bajo'
                  ? 'Stock bajo'
                  : previewStatus === 'critico'
                  ? 'Crítico'
                  : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Costos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Costo
          </h3>
          <CurrencyInput
            label="Costo por unidad"
            value={costPerUnit}
            onChange={setCostPerUnit}
            error={errors.costPerUnit}
          />
          {costPerUnit > 0 && currentQuantity > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Valor total en stock:{' '}
              <span className="font-medium text-gray-700">
                {new Intl.NumberFormat('es-PY', {
                  style: 'currency',
                  currency: 'PYG',
                  maximumFractionDigits: 0,
                }).format(costPerUnit * currentQuantity)}
              </span>
            </p>
          )}
        </div>

        {/* Sección: Información adicional */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Información adicional
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Proveedor"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
            <FloatingInput
              label="Ubicación en almacén"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción - fijos abajo */}
      <div className="shrink-0 flex gap-3 pt-4 mt-4 border-t border-gray-100">
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
          variant="gradient"
          loading={loading}
          icon={<IconDeviceFloppy size={18} />}
          className="flex-1"
        >
          {item ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}