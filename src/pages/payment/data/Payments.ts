import type { Payment } from '../types/Payment';

// Historial de pagos registrados
export const payments: Payment[] = [
  {
    id: 'pay-001',
    clientId: '1',
    clientName: 'Carlos Martínez',
    date: '2025-02-10',
    amount: 330000,
    paymentMethod: 'transferencia',
    allocations: [
      { orderId: 'ord-001', amount: 330000 },
    ],
    receiptNumber: 'REC-2025-001',
    createdAt: '2025-02-10T14:30:00',
  },
  {
    id: 'pay-002',
    clientId: '3',
    clientName: 'Jorge Ramírez',
    date: '2025-02-05',
    amount: 400000,
    paymentMethod: 'efectivo',
    allocations: [
      { orderId: 'ord-004', amount: 400000 },
    ],
    notes: 'Primer pago del catering',
    receiptNumber: 'REC-2025-002',
    createdAt: '2025-02-05T10:15:00',
  },
  {
    id: 'pay-003',
    clientId: '4',
    clientName: 'Ana López',
    date: '2025-01-20',
    amount: 300000,
    paymentMethod: 'tarjeta',
    allocations: [
      { orderId: 'ord-007', amount: 300000 },
    ],
    notes: 'Pago inicial plan keto',
    receiptNumber: 'REC-2025-003',
    createdAt: '2025-01-20T16:45:00',
  },
  {
    id: 'pay-004',
    clientId: '5',
    clientName: 'Roberto Fernández',
    date: '2025-02-11',
    amount: 105000,
    paymentMethod: 'efectivo',
    allocations: [
      { orderId: 'ord-009', amount: 105000 },
    ],
    receiptNumber: 'REC-2025-004',
    createdAt: '2025-02-11T12:00:00',
  },
  {
    id: 'pay-005',
    clientId: '7',
    clientName: 'Diego Villalba',
    date: '2025-02-09',
    amount: 200000,
    paymentMethod: 'transferencia',
    allocations: [
      { orderId: 'ord-010', amount: 200000 },
    ],
    notes: 'Adelanto para brunch',
    receiptNumber: 'REC-2025-005',
    createdAt: '2025-02-09T09:30:00',
  },
  {
    id: 'pay-006',
    clientId: '9',
    clientName: 'Miguel Ortiz',
    date: '2025-01-28',
    amount: 100000,
    paymentMethod: 'cheque',
    allocations: [
      { orderId: 'ord-012', amount: 100000 },
    ],
    notes: 'Cheque a 30 días',
    receiptNumber: 'REC-2025-006',
    createdAt: '2025-01-28T11:20:00',
  },
  {
    id: 'pay-007',
    clientId: '11',
    clientName: 'Fernando Cabrera',
    date: '2024-12-15',
    amount: 500000,
    paymentMethod: 'transferencia',
    allocations: [
      { orderId: 'ord-014', amount: 500000 },
    ],
    notes: 'Primera cuota plan trimestral',
    receiptNumber: 'REC-2024-050',
    createdAt: '2024-12-15T15:00:00',
  },
];

// Helper para obtener pagos de un cliente
export const getClientPayments = (clientId: string): Payment[] => {
  return payments.filter((payment) => payment.clientId === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper para generar número de recibo
export const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear();
  const count = payments.length + 1;
  return `REC-${year}-${count.toString().padStart(3, '0')}`;
};