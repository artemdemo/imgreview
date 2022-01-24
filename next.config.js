const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // https://github.com/vercel/next.js/issues/26527
    disableStaticImages: true,
  },
  webpack: (config) => {
    const assetRegex = new RegExp(`.(png|jpe?g|gif|woff|woff2|ico|svg)$`)

    config.module.rules.push({
      test: assetRegex,
      type: 'asset/resource',
      generator: {
        filename: './static/assets/[name]-[contenthash].[ext]',
      },
    })

    return config
  },
}

module.exports = withMDX(nextConfig);
