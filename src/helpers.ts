import type {
  StyleAttributes,
  NormalizedStyle,
  RGBColor,
  Transform
} from './types.js';

// Request animation frame polyfills
export const reqAnimFrame = window.requestAnimationFrame || 
  (window as any).webkitRequestAnimationFrame || 
  (window as any).mozRequestAnimationFrame || 
  (window as any).oRequestAnimationFrame ||
  ((callback: FrameRequestCallback) => setTimeout(callback, 16));

export const cancelAnimFrame = window.cancelAnimationFrame || 
  (window as any).webkitCancelAnimationFrame || 
  (window as any).mozCancelAnimationFrame || 
  (window as any).oCancelAnimationFrame ||
  clearTimeout;

// Calculate style
export function styleNormCalc(
  styleNormFrom: NormalizedStyle, 
  styleNormTo: NormalizedStyle, 
  progress: number
): NormalizedStyle {
  const styleNorm: NormalizedStyle = {};
  
  for (const key in styleNormFrom) {
    const prop = key as keyof NormalizedStyle;
    switch (prop) {
      case 'fill':
      case 'stroke':
        if (styleNormFrom[prop] && styleNormTo[prop]) {
          styleNorm[prop] = {
            ...styleNormFrom[prop],
            r: styleNormFrom[prop]!.r + (styleNormTo[prop]!.r - styleNormFrom[prop]!.r) * progress,
            g: styleNormFrom[prop]!.g + (styleNormTo[prop]!.g - styleNormFrom[prop]!.g) * progress,
            b: styleNormFrom[prop]!.b + (styleNormTo[prop]!.b - styleNormFrom[prop]!.b) * progress,
            opacity: styleNormFrom[prop]!.opacity + (styleNormTo[prop]!.opacity - styleNormFrom[prop]!.opacity) * progress,
          };
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        if (typeof styleNormFrom[prop] === 'number' && typeof styleNormTo[prop] === 'number') {
          styleNorm[prop] = styleNormFrom[prop]! + (styleNormTo[prop]! - styleNormFrom[prop]!) * progress;
        }
        break;
    }
  }
  return styleNorm;
}

export function styleNormToString(styleNorm: NormalizedStyle): StyleAttributes {
  const style: StyleAttributes = {};
  for (const key in styleNorm) {
    const prop = key as keyof NormalizedStyle;
    switch (prop) {
      case 'fill':
      case 'stroke':
        if (styleNorm[prop]) {
          style[prop] = rgbToString(styleNorm[prop]!);
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        if (typeof styleNorm[prop] === 'number') {
          style[prop] = String(styleNorm[prop]);
        }
        break;
    }
  }
  return style;
}

export function styleToNorm(styleFrom: StyleAttributes, styleTo: StyleAttributes): [NormalizedStyle, NormalizedStyle] {
  const styleNorm: [NormalizedStyle, NormalizedStyle] = [{}, {}];
  
  for (const key in styleFrom) {
    const prop = key as keyof StyleAttributes;
    switch (prop) {
      case 'fill':
      case 'stroke':
        if (styleFrom[prop]) {
          styleNorm[0][prop] = getRGB(styleFrom[prop]!);
          if (styleTo[prop] === undefined && styleNorm[0][prop]) {
            styleNorm[1][prop] = getRGB(styleFrom[prop]!);
            styleNorm[1][prop]!.opacity = 0;
          }
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        if (styleFrom[prop]) {
          styleNorm[0][prop] = Number(styleFrom[prop]);
          if (styleTo[prop] === undefined) {
            styleNorm[1][prop] = 1;
          }
        }
        break;
    }
  }
  
  for (const key in styleTo) {
    const prop = key as keyof StyleAttributes;
    switch (prop) {
      case 'fill':
      case 'stroke':
        if (styleTo[prop]) {
          styleNorm[1][prop] = getRGB(styleTo[prop]!);
          if (styleFrom[prop] === undefined && styleNorm[1][prop]) {
            styleNorm[0][prop] = getRGB(styleTo[prop]!);
            styleNorm[0][prop]!.opacity = 0;
          }
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        if (styleTo[prop]) {
          styleNorm[1][prop] = Number(styleTo[prop]);
          if (styleFrom[prop] === undefined) {
            styleNorm[0][prop] = 1;
          }
        }
        break;
    }
  }
  return styleNorm;
}

// Calculate transform progress
export function transCalc(transFrom: Transform, transTo: Transform, progress: number): Transform {
  const res: Transform = {};
  for (const key in transFrom) {
    const prop = key as keyof Transform;
    switch (prop) {
      case 'rotate':
        if (transFrom[prop] && transTo[prop]) {
          res[prop] = [0, 0, 0];
          for (let j = 0; j < 3; j++) {
            res[prop]![j] = transFrom[prop]![j] + (transTo[prop]![j] - transFrom[prop]![j]) * progress;
          }
        }
        break;
    }
  }
  return res;
}

export function trans2string(trans: Transform): string {
  let res = '';
  if (trans.rotate) {
    res += `rotate(${trans.rotate.join(' ')})`;
  }
  return res;
}

// Calculate curve progress
export function curveCalc(curveFrom: number[][], curveTo: number[][], progress: number): number[][] {
  const curve: number[][] = [];
  for (let i = 0, len1 = curveFrom.length; i < len1; i++) {
    curve.push([curveFrom[i][0]]);
    for (let j = 1, len2 = curveFrom[i].length; j < len2; j++) {
      curve[i].push(curveFrom[i][j] + (curveTo[i][j] - curveFrom[i][j]) * progress);
    }
  }
  return curve;
}

export function clone<T>(obj: T): T {
  // Handle Array
  if (obj instanceof Array) {
    const copy: any[] = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy as T;
  }

  // Handle Object
  if (obj instanceof Object) {
    const copy: any = {};
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        copy[attr] = clone((obj as any)[attr]);
      }
    }
    return copy as T;
  }

  return obj;
}

// Helper functions for color conversion
function getRGB(colorStr: string): RGBColor {
  // Simple RGB color parsing (this would need to be more comprehensive in real use)
  if (colorStr === 'none' || colorStr === 'transparent') {
    return { r: 0, g: 0, b: 0, opacity: 0 };
  }
  
  // Parse hex colors
  if (colorStr.startsWith('#')) {
    const hex = colorStr.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        opacity: 1
      };
    } else if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        opacity: 1
      };
    }
  }
  
  // Default to black
  return { r: 0, g: 0, b: 0, opacity: 1 };
}

function rgbToString(color: RGBColor): string {
  if (color.opacity === 0) {
    return 'transparent';
  }
  if (color.opacity === 1) {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
  }
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${color.opacity})`;
} 