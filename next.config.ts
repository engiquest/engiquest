import type { NextConfig } from 'next';
const staticExport = process.env.ENGIQUEST_STATIC_EXPORT === '1';
const config: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  ...(staticExport ? {
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    images: { unoptimized: true },
    trailingSlash: true,
  } : {}),
};
export default config;
