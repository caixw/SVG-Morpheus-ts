// Animation easing functions
export type EasingFunction = (t: number) => number;

// SVG Morpheus configuration options
export interface SVGMorpheusOptions {
  iconId?: string;
  duration?: number;
  easing?: string;
  rotation?: 'clock' | 'counterclock' | 'none' | 'random';
}

// Style attributes for SVG elements
export interface StyleAttributes {
  fill?: string;
  'fill-opacity'?: string;
  opacity?: string;
  stroke?: string;
  'stroke-opacity'?: string;
  'stroke-width'?: string;
}

// Normalized color object
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

// Normalized style values
export interface NormalizedStyle {
  fill?: RGBColor;
  stroke?: RGBColor;
  opacity?: number;
  'fill-opacity'?: number;
  'stroke-opacity'?: number;
  'stroke-width'?: number;
}

// Transform values
export interface Transform {
  rotate?: [number, number, number];
}

// Curve data - array of curve segments, each segment is an array starting with command and coordinates
export type CurveSegment = (string | number)[];
export type CurveData = CurveSegment[];

// Icon item structure
export interface IconItem {
  path: string;
  attrs: StyleAttributes;
  style: StyleAttributes;
  curve?: CurveData;
  attrsNorm?: NormalizedStyle;
  styleNorm?: NormalizedStyle;
  trans?: Transform;
  transStr?: string;
}

// Icon structure
export interface Icon {
  id: string;
  items: IconItem[];
}

// Morph node structure
export interface MorphNode {
  node: SVGPathElement;
  fromIconItemIdx: number;
  toIconItemIdx: number;
}

// Bounding box
export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

// Callback function type
export type CallbackFunction = () => void;

// Options for the `to` method
export interface ToMethodOptions {
  duration?: number;
  easing?: string;
  rotation?: 'clock' | 'counterclock' | 'none' | 'random';
}

// Animation frame request ID
export type AnimationFrameId = number;

// Easing functions map
export interface EasingMap {
  [key: string]: EasingFunction;
} 