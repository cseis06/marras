// Tipos para el módulo de Stock

// Unidades de medida disponibles
export type UnitType = 'kg' | 'g' | 'lt' | 'ml' | 'unidad' | 'paquete' | 'caja' | 'docena';

// Estado del stock
export type StockStatus = 'disponible' | 'bajo' | 'critico' | 'agotado';

// Tipo de movimiento de stock
export type MovementType = 'entrada' | 'salida';

// Razón del movimiento
export type MovementReason = 
  | 'compra' 
  | 'devolucion_proveedor' 
  | 'ajuste_inventario' 
  | 'uso_cocina' 
  | 'merma' 
  | 'vencimiento' 
  | 'otro';

// Producto en stock
export interface StockItem {
  id: string;
  code: string;              // Código único del producto
  name: string;              // Nombre del producto
  category: string;          // Categoría (ej: "Carnes", "Verduras", etc.)
  unit: UnitType;            // Unidad de medida
  currentQuantity: number;   // Cantidad actual en stock
  minQuantity: number;       // Cantidad mínima (para alertas)
  costPerUnit: number;       // Costo por unidad en Gs.
  supplier?: string;         // Proveedor principal (opcional)
  location?: string;         // Ubicación en almacén (opcional)
  notes?: string;            // Notas adicionales
  status: StockStatus;       // Estado calculado
  lastUpdated: string;       // Última actualización (ISO date)
  createdAt: string;         // Fecha de creación (ISO date)
}

// Movimiento de stock (entrada o salida)
export interface StockMovement {
  id: string;
  stockItemId: string;       // ID del producto
  type: MovementType;        // Entrada o salida
  reason: MovementReason;    // Razón del movimiento
  quantity: number;          // Cantidad del movimiento
  date: string;              // Fecha del movimiento (ISO date)
  notes?: string;            // Notas opcionales
  registeredBy?: string;     // Quién registró el movimiento
  createdAt: string;         // Timestamp de creación
}

// Configuración de labels para UI
export const unitLabels: Record<UnitType, string> = {
  kg: 'Kilogramos',
  g: 'Gramos',
  lt: 'Litros',
  ml: 'Mililitros',
  unidad: 'Unidades',
  paquete: 'Paquetes',
  caja: 'Cajas',
  docena: 'Docenas',
};

export const unitAbbreviations: Record<UnitType, string> = {
  kg: 'kg',
  g: 'g',
  lt: 'lt',
  ml: 'ml',
  unidad: 'uds',
  paquete: 'paq',
  caja: 'cjs',
  docena: 'doc',
};

export const statusConfig: Record<StockStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  disponible: { label: 'Disponible', variant: 'success' },
  bajo: { label: 'Stock Bajo', variant: 'warning' },
  critico: { label: 'Crítico', variant: 'error' },
  agotado: { label: 'Agotado', variant: 'neutral' },
};

export const movementTypeConfig: Record<MovementType, { label: string; color: string }> = {
  entrada: { label: 'Entrada', color: 'text-green-600' },
  salida: { label: 'Salida', color: 'text-red-600' },
};

export const movementReasonLabels: Record<MovementReason, string> = {
  compra: 'Compra',
  devolucion_proveedor: 'Devolución a proveedor',
  ajuste_inventario: 'Ajuste de inventario',
  uso_cocina: 'Uso en cocina',
  merma: 'Merma',
  vencimiento: 'Vencimiento',
  otro: 'Otro',
};

// Helper para calcular el estado basado en cantidad
export function calculateStockStatus(current: number, min: number): StockStatus {
  if (current <= 0) return 'agotado';
  if (current <= min * 0.5) return 'critico';
  if (current <= min) return 'bajo';
  return 'disponible';
}

// Categorías predefinidas para productos
export const stockCategories = [
  'Carnes',
  'Verduras',
  'Frutas',
  'Lácteos',
  'Bebidas',
  'Condimentos',
  'Granos',
  'Aceites',
  'Limpieza',
  'Descartables',
  'Otros',
];