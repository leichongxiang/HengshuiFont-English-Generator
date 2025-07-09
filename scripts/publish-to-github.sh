#!/bin/bash

# 🚀 GitHub发布自动化脚本 | GitHub Publishing Automation Script
# HengshuiFont English Generator
# Copyright 2024 - Apache License 2.0

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="HengshuiFont-English-Generator"
PROJECT_DESCRIPTION="🌟 Professional Hengshui-style English vocabulary practice template generator for Chinese students"
VERSION="1.0.0"

echo -e "${PURPLE}🚀 HengshuiFont English Generator - GitHub发布脚本${NC}"
echo -e "${CYAN}=================================================${NC}"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查Git是否已安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ 错误：Git未安装，请先安装Git${NC}"
    exit 1
fi

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误：Node.js未安装，请先安装Node.js${NC}"
    exit 1
fi

echo -e "${BLUE}📋 发布前检查...${NC}"

# 运行测试
echo -e "${YELLOW}🧪 运行测试...${NC}"
if npm test; then
    echo -e "${GREEN}✅ 测试通过${NC}"
else
    echo -e "${RED}❌ 测试失败，请修复后重试${NC}"
    exit 1
fi

# 运行代码检查
echo -e "${YELLOW}🔍 运行代码检查...${NC}"
if npm run lint; then
    echo -e "${GREEN}✅ 代码检查通过${NC}"
else
    echo -e "${RED}❌ 代码检查失败，请修复后重试${NC}"
    exit 1
fi

# 构建项目
echo -e "${YELLOW}🏗️ 构建项目...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败，请检查代码${NC}"
    exit 1
fi

# 获取用户GitHub信息
echo ""
echo -e "${BLUE}📝 请输入您的GitHub信息：${NC}"
read -p "GitHub用户名: " GITHUB_USERNAME
read -p "GitHub仓库名 (默认: $PROJECT_NAME): " REPO_NAME
REPO_NAME=${REPO_NAME:-$PROJECT_NAME}

# 确认信息
echo ""
echo -e "${CYAN}📋 发布信息确认：${NC}"
echo -e "项目名称: ${GREEN}$PROJECT_NAME${NC}"
echo -e "GitHub用户名: ${GREEN}$GITHUB_USERNAME${NC}"
echo -e "仓库名称: ${GREEN}$REPO_NAME${NC}"
echo -e "版本: ${GREEN}$VERSION${NC}"
echo ""

read -p "确认发布？(y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ 发布已取消${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 开始发布流程...${NC}"

# 初始化Git仓库（如果还没有）
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 初始化Git仓库...${NC}"
    git init
    echo -e "${GREEN}✅ Git仓库已初始化${NC}"
fi

# 添加远程仓库
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo -e "${YELLOW}🔗 添加远程仓库: $REMOTE_URL${NC}"

# 检查是否已存在origin
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️ 远程仓库origin已存在，更新URL...${NC}"
    git remote set-url origin $REMOTE_URL
else
    git remote add origin $REMOTE_URL
fi

echo -e "${GREEN}✅ 远程仓库已配置${NC}"

# 添加所有文件
echo -e "${YELLOW}📁 添加项目文件...${NC}"
git add .

# 检查是否有更改
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️ 没有检测到更改，跳过提交${NC}"
else
    # 提交更改
    echo -e "${YELLOW}💾 提交更改...${NC}"
    git commit -m "🎉 Initial release: Professional Hengshui-style English vocabulary generator v$VERSION

✨ Features:
- 500+ vocabulary words (Primary 1-6, Junior High 7-9)
- Professional Hengshui-style writing grids with customizable settings
- Grade-based template generation system
- Scientific spaced repetition (Ebbinghaus forgetting curve)
- Modern responsive UI with glassmorphism design
- Comprehensive PDF export functionality
- Personal word book management
- Multi-textbook version support

🛠️ Tech Stack:
- Next.js 15 + TypeScript for type safety
- Tailwind CSS 4 for modern responsive design
- jsPDF for high-quality document generation
- Jest for comprehensive testing
- GitHub Actions for CI/CD
- Apache License 2.0 for open source compliance

📚 Perfect for Chinese students learning English handwriting!
Built with ❤️ for the global education community.

#education #english #vocabulary #hengshui #chinese-students #nextjs #typescript #opensource"

    echo -e "${GREEN}✅ 更改已提交${NC}"
fi

# 设置主分支
echo -e "${YELLOW}🌿 设置主分支...${NC}"
git branch -M main

# 推送到GitHub
echo -e "${YELLOW}⬆️ 推送到GitHub...${NC}"
if git push -u origin main; then
    echo -e "${GREEN}✅ 成功推送到GitHub！${NC}"
else
    echo -e "${RED}❌ 推送失败，请检查：${NC}"
    echo -e "${RED}   1. GitHub仓库是否已创建${NC}"
    echo -e "${RED}   2. 是否有推送权限${NC}"
    echo -e "${RED}   3. 网络连接是否正常${NC}"
    exit 1
fi

# 创建标签
echo -e "${YELLOW}🏷️ 创建版本标签...${NC}"
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin "v$VERSION"
echo -e "${GREEN}✅ 版本标签已创建${NC}"

# 显示成功信息
echo ""
echo -e "${GREEN}🎉 发布成功！${NC}"
echo -e "${CYAN}=================================================${NC}"
echo -e "${GREEN}✅ 项目已成功发布到GitHub！${NC}"
echo ""
echo -e "${BLUE}📋 仓库信息：${NC}"
echo -e "🔗 仓库地址: ${CYAN}https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
echo -e "🌐 GitHub Pages: ${CYAN}https://$GITHUB_USERNAME.github.io/$REPO_NAME${NC}"
echo -e "📦 版本: ${GREEN}v$VERSION${NC}"
echo ""
echo -e "${BLUE}📋 下一步建议：${NC}"
echo -e "1. 🌟 在GitHub上为仓库添加描述和标签"
echo -e "2. 📖 检查README.md在GitHub上的显示效果"
echo -e "3. ⚙️ 配置GitHub Pages（如果需要）"
echo -e "4. 🏷️ 创建第一个Release"
echo -e "5. 📢 分享到社区和社交媒体"
echo ""
echo -e "${PURPLE}🚀 您的HengshuiFont English Generator现在已经是一个专业的开源项目了！${NC}"
echo -e "${CYAN}感谢您为教育技术开源社区做出的贡献！${NC}"
echo ""

# 询问是否打开浏览器
read -p "是否在浏览器中打开GitHub仓库？(Y/n): " OPEN_BROWSER
if [[ ! $OPEN_BROWSER =~ ^[Nn]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    elif command -v open &> /dev/null; then
        open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    elif command -v start &> /dev/null; then
        start "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    else
        echo -e "${YELLOW}请手动访问: https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
    fi
fi

echo -e "${GREEN}🎊 发布完成！祝您的项目获得成功！${NC}"
