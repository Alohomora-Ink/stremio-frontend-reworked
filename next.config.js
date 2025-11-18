/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  devIndicators: false,

  webpack: (config, { isServer, dev }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    config.output.webassemblyModuleFilename = isServer
      ? "../static/wasm/[modulehash].wasm"
      : "static/wasm/[modulehash].wasm";
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    if (!isServer) {
      config.module.rules.push({
        test: /stremio_core_web_bg\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "static/wasm/[name][ext]",
        },
      });
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
