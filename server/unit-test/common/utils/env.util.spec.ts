import { NODE_ENV, nodeEnv } from '@common';

describe('nodeEnv', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('NODE_ENV: development', () => {
    process.env.NODE_ENV = 'development';
    const env = nodeEnv();
    expect(env).toBe('development');
  });

  it('NODE_ENV: production', () => {
    process.env.NODE_ENV = 'production';
    const env = nodeEnv();
    expect(env).toBe('production');
  });

  it('NODE_ENV: staging', () => {
    process.env.NODE_ENV = 'staging';
    const env = nodeEnv();
    expect(env).toBe('staging');
  });

  it('NODE_ENV: test', () => {
    process.env.NODE_ENV = 'test';
    const env = nodeEnv();
    expect(env).toBe('test');
  });

  it('NODE_ENV: undefined', () => {
    delete process.env.NODE_ENV; // 기존 NODE_ENV 제거
    expect(() => nodeEnv()).toThrow('NODE_ENV가 선언되지 않았습니다.');
  });

  it('그외 NODE_ENV', () => {
    process.env.NODE_ENV = 'invalid_env' as NODE_ENV;
    expect(() => nodeEnv()).toThrow();
  });
});
