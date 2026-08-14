export const getAssetUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || '';
  // Ensure the path starts with a slash if baseUrl is present (and baseUrl doesn't end with one)
  // Or just straightforward concatenation:
  // If baseUrl is empty, it returns the local path like '/music/...'
  // If baseUrl is 'https://my-cdn.com', and path is '/music/...', it returns 'https://my-cdn.com/music/...'
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${normalizedBaseUrl}${normalizedPath}`;
};
