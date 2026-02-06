export type SupplierCategory = 
  | 'verduras'
  | 'carnes'
  | 'lacteos'
  | 'bebidas'
  | 'limpieza'
  | 'empaques'
  | 'otros';

export type SupplierStatus = 'activo' | 'inactivo' | 'suspendido';

export interface Supplier {
  id: string;
  ruc: string;
  businessName: string;        // Razón social
  contactName: string;         // Nombre del contacto
  phone: string;
  email: string;
  category: SupplierCategory;
  status: SupplierStatus;
  address: string;
  city: string;
  notes?: string;              // Observaciones
}