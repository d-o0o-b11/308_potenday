export const adjectiveExpressionUserId1 = {
  nickName: 'TEST_USER1',
  imgId: 2,
};

export const adjectiveExpressionUserId1Read = {
  ...adjectiveExpressionUserId1,
  nickname: adjectiveExpressionUserId1.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [11],
    createdAt: new Date('2024-09-21'),
  },
};

export const adjectiveExpressionUserId2 = {
  nickName: 'TEST_USER2',
  imgId: 3,
};
export const adjectiveExpressionUserId2Read = {
  ...adjectiveExpressionUserId2,
  nickname: adjectiveExpressionUserId2.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [1, 3, 11],
    createdAt: new Date('2024-09-21'),
  },
};

export const submitAdjectiveUser = {
  nickName: 'SUBMIT_USER',
  imgId: 2,
};

export const submitAdjectiveUserRead = {
  ...submitAdjectiveUser,
  nickname: submitAdjectiveUser.nickName,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
  adjectiveExpression: {
    adjectiveExpressionIdList: [11],
    createdAt: new Date('2024-09-21'),
  },
};

export const noneSubmitAdjectiveUser = {
  nickName: 'TEST_USER',
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
  nickName: 'TEST_USER',
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
  nickName: 'SUBMIT_USER',
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
