/*!
 * SVG Morpheus TypeScript Demo
 * Based on SVG-Morpheus by Alex Kaul
 * Modern TypeScript + Vite + pnpm refactored version
 * Repository: https://github.com/adoin/SVG-Morpheus-ts
 * License: MIT
 * Build Date: ${new Date().toISOString()}
 */

import { SVGMorpheus, bundleSvgs } from '../dist/index.js';

// 全局变量由 Vite 构建时注入
// __SVG_BASE_PATH__: string - SVG文件的基础路径
// __IS_GITHUB_PAGES__: boolean - 是否为GitHub Pages环境

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
    'icons.vite': 'Vite'
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
    'icons.vite': 'Vite'
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
      element.innerHTML = texts[key];
    }
  });
  
  // 重新高亮所有代码块
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
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
      'vite': t('icons.vite')
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
        <rect x="4" y="4" width="16" height="16" fill="currentColor"/>
      </svg>`,
      'triangle': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,3 21,20 3,20" fill="currentColor"/>
      </svg>`,
      'star': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" fill="currentColor"/>
      </svg>`,
      'heart': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84,4.61a5.5,5.5 0,0,0 -7.78,0L12,5.67 10.94,4.61a5.5,5.5 0,0,0 -7.78,7.78L12,21.23l8.84,-8.84A5.5,5.5 0,0,0 20.84,4.61Z" fill="currentColor"/>
      </svg>`,
      'diamond': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 22,12 12,22 2,12" fill="currentColor"/>
      </svg>`,
      'vite': getSvgPath('vite.svg')
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
        'data-source': 'bundleSvgs-dynamic'
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
        
        // 显示SVG和选项
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
            'vite': t('icons.vite')
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
  
  // 获取纯文本内容，去掉HTML标签
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