/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "l0pnnd1rqowgwafz.public.blob.vercel-storage.com",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
