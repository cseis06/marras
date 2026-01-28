export interface DishCategory {
  id: string;
  nombre: string;
  codigo: string;
  precioBase: number;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DishCategoryFormData = Omit<DishCategory, 'id' | 'createdAt' | 'updatedAt'>;