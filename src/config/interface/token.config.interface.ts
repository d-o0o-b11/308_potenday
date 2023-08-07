export interface IsTokenConfig {
  jwt_access_secret: string;
  jwt_access_expiration_time: string;
  jwt_refresh_secret: string;
  jwt_refresh_expiration_time: string;
}
