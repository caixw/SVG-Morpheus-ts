// Main entry point for SVG Morpheus TypeScript version

export { SVGMorpheus as default, SVGMorpheus } from './svg-morpheus';

export { rotations } from './types';

export type {
    BoundingBox,
    CallbackFunction,
    EasingFunction,
    Icon,
    IconItem,
    MorphNode,
    NormalizedStyle,
    Rotation,
    StyleAttributes,
    SVGMorpheusOptions,
    Transform
} from './types';

export { easings } from './easings';

export {
    bundleSvgs, // 🆕 动态 SVG 合并，返回 Blob URL
    bundleSvgsString, // 🆕 动态 SVG 合并，返回 SVG 字符串
    clone, curveCalc, styleNormCalc, styleNormToString,
    styleToNorm, trans2string, transCalc
} from './helpers';

export {
    curvePathBBox, parsePathString, path2curve,
    path2string, pathToAbsolute
} from './svg-path';
