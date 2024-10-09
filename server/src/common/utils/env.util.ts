export const NODE_ENV_VALUES = [
  'development',
  'staging',
  'production',
  'test',
] as const;

export type NODE_ENV = (typeof NODE_ENV_VALUES)[number];

export const nodeEnv = () => {
  const env = process.env.NODE_ENV as NODE_ENV | undefined;

  if (!env) {
    throw new Error('NODE_ENV가 선언되지 않았습니다.');
  }

  if (!NODE_ENV_VALUES.includes(env)) {
    throw new Error(`유효하지 않은 NODE_ENV 값입니다: ${env}`);
  }

  return env;
};
