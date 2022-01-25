const packageFile = require('./package.json');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  env: {
    appVersion: packageFile.version,
  },
  // https://nextjs.org/docs/api-reference/next.config.js/exportPathMap
  exportPathMap: async () => ({
    '/': { page: '/' },
    '/about/index': { page: '/about' },
  }),
  images: {
    loader: 'custom',
    // https://github.com/vercel/next.js/issues/26527#issuecomment-872044613
    disableStaticImages: true,
  },
  webpack: (config) => {
    const assetRegex = new RegExp(`.(png|jpe?g|gif|woff|woff2|ico|svg)$`);

    config.module.rules.push({
      test: assetRegex,
      type: 'asset/resource',
      generator: {
        filename: './static/assets/[name]-[contenthash].[ext]',
      },
    });

    return config;
  },
};

module.exports = withMDX(nextConfig);
