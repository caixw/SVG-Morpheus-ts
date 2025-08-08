// Main entry point for SVG Morpheus TypeScript version

// Export the main SVGMorpheus class
export { SVGMorpheus as default } from './svg-morpheus';
export { SVGMorpheus } from './svg-morpheus';

// Export all type definitions
export type {
    EasingFunction,
    SVGMorpheusOptions,
    StyleAttributes,
    NormalizedStyle,
    Transform,
    IconItem,
    Icon,
    MorphNode,
    BoundingBox,
    CallbackFunction
} from './types';

// Export easing functions object
export { easings } from './easings';

// Export utility functions and SVG bundling functions
export {
    styleNormCalc,
    styleNormToString,
    styleToNorm,
    transCalc,
    trans2string,
    curveCalc,
    clone,
    bundleSvgs,             // 🆕 动态SVG合并，返回 Blob URL
    bundleSvgsString        // 🆕 动态SVG合并，返回 SVG 字符串
} from './helpers';

// Export path utilities (if needed)
export {
    parsePathString,
    pathToAbsolute,
    path2curve,
    path2string,
    curvePathBBox
} from './svg-path'; 