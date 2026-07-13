/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './lib/netlifyImageLoader.js',
  },
  trailingSlash: true,
}

module.exports = nextConfig
