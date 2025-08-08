// Coordinate system transformation utilities
// 坐标系统转换工具

import { parsePathString, path2string, pathToAbsolute } from './svg-path';
import { DefsInfo, ViewBoxInfo } from './types';

/**
 * 坐标转换矩阵
 */
export interface TransformMatrix {
    /** Scale X | X 轴缩放 */
    scaleX: number;
    /** Scale Y | Y 轴缩放 */
    scaleY: number;
    /** Translate X | X 轴平移 */
    translateX: number;
    /** Translate Y | Y 轴平移 */
    translateY: number;
}

/**
 * 解析 ViewBox 字符串
 */
export function parseViewBox(viewBoxStr: string): ViewBoxInfo {
    const values = viewBoxStr.trim().split(/\s+/).map(Number);
    if (values.length !== 4) {
        throw new Error(`Invalid viewBox: ${viewBoxStr}`);
    }

    return {
        values: [values[0], values[1], values[2], values[3]],
        original: viewBoxStr
    };
}

/**
 * 计算从源 ViewBox 到目标 ViewBox 的转换矩阵
 */
export function calculateTransformMatrix(
    fromViewBox: ViewBoxInfo,
    toViewBox: ViewBoxInfo
): TransformMatrix {
    const [fromX, fromY, fromW, fromH] = fromViewBox.values;
    const [toX, toY, toW, toH] = toViewBox.values;

    // 计算缩放比例
    const scaleX = toW / fromW;
    const scaleY = toH / fromH;

    // 计算平移量 (先缩放后平移)
    const translateX = toX - fromX * scaleX;
    const translateY = toY - fromY * scaleY;

    return {
        scaleX,
        scaleY,
        translateX,
        translateY
    };
}

/**
 * 应用转换矩阵到点坐标
 */
export function transformPoint(x: number, y: number, matrix: TransformMatrix): [number, number] {
    return [
        x * matrix.scaleX + matrix.translateX,
        y * matrix.scaleY + matrix.translateY
    ];
}

/**
 * 转换 SVG 路径数据
 */
export function transformPath(pathData: string, matrix: TransformMatrix): string {
    if (!pathData || !pathData.trim()) {
        return pathData;
    }

    try {
        // 解析路径为绝对坐标
        const parsed = parsePathString(pathData);
        const absolute = pathToAbsolute(parsed);

        // 转换每个路径段的坐标
        const transformed = absolute.map((segment: any[]) => {
            const command = segment[0];
            const coords = segment.slice(1);

            // 根据命令类型转换坐标
            const newSegment = [command];

            switch (command) {
            case 'M': // MoveTo
            case 'L': // LineTo
                if (coords.length >= 2) {
                    const [newX, newY] = transformPoint(coords[0], coords[1], matrix);
                    newSegment.push(newX, newY);
                    // 处理额外的坐标对
                    for (let i = 2; i < coords.length; i += 2) {
                        if (i + 1 < coords.length) {
                            const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
                            newSegment.push(x, y);
                        }
                    }
                }
                break;

            case 'C': // CurveTo
                if (coords.length >= 6) {
                    for (let i = 0; i < coords.length; i += 2) {
                        if (i + 1 < coords.length) {
                            const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
                            newSegment.push(x, y);
                        }
                    }
                }
                break;

            case 'Q': // QuadraticCurveTo
                if (coords.length >= 4) {
                    for (let i = 0; i < coords.length; i += 2) {
                        if (i + 1 < coords.length) {
                            const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
                            newSegment.push(x, y);
                        }
                    }
                }
                break;

            case 'A': // Arc
                if (coords.length >= 7) {
                    // Arc: rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    // 只转换终点坐标，半径需要按比例缩放
                    const rx = coords[0] * matrix.scaleX;
                    const ry = coords[1] * matrix.scaleY;
                    const [endX, endY] = transformPoint(coords[5], coords[6], matrix);
                    newSegment.push(rx, ry, coords[2], coords[3], coords[4], endX, endY);
                }
                break;

            case 'H': // Horizontal LineTo
                if (coords.length >= 1) {
                    const [newX] = transformPoint(coords[0], 0, matrix);
                    newSegment.push(newX);
                }
                break;

            case 'V': // Vertical LineTo
                if (coords.length >= 1) {
                    const [, newY] = transformPoint(0, coords[0], matrix);
                    newSegment.push(newY);
                }
                break;

            case 'Z': // ClosePath
            case 'z':
                // 无需坐标转换
                break;

            default:
                // 对于未知命令，尝试按坐标对转换
                for (let i = 0; i < coords.length; i += 2) {
                    if (i + 1 < coords.length) {
                        const [x, y] = transformPoint(coords[i], coords[i + 1], matrix);
                        newSegment.push(x, y);
                    } else {
                        newSegment.push(coords[i]);
                    }
                }
            }

            return newSegment;
        });

        // 转换回路径字符串
        return path2string(transformed);
    } catch (error) {
        console.warn('Path transformation failed:', error);
        return pathData; // 返回原始路径
    }
}

