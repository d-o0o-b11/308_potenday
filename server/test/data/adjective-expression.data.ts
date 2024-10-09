export const adjectiveExpressionUserId1 = {
  name: 'TEST_USER1',
  imgId: 2,
};

export const adjectiveExpressionUserId1Read = {
  ...adjectiveExpressionUserId1,
  name: adjectiveExpressionUserId1.name,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [11],
    createdAt: new Date('2024-09-21'),
  },
};

export const adjectiveExpressionUserId2 = {
  name: 'TEST_USER2',
  imgId: 3,
};
export const adjectiveExpressionUserId2Read = {
  ...adjectiveExpressionUserId2,
  name: adjectiveExpressionUserId2.name,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [1, 3, 11],
    createdAt: new Date('2024-09-21'),
  },
};

export const submitAdjectiveUser = {
  name: 'SUBMIT_USER',
  imgId: 2,
};

export const submitAdjectiveUserRead = {
  ...submitAdjectiveUser,
  name: submitAdjectiveUser.name,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [11],
    createdAt: new Date('2024-09-21'),
  },
};

export const noneSubmitAdjectiveUser = {
  name: 'TEST_USER',
  imgId: 2,
};

export const noneSubmitAdjectiveUserRead = {
  ...noneSubmitAdjectiveUser,
  // nickname: noneSubmitAdjectiveUser.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
};

export const noneSubmitBalanceUser = {
  name: 'TEST_USER',
  imgId: 2,
};

export const noneSubmitBalanceUserRead = {
  ...noneSubmitBalanceUser,
  // nickname: noneSubmitBalanceUser.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
};

export const submitBalanceUser = {
  name: 'SUBMIT_USER',
  imgId: 2,
};

export const submitBalanceUserRead = {
  ...submitBalanceUser,
  balance: [
    {
      balanceId: 1,
      createdAt: new Date('2024-09-22'),
      balanceType: 'A',
    },
  ],
  // nickname: submitBalanceUser.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
};
