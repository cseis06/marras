export interface OrderItem {
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type WeekDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export interface RecurrenceConfig {
  enabled: boolean;
  days: WeekDay[];
  startDate: string;
  endDate?: string; // Opcional: fecha fin de recurrencia
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  locationId: string;
  deliveryDate: string;
  items: OrderItem[];
  chefId?: string;
  deliveryPersonId?: string;
  notes?: string;
  discountCode?: string;
  discountAmount: number;
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  recurrence?: RecurrenceConfig;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export const orderStatusLabels: Record<OrderStatus, string> = {
  draft: 'Borrador',
  confirmed: 'Confirmado',
  preparing: 'En Preparación',
  ready: 'Listo',
  delivering: 'En Camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const orderStatusVariants: Record<OrderStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  draft: 'neutral',
  confirmed: 'info',
  preparing: 'warning',
  ready: 'success',
  delivering: 'info',
  delivered: 'success',
  cancelled: 'error',
};

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

export interface Chef {
  id: string;
  nombre: string;
  especialidad: string;
  disponible: boolean;
  avatar?: string;
}

export interface DeliveryPerson {
  id: string;
  nombre: string;
  vehiculo: 'moto' | 'auto' | 'bicicleta';
  zona: string;
  disponible: boolean;
  avatar?: string;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  active: boolean;
}