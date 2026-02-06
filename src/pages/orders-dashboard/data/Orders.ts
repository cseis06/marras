import type { Order, OrderStatus, Chef, DeliveryPerson, DiscountCode } from '../types/Order';

// Chefs disponibles
export const chefs: Chef[] = [
  { id: 'chef-1', nombre: 'Ricardo Méndez', especialidad: 'Cocina Internacional', disponible: true },
  { id: 'chef-2', nombre: 'Patricia Valenzuela', especialidad: 'Cocina Saludable', disponible: true },
  { id: 'chef-3', nombre: 'Marcos Aguirre', especialidad: 'Cocina Vegana', disponible: false },
  { id: 'chef-4', nombre: 'Lucía Escobar', especialidad: 'Repostería Fit', disponible: true },
  { id: 'chef-5', nombre: 'Fernando Domínguez', especialidad: 'Cocina Keto', disponible: true },
  { id: 'chef-6', nombre: 'Carolina Insfrán', especialidad: 'Cocina Mediterránea', disponible: false },
];

// Repartidores disponibles
export const deliveryPersons: DeliveryPerson[] = [
  { id: 'delivery-1', nombre: 'Juan Pérez', vehiculo: 'moto', zona: 'Asunción Centro', disponible: true },
  { id: 'delivery-2', nombre: 'María López', vehiculo: 'auto', zona: 'Villa Morra / Carmelitas', disponible: true },
  { id: 'delivery-3', nombre: 'Pedro Gómez', vehiculo: 'moto', zona: 'Luque / San Lorenzo', disponible: false },
  { id: 'delivery-4', nombre: 'Ana Benítez', vehiculo: 'bicicleta', zona: 'Asunción Centro', disponible: true },
  { id: 'delivery-5', nombre: 'Carlos Villalba', vehiculo: 'moto', zona: 'Lambaré / Fernando de la Mora', disponible: true },
  { id: 'delivery-6', nombre: 'Sofía Martínez', vehiculo: 'auto', zona: 'San Lorenzo / Capiatá', disponible: true },
];

// Códigos de descuento
export const discountCodes: DiscountCode[] = [
  { code: 'BIENVENIDO10', type: 'percentage', value: 10, active: true },
  { code: 'PROMO20', type: 'percentage', value: 20, minAmount: 100000, maxDiscount: 50000, active: true },
  { code: 'DESCUENTO15K', type: 'fixed', value: 15000, minAmount: 80000, active: true },
  { code: 'VIP25', type: 'percentage', value: 25, minAmount: 150000, maxDiscount: 75000, active: true },
  { code: 'DELIVERY0', type: 'fixed', value: 10000, active: false },
  { code: 'INFLUENCER', type: 'percentage', value: 100, active: true },
];

// Constantes de costos
export const PACKAGING_FEE = 0;
export const DELIVERY_FEE = 5000;
export const FREE_DELIVERY_THRESHOLD = 1000000;

// Categorías de platos mock
const categories = [
  { id: 'cat-1', name: 'Menú Ejecutivo', price: 45000 },
  { id: 'cat-2', name: 'Ensaladas Premium', price: 35000 },
  { id: 'cat-3', name: 'Bowl Proteico', price: 55000 },
  { id: 'cat-4', name: 'Platos Keto', price: 60000 },
  { id: 'cat-5', name: 'Postres Fit', price: 25000 },
  { id: 'cat-6', name: 'Jugos Detox', price: 18000 },
  { id: 'cat-7', name: 'Wraps Saludables', price: 38000 },
  { id: 'cat-8', name: 'Sopas y Cremas', price: 32000 },
];

// Clientes mock
const clients = [
  { id: 'client-1', name: 'Ana García Romero', address: 'Av. España 1234, Asunción' },
  { id: 'client-2', name: 'Carlos Benítez', address: 'Calle Palma 567, Villa Morra' },
  { id: 'client-3', name: 'María Fernández', address: 'Av. Mariscal López 890, Carmelitas' },
  { id: 'client-4', name: 'Luis Acosta', address: 'Dr. Morra 123, San Lorenzo' },
  { id: 'client-5', name: 'Patricia Duarte', address: 'Mcal. Estigarribia 456, Luque' },
  { id: 'client-6', name: 'Roberto González', address: 'Av. Eusebio Ayala 789, Fernando de la Mora' },
  { id: 'client-7', name: 'Sandra Villalba', address: 'Perú 234, Asunción Centro' },
  { id: 'client-8', name: 'Miguel Torres', address: 'Brasil 567, Lambaré' },
  { id: 'client-9', name: 'Elena Martínez', address: 'Av. Aviadores 890, Asunción' },
  { id: 'client-10', name: 'José Ramírez', address: 'Colón 123, Villa Morra' },
];

