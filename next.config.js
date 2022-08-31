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
  // https://nextjs.org/docs/api-reference/next.config.js/basepath
  basePath: '/',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  env: {
    appVersion: packageFile.version,
  },
  // https://nextjs.org/docs/api-reference/next.config.js/exportPathMap
  exportPathMap: async () => ({
    '/': { page: '/' },
    '/about/index': { page: '/about' },
    '/features/index': { page: '/features' },
  }),
  images: {
    loader: 'custom',
    // https://github.com/vercel/next.js/issues/26527#issuecomment-872044613
    disableStaticImages: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /.(png|jpe?g|gif|ico|svg)$/,
      type: 'asset/resource',
      generator: {
        filename: './static/assets/[name]-[contenthash][ext]',
      },
    });

    return config;
  },
};

module.exports = withMDX(nextConfig);
