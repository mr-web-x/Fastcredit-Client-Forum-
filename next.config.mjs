/** @type {import('next').NextConfig} */
const nextConfig = {
  // Форум живёт под /forum
  // basePath: "/forum",
  // // Если статика будет кешироваться/отдаваться через основной сайт:
  assetPrefix: "/forum",
  // trailingSlash: true,
  // Для Server Actions (если будешь их использовать)
  experimental: { serverActions: { bodySizeLimit: "2mb" } },

  // Проксирование запросов к твоему API (удобно на dev)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
export default nextConfig;
