/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    // Stub out Solana packages (we only use EVM)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@solana-program/system": false,
      "@solana-program/memo": false,
      "@solana-program/token": false,
      "@solana/kit": false,
      "@react-native-async-storage/async-storage": false,
    };

    // Handle node externals
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
