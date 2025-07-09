# Deployment Guide | 部署指南

This guide covers various deployment options for the English Vocabulary Practice Template Generator.

本指南涵盖英语单词练字模板生成器的各种部署选项。

## 🚀 Quick Deployment Options | 快速部署选项

### 1. GitHub Pages (Recommended | 推荐)

**English**: GitHub Pages provides free hosting for static sites and is perfect for this project.

**中文**: GitHub Pages为静态网站提供免费托管，非常适合此项目。

#### Setup Steps | 设置步骤

1. **Fork or Clone the Repository | 分叉或克隆仓库**
   ```bash
   git clone https://github.com/yourusername/english-vocabulary-generator.git
   cd english-vocabulary-generator
   ```

2. **Install Dependencies | 安装依赖**
   ```bash
   npm install
   ```

3. **Build for Production | 生产构建**
   ```bash
   npm run build
   npm run export
   ```

4. **Enable GitHub Pages | 启用GitHub Pages**
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source
   - The CI/CD pipeline will automatically deploy on push to main

#### Custom Domain | 自定义域名
```bash
# Add CNAME file to public directory
echo "your-domain.com" > public/CNAME
```

### 2. Vercel

**English**: Vercel offers seamless Next.js deployment with automatic builds.

**中文**: Vercel提供无缝的Next.js部署和自动构建。

#### Deployment Steps | 部署步骤

1. **Connect Repository | 连接仓库**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

2. **Build Configuration | 构建配置**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "out",
     "installCommand": "npm install"
   }
   ```

3. **Environment Variables | 环境变量**
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### 3. Netlify

**English**: Netlify provides easy static site deployment with continuous integration.

**中文**: Netlify提供简单的静态网站部署和持续集成。

#### Configuration | 配置

Create `netlify.toml`:
```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 4. Firebase Hosting

**English**: Firebase Hosting offers fast and secure hosting with global CDN.

**中文**: Firebase Hosting提供快速安全的托管和全球CDN。

#### Setup | 设置

1. **Install Firebase CLI | 安装Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase | 初始化Firebase**
   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json | 配置firebase.json**
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy | 部署**
   ```bash
   npm run build
   npm run export
   firebase deploy
   ```

## 🔧 Build Configuration | 构建配置

### Environment Variables | 环境变量

Create `.env.local` for local development:
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="English Vocabulary Generator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
```

### Build Scripts | 构建脚本

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "export": "next export",
    "deploy:github": "npm run build && npm run export && gh-pages -d out",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=out"
  }
}
```

## 🌐 CDN and Performance | CDN和性能

### Asset Optimization | 资源优化

1. **Image Optimization | 图片优化**
   - Use WebP format for images
   - Implement lazy loading
   - Optimize image sizes

2. **Bundle Optimization | 包优化**
   ```bash
   # Analyze bundle size
   npm run analyze
   
   # Check bundle composition
   npx @next/bundle-analyzer
   ```

3. **Caching Strategy | 缓存策略**
   ```javascript
   // next.config.ts
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/static/(.*)',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   ```

## 🔒 Security Configuration | 安全配置

### Content Security Policy | 内容安全策略

```javascript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

### HTTPS Configuration | HTTPS配置

1. **Force HTTPS | 强制HTTPS**
   ```javascript
   // Redirect HTTP to HTTPS
   if (process.env.NODE_ENV === 'production') {
     if (req.headers['x-forwarded-proto'] !== 'https') {
       return res.redirect(301, `https://${req.headers.host}${req.url}`);
     }
   }
   ```

2. **Security Headers | 安全头**
   ```javascript
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on'
     },
     {
       key: 'Strict-Transport-Security',
       value: 'max-age=63072000; includeSubDomains; preload'
     },
     {
       key: 'X-XSS-Protection',
       value: '1; mode=block'
     }
   ];
   ```

## 📊 Monitoring and Analytics | 监控和分析

### Performance Monitoring | 性能监控

1. **Web Vitals | 网络生命体征**
   ```javascript
   // pages/_app.tsx
   export function reportWebVitals(metric) {
     console.log(metric);
     // Send to analytics service
   }
   ```

2. **Error Tracking | 错误跟踪**
   ```bash
   # Install Sentry
   npm install @sentry/nextjs
   ```

3. **Lighthouse CI | Lighthouse CI**
   ```yaml
   # .github/workflows/lighthouse.yml
   - name: Lighthouse CI
     uses: treosh/lighthouse-ci-action@v10
     with:
       configPath: './lighthouserc.json'
   ```

## 🚨 Troubleshooting | 故障排除

### Common Issues | 常见问题

1. **Build Failures | 构建失败**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Static Export Issues | 静态导出问题**
   ```javascript
   // Ensure no server-side features are used
   // Remove getServerSideProps, API routes, etc.
   ```

3. **Asset Loading Issues | 资源加载问题**
   ```javascript
   // Check basePath and assetPrefix in next.config.ts
   const nextConfig = {
     basePath: '/your-repo-name',
     assetPrefix: '/your-repo-name/',
   };
   ```

### Debug Commands | 调试命令

```bash
# Check build output
npm run build -- --debug

# Analyze bundle
npm run analyze

# Test production build locally
npm run build && npm run start
```

## 📝 Deployment Checklist | 部署检查清单

### Pre-deployment | 部署前

- [ ] All tests pass | 所有测试通过
- [ ] Build completes successfully | 构建成功完成
- [ ] No console errors | 无控制台错误
- [ ] Performance optimized | 性能已优化
- [ ] Security headers configured | 安全头已配置
- [ ] Environment variables set | 环境变量已设置

### Post-deployment | 部署后

- [ ] Site loads correctly | 网站正确加载
- [ ] All features work | 所有功能正常
- [ ] Mobile responsive | 移动端响应式
- [ ] Cross-browser compatible | 跨浏览器兼容
- [ ] Performance metrics good | 性能指标良好
- [ ] SSL certificate valid | SSL证书有效

## 🆘 Support | 支持

If you encounter deployment issues:

如果遇到部署问题：

- Check the [GitHub Issues](https://github.com/yourusername/english-vocabulary-generator/issues)
- Review the [troubleshooting guide](#troubleshooting)
- Contact the maintainers

---

**Happy Deploying! | 部署愉快！** 🚀