/**
 * 根据起始和目标 ViewBox 计算最佳的过渡 ViewBox
 */
export function calculateOptimalViewBox(
    fromViewBox: ViewBoxInfo | undefined, toViewBox: ViewBoxInfo | undefined
): ViewBoxInfo {
    // 如果都没有 ViewBox，使用默认
    if (!fromViewBox && !toViewBox) {
        return {
            values: [0, 0, 24, 24],
            original: '0 0 24 24'
        };
    }

    // 如果只有一个 ViewBox，使用该 ViewBox
    if (!fromViewBox && toViewBox) { return toViewBox; }
    if (fromViewBox && !toViewBox) { return fromViewBox; }

    // 如果两个 ViewBox 相同，直接返回
    if (fromViewBox && toViewBox) {
        const [fx, fy, fw, fh] = fromViewBox.values;
        const [tx, ty, tw, th] = toViewBox.values;

        if (fx === tx && fy === ty && fw === tw && fh === th) { return fromViewBox; }

        // 对于动画过程，我们使用目标 ViewBox 作为最终坐标系统。这样动画结束时图标会在正确的坐标系统中
        return toViewBox;
    }

    return { // 默认 fallback
        values: [0, 0, 24, 24],
        original: '0 0 24 24'
    };
}

/**
 * 转换渐变定义中的坐标
 */
export function transformGradientDefs(
    defs: DefsInfo, idPrefix: string = '', transformMatrix?: TransformMatrix
): DefsInfo {
    const transformedDefs: DefsInfo = {
        gradients: {},
        patterns: {},
        others: {}
    };

    // 转换渐变定义
    for (const [id, gradientStr] of Object.entries(defs.gradients)) {
        const newId = idPrefix + id;
        let transformed = gradientStr;

        // 重命名 ID 避免冲突
        transformed = transformed.replace(new RegExp(`id="${id}"`, 'g'), `id="${newId}"`);
        transformed = transformed.replace(new RegExp(`id='${id}'`, 'g'), `id='${newId}'`);

        // 如果有转换矩阵，转换渐变坐标
        if (transformMatrix) {
            transformed = transformGradientCoordinates(transformed, transformMatrix);
        }

        transformedDefs.gradients[newId] = transformed;
    }

    // 转换图案定义
    for (const [id, patternStr] of Object.entries(defs.patterns)) {
        const newId = idPrefix + id;
        let transformed = patternStr;

        // 重命名 ID 避免冲突
        transformed = transformed.replace(new RegExp(`id="${id}"`, 'g'), `id="${newId}"`);
        transformed = transformed.replace(new RegExp(`id='${id}'`, 'g'), `id='${newId}'`);

        // 如果有转换矩阵，转换图案坐标
        if (transformMatrix) {
            transformed = transformPatternCoordinates(transformed, transformMatrix);
        }

        transformedDefs.patterns[newId] = transformed;
    }

    // 转换其他定义
    for (const [id, otherStr] of Object.entries(defs.others)) {
        const newId = idPrefix + id;
        let transformed = otherStr;

        // 重命名ID避免冲突
        transformed = transformed.replace(new RegExp(`id="${id}"`, 'g'), `id="${newId}"`);
        transformed = transformed.replace(new RegExp(`id='${id}'`, 'g'), `id='${newId}'`);

        transformedDefs.others[newId] = transformed;
    }

    return transformedDefs;
}

