/*!
 * SVG Morpheus TypeScript Demo - Compiled Version
 * Version: v1.4.13
 * Build Date: 2026-04-09T05:49:35.012Z
 * Repository: https://github.com/caixw/SVG-Morpheus-ts
 */
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`modulepreload`,t=function(e){return`/SVG-Morpheus-ts/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(i.map(i=>{if(i=t(i,a),i in n)return;n[i]=!0;let o=i.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``;if(a)for(let e=r.length-1;e>=0;e--){let t=r[e];if(t.href===i&&(!o||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${i}"]${s}`))return;let l=document.createElement(`link`);if(l.rel=o?`stylesheet`:e,o||(l.as=`script`),l.crossOrigin=``,l.href=i,c&&l.setAttribute(`nonce`,c),document.head.appendChild(l),o)return new Promise((e,t)=>{l.addEventListener(`load`,e),l.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[])t.status===`rejected`&&s(t.reason);return r().catch(s)})};async function i(){console.log(`当前模式:`,`demo`,`是否为演示模式:`,!0);try{let e=await r(()=>import(`./dist-Dwakk0jt.js`),[]);return console.log(`已加载构建后的模块`),e}catch(e){console.error(`加载构建后的模块失败，回退到源文件:`,e);let t=await r(()=>import(`./src-BXqQb3tS.js`),[]);return console.log(`已回退到源 TypeScript 模块`),t}}var a,o;function s(e){return console.log(`使用构建时路径:`,`/SVG-Morpheus-ts/`+e),`/SVG-Morpheus-ts/`+e}var c={en:{title:`SVG Morpheus TypeScript`,subtitle:`Interactive SVG Morphing: Static & Dynamic Bundling Demo`,description:`Enhanced TypeScript version with bundleSvgs() for dynamic SVG merging`,"example1.title":`Example 1: Using Static iconset.svg File`,"example1.description":`📁 Traditional approach: Using pre-built iconset.svg files<br>Suitable for scenarios with fixed icons that don't require dynamic loading`,"example1.codeTitle":`💻 Example Code`,"example2.title":`Example 2: Using bundleSvgs for Dynamic SVG Generation`,"example2.description":`🚀 Modern approach: Runtime dynamic SVG icon merging with loading support<br>Suitable for modern applications requiring dynamic icon addition and diverse icon sources<br>✨ <strong>New Feature</strong>: Support for custom SVG attributes (viewBox, class, data-* etc.)`,"label.icon":`Icon:`,"label.easing":`Easing:`,"label.duration":`Duration:`,"label.rotation":`Rotation:`,"button.copy":`Copy Code`,"button.copied":`Copied!`,"button.copyFailed":`Copy Failed`,"loading.text":`Generating dynamic SVG...`,"error.loadFailed":`Failed to load dynamic SVG demo`,"error.bundleFailed":`bundleSvgs function not available`,"console.staticComplete":`Static iconset example initialized successfully`,"console.dynamicComplete":`Dynamic bundleSvgs example initialized successfully`,"project.basedOn":`Based on SVG-Morpheus`,"project.source":`View Source`,"project.github":`GitHub Repository`,"icons.circle":`Circle`,"icons.square":`Square`,"icons.triangle":`Triangle`,"icons.star":`Star`,"icons.heart":`Heart`,"icons.diamond":`Diamond`,"icons.search":`Search`,"icons.settings":`Settings`,"icons.vite":`Vite`,"icons.diving":`Diving`,"icons.bag":`Bag`,"code.example1":`// 1. Prepare static iconset.svg file
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
});`,"code.example2":`// 1. Import required functions
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
morpheus.to('diving'); // Try the new diving icon!`},zh:{title:`SVG Morpheus TypeScript`,subtitle:`交互式 SVG 变形：静态与动态合并演示`,description:`增强版 TypeScript 实现，内置 bundleSvgs() 动态 SVG 合并功能`,"example1.title":`示例 1：使用静态 iconset.svg 文件`,"example1.description":`📁 传统方式：使用预构建的 iconset.svg 文件<br>适用于图标固定、无需动态加载的场景`,"example1.codeTitle":`💻 示例代码`,"example2.title":`示例 2：使用 bundleSvgs 动态生成 SVG`,"example2.description":`🚀 现代方式：运行时动态合并 SVG 图标，支持加载状态<br>适用于需要动态添加图标、图标来源多样的现代应用<br>✨ <strong>新特性</strong>：支持自定义 SVG 属性（viewBox、class、data-* 等）`,"label.icon":`图标：`,"label.easing":`缓动：`,"label.duration":`时长：`,"label.rotation":`旋转：`,"button.copy":`复制代码`,"button.copied":`已复制！`,"button.copyFailed":`复制失败`,"loading.text":`正在生成动态 SVG...`,"error.loadFailed":`动态 SVG 演示加载失败`,"error.bundleFailed":`bundleSvgs 功能不可用`,"console.staticComplete":`静态 iconset 示例初始化成功`,"console.dynamicComplete":`动态 bundleSvgs 示例初始化成功`,"project.basedOn":`基于 SVG-Morpheus`,"project.source":`查看源码`,"project.github":`GitHub 仓库`,"icons.circle":`圆形`,"icons.square":`方形`,"icons.triangle":`三角形`,"icons.star":`星形`,"icons.heart":`心形`,"icons.diamond":`菱形`,"icons.search":`搜索`,"icons.settings":`设置`,"icons.vite":`Vite`,"icons.diving":`潜水`,"icons.bag":`背包`,"code.example1":`// 1. 准备静态 iconset.svg 文件
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
});`,"code.example2":`// 1. 导入所需函数
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
morpheus.to('diving'); // 试试新的潜水图标！`}},l=`en`;function u(e){l=e,document.querySelectorAll(`.lang-btn`).forEach(e=>{e.classList.remove(`active`)}),event.target.classList.add(`active`),d(),localStorage.setItem(`svgMorpheusLang`,e)}function d(){let e=c[l];document.querySelectorAll(`[data-i18n]`).forEach(t=>{let n=t.getAttribute(`data-i18n`);e[n]&&(t.innerHTML=e[n])}),document.querySelectorAll(`[data-i18n-code]`).forEach(t=>{let n=t.getAttribute(`data-i18n-code`);e[n]&&(t.textContent=e[n])}),document.querySelectorAll(`[data-i18n-code]`).forEach(t=>{let n=t.getAttribute(`data-i18n-code`);e[n]&&(t.textContent=e[n],t.removeAttribute(`data-highlighted`),t.className=t.className.replace(/hljs[^\s]*/g,``).trim())}),typeof hljs<`u`&&setTimeout(()=>{document.querySelectorAll(`[data-i18n-code]`).forEach(e=>{hljs.highlightElement(e)})},0),f()}function f(){let e=document.getElementById(`selIconDynamic`);if(e&&e.options.length>0){let t=e.value;e.innerHTML=``;let n={circle:p(`icons.circle`),square:p(`icons.square`),triangle:p(`icons.triangle`),star:p(`icons.star`),heart:p(`icons.heart`),diamond:p(`icons.diamond`),search:p(`icons.search`),settings:p(`icons.settings`),vite:p(`icons.vite`),diving:p(`icons.diving`),bag:p(`icons.bag`)};for(let[t,r]of Object.entries(n))e.options[e.options.length]=new Option(r,t);t?e.value=t:e.selectedIndex=e.options.length-1}}function p(e){return c[l][e]||e}function m(){let e=localStorage.getItem(`svgMorpheusLang`);e&&c[e]&&(l=e,document.querySelectorAll(`.lang-btn`).forEach(t=>{t.classList.remove(`active`),(e===`zh`&&t.textContent.includes(`中文`)||e===`en`&&t.textContent.includes(`English`))&&t.classList.add(`active`)})),d(),typeof hljs<`u`&&hljs.highlightAll()}window.switchLanguage=u;async function h(){try{let e=await i();a=e.SVGMorpheus,o=e.bundleSvgs}catch(e){console.error(`加载SVGMorpheus模块失败:`,e);return}m();let e=document.getElementById(`icon`);e&&(e.data=s(`iconset.svg`));let t={"3d_rotation":`3D Rotation`,accessibility:`Accessibility`,account_balance:`Account Balance`,account_box:`Account Box`,account_circle:`Account Circle`,add_shopping_cart:`Add Shopping Cart`,android:`Android`,backup:`Backup`,bookmark:`Bookmark`,bug_report:`Bug Report`,credit_card:`Credit Card`,delete:`Delete`,done:`Done`,drawer:`Drawer`,event:`Event`,exit_to_app:`Exit To App`,explore:`Explore`,extension:`Extension`,favorite:`Favorite`,help:`Help`,history:`History`,home:`Home`,https:`Https`,info:`Info`,input:`Input`,invert_colors:`Invert Colors`,label:`Label`,language:`Language`,launch:`Launch`,loyalty:`Loyalty`,polymer:`Polymer`,print:`Print`,receipt:`Receipt`},n={"circ-in":`Circ In`,"circ-out":`Circ Out`,"circ-in-out":`Circ In/Out`,"cubic-in":`Cubic In`,"cubic-out":`Cubic Out`,"cubic-in-out":`Cubic In/Out`,"elastic-in":`Elastic In`,"elastic-out":`Elastic Out`,"elastic-in-out":`Elastic In/Out`,"expo-in":`Expo In`,"expo-out":`Expo Out`,"expo-in-out":`Expo In/Out`,linear:`Linear`,"quad-in":`Quad In`,"quad-out":`Quad Out`,"quad-in-out":`Quad In/Out`,"quart-in":`Quart In`,"quart-out":`Quart Out`,"quart-in-out":`Quart In/Out`,"quint-in":`Quint In`,"quint-out":`Quint Out`,"quint-in-out":`Quint In/Out`,"sine-in":`Sine In`,"sine-out":`Sine Out`,"sine-in-out":`Sine In/Out`},r=[250,500,750,1e3,5e3],c={clock:`Clockwise`,counterclock:`Counterclockwise`,random:`Random`,none:`None`};l(),await u();function l(){let e=new a(`#icon`),t=document.getElementById(`selIcon`),n=document.getElementById(`selEasing`),r=document.getElementById(`selDuration`),i=document.getElementById(`selRotation`);d(t,n,r,i),h(e,t,n,r,i),console.log(p(`console.staticComplete`))}async function u(){console.log(`开始初始化动态示例...`);let e={circle:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="currentColor"/>
      </svg>`,square:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" fill="var(--color-red)"/>
        <rect x="4" y="4" width="8" height="8" fill="var(--color-blue)"/>
      </svg>`,triangle:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,3 21,20 3,20" fill="currentColor"/>
      </svg>`,settings:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>`,search:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>`,star:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" fill="currentColor"/>
      </svg>`,heart:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84,4.61a5.5,5.5 0,0,0 -7.78,0L12,5.67 10.94,4.61a5.5,5.5 0,0,0 -7.78,7.78L12,21.23l8.84,-8.84A5.5,5.5 0,0,0 20.84,4.61Z"/>
      </svg>`,diamond:`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 22,12 12,22 2,12"/>
      </svg>`,vite:s(`vite.svg`),diving:s(`diving.svg`),bag:s(`bag.svg`)};try{console.log(`准备调用 bundleSvgs...`),console.log(`bundleSvgs 函数类型:`,typeof o),console.log(`dynamicSvgMap 内容:`,e);let t={width:`100%`,height:`100%`,class:`dynamic-iconset`,style:`--color-red: red; --color-blue: blue;`,"data-source":`bundleSvgs-dynamic`};console.log(`customSvgAttributes:`,t),console.log(`开始调用 bundleSvgs...`);let n=await o(e,t);console.log(`bundleSvgs 调用成功，生成的 Blob URL:`,n);let r=document.getElementById(`iconDynamic`),i=document.getElementById(`loadingIndicator`),s=document.getElementById(`dynamicOptionsContainer`);console.log(`iconObject 元素:`,r),console.log(`loadingIndicator 元素:`,i);let c=setTimeout(()=>{console.log(`Object 加载超时，尝试直接使用 SVG`),l()},3e3);r.onload=function(){console.log(`Object onload 事件触发`),clearTimeout(c),l()},r.onerror=function(e){console.error(`Object 加载失败:`,e),clearTimeout(c),u(p(`error.loadFailed`))},console.log(`设置 iconObject.data 为:`,n),r.data=n,console.log(`已设置 object.data，等待加载完成...`);function l(){i&&(i.style.display=`none`),r.style.display=`block`,s&&(s.style.display=`block`);try{let e=new a(`#iconDynamic`),t=document.getElementById(`selIconDynamic`),n=document.getElementById(`selEasingDynamic`),r=document.getElementById(`selDurationDynamic`),i=document.getElementById(`selRotationDynamic`);f(t,n,r,i,{circle:p(`icons.circle`),square:p(`icons.square`),triangle:p(`icons.triangle`),star:p(`icons.star`),heart:p(`icons.heart`),diamond:p(`icons.diamond`),search:p(`icons.search`),settings:p(`icons.settings`),vite:p(`icons.vite`),diving:p(`icons.diving`),bag:p(`icons.bag`)}),h(e,t,n,r,i,!0),console.log(p(`console.dynamicComplete`))}catch(e){console.error(`SVGMorpheus 初始化失败:`,e),u(p(`error.loadFailed`))}}function u(e){let t=document.getElementById(`loadingIndicator`);t&&(t.innerHTML=`<span style="color: #f44336;">${e}</span>`)}}catch(e){console.error(`动态 SVG 初始化失败:`,e);let t=document.getElementById(`loadingIndicator`);t&&(e.message&&e.message.includes(`bundleSvgs`)?t.innerHTML=`<span style="color: #f44336;">${p(`error.bundleFailed`)}</span>`:t.innerHTML=`<span style="color: #f44336;">${p(`error.loadFailed`)}</span>`)}}function d(e,n,r,i){f(e,n,r,i,t)}function f(e,t,i,a,o){for(let t in o)e.options[e.options.length]=new Option(o[t],t);for(let e in n)t.options[t.options.length]=new Option(n[e],e);for(let e=0;e<r.length;e++)i.options[i.options.length]=new Option(r[e],r[e]);for(let e in c)a.options[a.options.length]=new Option(c[e],e);e.selectedIndex=e.options.length-1,t.selectedIndex=15,i.selectedIndex=2,a.selectedIndex=0}function h(e,t,n,r,i,a=!1){function o(e){return e.options[e.selectedIndex].value}let s,c=!1;function l(){clearTimeout(s);let a=o(t),l=o(n),u=o(r),f=o(i);e.to(a,{duration:u,easing:l,rotation:f},c?null:d)}function u(){let e=t.selectedIndex;for(;e===t.selectedIndex;)e=Math.round(Math.random()*(t.options.length-1));t.selectedIndex=e,l()}function d(){s=setTimeout(u,1e3)}t.addEventListener(`change`,l),t.addEventListener(`click`,function(){clearTimeout(s),c=!0}),d()}}function g(e){let t=e.closest(`.code-section`).querySelector(`pre code`),n=t.textContent||t.innerText;n=n.replace(/\n\s*\n/g,`
`).trim(),navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(n).then(()=>{v(e)}).catch(()=>{_(n,e)}):_(n,e)}function _(e,t){let n=document.createElement(`textarea`);n.value=e,n.style.position=`fixed`,n.style.left=`-9999px`,document.body.appendChild(n),n.focus(),n.select();try{document.execCommand(`copy`),v(t)}catch(e){console.error(`复制失败:`,e),y(t)}document.body.removeChild(n)}function v(e){e.textContent=p(`button.copied`),e.classList.add(`copied`),setTimeout(()=>{e.textContent=p(`button.copy`),e.classList.remove(`copied`)},2e3)}function y(e){e.textContent=p(`button.copyFailed`),e.classList.add(`copied`),setTimeout(()=>{e.textContent=p(`button.copy`),e.classList.remove(`copied`)},2e3)}window.copyCode=g,window.addEventListener(`load`,h);