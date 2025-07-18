import { createRoutesFromFolders } from '@remix-run/v1-route-convention';

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const commonConfig = {
  appDirectory: 'app',
  serverModuleFormat: 'esm',
  serverDependenciesToBundle: [
    'remix-i18next',
    '@remix-validated-form/with-zod',
  ],
  tailwind: true,
  routes(defineRoutes) {
    // uses the v1 convention, works in v1.15+ and v2
    return createRoutesFromFolders(defineRoutes);
  },
};

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const cloudflarePagesConfig = {
  serverBuildPath: 'functions/[[path]].js',
  serverPlatform: 'neutral',
  server: './server-cloudflare-pages.js',
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_dev: true,
    v2_headers: true,
    v2_meta: true,
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: [/^react.*/, 'remix-i18next', '@remix-validated-form/with-zod', 'i18next', 'react-i18next', 'i18next-resources-to-backend', 'i18next-http-backend', 'i18next-browser-languagedetector', 'clsx', 'zod', 'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  serverModuleFormat: "esm",
  serverMinify: true,
  ...commonConfig,
};
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const netlifyConfig = {
  serverBuildTarget: 'netlify',
  server: './server-netlify.js',
  ignoredRouteFiles: ['**/.*'],
  ...commonConfig,
};
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const devConfig = {
  appDirectory: 'app',
  serverModuleFormat: 'cjs',
  devServerPort: 8002,
  ignoredRouteFiles: ['.*'],
  ...commonConfig,
};

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const buildConfig = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  ignoredRouteFiles: ['.*'],
  ...commonConfig,
};

function selectConfig() {
  if (!['development', 'production'].includes(process.env.NODE_ENV))
    throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.CF_PAGES) return cloudflarePagesConfig;
  if (process.env.NETLIFY) return netlifyConfig;
  if (process.env.NODE_ENV === 'development') return devConfig;
  if (!process.env.CF_PAGES && !process.env.NETLIFY) return buildConfig;
  throw new Error(`Cannot select config`);
}

export default selectConfig();
