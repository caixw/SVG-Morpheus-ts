import { 
  styleNormCalc, 
  styleNormToString, 
  styleToNorm, 
  transCalc, 
  trans2string, 
  curveCalc, 
  clone,
  reqAnimFrame,
  cancelAnimFrame
} from './helpers';

import { easings } from './easings';
import { path2curve, path2string, curvePathBBox } from './svg-path';
import { 
  Icon, 
  IconItem, 
  MorphNode, 
  SVGMorpheusOptions, 
  ToMethodOptions, 
  CallbackFunction, 
  AnimationFrameId, 
  BoundingBox,
  StyleAttributes
} from './types';

export class SVGMorpheus {
  private _icons: Record<string, Icon> = {};
  private _curIconId: string = '';
  private _toIconId: string = '';
  private _curIconItems: IconItem[] = [];
  private _fromIconItems: IconItem[] = [];
  private _toIconItems: IconItem[] = [];
  private _morphNodes: MorphNode[] = [];
  private _morphG: SVGGElement | null = null;
  private _startTime: number | undefined;
  private _defDuration: number;
  private _defEasing: string;
  private _defRotation: string;
  private _defCallback: CallbackFunction;
  private _duration: number;
  private _easing: string;
  private _rotation: string;
  private _callback: CallbackFunction;
  private _rafid: AnimationFrameId | undefined;
  private _svgDoc: SVGSVGElement | null = null;
  private _fnTick: (timePassed: number) => void;

  constructor(
    element: string | HTMLElement | SVGSVGElement,
    options?: SVGMorpheusOptions,
    callback?: CallbackFunction
  ) {
    if (!element) {
      throw new Error('SVGMorpheus > "element" is required');
    }

    let targetElement: HTMLElement | SVGSVGElement;
    if (typeof element === 'string') {
      const found = document.querySelector(element);
      if (!found) {
        throw new Error('SVGMorpheus > "element" query is not related to an existing DOM node');
      }
      targetElement = found as HTMLElement | SVGSVGElement;
    } else {
      targetElement = element;
    }

    if (!!options && typeof options !== 'object') {
      throw new Error('SVGMorpheus > "options" parameter must be an object');
    }
    options = options || {};

    if (!!callback && typeof callback !== 'function') {
      throw new Error('SVGMorpheus > "callback" parameter must be a function');
    }

    const that = this;

    this._icons = {};
    this._curIconId = options.iconId || '';
    this._toIconId = '';
    this._curIconItems = [];
    this._fromIconItems = [];
    this._toIconItems = [];
    this._morphNodes = [];
    this._morphG = null;
    this._startTime = undefined;
    this._defDuration = options.duration || 750;
    this._defEasing = options.easing || 'quad-in-out';
    this._defRotation = options.rotation || 'clock';
    this._defCallback = callback || function () {};
    this._duration = this._defDuration;
    this._easing = this._defEasing;
    this._rotation = this._defRotation;
    this._callback = this._defCallback;
    this._rafid = undefined;

    this._fnTick = function(timePassed: number) {
      if (!that._startTime) {
        that._startTime = timePassed;
      }
      const progress = Math.min((timePassed - that._startTime) / that._duration, 1);
      that._updateAnimationProgress(progress);
      if (progress < 1) {
        that._rafid = reqAnimFrame(that._fnTick);
      } else {
        if (that._toIconId !== '') {
          that._animationEnd();
        }
      }
    };

    if (targetElement.nodeName.toUpperCase() === 'SVG') {
      this._svgDoc = targetElement as SVGSVGElement;
    } else {
      this._svgDoc = (targetElement as any).getSVGDocument();
    }
    if (!this._svgDoc) {
      targetElement.addEventListener("load", function() {
        that._svgDoc = (targetElement as any).getSVGDocument();
        that._init();
      }, false);
    } else {
      that._init();
    }
  }

