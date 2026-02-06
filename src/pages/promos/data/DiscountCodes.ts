import type { DiscountCode } from '../types/DiscountCode';

export const discountCodes: DiscountCode[] = [
  {
    id: '1',
    code: 'BIENVENIDO10',
    type: 'percentage',
    value: 10,
    active: true,
  },
  {
    id: '2',
    code: 'PROMO20',
    type: 'percentage',
    value: 20,
    minAmount: 100000,
    maxDiscount: 50000,
    active: true,
  },
  {
    id: '3',
    code: 'DESCUENTO15K',
    type: 'fixed',
    value: 15000,
    minAmount: 80000,
    active: true,
  },
  {
    id: '4',
    code: 'VIP25',
    type: 'percentage',
    value: 25,
    minAmount: 150000,
    maxDiscount: 75000,
    active: true,
  },
  {
    id: '5',
    code: 'DELIVERY0',
    type: 'fixed',
    value: 10000,
    active: false,
  },
  {
    id: '6',
    code: 'INFLUENCER',
    type: 'percentage',
    value: 100,
    active: true,
  },
];