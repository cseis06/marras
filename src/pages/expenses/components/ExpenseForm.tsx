import { useState } from 'react';
import Input from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import CurrencyInput from '../../../components/ui/CurrencyInput';
import DateInput from '../../../components/ui/DateInput';
import type { SelectOption } from '../../../components/ui/Select';
import type { Expense, ExpenseCategory, PaymentMethod, ExpenseStatus } from '../types/Expense';
import { suppliers } from '../../suppliers/data/Suppliers';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categoryOptions: SelectOption[] = [
  { value: 'ingredientes', label: 'Ingredientes' },
  { value: 'servicios', label: 'Servicios (luz, agua, etc.)' },
  { value: 'salarios', label: 'Salarios' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'impuestos', label: 'Impuestos' },
  { value: 'otros', label: 'Otros' },
];

const paymentMethodOptions: SelectOption[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'cheque', label: 'Cheque' },
];

const statusOptions: SelectOption[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'anulado', label: 'Anulado' },
];

const supplierOptions: SelectOption[] = [
  { value: '', label: 'Sin proveedor' },
  ...suppliers.map((s) => ({
    value: s.id,
    label: s.businessName,
  })),
];

const getSupplierIdByName = (name?: string): string => {
  if (!name) return '';
  const supplier = suppliers.find((s) => s.businessName === name);
  return supplier?.id ?? '';
};

const getInitialFormData = (expense?: Expense | null) => ({
  date: expense?.date ?? new Date().toISOString().split('T')[0],
  category: expense?.category ?? 'otros' as ExpenseCategory,
  description: expense?.description ?? '',
  amount: expense?.amount ?? 0,
  paymentMethod: expense?.paymentMethod ?? 'efectivo' as PaymentMethod,
  status: expense?.status ?? 'pendiente' as ExpenseStatus,
  supplierId: getSupplierIdByName(expense?.supplierName),
  invoiceNumber: expense?.invoiceNumber ?? '',
  notes: expense?.notes ?? '',
});

export default function ExpenseForm({ expense, onSubmit, onCancel, loading }: ExpenseFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(expense));

  const isEditing = !!expense;

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir supplierId a supplierName
    const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);

    const expenseData: Omit<Expense, 'id'> = {
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      supplierName: selectedSupplier?.businessName || undefined,
      invoiceNumber: formData.invoiceNumber || undefined,
      notes: formData.notes || undefined,
    };

    onSubmit(expenseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información del gasto</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <DateInput
              label="Fecha"
              value={formData.date}
              onChange={(value) => handleChange('date', value)}
              required
            />
            <Select
              label="Categoría"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              name="category"
              required
            />
          </div>

          <Input
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />

          <CurrencyInput
            label="Monto"
            value={formData.amount}
            onChange={(value) => handleChange('amount', value)}
            required
            className='mt-4'
          />
        </div>
      </div>

      {/* Información de pago */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información de pago</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Método de pago"
              options={paymentMethodOptions}
              value={formData.paymentMethod}
              onChange={(value) => handleChange('paymentMethod', value)}
              name="paymentMethod"
              required
            />
            <Select
              label="Estado"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              name="status"
              required
            />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información adicional</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Proveedor (opcional)"
              options={supplierOptions}
              value={formData.supplierId}
              onChange={(value) => handleChange('supplierId', value)}
              name="supplierId"
            />
            <Input
              label="Nº Factura (opcional)"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            />
          </div>

          <TextArea
            label="Observaciones (opcional)"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
          />
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
          disabled={loading}
          className="text-sm!"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar gasto'}
        </Button>
      </div>
    </form>
  );
}