import type { Chef, DeliveryPerson, DiscountCode } from '../types/order';

export const chefs: Chef[] = [
  {
    id: 'chef-1',
    nombre: 'Ricardo Méndez',
    especialidad: 'Cocina Internacional',
    disponible: true,
  },
  {
    id: 'chef-2',
    nombre: 'Patricia Valenzuela',
    especialidad: 'Cocina Saludable',
    disponible: true,
  },
  {
    id: 'chef-3',
    nombre: 'Marcos Aguirre',
    especialidad: 'Cocina Vegana',
    disponible: false,
  },
  {
    id: 'chef-4',
    nombre: 'Lucía Escobar',
    especialidad: 'Repostería Fit',
    disponible: true,
  },
  {
    id: 'chef-5',
    nombre: 'Fernando Domínguez',
    especialidad: 'Cocina Keto',
    disponible: true,
  },
  {
    id: 'chef-6',
    nombre: 'Carolina Insfrán',
    especialidad: 'Cocina Mediterránea',
    disponible: false,
  },
];

export const deliveryPersons: DeliveryPerson[] = [
  {
    id: 'delivery-1',
    nombre: 'Juan Pérez',
    vehiculo: 'moto',
    zona: 'Asunción Centro',
    disponible: true,
  },
  {
    id: 'delivery-2',
    nombre: 'María López',
    vehiculo: 'auto',
    zona: 'Villa Morra / Carmelitas',
    disponible: true,
  },
  {
    id: 'delivery-3',
    nombre: 'Pedro Gómez',
    vehiculo: 'moto',
    zona: 'Luque / San Lorenzo',
    disponible: false,
  },
  {
    id: 'delivery-4',
    nombre: 'Ana Benítez',
    vehiculo: 'bicicleta',
    zona: 'Asunción Centro',
    disponible: true,
  },
  {
    id: 'delivery-5',
    nombre: 'Carlos Villalba',
    vehiculo: 'moto',
    zona: 'Lambaré / Fernando de la Mora',
    disponible: true,
  },
  {
    id: 'delivery-6',
    nombre: 'Sofía Martínez',
    vehiculo: 'auto',
    zona: 'San Lorenzo / Capiatá',
    disponible: true,
  },
];

export const discountCodes: DiscountCode[] = [
  {
    code: 'BIENVENIDO10',
    type: 'percentage',
    value: 10,
    active: true,
  },
  {
    code: 'PROMO20',
    type: 'percentage',
    value: 20,
    minAmount: 100000,
    maxDiscount: 50000,
    active: true,
  },
  {
    code: 'DESCUENTO15K',
    type: 'fixed',
    value: 15000,
    minAmount: 80000,
    active: true,
  },
  {
    code: 'VIP25',
    type: 'percentage',
    value: 25,
    minAmount: 150000,
    maxDiscount: 75000,
    active: true,
  },
  {
    code: 'DELIVERY0',
    type: 'fixed',
    value: 10000,
    active: false,
  },
];

// Constantes de costos
export const PACKAGING_FEE = 5000; // ₲ 5.000
export const DELIVERY_FEE = 10000; // ₲ 10.000
export const FREE_DELIVERY_THRESHOLD = 100000; // Delivery gratis si supera ₲ 100.000