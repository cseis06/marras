import type { Order } from '../types/Payment';

// Pedidos mock con información de pagos
// Incluye pedidos con distintos estados: pendiente, parcial, pagado
export const orders: Order[] = [
  // Cliente 1 - Carlos Martínez (al_dia) - Sin deudas
  {
    id: 'ord-001',
    clientId: '1',
    date: '2025-02-10',
    items: [
      { id: 'item-1', name: 'Menú Ejecutivo x5', quantity: 5, unitPrice: 45000, subtotal: 225000 },
      { id: 'item-2', name: 'Ensalada César', quantity: 3, unitPrice: 35000, subtotal: 105000 },
    ],
    total: 330000,
    paid: 330000,
    balance: 0,
    status: 'pagado',
    deliveryAddress: 'Av. Mariscal López 1234, Villa Morra',
  },

  // Cliente 2 - María González (pendiente)
  {
    id: 'ord-002',
    clientId: '2',
    date: '2025-02-08',
    items: [
      { id: 'item-3', name: 'Almuerzo Fit', quantity: 10, unitPrice: 38000, subtotal: 380000 },
    ],
    total: 380000,
    paid: 0,
    balance: 380000,
    status: 'pendiente',
    deliveryAddress: 'Calle Palma 890, Centro',
    notes: 'Entregar al mediodía',
  },
  {
    id: 'ord-003',
    clientId: '2',
    date: '2025-02-05',
    items: [
      { id: 'item-4', name: 'Bowl Proteico', quantity: 5, unitPrice: 42000, subtotal: 210000 },
      { id: 'item-5', name: 'Jugo Natural', quantity: 5, unitPrice: 15000, subtotal: 75000 },
    ],
    total: 285000,
    paid: 0,
    balance: 285000,
    status: 'pendiente',
    deliveryAddress: 'Calle Palma 890, Centro',
  },

  // Cliente 3 - Jorge Ramírez (atrasado)
  {
    id: 'ord-004',
    clientId: '3',
    date: '2025-02-01',
    items: [
      { id: 'item-6', name: 'Catering Empresarial', quantity: 1, unitPrice: 850000, subtotal: 850000 },
    ],
    total: 850000,
    paid: 400000,
    balance: 450000,
    status: 'parcial',
    deliveryAddress: 'Ruta 2 Km 15, San Lorenzo',
    notes: 'Evento corporativo',
  },
  {
    id: 'ord-005',
    clientId: '3',
    date: '2025-01-28',
    items: [
      { id: 'item-7', name: 'Menú Semanal Premium', quantity: 7, unitPrice: 55000, subtotal: 385000 },
    ],
    total: 385000,
    paid: 0,
    balance: 385000,
    status: 'pendiente',
    deliveryAddress: 'Av. San Martín 456, Luque',
  },
  {
    id: 'ord-006',
    clientId: '3',
    date: '2025-01-20',
    items: [
      { id: 'item-8', name: 'Almuerzo Ejecutivo x10', quantity: 10, unitPrice: 45000, subtotal: 450000 },
    ],
    total: 450000,
    paid: 0,
    balance: 450000,
    status: 'pendiente',
    deliveryAddress: 'Calle 14 de Mayo 789, Fernando de la Mora',
  },

  // Cliente 4 - Ana López (moroso)
  {
    id: 'ord-007',
    clientId: '4',
    date: '2025-01-15',
    items: [
      { id: 'item-9', name: 'Plan Mensual Keto', quantity: 1, unitPrice: 1200000, subtotal: 1200000 },
    ],
    total: 1200000,
    paid: 300000,
    balance: 900000,
    status: 'parcial',
    deliveryAddress: 'Calle Independencia 234, Sajonia',
    notes: 'Plan de 30 días',
  },
  {
    id: 'ord-008',
    clientId: '4',
    date: '2024-12-20',
    items: [
      { id: 'item-10', name: 'Cena Navideña Especial', quantity: 1, unitPrice: 650000, subtotal: 650000 },
    ],
    total: 650000,
    paid: 0,
    balance: 650000,
    status: 'pendiente',
    deliveryAddress: 'Calle Independencia 234, Sajonia',
  },

  // Cliente 5 - Roberto Fernández (al_dia)
  {
    id: 'ord-009',
    clientId: '5',
    date: '2025-02-11',
    items: [
      { id: 'item-11', name: 'Menú del Día', quantity: 3, unitPrice: 35000, subtotal: 105000 },
    ],
    total: 105000,
    paid: 105000,
    balance: 0,
    status: 'pagado',
    deliveryAddress: 'Av. Eusebio Ayala 1567, Barrio Obrero',
  },

  // Cliente 7 - Diego Villalba (pendiente)
  {
    id: 'ord-010',
    clientId: '7',
    date: '2025-02-09',
    items: [
      { id: 'item-12', name: 'Brunch Corporativo', quantity: 1, unitPrice: 520000, subtotal: 520000 },
      { id: 'item-13', name: 'Café Premium x20', quantity: 20, unitPrice: 8000, subtotal: 160000 },
    ],
    total: 680000,
    paid: 200000,
    balance: 480000,
    status: 'parcial',
    deliveryAddress: 'Av. Mcal. López 2345, Villa Morra',
    notes: 'World Trade Center, Piso 12',
  },
  {
    id: 'ord-011',
    clientId: '7',
    date: '2025-02-06',
    items: [
      { id: 'item-14', name: 'Almuerzo Saludable x15', quantity: 15, unitPrice: 40000, subtotal: 600000 },
    ],
    total: 600000,
    paid: 0,
    balance: 600000,
    status: 'pendiente',
    deliveryAddress: 'Av. Perú 234, Las Mercedes',
  },

  // Cliente 9 - Miguel Ortiz (atrasado)
  {
    id: 'ord-012',
    clientId: '9',
    date: '2025-01-25',
    items: [
      { id: 'item-15', name: 'Menú Vegano Semanal', quantity: 7, unitPrice: 48000, subtotal: 336000 },
    ],
    total: 336000,
    paid: 100000,
    balance: 236000,
    status: 'parcial',
    deliveryAddress: 'Av. Sacramento 456, Recoleta',
  },
  {
    id: 'ord-013',
    clientId: '9',
    date: '2025-01-18',
    items: [
      { id: 'item-16', name: 'Catering Cumpleaños', quantity: 1, unitPrice: 450000, subtotal: 450000 },
    ],
    total: 450000,
    paid: 0,
    balance: 450000,
    status: 'pendiente',
    deliveryAddress: 'Calle Estrella 234, Centro',
  },

  // Cliente 11 - Fernando Cabrera (moroso)
  {
    id: 'ord-014',
    clientId: '11',
    date: '2024-12-10',
    items: [
      { id: 'item-17', name: 'Plan Trimestral Fitness', quantity: 1, unitPrice: 2800000, subtotal: 2800000 },
    ],
    total: 2800000,
    paid: 500000,
    balance: 2300000,
    status: 'parcial',
    deliveryAddress: 'Av. España 1234, Manorá',
    notes: 'Pago fraccionado acordado',
  },
  {
    id: 'ord-015',
    clientId: '11',
    date: '2024-11-15',
    items: [
      { id: 'item-18', name: 'Evento Corporativo Premium', quantity: 1, unitPrice: 1500000, subtotal: 1500000 },
    ],
    total: 1500000,
    paid: 0,
    balance: 1500000,
    status: 'pendiente',
    deliveryAddress: 'Av. España 1234, Manorá',
  },

  // Pedido anulado (ejemplo)
  {
    id: 'ord-016',
    clientId: '6',
    date: '2025-02-03',
    items: [
      { id: 'item-19', name: 'Pedido Cancelado', quantity: 1, unitPrice: 150000, subtotal: 150000 },
    ],
    total: 150000,
    paid: 0,
    balance: 0,
    status: 'anulado',
    deliveryAddress: 'Calle Cerro Corá 567, Lambaré',
    notes: 'Cliente canceló el pedido',
  },
];

// Helper para obtener pedidos pendientes de un cliente
export const getClientPendingOrders = (clientId: string): Order[] => {
  return orders.filter(
    (order) => order.clientId === clientId && 
    order.status !== 'pagado' && 
    order.status !== 'anulado'
  );
};

// Helper para calcular deuda total de un cliente
export const getClientTotalDebt = (clientId: string): number => {
  return getClientPendingOrders(clientId).reduce((sum, order) => sum + order.balance, 0);
};

// Helper para obtener el conteo de pedidos pendientes
export const getClientPendingOrdersCount = (clientId: string): number => {
  return getClientPendingOrders(clientId).length;
};