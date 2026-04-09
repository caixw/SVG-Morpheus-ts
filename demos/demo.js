/*!
 * SVG Morpheus TypeScript Demo
 * Based on SVG-Morpheus by Alex Kaul
 * Modern TypeScript + Vite + pnpm refactored version
 * Repository: https://github.com/adoin/SVG-Morpheus-ts
 * License: MIT
 * Build Date: ${new Date().toISOString()}
 */

// 动态导入 SVGMorpheus 模块
async function loadSVGMorpheus() {
  // 根据环境选择导入路径
  const isDemoMode = import.meta.env.MODE === 'demo';
  console.log('当前模式:', import.meta.env.MODE, '是否为演示模式:', isDemoMode);

  if (isDemoMode) {
    // 演示模式：使用构建后的文件
    try {
      const module = await import('../dist/index.js');
      console.log('已加载构建后的模块');
      return module;
    } catch (error) {
      console.error('加载构建后的模块失败，回退到源文件:', error);
      const module = await import('../src/index.ts');
      console.log('已回退到源 TypeScript 模块');
      return module;
    }
  } else {
    // 开发模式：直接使用源文件
    const module = await import('../src/index.ts');
    console.log('已加载源 TypeScript 模块');
    return module;
  }
}

// 全局变量声明
let SVGMorpheus, bundleSvgs;

// 全局变量由 Vite 构建时注入
// __SVG_BASE_PATH__: string - SVG 文件的基础路径
// __IS_GITHUB_PAGES__: boolean - 是否为 GitHub Pages 环境

// 动态路径处理函数
function getSvgPath(filename) {
  // 优先使用构建时注入的变量
  if (typeof __SVG_BASE_PATH__ !== 'undefined') {
    console.log('使用构建时路径:', __SVG_BASE_PATH__ + filename);
    return __SVG_BASE_PATH__ + filename;
  }

  // Fallback: 运行时检测环境
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/SVG-Morpheus-ts/' : '/';
  console.log('使用运行时检测路径:', basePath + filename);

  return basePath + filename;
}