  private _init(): void {
    if (!this._svgDoc) return;
    
    if (this._svgDoc.nodeName.toUpperCase() !== 'SVG') {
      const svgElements = this._svgDoc.getElementsByTagName('svg');
      this._svgDoc = svgElements[0] as SVGSVGElement;
    }

    if (!!this._svgDoc) {
      let lastIconId = '';

      // Read Icons Data
      // Icons = 1st tier G nodes having ID
      for (let i = this._svgDoc.childNodes.length - 1; i >= 0; i--) {
        const nodeIcon = this._svgDoc.childNodes[i];
        if (nodeIcon.nodeName.toUpperCase() === 'G') {
          const iconElement = nodeIcon as SVGGElement;
          const id = iconElement.getAttribute('id');
          if (!!id) {
            const items: IconItem[] = [];
            for (let j = 0, len2 = iconElement.childNodes.length; j < len2; j++) {
              const nodeItem = iconElement.childNodes[j] as SVGElement;
              const item: IconItem = {
                path: '',
                attrs: {},
                style: {}
              };

              // Get Item Path (Convert all shapes into Path Data)
              switch (nodeItem.nodeName.toUpperCase()) {
                case 'PATH':
                  item.path = (nodeItem as SVGPathElement).getAttribute('d') || '';
                  break;
                case 'CIRCLE':
                  const circleElement = nodeItem as SVGCircleElement;
                  const cx = parseFloat(circleElement.getAttribute('cx') || '0');
                  const cy = parseFloat(circleElement.getAttribute('cy') || '0');
                  const r = parseFloat(circleElement.getAttribute('r') || '0');
                  item.path = `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 -${r * 2},0z`;
                  break;
                case 'ELLIPSE':
                  const ellipseElement = nodeItem as SVGEllipseElement;
                  const ecx = parseFloat(ellipseElement.getAttribute('cx') || '0');
                  const ecy = parseFloat(ellipseElement.getAttribute('cy') || '0');
                  const rx = parseFloat(ellipseElement.getAttribute('rx') || '0');
                  const ry = parseFloat(ellipseElement.getAttribute('ry') || '0');
                  item.path = `M${ecx - rx},${ecy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 -${rx * 2},0z`;
                  break;
                case 'RECT':
                  const rectElement = nodeItem as SVGRectElement;
                  const x = parseFloat(rectElement.getAttribute('x') || '0');
                  const y = parseFloat(rectElement.getAttribute('y') || '0');
                  const w = parseFloat(rectElement.getAttribute('width') || '0');
                  const h = parseFloat(rectElement.getAttribute('height') || '0');
                  const rectRx = parseFloat(rectElement.getAttribute('rx') || '0');
                  const rectRy = parseFloat(rectElement.getAttribute('ry') || '0');
                  if (!rectRx && !rectRy) {
                    item.path = `M${x},${y}l${w},0l0,${h}l-${w},0z`;
                  } else {
                    item.path = `M${x + rectRx},${y}` +
                              `l${w - rectRx * 2},0` +
                              `a${rectRx},${rectRy} 0 0,1 ${rectRx},${rectRy}` +
                              `l0,${h - rectRy * 2}` +
                              `a${rectRx},${rectRy} 0 0,1 -${rectRx},${rectRy}` +
                              `l${rectRx * 2 - w},0` +
                              `a${rectRx},${rectRy} 0 0,1 -${rectRx},-${rectRy}` +
                              `l0,${rectRy * 2 - h}` +
                              `a${rectRx},${rectRy} 0 0,1 ${rectRx},-${rectRy}` +
                              'z';
                  }
                  break;
                case 'POLYGON':
                  const polygonElement = nodeItem as SVGPolygonElement;
                  const points = polygonElement.getAttribute('points') || '';
                  const p = points.split(/\s+/);
                  let path = "";
                  for (let k = 0, len = p.length; k < len; k++) {
                    path += (k && "L" || "M") + p[k]
                  }
                  item.path = path + 'z';
                  break;
                case 'LINE':
                  const lineElement = nodeItem as SVGLineElement;
                  const x1 = parseFloat(lineElement.getAttribute('x1') || '0');
                  const y1 = parseFloat(lineElement.getAttribute('y1') || '0');
                  const x2 = parseFloat(lineElement.getAttribute('x2') || '0');
                  const y2 = parseFloat(lineElement.getAttribute('y2') || '0');
                  item.path = `M${x1},${y1}L${x2},${y2}z`;
                  break;
              }
              
              if (item.path !== '') {
                // Traverse all attributes and get style values
                for (let k = 0, len3 = nodeItem.attributes.length; k < len3; k++) {
                  const attrib = nodeItem.attributes[k];
                  if (attrib.specified) {
                    const name = attrib.name.toLowerCase();
                    switch (name) {
                      case 'fill':
                      case 'fill-opacity':
                      case 'opacity':
                      case 'stroke':
                      case 'stroke-opacity':
                      case 'stroke-width':
                        (item.attrs as any)[name] = attrib.value;
                    }
                  }
                }

                // Traverse all inline styles and get supported values
                const elementStyle = (nodeItem as any).style;
                for (let l = 0, len4 = elementStyle.length; l < len4; l++) {
                  const styleName = elementStyle[l];
                  switch (styleName) {
                    case 'fill':
                    case 'fill-opacity':
                    case 'opacity':
                    case 'stroke':
                    case 'stroke-opacity':
                    case 'stroke-width':
                      (item.style as any)[styleName] = elementStyle[styleName];
                  }
                }

                items.push(item);
              }
            }

            // Add Icon
            if (items.length > 0) {
              const icon: Icon = {
                id: id,
                items: items
              };
              this._icons[id] = icon;
            }

            // Init Node for Icons Items and remove Icon Nodes
            if (!this._morphG) {
              lastIconId = id;
              this._morphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
              this._svgDoc.replaceChild(this._morphG, nodeIcon);
            } else {
              this._svgDoc.removeChild(nodeIcon);
            }
          }
        }
      }
      // To Default Icon
      const defaultIcon = this._curIconId || lastIconId;
      if (defaultIcon !== '') {
        this._setupAnimation(defaultIcon);
        this._updateAnimationProgress(1);
        this._animationEnd();
      }
    }
  }

