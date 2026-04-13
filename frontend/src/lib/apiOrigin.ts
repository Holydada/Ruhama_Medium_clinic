const DEFAULT_API = 'http://localhost:5000/api/v1';

export const getApiBaseUrl = (): string =>
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API;

/** Public health endpoint is on the API host, not under /api/v1 */
export const getPublicApiOrigin = (): string => {
  const base = getApiBaseUrl().replace(/\/$/, '');
  // Remove /api/v1 or /api from the end to get the origin
  if (base.endsWith('/api/v1')) {
    return base.slice(0, -'/api/v1'.length);
  }
  if (base.endsWith('/api')) {
    return base.slice(0, -'/api'.length);
  }
  return base;
};

export const getHealthCheckUrl = (): string => `${getPublicApiOrigin()}/health`;
