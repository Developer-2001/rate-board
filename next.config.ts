import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT_MODE === "export";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow your local network device (phone/other PC)
  allowedDevOrigins: ["10.254.165.216"],
};

if (isStaticExport) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = {
    unoptimized: true,
  };
}

export default nextConfig;
