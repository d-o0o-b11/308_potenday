import { BALANCE_TYPES } from '@domain';

export const balanceUserId1 = {
  nickName: 'TEST_USER1',
  imgId: 2,
};

export const balanceUserId2 = {
  nickName: 'TEST_USER2',
  imgId: 3,
};

export const balanceUserId3 = {
  nickName: 'TEST_USER3',
  imgId: 1,
};

export const balanceUser1List = [
  {
    balanceId: 1,
    balanceType: BALANCE_TYPES.A,
    createdAt: new Date('2024-09-26'),
  },
  {
    balanceId: 2,
    balanceType: BALANCE_TYPES.A,
    createdAt: new Date('2024-09-26'),
  },
];

export const balanceUser2List = [
  {
    balanceId: 1,
    balanceType: BALANCE_TYPES.A,
    createdAt: new Date('2024-09-26'),
  },
  {
    balanceId: 2,
    balanceType: BALANCE_TYPES.B,
    createdAt: new Date('2024-09-26'),
  },
];

export const balanceUser3List = [
  {
    balanceId: 2,
    balanceType: BALANCE_TYPES.B,
    createdAt: new Date('2024-09-26'),
  },
];
