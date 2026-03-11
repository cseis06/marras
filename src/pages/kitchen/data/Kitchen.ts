import type {
  Chef,
  ChefTask,
  CategoryAssignment,
  CustomOrderAssignment,
  KitchenStats,
  ChefColor,
} from '../types/Kitchen';

// Cocineras disponibles
export const chefs: Chef[] = [
  {
    id: 'chef-1',
    name: 'María González',
    color: 'amber',
    specialty: 'Cocina Keto y Saludable',
    available: true,
  },
  {
    id: 'chef-2',
    name: 'Teresa López',
    color: 'emerald',
    specialty: 'Cocina Hiperproteica',
    available: true,
  },
  {
    id: 'chef-3',
    name: 'Carmen Ruiz',
    color: 'violet',
    specialty: 'Cocina Mediterránea y Vegana',
    available: true,
  },
  {
    id: 'chef-4',
    name: 'Lucía Escobar',
    color: 'sky',
    specialty: 'Repostería Fit',
    available: true,
  },
  {
    id: 'chef-5',
    name: 'Patricia Benítez',
    color: 'rose',
    specialty: 'Cocina Internacional',
    available: false,
  },
  {
    id: 'chef-6',
    name: 'Sandra Villalba',
    color: 'orange',
    specialty: 'Cocina Detox',
    available: true,
  },
];

// Categorías de platos
const categories = [
  { id: 'cat-1', name: 'Almuerzos Keto' },
  { id: 'cat-2', name: 'Cenas Hiperproteicas' },
  { id: 'cat-3', name: 'Cenas Saludables' },
  { id: 'cat-4', name: 'Ensaladas Premium' },
  { id: 'cat-5', name: 'Bowl Proteico' },
  { id: 'cat-6', name: 'Postres Fit' },
  { id: 'cat-7', name: 'Jugos Detox' },
  { id: 'cat-8', name: 'Wraps Saludables' },
  { id: 'cat-9', name: 'Sopas y Cremas' },
  { id: 'cat-10', name: 'Platos Veganos' },
  { id: 'cat-11', name: 'Cocina Mediterránea' },
  { id: 'cat-12', name: 'Snacks Saludables' },
];

// Clientes para pedidos personalizados
const clients = [
  { id: 'client-1', name: 'Ana García Romero' },
  { id: 'client-2', name: 'Carlos Benítez' },
  { id: 'client-3', name: 'María Fernández' },
  { id: 'client-4', name: 'Luis Acosta' },
  { id: 'client-5', name: 'Patricia Duarte' },
  { id: 'client-6', name: 'Roberto González' },
  { id: 'client-7', name: 'Sandra Villalba' },
  { id: 'client-8', name: 'Miguel Torres' },
];

// Notas de personalización comunes
const customNotes = [
  'Sin gluten, sin lácteos',
  'Extra proteína, sin sal',
  'Sin cebolla ni ajo',
  'Bajo en sodio',
  'Sin azúcar añadida',
  'Porción doble de vegetales',
  'Sin mariscos (alergia)',
  'Vegetariano estricto',
  'Sin picante',
  'Sin frutos secos (alergia)',
];

