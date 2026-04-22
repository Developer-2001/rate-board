import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow your local network device (phone/other PC)
  allowedDevOrigins: ["10.254.165.216"],
};

export default nextConfig;