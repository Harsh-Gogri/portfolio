const createMDX = require('@next/mdx');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizeCss: true,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

module.exports = withMDX(nextConfig);
