/*
 * Copyright 2024 English Vocabulary Practice Template Generator Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Skip linting during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip type checking during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // Set base path for GitHub Pages (uncomment and modify if using custom domain)
  // basePath: '/english-vocabulary-generator',

  // Asset prefix for GitHub Pages (uncomment and modify if using custom domain)
  // assetPrefix: '/english-vocabulary-generator/',

  // Trailing slash for better compatibility
  trailingSlash: true,

  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle PDF generation in client-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'english-vocabulary-generator',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