// 国际化数据
const i18nData = {
  'en': {
    'title': 'SVG Morpheus TypeScript',
    'subtitle': 'Interactive SVG Morphing: Static & Dynamic Bundling Demo',
    'description': 'Enhanced TypeScript version with bundleSvgs() for dynamic SVG merging',
    'example1.title': 'Example 1: Using Static iconset.svg File',
    'example1.description': '📁 Traditional approach: Using pre-built iconset.svg files<br>Suitable for scenarios with fixed icons that don\'t require dynamic loading',
    'example1.codeTitle': '💻 Example Code',
    'example2.title': 'Example 2: Using bundleSvgs for Dynamic SVG Generation',
    'example2.description': '🚀 Modern approach: Runtime dynamic SVG icon merging with loading support<br>Suitable for modern applications requiring dynamic icon addition and diverse icon sources<br>✨ <strong>New Feature</strong>: Support for custom SVG attributes (viewBox, class, data-* etc.)',
    'label.icon': 'Icon:',
    'label.easing': 'Easing:',
    'label.duration': 'Duration:',
    'label.rotation': 'Rotation:',
    'button.copy': 'Copy Code',
    'button.copied': 'Copied!',
    'button.copyFailed': 'Copy Failed',
    'loading.text': 'Generating dynamic SVG...',
    'error.loadFailed': 'Failed to load dynamic SVG demo',
    'error.bundleFailed': 'bundleSvgs function not available',
    'console.staticComplete': 'Static iconset example initialized successfully',
    'console.dynamicComplete': 'Dynamic bundleSvgs example initialized successfully',
    'project.basedOn': 'Based on SVG-Morpheus',
    'project.source': 'View Source',
    'project.github': 'GitHub Repository',
    'icons.circle': 'Circle',
    'icons.square': 'Square',
    'icons.triangle': 'Triangle',
    'icons.star': 'Star',
    'icons.heart': 'Heart',
    'icons.diamond': 'Diamond',
    'icons.search': 'Search',
    'icons.settings': 'Settings',
    'icons.vite': 'Vite',
    'icons.diving': 'Diving',
    'icons.bag': 'Bag',
    'code.example1': `// 1. Prepare static iconset.svg file
// iconset.svg contains all icon <g> elements

// 2. HTML structure
<object data="/iconset.svg"
        type="image/svg+xml"
        id="icon"></object>

// 3. JavaScript initialization
import { SVGMorpheus } from '@iconsets/svg-morpheus-ts';

const morpheus = new SVGMorpheus('#icon', {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'clock'
});

// 4. Switch to specified icon
morpheus.to('icon-name');

// 5. Animation with callback
morpheus.to('another-icon', {
  duration: 1000
}, () => {
  console.log('Animation complete!');
});`,
    'code.example2': `// 1. Import required functions
import {
  SVGMorpheus,
  bundleSvgs
} from '@iconsets/svg-morpheus-ts';

// 2. Define SVG icon mapping (including new icons!)
const svgMap = {
  'circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>',
  'square': '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16"/></svg>',
  'triangle': '<svg viewBox="0 0 24 24"><polygon points="12,3 21,20 3,20"/></svg>',
  'vite': '/vite.svg',        // File path
  'diving': '/diving.svg',    // 🆕 New diving icon
  'bag': '/bag.svg'           // 🆕 New bag icon
};

// 3. Custom SVG attributes (optional)
const customAttributes = {
  viewBox: '0 0 24 24',
  class: 'dynamic-iconset',
  'data-version': '1.0'
};

// 4. Generate bundled SVG Blob URL (one step)
const bundledSvgUrl = await bundleSvgs(svgMap, customAttributes);

// 5. Set to object element
objectElement.data = bundledSvgUrl;

// 6. Initialize SVGMorpheus
const morpheus = new SVGMorpheus('#iconDynamic');
morpheus.to('diving'); // Try the new diving icon!`
  },
  'zh': {
    'title': 'SVG Morpheus TypeScript',
    'subtitle': '交互式 SVG 变形：静态与动态合并演示',
    'description': '增强版 TypeScript 实现，内置 bundleSvgs() 动态 SVG 合并功能',
    'example1.title': '示例 1：使用静态 iconset.svg 文件',
    'example1.description': '📁 传统方式：使用预构建的 iconset.svg 文件<br>适用于图标固定、无需动态加载的场景',
    'example1.codeTitle': '💻 示例代码',
    'example2.title': '示例 2：使用 bundleSvgs 动态生成 SVG',
    'example2.description': '🚀 现代方式：运行时动态合并 SVG 图标，支持加载状态<br>适用于需要动态添加图标、图标来源多样的现代应用<br>✨ <strong>新特性</strong>：支持自定义 SVG 属性（viewBox、class、data-* 等）',
    'label.icon': '图标：',
    'label.easing': '缓动：',
    'label.duration': '时长：',
    'label.rotation': '旋转：',
    'button.copy': '复制代码',
    'button.copied': '已复制！',
    'button.copyFailed': '复制失败',
    'loading.text': '正在生成动态 SVG...',
    'error.loadFailed': '动态 SVG 演示加载失败',
    'error.bundleFailed': 'bundleSvgs 功能不可用',
    'console.staticComplete': '静态 iconset 示例初始化成功',
    'console.dynamicComplete': '动态 bundleSvgs 示例初始化成功',
    'project.basedOn': '基于 SVG-Morpheus',
    'project.source': '查看源码',
    'project.github': 'GitHub 仓库',
    'icons.circle': '圆形',
    'icons.square': '方形',
    'icons.triangle': '三角形',
    'icons.star': '星形',
    'icons.heart': '心形',
    'icons.diamond': '菱形',
    'icons.search': '搜索',
    'icons.settings': '设置',
    'icons.vite': 'Vite',
    'icons.diving': '潜水',
    'icons.bag': '背包',
    'code.example1': `// 1. 准备静态 iconset.svg 文件
// iconset.svg 包含所有图标的 <g> 元素

// 2. HTML 结构
<object data="/iconset.svg"
        type="image/svg+xml"
        id="icon"></object>

// 3. JavaScript 初始化
import { SVGMorpheus } from '@iconsets/svg-morpheus-ts';

const morpheus = new SVGMorpheus('#icon', {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'clock'
});

// 4. 切换到指定图标
morpheus.to('icon-name');

// 5. 带回调的动画
morpheus.to('another-icon', {
  duration: 1000
}, () => {
  console.log('动画完成!');
});`,
    'code.example2': `// 1. 导入所需函数
import {
  SVGMorpheus,
  bundleSvgs
} from '@iconsets/svg-morpheus-ts';

// 2. 定义 SVG 图标映射（包含新图标！）
const svgMap = {
  'circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>',
  'square': '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16"/></svg>',
  'triangle': '<svg viewBox="0 0 24 24"><polygon points="12,3 21,20 3,20"/></svg>',
  'vite': '/vite.svg',        // 文件路径
  'diving': '/diving.svg',    // 新增潜水图标
  'bag': '/bag.svg'           // 新增背包图标
};

// 3. 自定义 SVG 属性（可选）
const customAttributes = {
  viewBox: '0 0 24 24',
  class: 'dynamic-iconset',
  'data-version': '1.0'
};

// 4. 生成合并的 SVG Blob URL（一步完成）
const bundledSvgUrl = await bundleSvgs(svgMap, customAttributes);

// 5. 设置到 object 元素
objectElement.data = bundledSvgUrl;

// 6. 初始化 SVGMorpheus
const morpheus = new SVGMorpheus('#iconDynamic');
morpheus.to('diving'); // 试试新的潜水图标！`
  }
};

