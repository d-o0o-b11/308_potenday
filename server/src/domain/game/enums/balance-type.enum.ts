export const BALANCE_TYPES = {
  A: 'A',
  B: 'B',
} as const;
export type BalanceType = (typeof BALANCE_TYPES)[keyof typeof BALANCE_TYPES];
