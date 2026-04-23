import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.parasinfotech.rateboard",
  appName: "Rate Board",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
