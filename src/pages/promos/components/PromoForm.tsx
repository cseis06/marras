import { useState } from 'react';
import { IconPercentage } from '@tabler/icons-react';
import Input from '../../../components/ui/FloatingInput';
import Select from '../../../components/ui/Select';
import type { SelectOption } from '../../../components/ui/Select';
import CurrencyInput from '../../../components/ui/CurrencyInput';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/Button';
import type { DiscountCode, DiscountType } from '../types/DiscountCode';

interface PromoFormProps {
  promo?: DiscountCode | null;
  existingCodes?: string[];
  onSubmit: (data: Omit<DiscountCode, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const discountTypeOptions: SelectOption[] = [
  { value: 'percentage', label: 'Porcentaje' },
  { value: 'fixed', label: 'Monto fijo' },
];

const getInitialFormData = (promo?: DiscountCode | null) => ({
  code: promo?.code ?? '',
  type: promo?.type ?? 'percentage' as DiscountType,
  value: promo?.value ?? 0,
  minAmount: promo?.minAmount ?? 0,
  maxDiscount: promo?.maxDiscount ?? 0,
  active: promo?.active ?? true,
});

export default function PromoForm({ 
  promo, 
  existingCodes = [], 
  onSubmit, 
  onCancel, 
  loading 
}: PromoFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(promo));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!promo;

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Si cambia el tipo a 'fixed', limpiar maxDiscount
      if (field === 'type' && value === 'fixed') {
        updated.maxDiscount = 0;
      }
      
      return updated;
    });

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperCode = e.target.value.toUpperCase().replace(/\s/g, '');
    handleChange('code', upperCode);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar código
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.length < 3) {
      newErrors.code = 'El código debe tener al menos 3 caracteres';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Solo letras mayúsculas y números';
    } else if (!isEditing && existingCodes.includes(formData.code)) {
      newErrors.code = 'Este código ya existe';
    } else if (isEditing && promo?.code !== formData.code && existingCodes.includes(formData.code)) {
      newErrors.code = 'Este código ya existe';
    }

    // Validar valor
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'El valor debe ser mayor a 0';
    } else if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'El porcentaje no puede ser mayor a 100';
    }

    // Validar minAmount si existe
    if (formData.minAmount !== undefined && formData.minAmount < 0) {
      newErrors.minAmount = 'El monto mínimo no puede ser negativo';
    }

    // Validar maxDiscount si existe y es percentage
    if (formData.type === 'percentage' && formData.maxDiscount !== undefined && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'El descuento máximo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const promoData: Omit<DiscountCode, 'id'> = {
      code: formData.code,
      type: formData.type,
      value: formData.value,
      minAmount: formData.minAmount && formData.minAmount > 0 ? formData.minAmount : undefined,
      maxDiscount: formData.type === 'percentage' && formData.maxDiscount && formData.maxDiscount > 0 
        ? formData.maxDiscount 
        : undefined,
      active: formData.active,
    };

    onSubmit(promoData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del código */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información del código</h3>
        <div className="space-y-4">
          <div>
            <Input
              label="Código promocional"
              value={formData.code}
              onChange={handleCodeChange}
              placeholder="PROMO2024"
              required
              error={errors.code}
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo letras mayúsculas y números, sin espacios
            </p>
          </div>

          <Select
            label="Tipo de descuento"
            options={discountTypeOptions}
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            name="discountType"
            required
          />

          {formData.type === 'percentage' ? (
            <div>
              <Input
                label="Porcentaje de descuento"
                type="number"
                value={formData.value.toString()}
                onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                min="1"
                max="100"
                step="1"
                required
                error={errors.value}
                icon={<IconPercentage size={16} />}
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor entre 1 y 100
              </p>
            </div>
          ) : (
            <div className='pt-4'>
              <CurrencyInput
                label="Monto fijo de descuento"
                value={formData.value}
                onChange={(value) => handleChange('value', value)}
                required
                error={errors.value}
              />
              <p className="text-xs text-gray-500 mt-1">
                Monto en guaraníes que se descontará
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Condiciones */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-5">Condiciones (opcional)</h3>
        <div className="space-y-4">
          <div>
            <CurrencyInput
              label="Monto mínimo de compra"
              value={formData.minAmount}
              onChange={(value) => handleChange('minAmount', value)}
              error={errors.minAmount}
            />
            <p className="text-xs text-gray-500 mt-1">
              Si se deja en 0, no hay mínimo
            </p>
          </div>

          {formData.type === 'percentage' && (
            <div>
              <CurrencyInput
                label="Descuento máximo"
                value={formData.maxDiscount}
                onChange={(value) => handleChange('maxDiscount', value)}
                error={errors.maxDiscount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Si se deja en 0, no hay límite de descuento
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estado */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado</h3>
        <Toggle
          checked={formData.active}
          onChange={(checked) => handleChange('active', checked)}
          label={formData.active ? 'Código activo' : 'Código inactivo'}
        />
        <p className="text-xs text-gray-500 mt-2">
          {formData.active 
            ? 'Este código puede ser usado para los clientes' 
            : 'Este código no está disponible para uso'}
        </p>
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
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear código'}
        </Button>
      </div>
    </form>
  );
}