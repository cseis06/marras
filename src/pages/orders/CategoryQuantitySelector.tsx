import { IconPlus, IconMinus, IconX, IconCheck } from '@tabler/icons-react';
import type { DishCategory } from '../platos/types/DishCategory';
import type { OrderItem } from './types/order';

interface CategoryQuantitySelectorProps {
  categories: DishCategory[];
  selectedItems: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  className?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function CategoryQuantitySelector({
  categories,
  selectedItems,
  onChange,
  className = '',
}: CategoryQuantitySelectorProps) {
  const activeCategories = categories.filter((cat) => cat.estado);

  const isSelected = (categoryId: string) => {
    return selectedItems.some((item) => item.categoryId === categoryId);
  };

  const handleToggleCategory = (category: DishCategory) => {
    if (isSelected(category.id)) {
      // Remover categoría
      onChange(selectedItems.filter((item) => item.categoryId !== category.id));
    } else {
      // Agregar categoría con cantidad 1
      const newItem: OrderItem = {
        categoryId: category.id,
        categoryName: category.nombre,
        quantity: 1,
        unitPrice: category.precioBase,
        subtotal: category.precioBase,
      };
      onChange([...selectedItems, newItem]);
    }
  };

  const handleQuantityChange = (categoryId: string, delta: number) => {
    onChange(
      selectedItems.map((item) => {
        if (item.categoryId === categoryId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(selectedItems.filter((item) => item.categoryId !== categoryId));
  };

  return (
    <div className={className}>
      {/* Chips de categorías */}
      <p className="text-sm text-gray-500 mb-3">
        Selecciona las categorías para este pedido:
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {activeCategories.map((category) => {
          const selected = isSelected(category.id);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleToggleCategory(category)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${
                  selected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                }
              `}
            >
              {selected && <IconCheck size={14} className="flex-shrink-0" />}
              {category.nombre}
            </button>
          );
        })}
      </div>

      {/* Lista de categorías seleccionadas con cantidad */}
      {selectedItems.length > 0 && (
        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium text-gray-700">
            Categorías seleccionadas:
          </p>
          {selectedItems.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.categoryName}
                </p>
                <p className="text-xs text-gray-500">
                  ₲ {formatCurrency(item.unitPrice)} c/u
                </p>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.categoryId, -1)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconMinus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.categoryId, 1)}
                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-r-lg transition-colors"
                  >
                    <IconPlus size={16} />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    ₲ {formatCurrency(item.subtotal)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCategory(item.categoryId)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <IconX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItems.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-400">
            No hay categorías seleccionadas
          </p>
        </div>
      )}
    </div>
  );
}