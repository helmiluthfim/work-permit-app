/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Setiap kali browser meminta URL yang berawalan /cdn/
        source: "/cdn/:path*",
        // Vercel akan diam-diam mengambil datanya dari R2
        destination:
          "https://pub-85cd6db2069b4d4693922d6d20b579e3.r2.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
