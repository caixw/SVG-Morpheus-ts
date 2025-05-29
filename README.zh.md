# SVG Morpheus TypeScript

> **⚡ 本项目基于 [alexk111/SVG-Morpheus](https://github.com/alexk111/SVG-Morpheus) 进行 TypeScript 重构**  
> 原始项目作者：[@alexk111](https://github.com/alexk111) - 使用现代化 TypeScript + Vite + pnpm 重构

**中文** | [English](./README.md)

JavaScript库，使SVG图标能够从一个变形到另一个。它实现了Material Design的精美细节过渡效果。

## 🌐 在线演示

**[🎯 查看在线演示](https://adoin.github.io/SVG-Morpheus-ts/)**

体验交互式演示，观看SVG变形动画效果，包含静态和动态示例，支持中英文界面。

## 🚀 重构亮点

这个项目已经从 Gulp 重构为现代化的 TypeScript + Vite + pnpm 构建系统：

- ✅ **TypeScript** - 完整的类型安全支持
- ✅ **ESM 模块** - 使用标准的 ES 模块系统
- ✅ **Vite 构建** - 快速的现代化构建工具
- ✅ **多格式输出** - 支持 ES、CJS、UMD 格式
- ✅ **现代工具链** - ESLint、TypeScript 类型检查
- ✅ **开发体验** - HMR、快速重载
- ✅ **pnpm** - 高效的包管理器
- ✅ **动态SVG合并** - 🆕 运行时SVG图标集生成

## 🏗️ 安装

```bash
npm install svg-morpheus
```

## 📖 使用方法

### 导入核心类

```typescript
// 默认导入
import SVGMorpheus from 'svg-morpheus-ts';

// 或者命名导入
import { SVGMorpheus } from 'svg-morpheus-ts';

// 创建实例
const myMorpheus = new SVGMorpheus('#my-svg');
```

### 导入类型定义

```typescript
import type { 
  SVGMorpheusOptions, 
  IconItem, 
  EasingFunction,
  RGBColor 
} from 'svg-morpheus-ts';

// 使用类型
const options: SVGMorpheusOptions = {
  duration: 1000,
  easing: 'ease-in-out',
  rotation: 'clock'
};

const customEasing: EasingFunction = (t: number) => t * t;
```

### 导入工具函数

```typescript
import { 
  easings,           // 预定义的缓动函数
  pathToAbsolute,    // 路径转换工具
  styleNormCalc,     // 样式计算工具
  curveCalc,         // 曲线计算工具
  bundleSvgs,        // 🆕 动态SVG合并，返回 Blob URL
  bundleSvgsString   // 🆕 动态SVG合并，返回 SVG 字符串
} from 'svg-morpheus-ts';

// 使用预定义的缓动函数
console.log(easings.easeInOut);

// 使用路径工具
const absolutePath = pathToAbsolute('m10,10 l20,20');

// 🆕 动态合并多个SVG
const svgMap = {
  'icon1': '<svg>...</svg>',
  'icon2': '/path/to/icon.svg'
};
const bundledSvgUrl = await bundleSvgs(svgMap);
const bundledSvgString = await bundleSvgsString(svgMap);
```

### 完整示例

```typescript
import SVGMorpheus, { 
  type SVGMorpheusOptions, 
  easings 
} from 'svg-morpheus-ts';

// 配置选项
const options: SVGMorpheusOptions = {
  duration: 800,
  easing: 'easeInOut',
  rotation: 'clock'
};

// 创建morpheus实例
const morpheus = new SVGMorpheus('#my-svg', options);

// 注册自定义缓动函数
morpheus.registerEasing('customEase', easings.easeInQuad);

// 开始动画
morpheus.to('icon2', { duration: 1200 });
```

### ES 模块 (推荐)

```typescript
import { SVGMorpheus } from 'svg-morpheus-ts';

const morpheus = new SVGMorpheus('svg', {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'clock'
});

// 变形到指定图标
morpheus.to('icon-name');
```

### CommonJS

```javascript
const { SVGMorpheus } = require('svg-morpheus');

const morpheus = new SVGMorpheus('svg');
morpheus.to('icon-name');
```

### UMD (浏览器)

```html
<script src="svg-morpheus.umd.js"></script>
<script>
  const morpheus = new SVGMorpheus('svg');
  morpheus.to('icon-name');
</script>
```

## 🎯 TypeScript 支持

项目提供完整的 TypeScript 类型定义：

```typescript
import { SVGMorpheus, type SVGMorpheusOptions } from 'svg-morpheus-ts';

const options: SVGMorpheusOptions = {
  duration: 500,
  easing: 'cubic-in-out',
  rotation: 'clock'
};

const morpheus = new SVGMorpheus('#my-svg', options, () => {
  console.log('动画完成');
});
```

## 📦 导出清单

### 核心类
- `SVGMorpheus` (默认导出)
- `SVGMorpheus` (命名导出)

### 类型定义
- `EasingFunction` - 缓动函数类型
- `SVGMorpheusOptions` - 配置选项接口
- `StyleAttributes` - 样式属性接口
- `RGBColor` - RGB颜色接口
- `NormalizedStyle` - 标准化样式接口
- `Transform` - 变换接口
- `IconItem` - 图标项接口
- `Icon` - 图标接口
- `MorphNode` - 变形节点接口
- `BoundingBox` - 边界框接口
- `CallbackFunction` - 回调函数类型

### 工具函数
- `easings` - 预定义缓动函数对象
- `styleNormCalc` - 样式标准化计算
- `styleNormToString` - 样式对象转字符串
- `styleToNorm` - 样式转标准化格式
- `transCalc` - 变换计算
- `trans2string` - 变换转字符串
- `curveCalc` - 曲线计算
- `clone` - 深度克隆
- `parsePathString` - 解析路径字符串
- `pathToAbsolute` - 转换为绝对路径
- `path2curve` - 路径转曲线
- `path2string` - 路径转字符串
- `curvePathBBox` - 计算曲线边界框
- `bundleSvgs` - 🆕 动态SVG合并工具
- `bundleSvgsString` - 🆕 动态SVG合并，返回 SVG 字符串

## 🛠️ 开发

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

在浏览器中打开 `http://localhost:9000` 查看演示。

### 构建

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录：
- `index.js` - ES 模块
- `index.cjs` - CommonJS 模块  
- `index.umd.js` - UMD 模块
- `index.d.ts` - TypeScript 类型定义

### 代码检查

```bash
pnpm lint          # 检查代码
pnpm lint:fix      # 自动修复
pnpm type-check    # TypeScript 类型检查
```

## 📝 配置选项

```typescript
interface SVGMorpheusOptions {
  iconId?: string;                                    // 初始图标ID
  duration?: number;                                  // 动画时长(ms)
  easing?: string;                                   // 缓动函数
  rotation?: 'clock' | 'counterclock' | 'none' | 'random'; // 旋转方向
}
```

## 🎨 支持的缓动函数

- `linear`
- `quad-in`, `quad-out`, `quad-in-out`
- `cubic-in`, `cubic-out`, `cubic-in-out`
- `quart-in`, `quart-out`, `quart-in-out`
- `quint-in`, `quint-out`, `quint-in-out`
- `sine-in`, `sine-out`, `sine-in-out`
- `expo-in`, `expo-out`, `expo-in-out`
- `circ-in`, `circ-out`, `circ-in-out`
- `elastic-in`, `elastic-out`, `elastic-in-out`

### 自定义缓动函数

```typescript
morpheus.registerEasing('my-easing', (t: number) => {
  return t * t * t; // 自定义缓动逻辑
});
```

## 📦 项目结构

```
├── src/                  # TypeScript 源码
│   ├── index.ts         # 主入口文件
│   ├── types.ts         # 类型定义
│   ├── helpers.ts       # 工具函数 (包含 bundleSvgs 🆕)
│   ├── easings.ts       # 缓动函数
│   ├── svg-path.ts      # SVG 路径处理
│   └── svg-morpheus.ts  # 主类
├── dist/                # 构建产物
├── demos/               # 演示文件 (包含 bundleSvgs 示例 🆕)
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── package.json
└── pnpm-lock.yaml       # pnpm 锁文件
```

## 🔄 从旧版本迁移

### 主要变更

1. **模块系统**: 从 IIFE 改为 ESM
2. **TypeScript**: 提供完整类型支持
3. **构建工具**: 从 Gulp 迁移到 Vite
4. **包管理器**: 使用 pnpm 替代 npm
5. **API**: 保持向后兼容

### 迁移步骤

```javascript
// 旧版本 (UMD)
const morpheus = new SVGMorpheus('svg');

// 新版本 (ESM)
import { SVGMorpheus } from 'svg-morpheus-ts';
const morpheus = new SVGMorpheus('svg');
```

## ⚡ 性能优势

使用 pnpm 的优势：

- 🚀 **更快的安装速度** - 硬链接和符号链接减少磁盘使用
- 📦 **节省磁盘空间** - 全局存储，避免重复下载
- 🔒 **严格的依赖管理** - 防止幽灵依赖问题
- 🛡️ **更好的安全性** - 更严格的包解析机制

## 📄 许可证

MIT License

## 🙏 致谢

基于原始的 [SVG Morpheus](https://github.com/alexk111/SVG-Morpheus) 项目，使用现代化技术栈重构。 

## 🆕 动态SVG合并

新的 `bundleSvgs` 功能允许你在运行时动态创建iconset风格的SVG文件，非常适合需要灵活图标管理的现代应用程序。

### 基础用法

```typescript
import { bundleSvgs } from 'svg-morpheus-ts';

const svgMap = {
  'home': '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  'user': '/icons/user.svg',      // 也可以从文件加载
  'settings': '/icons/settings.svg'
};

// 生成合并的SVG Blob URL
const bundledSvgUrl = await bundleSvgs(svgMap);
console.log(bundledSvgUrl);
// 输出: blob:null/12345678-1234-1234-1234-123456789abc
```

### 自定义SVG属性

```typescript
// 自定义根SVG元素的属性
const customAttributes = {
  viewBox: '0 0 24 24',
  width: '100%',
  height: '100%',
  class: 'my-iconset',
  'data-version': '1.0'
};

const bundledSvgUrl = await bundleSvgs(svgMap, customAttributes);
// 生成的SVG将应用自定义属性
```

### 与Object元素配合使用

```typescript
// 直接使用bundleSvgs与object元素
const bundledSvgUrl = await bundleSvgs(svgMap, { viewBox: '0 0 24 24' });

// 用于object元素
const objectElement = document.getElementById('my-svg-object');
objectElement.data = bundledSvgUrl;

// 初始化SVGMorpheus
const morpheus = new SVGMorpheus('#my-svg-object');
morpheus.to('home');
```

### 获取SVG字符串（用于备用方案）

```typescript
import { bundleSvgsString } from 'svg-morpheus-ts';

// 获取SVG字符串而不是Blob URL
const bundledSvgString = await bundleSvgsString(svgMap, customAttributes);

// 用于内联SVG
document.getElementById('svg-container').innerHTML = bundledSvgString;
```

### 高级特性

**智能内容检测**: 自动检测输入是SVG代码还是文件路径
```typescript
const mixedSources = {
  'inline': '<svg>...</svg>',      // 直接的SVG代码
  'external': '/icons/icon.svg',   // 文件路径
  'with-xml': '<?xml version="1.0"?><svg>...</svg>' // XML声明
};
```

**错误处理**: 优雅地处理加载失败
```typescript
const bundledSvg = await bundleSvgs({
  'valid': '<svg>...</svg>',
  'invalid': '/non-existent.svg'  // 将被跳过并显示警告
});
```

**TypeScript支持**: 包含完整的类型定义
```typescript
import type { bundleSvgs } from 'svg-morpheus-ts';

const svgAttributes: Record<string, string | number> = {
  'data-theme': 'dark',
  'data-count': 5
};
```

### API参考

#### bundleSvgs(svgMap, svgAttributes?)

- **svgMap**: `Record<string, string>` - 将图标ID映射到SVG源的对象
- **svgAttributes**: `Record<string, string | number>` (可选) - 根SVG元素的自定义属性
- **返回值**: `Promise<string>` - 生成的 Blob URL

#### bundleSvgsString(svgMap, svgAttributes?)

- **svgMap**: `Record<string, string>` - 将图标ID映射到SVG源的对象
- **svgAttributes**: `Record<string, string | number>` (可选) - 根SVG元素的自定义属性
- **返回值**: `Promise<string>` - 合并的SVG字符串 

## 浏览器兼容性

此库使用现代 Web API。以下是实现完整功能所需的最低浏览器版本：

### 核心功能兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|---------|------|
| **Chrome** | 42+ | 完全支持所有功能 |
| **Firefox** | 39+ | 完全支持所有功能 |
| **Safari** | 10.1+ | 完全支持所有功能 |
| **Edge** | 14+ | 完全支持所有功能 |
| **Internet Explorer** | ❌ 不支持 | 缺少 fetch API 和其他现代功能 |

### 功能特定兼容性

| API/功能 | Chrome | Firefox | Safari | Edge | IE |
|----------|--------|---------|--------|------|-----|
| **SVG 变形 (核心)** | 22+ | 11+ | 6+ | 12+ | 10+ |
| **bundleSvgs (fetch API)** | 42+ | 39+ | 10.1+ | 14+ | ❌ |
| **Blob/URL.createObjectURL** | 8+ | 4+ | 6+ | 12+ | 10+ |
| **querySelector/querySelectorAll** | 4+ | 3.5+ | 3.1+ | 12+ | 9+ |
| **requestAnimationFrame** | 22+ | 11+ | 6+ | 12+ | 10+ |
| **addEventListener** | 1+ | 1+ | 1+ | 12+ | 9+ |
| **createElementNS** | 1+ | 1+ | 1+ | 12+ | 9+ |
| **getComputedStyle** | 1+ | 1+ | 1+ | 12+ | 9+ |

### 建议

- **现代开发**: 使用 Chrome 42+、Firefox 39+、Safari 10.1+ 或 Edge 14+
- **旧版支持**: 对于 IE 支持，考虑使用 fetch API 的 polyfill 或使用 XMLHttpRequest
- **移动浏览器**: 支持所有现代移动浏览器
- **bundleSvgs 功能**: 需要支持 fetch API 的现代浏览器

### 旧版浏览器的 Polyfill

如果需要支持旧版浏览器，请考虑这些 polyfill：

```html
<!-- 适用于 IE 11 和更旧的浏览器 -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch,Promise"></script>
```

**注意**：核心 SVG 变形功能在较旧的浏览器中有效（IE 10+），但新的 `bundleSvgs` 功能需要支持 fetch API 的现代浏览器。 