@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 🚀 GitHub发布自动化脚本 (Windows版) | GitHub Publishing Automation Script (Windows)
REM HengshuiFont English Generator
REM Copyright 2024 - Apache License 2.0

echo.
echo 🚀 HengshuiFont English Generator - GitHub发布脚本
echo =================================================
echo.

REM 项目信息
set PROJECT_NAME=HengshuiFont-English-Generator
set PROJECT_DESCRIPTION=🌟 Professional Hengshui-style English vocabulary practice template generator for Chinese students
set VERSION=1.0.0

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查Git是否已安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Git未安装，请先安装Git
    pause
    exit /b 1
)

REM 检查Node.js是否已安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

echo 📋 发布前检查...
echo.

REM 运行代码检查
echo 🔍 运行代码检查...
call npm run lint
if errorlevel 1 (
    echo ❌ 代码检查失败，请修复后重试
    pause
    exit /b 1
)
echo ✅ 代码检查通过
echo.

REM 构建项目
echo 🏗️ 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败，请检查代码
    pause
    exit /b 1
)
echo ✅ 构建成功
echo.

REM 获取用户GitHub信息
echo 📝 请输入您的GitHub信息：
set /p GITHUB_USERNAME=GitHub用户名: 
set /p REPO_NAME=GitHub仓库名 (默认: %PROJECT_NAME%): 
if "%REPO_NAME%"=="" set REPO_NAME=%PROJECT_NAME%

REM 确认信息
echo.
echo 📋 发布信息确认：
echo 项目名称: %PROJECT_NAME%
echo GitHub用户名: %GITHUB_USERNAME%
echo 仓库名称: %REPO_NAME%
echo 版本: %VERSION%
echo.

set /p CONFIRM=确认发布？(y/N): 
if /i not "%CONFIRM%"=="y" (
    echo ❌ 发布已取消
    pause
    exit /b 0
)

echo.
echo 🚀 开始发布流程...
echo.

REM 初始化Git仓库（如果还没有）
if not exist ".git" (
    echo 📦 初始化Git仓库...
    git init
    echo ✅ Git仓库已初始化
)

REM 添加远程仓库
set REMOTE_URL=https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
echo 🔗 添加远程仓库: %REMOTE_URL%

REM 检查是否已存在origin
git remote get-url origin >nul 2>&1
if not errorlevel 1 (
    echo ⚠️ 远程仓库origin已存在，更新URL...
    git remote set-url origin %REMOTE_URL%
) else (
    git remote add origin %REMOTE_URL%
)

echo ✅ 远程仓库已配置
echo.

REM 添加所有文件
echo 📁 添加项目文件...
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "🎉 Initial release: Professional Hengshui-style English vocabulary generator v%VERSION%

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

echo ✅ 更改已提交
echo.

REM 设置主分支
echo 🌿 设置主分支...
git branch -M main

REM 推送到GitHub
echo ⬆️ 推送到GitHub...
git push -u origin main
if errorlevel 1 (
    echo ❌ 推送失败，请检查：
    echo    1. GitHub仓库是否已创建
    echo    2. 是否有推送权限
    echo    3. 网络连接是否正常
    pause
    exit /b 1
)
echo ✅ 成功推送到GitHub！
echo.

REM 创建标签
echo 🏷️ 创建版本标签...
git tag -a "v%VERSION%" -m "Release version %VERSION%"
git push origin "v%VERSION%"
echo ✅ 版本标签已创建
echo.

REM 显示成功信息
echo.
echo 🎉 发布成功！
echo =================================================
echo ✅ 项目已成功发布到GitHub！
echo.
echo 📋 仓库信息：
echo 🔗 仓库地址: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo 🌐 GitHub Pages: https://%GITHUB_USERNAME%.github.io/%REPO_NAME%
echo 📦 版本: v%VERSION%
echo.
echo 📋 下一步建议：
echo 1. 🌟 在GitHub上为仓库添加描述和标签
echo 2. 📖 检查README.md在GitHub上的显示效果
echo 3. ⚙️ 配置GitHub Pages（如果需要）
echo 4. 🏷️ 创建第一个Release
echo 5. 📢 分享到社区和社交媒体
echo.
echo 🚀 您的HengshuiFont English Generator现在已经是一个专业的开源项目了！
echo 感谢您为教育技术开源社区做出的贡献！
echo.

REM 询问是否打开浏览器
set /p OPEN_BROWSER=是否在浏览器中打开GitHub仓库？(Y/n): 
if /i not "%OPEN_BROWSER%"=="n" (
    start https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
)

echo.
echo 🎊 发布完成！祝您的项目获得成功！
pause
