export const defaultUrl = {
  id: 1,
  url: 'TEST_URL',
  status: true,
} as const;

export const defaultReadUrl = {
  url: defaultUrl.url,
  status: defaultUrl.status,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const gamingUrl = {
  url: 'GAMING_URL',
  status: false,
} as const;

export const gamingReadUrl = {
  url: gamingUrl.url,
  status: gamingUrl.status,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const gamingUser = {
  url: gamingUrl.url,
  imgId: 2,
  name: 'TEST NICK',
} as const;

export const defaultUser = {
  imgId: 2,
  name: 'TEST NICK',
} as const;

export const maxUrl = {
  url: 'MAX_URL',
  status: true,
} as const;

export const maxReadUrl = {
  url: maxUrl.url,
  status: maxUrl.status,
  createdAt: new Date('2024-09-21'),
  updatedAt: null,
  deletedAt: null,
} as const;

export const maxUser = {
  url: maxUrl.url,
  imgId: 2,
  name: 'MAX NICK',
} as const as any;
