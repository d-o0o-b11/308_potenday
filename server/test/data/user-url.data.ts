export const waitingUrl = {
  url: 'WAITING_URL',
  status: true,
} as const;

export const waitingReadUrl = {
  ...waitingUrl,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const waitingUser = {
  imgId: 2,
  nickName: 'TEST NICK',
} as const;

export const waitingReadUser = {
  ...waitingUser,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const waitingNoneUrl = {
  url: 'WAITING_NONE_URL',
  status: true,
} as const;

export const waitingNoneReadUrl = {
  ...waitingNoneUrl,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const updateUrl = {
  url: 'UPDATE_URL',
  status: true,
} as const;

export const updateReadUrl = {
  ...updateUrl,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const updateTrueUrl = {
  url: 'UPDATE_TRUE_URL',
  status: true,
} as const;

export const updateTrueReadUrl = {
  ...updateTrueUrl,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const updateFalseUrl = {
  url: 'UPDATE_FALSE_URL',
  status: false,
} as const;

export const updateFalseReadUrl = {
  ...updateFalseUrl,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;