let currentLanguage = 'en'; // 默认英文

// 语言切换函数
function switchLanguage(lang) {
  currentLanguage = lang;

  // 更新按钮状态
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // 更新所有文本
  updateTexts();

  // 保存语言选择
  localStorage.setItem('svgMorpheusLang', lang);
}

// 更新页面文本
function updateTexts() {
  const texts = i18nData[currentLanguage];

  // 更新所有带有 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (texts[key]) {
      element.innerHTML = texts[key];
    }
  });

  // 更新代码块
  document.querySelectorAll('[data-i18n-code]').forEach(element => {
    const key = element.getAttribute('data-i18n-code');
    if (texts[key]) {
      element.textContent = texts[key];
    }
  });

  // 更新代码块 - 使用特殊处理避免 highlight.js 清理 HTML 标签
  document.querySelectorAll('[data-i18n-code]').forEach(element => {
    const key = element.getAttribute('data-i18n-code');
    if (texts[key]) {
      // 先设置文本内容
      element.textContent = texts[key];
      // 移除之前的高亮类，让 highlight.js 重新处理
      element.removeAttribute('data-highlighted');
      element.className = element.className.replace(/hljs[^\s]*/g, '').trim();
    }
  });

  // 延迟执行 highlight.js，确保 DOM 更新完成
  if (typeof hljs !== 'undefined') {
    setTimeout(() => {
      document.querySelectorAll('[data-i18n-code]').forEach((block) => {
        hljs.highlightElement(block);
      });
    }, 0);
  }

  // 更新动态示例的下拉框选项
  updateDynamicOptions();
}

// 更新动态示例的下拉框选项
function updateDynamicOptions() {
  const selIconDynamic = document.getElementById('selIconDynamic');
  if (selIconDynamic && selIconDynamic.options.length > 0) {
    const currentValue = selIconDynamic.value;

    // 清空现有选项
    selIconDynamic.innerHTML = '';

    // 重新填充选项
    const dynamicIcons = {
      'circle': t('icons.circle'),
      'square': t('icons.square'),
      'triangle': t('icons.triangle'),
      'star': t('icons.star'),
      'heart': t('icons.heart'),
      'diamond': t('icons.diamond'),
      'search': t('icons.search'),
      'settings': t('icons.settings'),
      'vite': t('icons.vite'),
      'diving': t('icons.diving'),
      'bag': t('icons.bag')
    };

    for (const [key, value] of Object.entries(dynamicIcons)) {
      selIconDynamic.options[selIconDynamic.options.length] = new Option(value, key);
    }

    // 恢复之前选中的值
    if (currentValue) {
      selIconDynamic.value = currentValue;
    } else {
      selIconDynamic.selectedIndex = selIconDynamic.options.length - 1;
    }
  }
}

// 获取国际化文本
function t(key) {
  return i18nData[currentLanguage][key] || key;
}

// 页面加载时恢复语言设置
function initLanguage() {
  const savedLang = localStorage.getItem('svgMorpheusLang');
  if (savedLang && i18nData[savedLang]) {
    currentLanguage = savedLang;
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if ((savedLang === 'zh' && btn.textContent.includes('中文')) ||
          (savedLang === 'en' && btn.textContent.includes('English'))) {
        btn.classList.add('active');
      }
    });
  }
  updateTexts();

  // 初始化 highlight.js
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
}

