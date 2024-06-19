export const nodeEnv = () => {
  const env = process.env.NODE_ENV;

  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV가 선언되지 않았습니다.');
  }
  return env as NODE_ENV;
};

export type NODE_ENV = 'development' | 'staging' | 'production' | 'test';
