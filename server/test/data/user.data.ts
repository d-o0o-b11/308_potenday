export const defaultUrl = {
  url: 'TEST_URL',
  status: true,
} as const;

export const defaultUser = {
  url: defaultUrl.url,
  imgId: 2,
  nickName: 'TEST NICK',
} as const;

export const maxUrl = {
  url: 'MAX_URL',
  status: true,
} as const;

export const maxUser = {
  url: maxUrl.url,
  imgId: 2,
  nickName: 'MAX NICK',
} as const as any;
