import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/claudecode_todoapp1",
  images: { unoptimized: true },
  async redirects() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/",
        destination: "/claudecode_todoapp1",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
