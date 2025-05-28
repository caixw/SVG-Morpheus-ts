# SVG Morpheus TypeScript

[中文](./README.zh.md) | **English**

JavaScript library enabling SVG icons to morph from one to the other. It implements Material Design's Delightful Details transitions.

## 🚀 Modernization Highlights

This project has been refactored from Gulp to a modern TypeScript + Vite + pnpm build system:

- ✅ **TypeScript** - Complete type safety support
- ✅ **ESM Modules** - Standard ES module system
- ✅ **Vite Build** - Fast modern build tool
- ✅ **Multi-format Output** - Supports ES, CJS, UMD formats
- ✅ **Modern Toolchain** - ESLint, TypeScript type checking
- ✅ **Development Experience** - HMR, fast reload
- ✅ **pnpm** - Efficient package manager

## 🏗️ Installation

```bash
pnpm add svg-morpheus
```

## 📖 Usage

### ES Modules (Recommended)

```typescript
import { SVGMorpheus } from 'svg-morpheus';

const morpheus = new SVGMorpheus('svg', {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'clock'
});

// Morph to specified icon
morpheus.to('icon-name');
```

### CommonJS

```javascript
const { SVGMorpheus } = require('svg-morpheus');

const morpheus = new SVGMorpheus('svg');
morpheus.to('icon-name');
```

### UMD (Browser)

```html
<script src="svg-morpheus.umd.js"></script>
<script>
  const morpheus = new SVGMorpheus('svg');
  morpheus.to('icon-name');
</script>
```

## 🎯 TypeScript Support

The project provides complete TypeScript type definitions:

```typescript
import { SVGMorpheus, type SVGMorpheusOptions } from 'svg-morpheus';

const options: SVGMorpheusOptions = {
  duration: 500,
  easing: 'cubic-in-out',
  rotation: 'clock'
};

const morpheus = new SVGMorpheus('#my-svg', options, () => {
  console.log('Animation complete');
});
```

## 🛠️ Development

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

Open `http://localhost:9000` in your browser to view the demo.

### Build

```bash
pnpm build
```

Build output will be generated in the `dist/` directory:
- `svg-morpheus.js` - ES module
- `svg-morpheus.cjs` - CommonJS module  
- `svg-morpheus.umd.js` - UMD module
- `svg-morpheus.d.ts` - TypeScript type definitions

### Code Quality

```bash
pnpm lint          # Check code
pnpm lint:fix      # Auto fix
pnpm type-check    # TypeScript type checking
```

## 📝 Configuration Options

```typescript
interface SVGMorpheusOptions {
  iconId?: string;                                    // Initial icon ID
  duration?: number;                                  // Animation duration (ms)
  easing?: string;                                   // Easing function
  rotation?: 'clock' | 'counterclock' | 'none' | 'random'; // Rotation direction
}
```

## 🎨 Supported Easing Functions

- `linear`
- `quad-in`, `quad-out`, `quad-in-out`
- `cubic-in`, `cubic-out`, `cubic-in-out`
- `quart-in`, `quart-out`, `quart-in-out`
- `quint-in`, `quint-out`, `quint-in-out`
- `sine-in`, `sine-out`, `sine-in-out`
- `expo-in`, `expo-out`, `expo-in-out`
- `circ-in`, `circ-out`, `circ-in-out`
- `elastic-in`, `elastic-out`, `elastic-in-out`

### Custom Easing Functions

```typescript
morpheus.registerEasing('my-easing', (t: number) => {
  return t * t * t; // Custom easing logic
});
```

## 📦 Project Structure

```
├── src/                  # TypeScript source code
│   ├── types.ts         # Type definitions
│   ├── helpers.ts       # Utility functions
│   ├── easings.ts       # Easing functions
│   ├── svg-path.ts      # SVG path processing
│   └── svg-morpheus.ts  # Main class
├── dist/                # Build output
├── demos/               # Demo files
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json
└── pnpm-lock.yaml       # pnpm lock file
```

## 🔄 Migration from Old Version

### Major Changes

1. **Module System**: From IIFE to ESM
2. **TypeScript**: Complete type support
3. **Build Tool**: From Gulp to Vite
4. **Package Manager**: Use pnpm instead of npm
5. **API**: Maintains backward compatibility

### Migration Steps

```javascript
// Old version (UMD)
const morpheus = new SVGMorpheus('svg');

// New version (ESM)
import { SVGMorpheus } from 'svg-morpheus';
const morpheus = new SVGMorpheus('svg');
```

## ⚡ Performance Benefits

Advantages of using pnpm:

- 🚀 **Faster installation** - Hard links and symlinks reduce disk usage
- 📦 **Save disk space** - Global storage, avoid duplicate downloads
- 🔒 **Strict dependency management** - Prevent phantom dependency issues
- 🛡️ **Better security** - Stricter package resolution mechanism

## 📄 License

MIT License

## 🙏 Acknowledgments

Based on the original [SVG Morpheus](https://github.com/alexk111/SVG-Morpheus) project, refactored with modern technology stack.
