export type DiscountType = 'percentage' | 'fixed';

export interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  active: boolean;
}