// 使函数在全局可用
window.switchLanguage = switchLanguage;

// 主初始化函数
async function init() {
  // 首先加载SVGMorpheus模块
  try {
    const module = await loadSVGMorpheus();
    SVGMorpheus = module.SVGMorpheus;
    bundleSvgs = module.bundleSvgs;
  } catch (error) {
    console.error('加载SVGMorpheus模块失败:', error);
    return;
  }

  // 初始化语言设置
  initLanguage();

  // 动态设置静态示例的 SVG 路径
  const staticIconObject = document.getElementById('icon');
  if (staticIconObject) {
    staticIconObject.data = getSvgPath('iconset.svg');
  }

  // 共享配置
  const icons = {
    '3d_rotation':'3D Rotation',
    'accessibility':'Accessibility',
    'account_balance':'Account Balance',
    'account_box':'Account Box',
    'account_circle':'Account Circle',
    'add_shopping_cart':'Add Shopping Cart',
    'android':'Android',
    'backup':'Backup',
    'bookmark':'Bookmark',
    'bug_report':'Bug Report',
    'credit_card':'Credit Card',
    'delete':'Delete',
    'done':'Done',
    'drawer':'Drawer',
    'event':'Event',
    'exit_to_app':'Exit To App',
    'explore':'Explore',
    'extension':'Extension',
    'favorite':'Favorite',
    'help':'Help',
    'history':'History',
    'home':'Home',
    'https':'Https',
    'info':'Info',
    'input':'Input',
    'invert_colors':'Invert Colors',
    'label':'Label',
    'language':'Language',
    'launch':'Launch',
    'loyalty':'Loyalty',
    'polymer':'Polymer',
    'print':'Print',
    'receipt':'Receipt'
  };

  const easings = {
    'circ-in': 'Circ In','circ-out': 'Circ Out','circ-in-out': 'Circ In/Out',
    'cubic-in': 'Cubic In', 'cubic-out': 'Cubic Out', 'cubic-in-out': 'Cubic In/Out',
    'elastic-in': 'Elastic In', 'elastic-out': 'Elastic Out', 'elastic-in-out': 'Elastic In/Out',
    'expo-in': 'Expo In', 'expo-out': 'Expo Out', 'expo-in-out': 'Expo In/Out',
    'linear': 'Linear',
    'quad-in': 'Quad In', 'quad-out': 'Quad Out', 'quad-in-out': 'Quad In/Out',
    'quart-in': 'Quart In', 'quart-out': 'Quart Out', 'quart-in-out': 'Quart In/Out',
    'quint-in': 'Quint In', 'quint-out': 'Quint Out', 'quint-in-out': 'Quint In/Out',
    'sine-in': 'Sine In','sine-out': 'Sine Out','sine-in-out': 'Sine In/Out'
  };

  const durations = [250, 500, 750, 1000, 5000];
  const rotations = {
    'clock': 'Clockwise',
    'counterclock': 'Counterclockwise',
    'random': 'Random',
    'none': 'None'
  };

  // 初始化第一个示例（静态 iconset.svg）
  initStaticExample();

  // 初始化第二个示例（动态生成）
  await initDynamicExample();

  function initStaticExample() {
    const svgMorpheus = new SVGMorpheus('#icon');
    const selIcon = document.getElementById('selIcon');
    const selEasing = document.getElementById('selEasing');
    const selDuration = document.getElementById('selDuration');
    const selRotation = document.getElementById('selRotation');

    populateSelects(selIcon, selEasing, selDuration, selRotation);
    setupEventHandlers(svgMorpheus, selIcon, selEasing, selDuration, selRotation);

    console.log(t('console.staticComplete'));
  }

  async function initDynamicExample() {
    console.log('开始初始化动态示例...');

    // 动态 SVG 图标数据（使用简单的几何图形作为示例）
    const dynamicSvgMap = {
      'circle': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="currentColor"/>
      </svg>`,
      'square': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" fill="var(--color-red)"/>
        <rect x="4" y="4" width="8" height="8" fill="var(--color-blue)"/>
      </svg>`,
      'triangle': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,3 21,20 3,20" fill="currentColor"/>
      </svg>`,
      'settings': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>`,
      'search': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>`,
      'star': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" fill="currentColor"/>
      </svg>`,
      'heart': `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84,4.61a5.5,5.5 0,0,0 -7.78,0L12,5.67 10.94,4.61a5.5,5.5 0,0,0 -7.78,7.78L12,21.23l8.84,-8.84A5.5,5.5 0,0,0 20.84,4.61Z"/>
      </svg>`,
      'diamond': `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 22,12 12,22 2,12"/>
      </svg>`,
      'vite': getSvgPath('vite.svg'),
      'diving': getSvgPath('diving.svg'),
      'bag': getSvgPath('bag.svg')
    };

    try {
      console.log('准备调用 bundleSvgs...');
      console.log('bundleSvgs 函数类型:', typeof bundleSvgs);
      console.log('dynamicSvgMap 内容:', dynamicSvgMap);

      // 自定义 SVG 属性
      const customSvgAttributes = {
        width: '100%',
        height: '100%',
        class: 'dynamic-iconset',
        style: '--color-red: red; --color-blue: blue;',
	  'data-source': 'bundleSvgs-dynamic',
      };

      console.log('customSvgAttributes:', customSvgAttributes);
      console.log('开始调用 bundleSvgs...');

      // 使用 bundleSvgs 生成合并的 SVG Blob URL，并传入自定义属性
      const bundledSvgUrl = await bundleSvgs(dynamicSvgMap, customSvgAttributes);
      console.log('bundleSvgs 调用成功，生成的 Blob URL:', bundledSvgUrl);

      // 设置 object 元素的 data 属性
      const iconObject = document.getElementById('iconDynamic');
      const loadingIndicator = document.getElementById('loadingIndicator');
      const dynamicOptionsContainer = document.getElementById('dynamicOptionsContainer');

      console.log('iconObject 元素:', iconObject);
      console.log('loadingIndicator 元素:', loadingIndicator);

      // 设置超时机制，防止一直卡在加载状态
      const loadTimeout = setTimeout(() => {
        console.log('Object 加载超时，尝试直接使用 SVG');
        showDynamicExample();
      }, 3000);

      // 等待 SVG 加载完成后初始化
      iconObject.onload = function() {
        console.log('Object onload 事件触发');
        clearTimeout(loadTimeout);
        showDynamicExample();
      };

      // 错误处理
      iconObject.onerror = function(e) {
        console.error('Object 加载失败:', e);
        clearTimeout(loadTimeout);
        showErrorMessage(t('error.loadFailed'));
      };

      // 设置 data 属性
      console.log('设置 iconObject.data 为:', bundledSvgUrl);
      iconObject.data = bundledSvgUrl;
      console.log('已设置 object.data，等待加载完成...');

      function showDynamicExample() {
        // 隐藏加载指示器
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
        }

        // 显示 SVG 和选项
        iconObject.style.display = 'block';
        if (dynamicOptionsContainer) {
          dynamicOptionsContainer.style.display = 'block';
        }

        try {
          const svgMorpheusDynamic = new SVGMorpheus('#iconDynamic');
          const selIconDynamic = document.getElementById('selIconDynamic');
          const selEasingDynamic = document.getElementById('selEasingDynamic');
          const selDurationDynamic = document.getElementById('selDurationDynamic');
          const selRotationDynamic = document.getElementById('selRotationDynamic');

          // 为动态示例创建图标选项
          const dynamicIcons = {
            'circle': t('icons.circle'),
            'square': t('icons.square'),
            'triangle': t('icons.triangle'),
            'star': t('icons.star'),
            'heart': t('icons.heart'),
            'diamond': t('icons.diamond'),
            'search': t('icons.search'),
            'settings': t('icons.settings'),
            'vite': t('icons.vite'),
            'diving': t('icons.diving'),
            'bag': t('icons.bag')
          };

          populateSelectsDynamic(selIconDynamic, selEasingDynamic, selDurationDynamic, selRotationDynamic, dynamicIcons);
          setupEventHandlers(svgMorpheusDynamic, selIconDynamic, selEasingDynamic, selDurationDynamic, selRotationDynamic, true);

          console.log(t('console.dynamicComplete'));
        } catch (morpheusError) {
          console.error('SVGMorpheus 初始化失败:', morpheusError);
          showErrorMessage(t('error.loadFailed'));
        }
      }

      function showErrorMessage(message) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
          loadingIndicator.innerHTML = `<span style="color: #f44336;">${message}</span>`;
        }
      }
    } catch (error) {
      console.error('动态 SVG 初始化失败:', error);
      // 检查是否是因为模块导入失败
      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) {
        if (error.message && error.message.includes('bundleSvgs')) {
          loadingIndicator.innerHTML = `<span style="color: #f44336;">${t('error.bundleFailed')}</span>`;
        } else {
          loadingIndicator.innerHTML = `<span style="color: #f44336;">${t('error.loadFailed')}</span>`;
        }
      }
    }
  }

  function populateSelects(selIcon, selEasing, selDuration, selRotation) {
    populateSelectsDynamic(selIcon, selEasing, selDuration, selRotation, icons);
  }

  function populateSelectsDynamic(selIcon, selEasing, selDuration, selRotation, iconMap) {
    // 填充图标选择
    for (const key in iconMap) {
      selIcon.options[selIcon.options.length] = new Option(iconMap[key], key);
    }

    // 填充缓动选择
    for (const key in easings) {
      selEasing.options[selEasing.options.length] = new Option(easings[key], key);
    }

    // 填充时长选择
    for (let i = 0; i < durations.length; i++) {
      selDuration.options[selDuration.options.length] = new Option(durations[i], durations[i]);
    }

    // 填充旋转选择
    for (const key in rotations) {
      selRotation.options[selRotation.options.length] = new Option(rotations[key], key);
    }

    // 设置默认值
    selIcon.selectedIndex = selIcon.options.length - 1;
    selEasing.selectedIndex = 15;
    selDuration.selectedIndex = 2;
    selRotation.selectedIndex = 0;
  }

  function setupEventHandlers(svgMorpheus, selIcon, selEasing, selDuration, selRotation, isDynamic = false) {
    function getSelValue(sel) {
      return sel.options[sel.selectedIndex].value;
    }

    let timeoutInstance, manualChange = false;

    function onIconChange() {
      clearTimeout(timeoutInstance);
      const valIcon = getSelValue(selIcon);
      const valEasing = getSelValue(selEasing);
      const valDuration = getSelValue(selDuration);
      const valRotation = getSelValue(selRotation);

      svgMorpheus.to(valIcon, {
        duration: valDuration,
        easing: valEasing,
        rotation: valRotation
      }, !manualChange ? launchTimer : null);
    }

    function timerTick() {
      let selIndex = selIcon.selectedIndex;
      while (selIndex === selIcon.selectedIndex) {
        selIndex = Math.round(Math.random() * (selIcon.options.length - 1));
      }
      selIcon.selectedIndex = selIndex;
      onIconChange();
    }

    function launchTimer() {
      timeoutInstance = setTimeout(timerTick, 1000);
    }

    selIcon.addEventListener('change', onIconChange);
    selIcon.addEventListener('click', function() {
      clearTimeout(timeoutInstance);
      manualChange = true;
    });

    // 启动自动切换
    launchTimer();
  }
}

