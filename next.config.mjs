/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js автоматически добавляет /forum ко всем ссылкам
  // basePath: "/forum",
  assetPrefix: "/forum",

  // Для Server Actions
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },

  // Проксирование API запросов к backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },

  // Отключаем trailing slash
  trailingSlash: false,

  // Дополнительные настройки
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
