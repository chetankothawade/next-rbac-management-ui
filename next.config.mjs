import path from "path";

const nextConfig = {
  webpack(config) {
    config.resolve.alias["react-router-dom"] = path.resolve(
      process.cwd(),
      "src/lib/react-router-dom.js"
    );
    config.resolve.alias["framer-motion"] = path.resolve(
      process.cwd(),
      "src/lib/framer-motion.js"
    );

    return config;
  },
};

export default nextConfig;
