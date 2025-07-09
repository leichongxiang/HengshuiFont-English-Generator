# Contributing Guide | 贡献指南

Thank you for your interest in contributing to the English Vocabulary Practice Template Generator! We welcome contributions from the community and are grateful for your support.

感谢您对英语单词练字模板生成器项目的贡献兴趣！我们欢迎社区贡献，并对您的支持表示感谢。

## Table of Contents | 目录

- [Code of Conduct | 行为准则](#code-of-conduct--行为准则)
- [How to Contribute | 如何贡献](#how-to-contribute--如何贡献)
- [Development Setup | 开发环境设置](#development-setup--开发环境设置)
- [Coding Standards | 编码标准](#coding-standards--编码标准)
- [Commit Guidelines | 提交指南](#commit-guidelines--提交指南)
- [Pull Request Process | 拉取请求流程](#pull-request-process--拉取请求流程)
- [Issue Reporting | 问题报告](#issue-reporting--问题报告)
- [Feature Requests | 功能请求](#feature-requests--功能请求)

## Code of Conduct | 行为准则

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

本项目及其所有参与者都受我们的行为准则约束。参与项目即表示您同意遵守此准则。

### Our Standards | 我们的标准

**Positive behaviors include | 积极行为包括:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include | 不可接受的行为包括:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission

## How to Contribute | 如何贡献

### Types of Contributions | 贡献类型

We welcome several types of contributions:

我们欢迎以下几种类型的贡献：

1. **🐛 Bug Reports | 错误报告** - Help us identify and fix issues
2. **💡 Feature Requests | 功能请求** - Suggest new features or improvements
3. **📝 Documentation | 文档** - Improve or translate documentation
4. **🔧 Code Contributions | 代码贡献** - Fix bugs or implement new features
5. **🌐 Translations | 翻译** - Help translate the interface to other languages
6. **📚 Vocabulary Data | 词汇数据** - Contribute additional vocabulary words
7. **🎨 Design | 设计** - Improve UI/UX design and user experience

## Development Setup | 开发环境设置

### Prerequisites | 前置要求

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Local Development | 本地开发

1. **Fork the repository | 分叉仓库**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork | 克隆您的分叉**
   ```bash
   git clone https://github.com/yourusername/english-vocabulary-generator.git
   cd english-vocabulary-generator
   ```

3. **Add upstream remote | 添加上游远程**
   ```bash
   git remote add upstream https://github.com/originalowner/english-vocabulary-generator.git
   ```

4. **Install dependencies | 安装依赖**
   ```bash
   npm install
   ```

5. **Start development server | 启动开发服务器**
   ```bash
   npm run dev
   ```

6. **Open in browser | 在浏览器中打开**
   ```
   http://localhost:3000
   ```

### Project Structure | 项目结构

```
english-vocabulary-generator/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── data/               # Vocabulary data files
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

## Coding Standards | 编码标准

### Code Style | 代码风格

We use the following tools to maintain code quality:

我们使用以下工具来维护代码质量：

- **ESLint** - For code linting
- **Prettier** - For code formatting
- **TypeScript** - For type safety
- **Husky** - For git hooks

### Naming Conventions | 命名约定

- **Files**: Use kebab-case for file names (`vocabulary-data.ts`)
- **Components**: Use PascalCase for React components (`VocabularyCard`)
- **Variables**: Use camelCase for variables (`selectedWords`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (`DEFAULT_OPTIONS`)

### TypeScript Guidelines | TypeScript指南

- Always define proper types for props and state
- Use interfaces for object types
- Avoid `any` type unless absolutely necessary
- Export types that might be used by other components

## Commit Guidelines | 提交指南

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

我们遵循[约定式提交](https://www.conventionalcommits.org/)规范：

### Commit Message Format | 提交消息格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types | 类型

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples | 示例

```bash
feat(vocabulary): add grade 5 vocabulary data
fix(pdf): resolve PDF generation issue on Safari
docs(readme): update installation instructions
style(ui): improve button hover animations
```

## Pull Request Process | 拉取请求流程

1. **Create a feature branch | 创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes | 进行更改**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes | 测试更改**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes | 提交更改**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork | 推送到您的分叉**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request | 创建拉取请求**
   - Use a clear and descriptive title
   - Provide a detailed description of changes
   - Link any related issues
   - Add screenshots for UI changes

### Pull Request Checklist | 拉取请求检查清单

- [ ] Code follows the project's coding standards
- [ ] Tests pass locally
- [ ] Documentation has been updated
- [ ] Commit messages follow the conventional format
- [ ] No merge conflicts with main branch
- [ ] Screenshots included for UI changes

## Issue Reporting | 问题报告

When reporting bugs, please include:

报告错误时，请包含：

- **Environment**: OS, browser, Node.js version
- **Steps to reproduce**: Clear steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Additional context**: Any other relevant information

### Bug Report Template | 错误报告模板

```markdown
**Environment | 环境**
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 96, Safari 15]
- Node.js: [e.g., 18.0.0]

**Steps to Reproduce | 重现步骤**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior | 预期行为**
A clear description of what you expected to happen.

**Actual Behavior | 实际行为**
A clear description of what actually happened.

**Screenshots | 截图**
If applicable, add screenshots to help explain your problem.
```

## Feature Requests | 功能请求

We welcome feature requests! Please provide:

我们欢迎功能请求！请提供：

- **Problem description**: What problem does this solve?
- **Proposed solution**: How would you like it to work?
- **Alternatives considered**: What other solutions did you consider?
- **Additional context**: Any other relevant information

## Recognition | 致谢

Contributors will be recognized in:

贡献者将在以下地方得到认可：

- Project README
- Release notes
- Contributors page
- Special mentions for significant contributions

## Questions? | 有问题？

If you have questions about contributing, please:

如果您对贡献有疑问，请：

- Check existing issues and discussions
- Create a new discussion on GitHub
- Contact the maintainers

---

Thank you for contributing to making English learning better for students worldwide!

感谢您为改善全世界学生的英语学习做出贡献！