/**
 * 转换渐变坐标
 */
function transformGradientCoordinates(gradientStr: string, matrix: TransformMatrix): string {
    let transformed = gradientStr;

    // 处理 linearGradient 的坐标
    if (gradientStr.includes('linearGradient')) {
        // 匹配 x1, y1, x2, y2 属性（支持百分比和绝对值）
        transformed = transformed.replace(
            /\b(x1|y1|x2|y2)=["']([^"']+)["']/g,
            (_match, attr, value) => {
                const transformedValue = transformGradientValue(attr, value, matrix);
                return `${attr}="${transformedValue}"`;
            }
        );
    }

    // 处理 radialGradient 的坐标
    if (gradientStr.includes('radialGradient')) {
        // 匹配 cx, cy, r, fx, fy 属性
        transformed = transformed.replace(
            /\b(cx|cy|fx|fy|r)=["']([^"']+)["']/g,
            (_match, attr, value) => {
                const transformedValue = transformGradientValue(attr, value, matrix);
                return `${attr}="${transformedValue}"`;
            }
        );
    }

    return transformed;
}

/**
 * 转换图案坐标
 */
function transformPatternCoordinates(patternStr: string, matrix: TransformMatrix): string {
    let transformed = patternStr;

    // 处理 pattern 的坐标属性
    transformed = transformed.replace(
        /\b(x|y|width|height)=["']([^"']+)["']/g,
        (_match, attr, value) => {
            const transformedValue = transformGradientValue(attr, value, matrix);
            return `${attr}="${transformedValue}"`;
        }
    );

    return transformed;
}

/**
 * 转换单个渐变坐标值
 */
function transformGradientValue(attr: string, value: string, matrix: TransformMatrix): string {
    // 处理百分比值（保持百分比格式，因为百分比是相对的）
    if (value.endsWith('%')) {
        return value; // 百分比坐标不需要转换，它们是相对于元素大小的
    }

    // 处理绝对坐标值
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return value; // 非数字值保持不变
    }

    // 根据属性类型进行坐标转换
    let transformedValue: number;

    switch (attr) {
    case 'x1':
    case 'x2':
    case 'cx':
    case 'fx':
    case 'x':
        // X坐标转换
        transformedValue = numValue * matrix.scaleX + matrix.translateX;
        break;

    case 'y1':
    case 'y2':
    case 'cy':
    case 'fy':
    case 'y':
        // Y坐标转换
        transformedValue = numValue * matrix.scaleY + matrix.translateY;
        break;

    case 'r':
        // 半径转换（使用平均缩放比例）
        transformedValue = numValue * Math.sqrt(matrix.scaleX * matrix.scaleY);
        break;

    case 'width':
        // 宽度转换
        transformedValue = numValue * matrix.scaleX;
        break;

    case 'height':
        // 高度转换
        transformedValue = numValue * matrix.scaleY;
        break;

    default:
        transformedValue = numValue;
    }

    // 保留合理的小数位数
    return transformedValue.toFixed(3);
}

/**
 * 更新路径中的 defs 引用
 */
export function updateDefsReferences(
    pathData: string, attrs: Record<string, any>, oldToNewIdMap: Record<string, string>
): { pathData: string; attrs: Record<string, any>; } {
    let updatedAttrs = { ...attrs };

    // 更新属性中的引用
    for (const [attr, value] of Object.entries(updatedAttrs)) {
        if (typeof value === 'string' && value.startsWith('url(#')) {
            const match = value.match(/url\(#([^)]+)\)/);
            if (match && oldToNewIdMap[match[1]]) {
                updatedAttrs[attr] = `url(#${oldToNewIdMap[match[1]]})`;
            }
        }
    }

    return {
        pathData,
        attrs: updatedAttrs
    };
}
