// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ADR-001: статический вывод, деплой по FTP на cPanel/Apache (клон пайплайна bravo-motors)
// ADR-002: trailingSlash 'always' — урок bravo-motors (71 внутренний 301 из-за отсутствия слэшей на Apache)
// ADR-004: Keystatic + Node-адаптер подключаются ТОЛЬКО в локальном режиме (npm run cms);
//          прод-сборка (npm run build) — чистая статика без серверного кода.
const KEYSTATIC = process.env.KEYSTATIC === 'true';

let keystaticIntegrations = [];
let adapter = undefined;
if (KEYSTATIC) {
  const { default: react } = await import('@astrojs/react');
  const { default: keystatic } = await import('@keystatic/astro');
  const { default: node } = await import('@astrojs/node');
  keystaticIntegrations = [react(), keystatic()];
  adapter = node({ mode: 'standalone' });
}

export default defineConfig({
  site: 'https://vw-club.md',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  adapter,
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'ru'],
    routing: {
      prefixDefaultLocale: false, // RO в корне, RU под /ru/
    },
  },
  integrations: [
    ...keystaticIntegrations,
    sitemap({
      i18n: {
        defaultLocale: 'ro',
        locales: { ro: 'ro', ru: 'ru' },
      },
    }),
  ],
});