// Función para generar número de pedido
const generateOrderNumber = (): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}-${random}`;
};

// Función para obtener fecha formateada
const getDateString = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Asignaciones de categorías por cocinera (configuración base)
const chefCategoryAssignments: Record<string, string[]> = {
  'chef-1': ['cat-1', 'cat-3', 'cat-6'], // María: Keto, Saludables, Postres Fit
  'chef-2': ['cat-2', 'cat-5'], // Teresa: Hiperproteicas, Bowl Proteico
  'chef-3': ['cat-10', 'cat-11', 'cat-4'], // Carmen: Veganos, Mediterránea, Ensaladas
  'chef-4': ['cat-6', 'cat-12'], // Lucía: Postres Fit, Snacks
  'chef-5': ['cat-8', 'cat-9'], // Patricia: Wraps, Sopas
  'chef-6': ['cat-7', 'cat-4'], // Sandra: Detox, Ensaladas
};

// Generar asignaciones de categorías para una cocinera
const generateCategoryAssignments = (chefId: string, date: string): CategoryAssignment[] => {
  const categoryIds = chefCategoryAssignments[chefId] || [];
  
  return categoryIds.map((catId) => {
    const category = categories.find((c) => c.id === catId);
    const quantity = Math.floor(Math.random() * 30) + 10; // 10-40 platos
    const completionRate = date === getDateString(0) 
      ? Math.random() * 0.8 // Hoy: 0-80% completado
      : date < getDateString(0) 
        ? 1 // Pasado: 100%
        : 0; // Futuro: 0%
    
    return {
      id: `assign-${chefId}-${catId}-${date}`,
      categoryId: catId,
      categoryName: category?.name || 'Categoría desconocida',
      quantity,
      completed: Math.floor(quantity * completionRate),
    };
  });
};

// Generar pedidos personalizados para una cocinera
const generateCustomOrders = (chefId: string, date: string): CustomOrderAssignment[] => {
  // Solo algunas cocineras tienen pedidos personalizados
  const hasCustomOrders = Math.random() > 0.3;
  if (!hasCustomOrders) return [];

  const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 pedidos
  const orders: CustomOrderAssignment[] = [];

  for (let i = 0; i < numOrders; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const note = customNotes[Math.floor(Math.random() * customNotes.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const isCompleted = date < getDateString(0) || (date === getDateString(0) && Math.random() > 0.5);

    orders.push({
      id: `custom-${chefId}-${date}-${i}`,
      orderId: `order-custom-${i}`,
      orderNumber: generateOrderNumber(),
      clientId: client.id,
      clientName: client.name,
      notes: note,
      quantity,
      completed: isCompleted,
    });
  }

  return orders;
};

// Generar tareas para todas las cocineras en una fecha
export const generateChefTasks = (date: string): ChefTask[] => {
  return chefs
    .filter((chef) => chef.available)
    .map((chef) => {
      const categoryAssignments = generateCategoryAssignments(chef.id, date);
      const customOrders = generateCustomOrders(chef.id, date);

      const totalFromCategories = categoryAssignments.reduce((sum, cat) => sum + cat.quantity, 0);
      const totalFromCustom = customOrders.reduce((sum, order) => sum + order.quantity, 0);
      const totalDishes = totalFromCategories + totalFromCustom;

      const completedFromCategories = categoryAssignments.reduce((sum, cat) => sum + cat.completed, 0);
      const completedFromCustom = customOrders.filter((o) => o.completed).reduce((sum, o) => sum + o.quantity, 0);
      const completedDishes = completedFromCategories + completedFromCustom;

      return {
        id: `task-${chef.id}-${date}`,
        chefId: chef.id,
        chefName: chef.name,
        chefColor: chef.color,
        date,
        categories: categoryAssignments,
        customOrders,
        totalDishes,
        completedDishes,
      };
    });
};

// Cache de tareas generadas para consistencia
const tasksCache: Record<string, ChefTask[]> = {};

// Obtener tareas para una fecha (con cache)
export const getChefTasks = (date: string): ChefTask[] => {
  if (!tasksCache[date]) {
    tasksCache[date] = generateChefTasks(date);
  }
  return tasksCache[date];
};

// Obtener tareas filtradas por cocinera
export const getChefTasksFiltered = (date: string, chefId: string | null): ChefTask[] => {
  const tasks = getChefTasks(date);
  if (!chefId) return tasks;
  return tasks.filter((task) => task.chefId === chefId);
};

// Calcular estadísticas generales
export const calculateKitchenStats = (tasks: ChefTask[]): KitchenStats => {
  const totalDishes = tasks.reduce((sum, task) => sum + task.totalDishes, 0);
  const completedDishes = tasks.reduce((sum, task) => sum + task.completedDishes, 0);
  const totalCategories = tasks.reduce((sum, task) => sum + task.categories.length, 0);
  const totalCustomOrders = tasks.reduce((sum, task) => sum + task.customOrders.length, 0);

  return {
    totalDishes,
    completedDishes,
    pendingDishes: totalDishes - completedDishes,
    activeChefs: tasks.length,
    totalCategories,
    totalCustomOrders,
  };
};

// Obtener opciones de cocineras para el select
export const getChefOptions = (date: string): { value: string; label: string; color: ChefColor; count: number }[] => {
  const tasks = getChefTasks(date);
  return tasks.map((task) => ({
    value: task.chefId,
    label: task.chefName,
    color: task.chefColor,
    count: task.totalDishes,
  }));
};

// Helper para obtener fecha de hoy
export const getTodayString = (): string => getDateString(0);

// Helper para obtener fecha de mañana
export const getTomorrowString = (): string => getDateString(1);

// Helper para obtener rango de la semana
export const getWeekRange = (): { start: string; end: string } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: friday.toISOString().split('T')[0],
  };
};

// Obtener tareas de toda la semana
export const getWeekTasks = (): ChefTask[] => {
  const { start, end } = getWeekRange();
  const allTasks: ChefTask[] = [];
  
  const currentDate = new Date(start);
  const endDate = new Date(end);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTasks = getChefTasks(dateStr);
    allTasks.push(...dayTasks);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return allTasks;
};

// Formatear fecha para mostrar
export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.getTime() === today.getTime()) {
    return 'Hoy';
  }
  if (date.getTime() === tomorrow.getTime()) {
    return 'Mañana';
  }
  
  return date.toLocaleDateString('es-PY', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
};