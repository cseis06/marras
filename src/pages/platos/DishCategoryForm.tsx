import { useState, useCallback } from 'react';
import { IconLink, IconLinkOff } from '@tabler/icons-react';
import Input from '../../components/ui/FloatingInput';
import CurrencyInput from '../../components/ui/CurrencyInput';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import type { DishCategory, DishCategoryFormData } from '../../pages/platos/types/DishCategory';

interface DishCategoryFormProps {
  category?: DishCategory | null;
  existingCodes?: string[];
  existingNames?: string[];
  onSubmit: (data: DishCategoryFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Genera código a partir del nombre
const generateCode = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos
    .toUpperCase()
    .trim()
    .replace(/\s+/g, '_') // Espacios → guiones bajos
    .replace(/[^A-Z0-9_]/g, ''); // Solo alfanuméricos y guiones bajos
};

// Valida formato del código
const isValidCodeFormat = (code: string): boolean => {
  return /^[A-Z0-9_]+$/.test(code);
};

// Formatea fecha para mostrar
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function DishCategoryForm({
  category,
  existingCodes = [],
  existingNames = [],
  onSubmit,
  onCancel,
  loading = false,
}: DishCategoryFormProps) {
  const isEditing = !!category;

  // Form state
  const [nombre, setNombre] = useState(category?.nombre || '');
  const [codigo, setCodigo] = useState(category?.codigo || '');
  const [precioBase, setPrecioBase] = useState(category?.precioBase || 0);
  const [estado, setEstado] = useState(category?.estado ?? true);

  // Sync state (código vinculado al nombre)
  const [isCodeLinked, setIsCodeLinked] = useState(!isEditing);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validación
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Nombre
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (
      existingNames
        .filter((n) => n !== category?.nombre)
        .some((n) => n.toLowerCase() === nombre.toLowerCase().trim())
    ) {
      newErrors.nombre = 'Ya existe una categoría con este nombre';
    }

    // Código
    if (!codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    } else if (!isValidCodeFormat(codigo)) {
      newErrors.codigo = 'Solo mayúsculas, números y guiones bajos';
    } else if (
      existingCodes
        .filter((c) => c !== category?.codigo)
        .includes(codigo.toUpperCase())
    ) {
      newErrors.codigo = 'Este código ya está en uso';
    }

    // Precio
    if (!precioBase || precioBase <= 0) {
      newErrors.precioBase = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nombre, codigo, precioBase, existingCodes, existingNames, category]);

  // Validar campo individual al perder foco
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // Manejar cambio de nombre (auto-genera código si está vinculado)
  const handleNombreChange = (value: string) => {
    setNombre(value);
    if (isCodeLinked) {
      setCodigo(generateCode(value));
    }
  };

  // Manejar cambio de código manual
  const handleCodigoChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setCodigo(upperValue);
    setIsCodeLinked(false);
  };

  // Toggle vinculación código-nombre
  const toggleCodeLink = () => {
    if (!isCodeLinked) {
      // Vincular: regenerar código desde nombre
      setCodigo(generateCode(nombre));
    }
    setIsCodeLinked(!isCodeLinked);
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, codigo: true, precioBase: true });

    if (validate()) {
      onSubmit({
        nombre: nombre.trim(),
        codigo: codigo.toUpperCase(),
        precioBase,
        estado,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1 flex flex-col gap-4">
        {/* Nombre */}
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => handleNombreChange(e.target.value)}
          onBlur={() => handleBlur('nombre')}
          required
          autoFocus
        />
        {touched.nombre && errors.nombre && (
          <p className="text-red-500 text-xs -mt-4">{errors.nombre}</p>
        )}

        {/* Código */}
        <div className="space-y-1.5">
          {isCodeLinked && (
            <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
              <IconLink size={12} />
              Código se genera automáticamente desde el nombre
            </p>
          )}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Código"
                value={codigo}
                onChange={(e) => handleCodigoChange(e.target.value)}
                onBlur={() => handleBlur('codigo')}
                required
              />
            </div>
            <button
              type="button"
              onClick={toggleCodeLink}
              className={`
                p-5 rounded-lg transition-colors self-center
                ${
                  isCodeLinked
                    ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title={isCodeLinked ? 'Código vinculado al nombre' : 'Vincular código al nombre'}
            >
              {isCodeLinked ? <IconLink size={18} /> : <IconLinkOff size={18} />}
            </button>
          </div>
          {touched.codigo && errors.codigo && (
            <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
          )}
        </div>

        {/* Precio Base */}
        <CurrencyInput
          label="Precio Base"
          value={precioBase}
          onChange={setPrecioBase}
          onBlur={() => handleBlur('precioBase')}
          helperText="IVA incluido"
          error={touched.precioBase ? errors.precioBase : undefined}
          required
          className='mt-6'
        />

        {/* Estado */}
        <div className="pt-2">
          <label className="block text-xs text-gray-500 mb-3">Estado</label>
          <Toggle
            checked={estado}
            onChange={setEstado}
            activeLabel="Activo"
            inactiveLabel="Inactivo"
            size="md"
          />
        </div>

        {/* Metadatos (solo en modo edición) */}
        {isEditing && category && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Información del registro
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>
                <span className="text-gray-400">ID:</span> {category.id}
              </p>
              <p>
                <span className="text-gray-400">Creado:</span>{' '}
                {formatDate(category.createdAt)}
              </p>
              <p>
                <span className="text-gray-400">Actualizado:</span>{' '}
                {formatDate(category.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con botones */}
      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          textColor='text-gray-500'
          bgColor='bg-gray-500'
          className="flex-1 text-sm!"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
          className="flex-1 text-sm!"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  );
}