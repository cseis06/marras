import { useMemo } from 'react';
import { IconPackageImport, IconPackageExport, IconCalendar, IconUser } from '@tabler/icons-react';
import type { StockItem, StockMovement } from '../types/Stock';
import { movementReasonLabels, unitAbbreviations } from '../types/Stock';

interface StockMovementHistoryProps {
  item: StockItem;
  movements: StockMovement[];
}

export default function StockMovementHistory({ item, movements }: StockMovementHistoryProps) {
  // Filtrar y ordenar movimientos del producto
  const itemMovements = useMemo(() => {
    return movements
      .filter((m) => m.stockItemId === item.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [movements, item.id]);

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calcular resumen
  const summary = useMemo(() => {
    const entradas = itemMovements
      .filter((m) => m.type === 'entrada')
      .reduce((sum, m) => sum + m.quantity, 0);
    const salidas = itemMovements
      .filter((m) => m.type === 'salida')
      .reduce((sum, m) => sum + m.quantity, 0);
    return { entradas, salidas };
  }, [itemMovements]);

  return (
    <div className="flex flex-col h-full">
      {/* Info del producto */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 mb-4">
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

      {/* Resumen de movimientos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700">
            <IconPackageImport size={18} />
            <span className="text-xs font-medium">Total entradas</span>
          </div>
          <p className="text-xl font-bold text-green-700 mt-1">
            +{summary.entradas} {unitAbbreviations[item.unit]}
          </p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 text-red-700">
            <IconPackageExport size={18} />
            <span className="text-xs font-medium">Total salidas</span>
          </div>
          <p className="text-xl font-bold text-red-700 mt-1">
            -{summary.salidas} {unitAbbreviations[item.unit]}
          </p>
        </div>
      </div>

      {/* Lista de movimientos */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          Historial de movimientos
        </h3>

        {itemMovements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <IconCalendar size={40} strokeWidth={1.5} />
            <p className="mt-2 text-sm">No hay movimientos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {itemMovements.map((movement) => (
              <div
                key={movement.id}
                className="p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        movement.type === 'entrada'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {movement.type === 'entrada' ? (
                        <IconPackageImport size={18} />
                      ) : (
                        <IconPackageExport size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {movementReasonLabels[movement.reason]}
                      </p>
                      {movement.notes && (
                        <p className="text-xs text-gray-500 mt-0.5">{movement.notes}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <IconCalendar size={12} />
                          {formatDate(movement.date)}
                        </span>
                        {movement.registeredBy && (
                          <span className="flex items-center gap-1">
                            <IconUser size={12} />
                            {movement.registeredBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                        movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {movement.type === 'entrada' ? '+' : '-'}
                      {movement.quantity}
                    </span>
                    <p className="text-xs text-gray-500">{unitAbbreviations[item.unit]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}