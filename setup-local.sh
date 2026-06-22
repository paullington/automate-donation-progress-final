#!/bin/bash

# Automated Donation Tracking System - Local Setup Script
# Run this script to set up the project locally

set -e

PROJECT_NAME="automated-donation-tracking"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Automated Donation Tracking System - Local Setup             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Create project directory
echo "1. Creating project directory: $PROJECT_NAME"
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "2. Initializing npm project..."
npm init -y > /dev/null

echo "3. Installing dependencies..."
npm install --legacy-peer-deps \
  next@16 \
  react@19 \
  react-dom@19 \
  typescript \
  tailwindcss \
  postcss \
  autoprefixer \
  drizzle-orm \
  pg \
  @vercel/blob \
  lucide-react \
  swr \
  qrcode.react \
  --save

npm install --save-dev \
  @types/node \
  @types/react \
  @types/react-dom \
  typescript \
  --save-dev

echo "4. Setting up configuration files..."
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom", "dom.iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIG

cat > next.config.mjs << 'NEXTCONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
NEXTCONFIG

cat > tailwind.config.ts << 'TAILWIND'
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
TAILWIND

cat > postcss.config.js << 'POSTCSS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS

echo "5. Creating .gitignore..."
cat > .gitignore << 'GITIGNORE'
node_modules/
.next/
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
*.zip
*.tar.gz
.vercel/
GITIGNORE

echo "6. Creating .env.example..."
cat > .env.example << 'ENVEXAMPLE'
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_token_here

# Admin
ADMIN_PASSWORD=your_password_here
ENVEXAMPLE

echo "7. Creating package.json scripts..."
npm set-script dev "next dev"
npm set-script build "next build"
npm set-script start "next start"
npm set-script lint "next lint"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   ✅ Setup Complete!                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Copy source files from v0 project"
echo "2. Create .env.local with your database URL"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "Documentation:"
echo "• START_HERE.md - Quick start guide"
echo "• HOW_TO_DOWNLOAD.md - Detailed setup"
echo "• DEPLOYMENT_CHECKLIST.md - Production"
echo ""
