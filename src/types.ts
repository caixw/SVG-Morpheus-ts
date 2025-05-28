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

// Icon item structure
export interface IconItem {
  path: string;
  attrs: StyleAttributes;
  style: StyleAttributes;
  curve?: number[][];
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
  width: number;
  height: number;
  cx: number;
  cy: number;
}

// Callback function type
export type CallbackFunction = () => void; 