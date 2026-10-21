/** These public build settings never contain credentials. */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
export const BASE_PATH = STATIC_EXPORT ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
export const assetPath = (path: string) => `${BASE_PATH}${path}`;
