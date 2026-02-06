// Tipos base de pedidos
export type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export const weekDayLabels: Record<WeekDay, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
};

export const weekDayShortLabels: Record<WeekDay, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
};

export const ALL_WEEK_DAYS: WeekDay[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

export interface OrderItem {
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface RecurrenceConfig {
  enabled: boolean;
  days: WeekDay[];
  startDate: string;
  endDate?: string;
}

export interface Chef {
  id: string;
  nombre: string;
  especialidad: string;
  disponible: boolean;
}

export interface DeliveryPerson {
  id: string;
  nombre: string;
  vehiculo: 'moto' | 'auto' | 'bicicleta';
  zona: string;
  disponible: boolean;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  active: boolean;
}

// Estados del pedido
export type OrderStatus = 
  | 'borrador'
  | 'pendiente'
  | 'confirmado'
  | 'en_preparacion'
  | 'listo'
  | 'en_camino'
  | 'entregado'
  | 'cancelado';

export const orderStatusLabels: Record<OrderStatus, string> = {
  borrador: 'Borrador',
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_preparacion: 'En Preparación',
  listo: 'Listo',
  en_camino: 'En Camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const orderStatusColors: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  borrador: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  confirmado: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  en_preparacion: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  listo: { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  en_camino: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  entregado: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelado: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

// Tipo completo de pedido
export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  locationId: string;
  locationAddress: string;
  deliveryDate: string;
  items: OrderItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  discount: { code: string; amount: number } | null;
  total: number;
  status: OrderStatus;
  chefId: string | null;
  chefName: string | null;
  deliveryPersonId: string | null;
  deliveryPersonName: string | null;
  notes: string;
  recurrence: RecurrenceConfig | null;
  createdAt: string;
  updatedAt: string;
}

// Tipos para filtros de período
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export const timePeriodLabels: Record<TimePeriod, string> = {
  day: 'Hoy',
  week: 'Esta Semana',
  month: 'Este Mes',
  year: 'Este Año',
};

// Tipos para estadísticas
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalItems: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  recurrentOrders: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

export interface ChefStats {
  chefId: string;
  chefName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface DeliveryStats {
  deliveryPersonId: string;
  deliveryPersonName: string;
  totalDeliveries: number;
  zone: string;
}

export interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}