import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT_MODE === "export";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow your local network device (phone/other PC)
  allowedDevOrigins: ["192.168.31.50"],
};

if (isStaticExport) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = {
    unoptimized: true,
  };
}

export default nextConfig;