  private _setupAnimation(toIconId: string): void {
    if (!!toIconId && !!this._icons[toIconId]) {
      this._toIconId = toIconId;
      this._startTime = undefined;
      let i: number, len: number;
      this._fromIconItems = clone(this._curIconItems);
      this._toIconItems = clone(this._icons[toIconId].items);

      for (i = 0, len = this._morphNodes.length; i < len; i++) {
        const morphNode = this._morphNodes[i];
        morphNode.fromIconItemIdx = i;
        morphNode.toIconItemIdx = i;
      }

      const maxNum = Math.max(this._fromIconItems.length, this._toIconItems.length);
      let toBB: BoundingBox;
      for (i = 0; i < maxNum; i++) {
        // Add items to fromIcon/toIcon if needed
        if (!this._fromIconItems[i]) {
          if (!!this._toIconItems[i]) {
            toBB = curvePathBBox(path2curve(this._toIconItems[i].path));
            this._fromIconItems.push({
              path: 'M' + toBB.cx + ',' + toBB.cy + 'l0,0',
              attrs: {},
              style: {},
              trans: {
                'rotate': [0, toBB.cx, toBB.cy]
              }
            });
          } else {
            this._fromIconItems.push({
              path: 'M0,0l0,0',
              attrs: {},
              style: {},
              trans: {
                'rotate': [0, 0, 0]
              }
            });
          }
        }
        if (!this._toIconItems[i]) {
          if (!!this._fromIconItems[i]) {
            toBB = curvePathBBox(path2curve(this._fromIconItems[i].path));
            this._toIconItems.push({
              path: 'M' + toBB.cx + ',' + toBB.cy + 'l0,0',
              attrs: {},
              style: {},
              trans: {
                'rotate': [0, toBB.cx, toBB.cy]
              }
            });
          } else {
            this._toIconItems.push({
              path: 'M0,0l0,0',
              attrs: {},
              style: {},
              trans: {
                'rotate': [0, 0, 0]
              }
            });
          }
        }

        // Add Node to DOM if needed
        if (!this._morphNodes[i] && this._morphG) {
          const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          this._morphG.appendChild(node);
          this._morphNodes.push({
            node: node,
            fromIconItemIdx: i,
            toIconItemIdx: i
          });
        }
      }

      for (i = 0; i < maxNum; i++) {
        const fromIconItem = this._fromIconItems[i];
        const toIconItem = this._toIconItems[i];

        // Calculate from/to curve data and set to fromIcon/toIcon
        const curves = path2curve(this._fromIconItems[i].path, this._toIconItems[i].path);
        fromIconItem.curve = curves[0];
        toIconItem.curve = curves[1];

        // Normalize from/to attrs
        const attrsNorm = styleToNorm(this._fromIconItems[i].attrs, this._toIconItems[i].attrs);
        fromIconItem.attrsNorm = attrsNorm[0];
        toIconItem.attrsNorm = attrsNorm[1];
        fromIconItem.attrs = styleNormToString(fromIconItem.attrsNorm);
        toIconItem.attrs = styleNormToString(toIconItem.attrsNorm);

        // Normalize from/to style
        const styleNorm = styleToNorm(this._fromIconItems[i].style, this._toIconItems[i].style);
        fromIconItem.styleNorm = styleNorm[0];
        toIconItem.styleNorm = styleNorm[1];
        fromIconItem.style = styleNormToString(fromIconItem.styleNorm);
        toIconItem.style = styleNormToString(toIconItem.styleNorm);

        // Calculate from/to transform
        toBB = curvePathBBox(toIconItem.curve!);
        toIconItem.trans = {
          'rotate': [0, toBB.cx, toBB.cy]
        };
        let rotation = this._rotation;
        let degAdd: number;
        if (rotation === 'random') {
          rotation = Math.random() < 0.5 ? 'counterclock' : 'clock';
        }
        switch (rotation) {
          case 'none':
            if (fromIconItem.trans?.rotate && toIconItem.trans?.rotate) {
              toIconItem.trans.rotate[0] = fromIconItem.trans.rotate[0];
            }
            break;
          case 'counterclock':
            if (fromIconItem.trans?.rotate && toIconItem.trans?.rotate) {
              toIconItem.trans.rotate[0] = fromIconItem.trans.rotate[0] - 360;
              degAdd = -fromIconItem.trans.rotate[0] % 360;
              toIconItem.trans.rotate[0] += (degAdd < 180 ? degAdd : degAdd - 360);
            } else if (toIconItem.trans?.rotate) {
              toIconItem.trans.rotate[0] = -360;
            }
            break;
          default: // Clockwise
            if (fromIconItem.trans?.rotate && toIconItem.trans?.rotate) {
              toIconItem.trans.rotate[0] = fromIconItem.trans.rotate[0] + 360;
              degAdd = fromIconItem.trans.rotate[0] % 360;
              toIconItem.trans.rotate[0] += (degAdd < 180 ? -degAdd : 360 - degAdd);
            } else if (toIconItem.trans?.rotate) {
              toIconItem.trans.rotate[0] = 360;
            }
            break;
        }
      }

      this._curIconItems = clone(this._fromIconItems);
    }
  }

