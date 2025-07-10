#!/bin/bash

# 🚀 Git Repository Initialization Script
# HengshuiFont English Generator
# Copyright 2024 - Apache License 2.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project information
PROJECT_NAME="HengshuiFont-English-Generator"
PROJECT_DESCRIPTION="🌟 Professional Hengshui-style English vocabulary practice template generator for Chinese students"

echo -e "${PURPLE}🚀 HengshuiFont English Generator - Git Initialization${NC}"
echo -e "${PURPLE}=================================================${NC}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Get GitHub username
echo -e "${CYAN}📝 Please enter your GitHub username:${NC}"
read -p "GitHub Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required.${NC}"
    exit 1
fi

# Confirm repository URL
REPO_URL="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}.git"
echo -e "${YELLOW}📍 Repository URL will be: ${REPO_URL}${NC}"
echo -e "${YELLOW}⚠️  Make sure you have created the repository on GitHub first!${NC}"
echo ""

read -p "Continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏹️  Operation cancelled.${NC}"
    exit 0
fi

echo -e "${BLUE}🔧 Initializing Git repository...${NC}"

# Initialize git repository
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Git repository already exists${NC}"
fi

# Add remote origin
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  Remote 'origin' already exists. Removing...${NC}"
    git remote remove origin
fi

git remote add origin "$REPO_URL"
echo -e "${GREEN}✅ Remote origin added: ${REPO_URL}${NC}"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}📝 Creating .gitignore file...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF
    echo -e "${GREEN}✅ .gitignore file created${NC}"
fi

# Add all files
echo -e "${BLUE}📦 Adding all files to git...${NC}"
git add .

# Create initial commit
echo -e "${BLUE}💾 Creating initial commit...${NC}"
git commit -m "🎉 Initial release: HengshuiFont English Generator v1.0.0

✨ Features:
- 500+ vocabulary database (Primary 1-6, Junior High 7-9)
- Professional Hengshui-style writing grids
- Grade-based template generation
- Scientific spaced repetition system
- Modern glassmorphism UI design
- Comprehensive PDF export functionality

🛠️ Tech Stack:
- Next.js 15 + TypeScript 5
- Tailwind CSS 4
- jsPDF 3 for document generation
- React 19 with latest features
- Apache License 2.0

📚 Perfect for Chinese students learning English!

🌟 Live Demo: https://${GITHUB_USERNAME}.github.io/${PROJECT_NAME}
📖 Documentation: README.md
🤝 Contributing: CONTRIBUTING.md
📄 License: Apache License 2.0"

echo -e "${GREEN}✅ Initial commit created${NC}"

# Set main branch
echo -e "${BLUE}🌿 Setting main branch...${NC}"
git branch -M main

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
echo -e "${YELLOW}⚠️  You may need to enter your GitHub credentials${NC}"

if git push -u origin main; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub. Please check:${NC}"
    echo -e "${RED}   1. Repository exists on GitHub${NC}"
    echo -e "${RED}   2. You have push permissions${NC}"
    echo -e "${RED}   3. Your GitHub credentials are correct${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Git repository initialization completed!${NC}"
echo ""
echo -e "${CYAN}📍 Next steps:${NC}"
echo -e "${CYAN}1. Visit your repository: https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}${NC}"
echo -e "${CYAN}2. Configure GitHub Pages in repository settings${NC}"
echo -e "${CYAN}3. Create your first release (v1.0.0)${NC}"
echo -e "${CYAN}4. Add repository description and topics${NC}"
echo -e "${CYAN}5. Share your project with the community!${NC}"
echo ""
echo -e "${PURPLE}🌟 Your HengshuiFont English Generator is now live on GitHub!${NC}"
echo -e "${PURPLE}📖 Check GITHUB_SETUP_GUIDE.md for detailed next steps${NC}"