// Función para generar fecha aleatoria en un rango
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Función para generar número de pedido
const generateOrderNumber = (date: Date): string => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}-${random}`;
};

// Función para seleccionar items aleatorios
const randomItems = () => {
  const numItems = Math.floor(Math.random() * 4) + 1;
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, numItems);
  
  return selected.map(cat => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      quantity,
      unitPrice: cat.price,
      subtotal: quantity * cat.price,
    };
  });
};

// Función para seleccionar estado ponderado
const randomStatus = (isRecent: boolean): OrderStatus => {
  const statuses: { status: OrderStatus; weight: number }[] = isRecent
    ? [
        { status: 'pendiente', weight: 15 },
        { status: 'confirmado', weight: 20 },
        { status: 'en_preparacion', weight: 15 },
        { status: 'listo', weight: 10 },
        { status: 'en_camino', weight: 10 },
        { status: 'entregado', weight: 25 },
        { status: 'cancelado', weight: 5 },
      ]
    : [
        { status: 'entregado', weight: 80 },
        { status: 'cancelado', weight: 15 },
        { status: 'borrador', weight: 5 },
      ];

  const totalWeight = statuses.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const s of statuses) {
    if (random < s.weight) return s.status;
    random -= s.weight;
  }
  
  return 'entregado';
};

// Generar pedidos mock
const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  // Generar aproximadamente 500 pedidos en el último año
  for (let i = 0; i < 500; i++) {
    const orderDate = randomDate(oneYearAgo, now);
    const isRecent = (now.getTime() - orderDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
    const items = randomItems();
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const client = clients[Math.floor(Math.random() * clients.length)];
    const chef = chefs[Math.floor(Math.random() * chefs.length)];
    const delivery = deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)];
    
    // Descuento aleatorio (20% de probabilidad)
    const hasDiscount = Math.random() < 0.2;
    const discountCode = hasDiscount 
      ? discountCodes.filter(d => d.active)[Math.floor(Math.random() * discountCodes.filter(d => d.active).length)]
      : null;
    
    let discountAmount = 0;
    if (discountCode) {
      if (discountCode.type === 'percentage') {
        discountAmount = Math.round(subtotal * (discountCode.value / 100));
        if (discountCode.maxDiscount) {
          discountAmount = Math.min(discountAmount, discountCode.maxDiscount);
        }
      } else {
        discountAmount = discountCode.value;
      }
    }
    
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + PACKAGING_FEE + deliveryFee - discountAmount;
    const status = randomStatus(isRecent);
    
    // Recurrencia aleatoria (15% de probabilidad)
    const isRecurrent = Math.random() < 0.15;
    
    orders.push({
      id: `order-${i + 1}`,
      orderNumber: generateOrderNumber(orderDate),
      clientId: client.id,
      clientName: client.name,
      locationId: `loc-${client.id}`,
      locationAddress: client.address,
      deliveryDate: orderDate.toISOString().split('T')[0],
      items,
      subtotal,
      packagingFee: PACKAGING_FEE,
      deliveryFee,
      discount: discountCode ? { code: discountCode.code, amount: discountAmount } : null,
      total,
      status,
      chefId: chef.id,
      chefName: chef.nombre,
      deliveryPersonId: delivery.id,
      deliveryPersonName: delivery.nombre,
      notes: Math.random() < 0.3 ? 'Sin cebolla, por favor' : '',
      recurrence: isRecurrent ? {
        enabled: true,
        days: ['lunes', 'miercoles', 'viernes'],
        startDate: orderDate.toISOString().split('T')[0],
      } : null,
      createdAt: orderDate.toISOString(),
      updatedAt: orderDate.toISOString(),
    });
  }
  
  // Ordenar por fecha descendente
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const orders: Order[] = generateOrders();

// Funciones helper para filtrar pedidos por período
export const filterOrdersByPeriod = (orders: Order[], period: 'day' | 'week' | 'month' | 'year'): Order[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let startDate: Date;
  
  switch (period) {
    case 'day':
      startDate = today;
      break;
    case 'week':
      const dayOfWeek = today.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - daysFromMonday);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = today;
  }
  
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= now;
  });
};

// Calcular estadísticas generales
export const calculateStats = (filteredOrders: Order[]) => {
  const delivered = filteredOrders.filter(o => o.status === 'entregado');
  const cancelled = filteredOrders.filter(o => o.status === 'cancelado');
  const pending = filteredOrders.filter(o => 
    ['pendiente', 'confirmado', 'en_preparacion', 'listo', 'en_camino'].includes(o.status)
  );
  const recurrent = filteredOrders.filter(o => o.recurrence?.enabled);
  
  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
  const totalItems = filteredOrders.reduce((sum, o) => 
    sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  
  return {
    totalOrders: filteredOrders.length,
    totalRevenue,
    averageOrderValue: filteredOrders.length > 0 ? Math.round(totalRevenue / delivered.length) || 0 : 0,
    totalItems,
    deliveredOrders: delivered.length,
    cancelledOrders: cancelled.length,
    pendingOrders: pending.length,
    recurrentOrders: recurrent.length,
  };
};

// Estadísticas por categoría
export const getCategoryStats = (filteredOrders: Order[]) => {
  const categoryMap = new Map<string, { name: string; quantity: number; revenue: number; orders: Set<string> }>();
  
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const existing = categoryMap.get(item.categoryId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
        existing.orders.add(order.id);
      } else {
        categoryMap.set(item.categoryId, {
          name: item.categoryName,
          quantity: item.quantity,
          revenue: item.subtotal,
          orders: new Set([order.id]),
        });
      }
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([id, data]) => ({
      categoryId: id,
      categoryName: data.name,
      totalQuantity: data.quantity,
      totalRevenue: data.revenue,
      orderCount: data.orders.size,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);
};

// Estadísticas por chef
export const getChefStats = (filteredOrders: Order[]) => {
  const chefMap = new Map<string, { name: string; orders: number; revenue: number }>();
  
  filteredOrders.filter(o => o.chefId && o.status !== 'cancelado').forEach(order => {
    const existing = chefMap.get(order.chefId!);
    if (existing) {
      existing.orders += 1;
      existing.revenue += order.total;
    } else {
      chefMap.set(order.chefId!, {
        name: order.chefName || 'Sin asignar',
        orders: 1,
        revenue: order.total,
      });
    }
  });
  
  return Array.from(chefMap.entries())
    .map(([id, data]) => ({
      chefId: id,
      chefName: data.name,
      totalOrders: data.orders,
      totalRevenue: data.revenue,
    }))
    .sort((a, b) => b.totalOrders - a.totalOrders);
};

// Estadísticas por repartidor
export const getDeliveryStats = (filteredOrders: Order[]) => {
  const deliveryMap = new Map<string, { name: string; deliveries: number }>();
  
  filteredOrders.filter(o => o.deliveryPersonId && o.status === 'entregado').forEach(order => {
    const existing = deliveryMap.get(order.deliveryPersonId!);
    if (existing) {
      existing.deliveries += 1;
    } else {
      const person = deliveryPersons.find(d => d.id === order.deliveryPersonId);
      deliveryMap.set(order.deliveryPersonId!, {
        name: order.deliveryPersonName || 'Sin asignar',
        deliveries: 1,
      });
    }
  });
  
  return Array.from(deliveryMap.entries())
    .map(([id, data]) => ({
      deliveryPersonId: id,
      deliveryPersonName: data.name,
      totalDeliveries: data.deliveries,
      zone: deliveryPersons.find(d => d.id === id)?.zona || '',
    }))
    .sort((a, b) => b.totalDeliveries - a.totalDeliveries);
};

// Estadísticas diarias para gráfico de líneas
export const getDailyStats = (filteredOrders: Order[], days: number = 30) => {
  const now = new Date();
  const result: { date: string; orders: number; revenue: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOrders = filteredOrders.filter(o => o.deliveryDate === dateStr);
    const delivered = dayOrders.filter(o => o.status === 'entregado');
    
    result.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: delivered.reduce((sum, o) => sum + o.total, 0),
    });
  }
  
  return result;
};

// Estadísticas por estado
export const getStatusStats = (filteredOrders: Order[]) => {
  const statusMap = new Map<string, number>();
  
  filteredOrders.forEach(order => {
    statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
  });
  
  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));
};

// Top clientes
export const getTopClients = (filteredOrders: Order[], limit: number = 5) => {
  const clientMap = new Map<string, { name: string; orders: number; revenue: number }>();
  
  filteredOrders.filter(o => o.status === 'entregado').forEach(order => {
    const existing = clientMap.get(order.clientId);
    if (existing) {
      existing.orders += 1;
      existing.revenue += order.total;
    } else {
      clientMap.set(order.clientId, {
        name: order.clientName,
        orders: 1,
        revenue: order.total,
      });
    }
  });
  
  return Array.from(clientMap.entries())
    .map(([id, data]) => ({
      clientId: id,
      clientName: data.name,
      totalOrders: data.orders,
      totalRevenue: data.revenue,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
};