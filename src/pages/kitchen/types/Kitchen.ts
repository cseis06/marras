// Tipos para gestión de cocina

export type ChefColor = 'amber' | 'emerald' | 'violet' | 'sky' | 'rose' | 'orange';

export const chefColorStyles: Record<ChefColor, { bg: string; border: string; accent: string; text: string }> = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-l-amber-400',
    accent: 'bg-amber-400',
    text: 'text-amber-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-l-emerald-400',
    accent: 'bg-emerald-400',
    text: 'text-emerald-700',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-l-violet-400',
    accent: 'bg-violet-400',
    text: 'text-violet-700',
  },
  sky: {
    bg: 'bg-sky-50',
    border: 'border-l-sky-400',
    accent: 'bg-sky-400',
    text: 'text-sky-700',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-l-rose-400',
    accent: 'bg-rose-400',
    text: 'text-rose-700',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-l-orange-400',
    accent: 'bg-orange-400',
    text: 'text-orange-700',
  },
};

// Cocinera
export interface Chef {
  id: string;
  name: string;
  color: ChefColor;
  specialty: string;
  available: boolean;
  avatarUrl?: string;
}

// Asignación de categoría a cocinera
export interface CategoryAssignment {
  id: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  completed: number;
}

// Pedido personalizado asignado
export interface CustomOrderAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  notes: string;
  quantity: number;
  completed: boolean;
}

// Tarea completa de cocinera para un día
export interface ChefTask {
  id: string;
  chefId: string;
  chefName: string;
  chefColor: ChefColor;
  date: string;
  categories: CategoryAssignment[];
  customOrders: CustomOrderAssignment[];
  totalDishes: number;
  completedDishes: number;
}

// Estadísticas generales de cocina
export interface KitchenStats {
  totalDishes: number;
  completedDishes: number;
  pendingDishes: number;
  activeChefs: number;
  totalCategories: number;
  totalCustomOrders: number;
}

// Opciones de filtro de fecha
export type DateFilter = 'today' | 'tomorrow' | 'week';

export const dateFilterLabels: Record<DateFilter, string> = {
  today: 'Hoy',
  tomorrow: 'Mañana',
  week: 'Esta Semana',
};