// 复制代码功能
function copyCode(button) {
  const codeSection = button.closest('.code-section');
  const codeElement = codeSection.querySelector('pre code');

  // 获取纯文本内容，去掉 HTML 标签
  let codeText = codeElement.textContent || codeElement.innerText;

  // 清理多余的空白
  codeText = codeText.replace(/\n\s*\n/g, '\n').trim();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeText).then(() => {
      showCopySuccess(button);
    }).catch(() => {
      fallbackCopyTextToClipboard(codeText, button);
    });
  } else {
    fallbackCopyTextToClipboard(codeText, button);
  }
}

function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showCopySuccess(button);
  } catch (err) {
    console.error('复制失败:', err);
    showCopyError(button);
  }

  document.body.removeChild(textArea);
}

function showCopySuccess(button) {
  button.textContent = t('button.copied');
  button.classList.add('copied');
  setTimeout(() => {
    button.textContent = t('button.copy');
    button.classList.remove('copied');
  }, 2000);
}

function showCopyError(button) {
  button.textContent = t('button.copyFailed');
  button.classList.add('copied');
  setTimeout(() => {
    button.textContent = t('button.copy');
    button.classList.remove('copied');
  }, 2000);
}

// 使复制函数在全局可用
window.copyCode = copyCode;

// 页面加载时初始化
window.addEventListener('load', init);
