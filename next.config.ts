/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "script-src 'self' 'unsafe-eval' https://*.firebaseio.com https://*.googleapis.com;",
        },
      ],
    },
  ],
};

export default nextConfig;
