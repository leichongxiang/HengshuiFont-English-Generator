# PDF乱码问题修复说明

## 问题分析

根据您提供的PDF截图，发现以下问题：

1. **字体编码问题**：音标和中文字符显示为乱码
2. **PDF格式不够紧凑**：每个单词占用空间过大
3. **缺少字体支持**：jsPDF默认字体不支持国际音标和中文字符

## 解决方案

### 1. 字体编码修复

- 添加了 `safeRenderText` 函数来安全处理文本渲染
- 将特殊字符转换为ASCII兼容字符
- 音标符号简化处理：
  - `ə` → `e` (schwa)
  - `ɪ` → `i` (小写i)
  - `ʊ` → `u` (小写u)
  - `θ/ð` → `th` (theta/eth)
  - `ʃ` → `sh` (sh音)
  - `ŋ` → `ng` (ng音)

### 2. 新增紧凑型模板

创建了 `generateCompactPracticeTemplate` 函数，特点：

- **每行一个单词**：更紧凑的布局
- **描红练习**：第一行显示浅灰色描红字母
- **简化音标**：使用ASCII字符表示音标
- **更多单词**：每页可容纳12-15个单词（原来约6-8个）

### 3. UI改进

- 添加了两种模板选择：
  - **Standard Template**：传统四线三格格式
  - **Compact Template**：紧凑型一行一词格式
- 英文界面：避免中文字符导致的显示问题

## 文件修改清单

### 主要修改文件：

1. **`src/utils/hengshuiPdfGenerator.ts`**
   - 添加 `initializePDFFonts` 函数
   - 添加 `safeRenderText` 函数
   - 修改现有模板生成函数
   - 新增 `generateCompactPracticeTemplate` 函数

2. **`src/app/page.tsx`**
   - 导入新的紧凑型模板函数
   - 添加 `handleDownloadCompactTemplate` 处理函数
   - 更新UI界面，添加两种模板选择按钮

### 新增测试文件：

3. **`test-pdf-fix.html`**
   - 独立的HTML测试页面
   - 可以直接在浏览器中测试PDF生成
   - 验证字体编码修复效果

## 使用方法

### 方法1：在应用中使用

1. 启动应用：`npm run dev`
2. 选择要练习的单词
3. 在右侧面板选择模板类型：
   - **Standard Template**：传统格式
   - **Compact Template**：紧凑格式
4. 点击下载按钮生成PDF

### 方法2：独立测试

1. 在浏览器中打开 `test-pdf-fix.html`
2. 点击 "Test PDF Generation" 按钮
3. 查看生成的测试PDF文件

## 预期效果

### 修复前的问题：
- 音标显示为乱码：`R N- Äeihö Ä·lG - ~Ä[W]tg-`
- 中文翻译显示为乱码
- 每页单词数量少

### 修复后的效果：
- 音标正常显示：`/he'lou/`, `/sku:l/`, `/'fameli/`
- 中文翻译用英文标注：`[hello]`, `[school]`, `[family]`
- 每页可容纳更多单词
- 紧凑型格式：一行一词，便于练习

## 技术细节

### 字符编码处理
```javascript
const cleanText = text
  .replace(/[^\x00-\x7F\u0250-\u02AF\u1D00-\u1D7F\u1D80-\u1DBF]/g, '?')
  .replace(/[""'']/g, '"')
  .replace(/[—–]/g, '-');
```

### 音标简化映射
```javascript
const simplePhonetic = word.phonetic
  .replace(/[ə]/g, 'e')
  .replace(/[ɪ]/g, 'i')
  .replace(/[ʊ]/g, 'u')
  // ... 更多映射
```

### 紧凑型布局
- 行高：10mm（原15mm）
- 字母间距：6mm（原8mm）
- 单词间距：3mm（原5mm）

## 注意事项

1. **字体限制**：由于jsPDF的限制，复杂的Unicode字符可能仍然无法完美显示
2. **音标简化**：为了兼容性，音标进行了简化处理
3. **中文处理**：中文翻译改为英文标注以避免乱码

## 后续优化建议

1. **添加自定义字体**：集成支持中文和音标的字体文件
2. **音标字体**：使用专门的音标字体库
3. **多语言支持**：根据用户选择显示中文或英文界面
4. **模板样式**：添加更多模板样式选择
