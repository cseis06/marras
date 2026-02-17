import { useState } from 'react';
import Input from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import type { SelectOption } from '../../../components/ui/Select';
import type { Supplier, SupplierCategory, SupplierStatus } from '../types/Supplier';

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSubmit: (data: Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categoryOptions: SelectOption[] = [
  { value: 'verduras', label: 'Verduras y Frutas' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'lacteos', label: 'Lácteos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'empaques', label: 'Empaques' },
  { value: 'otros', label: 'Otros' },
];

const statusOptions: SelectOption[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'suspendido', label: 'Suspendido' },
];

const getInitialFormData = (supplier?: Supplier | null) => ({
  ruc: supplier?.ruc ?? '',
  businessName: supplier?.businessName ?? '',
  contactName: supplier?.contactName ?? '',
  phone: supplier?.phone ?? '',
  email: supplier?.email ?? '',
  category: supplier?.category ?? 'otros' as SupplierCategory,
  status: supplier?.status ?? 'activo' as SupplierStatus,
  address: supplier?.address ?? '',
  city: supplier?.city ?? '',
  notes: supplier?.notes ?? '',
});

export default function SupplierForm({ supplier, onSubmit, onCancel, loading }: SupplierFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(supplier));

  const isEditing = !!supplier;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const supplierData: Omit<Supplier, 'id'> = {
      ...formData,
      notes: formData.notes || undefined,
    };

    onSubmit(supplierData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos de la empresa */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos de la empresa</h3>
        <div className="space-y-4">
          <Input
            label="RUC"
            value={formData.ruc}
            onChange={(e) => handleChange('ruc', e.target.value)}
            required
          />

          <Input
            label="Razón Social"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Categoría"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              name="category"
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

      {/* Datos de contacto */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos de contacto</h3>
        <div className="space-y-4">
          <Input
            label="Nombre del contacto"
            value={formData.contactName}
            onChange={(e) => handleChange('contactName', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ubicación</h3>
        <div className="space-y-4">
          <Input
            label="Dirección"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />

          <Input
            label="Ciudad"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información adicional</h3>
        <TextArea
          label="Observaciones (opcional)"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
        />
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
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear proveedor'}
        </Button>
      </div>
    </form>
  );
}