export interface IJwt {
  secretKey: string;
  secretKeyExpire: string;
  cookieHeader: string;
  cookieExpire: number;
}
