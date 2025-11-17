import Color from 'colorjs.io';

// Animation easing functions | 动画缓动函数类型
export type EasingFunction = (t: number) => number;

/**
 * 可用的旋转方式
 */
export const rotations = ['clock', 'counterclock', 'none', 'random'] as const;

/**
 * 动画图标的旋转方式
 */
export type Rotation = typeof rotations[number];

// SVG Morpheus configuration options | SVG Morpheus 配置选项
export interface SVGMorpheusOptions extends ToMethodOptions {
    /**
     * Initial icon ID to display | 初始显示的图标 ID
     * Specifies which icon to display by default when SVGMorpheus is instantiated | 指定 SVGMorpheus 实例化后默认显示哪个图标
     * If not specified, the last icon in the SVG will be used as default | 如果不指定，将使用 SVG 中的最后一个图标作为默认图标
     */
    iconId?: string;
}

// Style attributes for SVG elements | SVG 元素样式属性
export interface StyleAttributes {
    fill?: string;
    stroke?: string;
    opacity?: string;
    'fill-opacity'?: string;
    'stroke-opacity'?: string;
    'stroke-width'?: string;
}

// Normalized style values | 标准化样式值
export interface NormalizedStyle {
    /** Fill color or gradient reference | 填充颜色或渐变引用 */
    fill?: Color | string;
    /** Stroke color or gradient reference | 描边颜色或渐变引用 */
    stroke?: Color | string;
    /** Overall opacity | 整体透明度 */
    opacity?: number;
    /** Fill opacity | 填充透明度 */
    'fill-opacity'?: number;
    /** Stroke opacity | 描边透明度 */
    'stroke-opacity'?: number;
    /** Stroke width | 描边宽度 */
    'stroke-width'?: number;
}

// Transform values | 变换值
export interface Transform {
    /** Rotation: [angle, centerX, centerY] | 旋转: [角度, 中心 X, 中心 Y] */
    rotate?: [number, number, number];
}

// Curve data - array of curve segments, each segment is an array starting with command and coordinates
// 曲线数据 - 曲线段数组，每个段是以命令和坐标开始的数组
export type CurveSegment = (string | number)[];
export type CurveData = CurveSegment[];

// Icon item structure | 图标项结构
export interface IconItem {
    /** SVG path data | SVG 路径数据 */
    path: string;
    /** Element attributes | 元素属性 */
    attrs: StyleAttributes;
    /** Element styles | 元素样式 */
    style: StyleAttributes;
    /** Curve data for animation | 用于动画的曲线数据 */
    curve?: CurveData;
    /** Normalized attributes | 标准化属性 */
    attrsNorm?: NormalizedStyle;
    /** Normalized styles | 标准化样式 */
    styleNorm?: NormalizedStyle;
    /** Transform data | 变换数据 */
    trans?: Transform;
    /** Transform string | 变换字符串 */
    transStr?: string;
}

// ViewBox information | ViewBox 信息
export interface ViewBoxInfo {
    /** ViewBox values: [x, y, width, height] | ViewBox 值 */
    values: [number, number, number, number];
    /** Original viewBox string | 原始 viewBox 字符串 */
    original: string;
}

// SVG definitions information | SVG 定义信息
export interface DefsInfo {
    /** Gradient definitions | 渐变定义 */
    gradients: Record<string, string>;
    /** Pattern definitions | 图案定义 */
    patterns: Record<string, string>;
    /** Other definitions | 其他定义 */
    others: Record<string, string>;
    /** Raw defs element | 原始 defs 元素 */
    raw?: string;
}

// Icon structure | 图标结构
export interface Icon {
    /** Icon identifier | 图标标识符 */
    id: string;
    /** Array of icon items | 图标项数组 */
    items: IconItem[];
    /** ViewBox information | ViewBox 信息 */
    viewBox?: ViewBoxInfo;
    /** SVG definitions | SVG 定义 */
    defs?: DefsInfo;
    /** Original SVG root attributes | 原始 SVG 根属性 */
    rootAttrs?: Record<string, string>;
}

// Morph node structure | 变形节点结构
export interface MorphNode {
    /** SVG path element | SVG 路径元素 */
    node: SVGPathElement;
    /** Source icon item index | 源图标项索引 */
    fromIconItemIdx: number;
    /** Target icon item index | 目标图标项索引 */
    toIconItemIdx: number;
}

// Bounding box | 边界框
export interface BoundingBox {
    /** X coordinate | X 坐标 */
    x: number;
    /** Y coordinate | Y 坐标 */
    y: number;
    /** Width | 宽度 */
    w: number;
    /** Height | 高度 */
    h: number;
    /** Center X coordinate | 中心 X 坐标 */
    cx: number;
    /** Center Y coordinate | 中心 Y 坐标 */
    cy: number;
}

// Options for the to() method | to() 方法的选项
export interface ToMethodOptions {
    /**
     * Animation duration in milliseconds | 动画持续时间（毫秒）
     * Overrides the instance default animation duration, only applies to current morph | 覆盖实例默认的动画持续时间，仅对当前这次变形生效
     * @example 0 // No animation | 没有动画
     * @example 500 // 0.5 second fast morph | 0.5 秒的快速变形
     */
    duration?: number;

    /**
     * Animation easing function name | 动画缓动函数名称
     * Overrides the instance default easing function, only applies to current morph | 覆盖实例默认的缓动函数，仅对当前这次变形生效
     * @example 'ease-in-out' // Slow start and end animation effect | 慢进慢出的动画效果
     */
    easing?: string;

    /**
     * Icon rotation direction | 图标旋转方向
     * Overrides the instance default rotation behavior, only applies to current morph | 覆盖实例默认的旋转行为，仅对当前这次变形生效
     * - 'clock': Clockwise rotation | 顺时针旋转
     * - 'counterclock': Counterclockwise rotation | 逆时针旋转
     * - 'none': No rotation | 不旋转
     * - 'random': Random rotation direction | 随机旋转方向
     */
    rotation?: Rotation;
}

/**
 * Callback function type for animation completion | 动画完成时的回调函数类型
 * Called after icon morphing animation completes, used for executing subsequent operations | 在图标变形动画完成后被调用，用于执行后续操作
 * @example
 * const callback = () => {
 *   console.log('Animation completed!'); // 动画已完成！
 * };
 */
export type CallbackFunction = () => void;

// Easing functions map | 缓动函数映射
export interface EasingMap {
    [key: string]: EasingFunction;
}
