@echo off
setlocal enabledelayedexpansion

REM 🚀 Git Repository Initialization Script (Windows)
REM HengshuiFont English Generator
REM Copyright 2024 - Apache License 2.0

echo.
echo 🚀 HengshuiFont English Generator - Git Initialization
echo =================================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Get GitHub username
set /p GITHUB_USERNAME="📝 Please enter your GitHub username: "

if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username is required.
    pause
    exit /b 1
)

REM Confirm repository URL
set PROJECT_NAME=HengshuiFont-English-Generator
set REPO_URL=https://github.com/%GITHUB_USERNAME%/%PROJECT_NAME%.git

echo.
echo 📍 Repository URL will be: %REPO_URL%
echo ⚠️  Make sure you have created the repository on GitHub first!
echo.

set /p CONTINUE="Continue? (y/N): "
if /i not "%CONTINUE%"=="y" (
    echo ⏹️  Operation cancelled.
    pause
    exit /b 0
)

echo.
echo 🔧 Initializing Git repository...

REM Initialize git repository
if not exist ".git" (
    git init
    echo ✅ Git repository initialized
) else (
    echo ⚠️  Git repository already exists
)

REM Remove existing remote origin if it exists
git remote remove origin >nul 2>&1

REM Add remote origin
git remote add origin "%REPO_URL%"
echo ✅ Remote origin added: %REPO_URL%

REM Create .gitignore if it doesn't exist
if not exist ".gitignore" (
    echo 📝 Creating .gitignore file...
    (
        echo # Dependencies
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Next.js
        echo .next/
        echo out/
        echo build/
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Logs
        echo logs/
        echo *.log
        echo.
        echo # Runtime data
        echo pids/
        echo *.pid
        echo *.seed
        echo *.pid.lock
        echo.
        echo # Coverage directory used by tools like istanbul
        echo coverage/
        echo .nyc_output/
        echo.
        echo # Dependency directories
        echo jspm_packages/
        echo.
        echo # Optional npm cache directory
        echo .npm
        echo.
        echo # Optional eslint cache
        echo .eslintcache
        echo.
        echo # Temporary folders
        echo tmp/
        echo temp/
    ) > .gitignore
    echo ✅ .gitignore file created
)

REM Add all files
echo 📦 Adding all files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
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

🌟 Live Demo: https://%GITHUB_USERNAME%.github.io/%PROJECT_NAME%
📖 Documentation: README.md
🤝 Contributing: CONTRIBUTING.md
📄 License: Apache License 2.0"

echo ✅ Initial commit created

REM Set main branch
echo 🌿 Setting main branch...
git branch -M main

REM Push to GitHub
echo 🚀 Pushing to GitHub...
echo ⚠️  You may need to enter your GitHub credentials

git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Failed to push to GitHub. Please check:
    echo    1. Repository exists on GitHub
    echo    2. You have push permissions
    echo    3. Your GitHub credentials are correct
    pause
    exit /b 1
)

echo.
echo ✅ Successfully pushed to GitHub!
echo.
echo 🎉 Git repository initialization completed!
echo.
echo 📍 Next steps:
echo 1. Visit your repository: https://github.com/%GITHUB_USERNAME%/%PROJECT_NAME%
echo 2. Configure GitHub Pages in repository settings
echo 3. Create your first release (v1.0.0)
echo 4. Add repository description and topics
echo 5. Share your project with the community!
echo.
echo 🌟 Your HengshuiFont English Generator is now live on GitHub!
echo 📖 Check GITHUB_SETUP_GUIDE.md for detailed next steps
echo.
pause
