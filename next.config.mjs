/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '', // Optional, usually left empty
            },
        ],
    },
    webpack(config) {
        config.module.rules.push({
          test: /\.map$/,
          use: 'raw-loader'
        });
        return config;
      },
};

export default nextConfig;