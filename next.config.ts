import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow your local network device (phone/other PC)
  allowedDevOrigins: ["192.168.31.50"],
};

export default nextConfig;