  private _updateAnimationProgress(progress: number): void {
    progress = easings[this._easing](progress);

    let i: number, j: string, k: string, len: number;
    // Update path/attrs/transform
    for (i = 0, len = this._curIconItems.length; i < len; i++) {
      if (this._fromIconItems[i].curve && this._toIconItems[i].curve) {
        this._curIconItems[i].curve = curveCalc(this._fromIconItems[i].curve!, this._toIconItems[i].curve!, progress);
        this._curIconItems[i].path = path2string(this._curIconItems[i].curve);
      }

      if (this._fromIconItems[i].attrsNorm && this._toIconItems[i].attrsNorm) {
        this._curIconItems[i].attrsNorm = styleNormCalc(this._fromIconItems[i].attrsNorm!, this._toIconItems[i].attrsNorm!, progress);
        this._curIconItems[i].attrs = styleNormToString(this._curIconItems[i].attrsNorm!);
      }

      if (this._fromIconItems[i].styleNorm && this._toIconItems[i].styleNorm) {
        this._curIconItems[i].styleNorm = styleNormCalc(this._fromIconItems[i].styleNorm!, this._toIconItems[i].styleNorm!, progress);
        this._curIconItems[i].style = styleNormToString(this._curIconItems[i].styleNorm!);
      }

      if (this._fromIconItems[i].trans && this._toIconItems[i].trans) {
        this._curIconItems[i].trans = transCalc(this._fromIconItems[i].trans!, this._toIconItems[i].trans!, progress);
        this._curIconItems[i].transStr = trans2string(this._curIconItems[i].trans!);
      }
    }

    // Update DOM
    for (i = 0, len = this._morphNodes.length; i < len; i++) {
      const morphNode = this._morphNodes[i];
      morphNode.node.setAttribute("d", this._curIconItems[i].path);
      const attrs = this._curIconItems[i].attrs as StyleAttributes;
      for (j in attrs) {
        morphNode.node.setAttribute(j, (attrs as any)[j]);
      }
      const style = this._curIconItems[i].style as StyleAttributes;
      for (k in style) {
        (morphNode.node.style as any)[k] = (style as any)[k];
      }
      morphNode.node.setAttribute("transform", this._curIconItems[i].transStr || '');
    }
  }

  private _animationEnd(): void {
    for (let i = this._morphNodes.length - 1; i >= 0; i--) {
      const morphNode = this._morphNodes[i];
      if (!!this._icons[this._toIconId].items[i]) {
        morphNode.node.setAttribute("d", this._icons[this._toIconId].items[i].path);
      } else {
        if (morphNode.node.parentNode) {
          morphNode.node.parentNode.removeChild(morphNode.node);
        }
        this._morphNodes.splice(i, 1);
      }
    }

    this._curIconId = this._toIconId;
    this._toIconId = '';

    this._callback();
  }

  // Public methods

  // Morph To Icon
  public to(iconId: string, options?: ToMethodOptions, callback?: CallbackFunction): void {
    if (iconId !== this._toIconId) {
      if (!!options && typeof options !== 'object') {
        throw new Error('SVGMorpheus.to() > "options" parameter must be an object');
      }
      options = options || {};

      if (!!callback && typeof callback !== 'function') {
        throw new Error('SVGMorpheus.to() > "callback" parameter must be a function');
      }

      if (this._rafid) {
        cancelAnimFrame(this._rafid);
      }

      this._duration = options.duration || this._defDuration;
      this._easing = options.easing || this._defEasing;
      this._rotation = options.rotation || this._defRotation;
      this._callback = callback || this._defCallback;

      this._setupAnimation(iconId);
      this._rafid = reqAnimFrame(this._fnTick);
    }
  }

  // Register custom Easing function
  public registerEasing(name: string, fn: (progress: number) => number): void {
    easings[name] = fn;
  }
}

// Default export for ESM
export default SVGMorpheus; 