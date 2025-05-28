import type {
  SVGMorpheusOptions,
  CallbackFunction,
  Icon,
  IconItem,
  MorphNode,
  StyleAttributes,
  BoundingBox
} from './types.ts';

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
} from './helpers.js';

import { easings } from './easings.js';
import { path2curve, path2string, curvePathBBox } from './svg-path.js';

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
  private _rafid: number | undefined;
  private _svgDoc: SVGSVGElement | null = null;
  private _fnTick: (timePassed: number) => void;

  constructor(
    element: string | SVGSVGElement | HTMLObjectElement,
    options?: SVGMorpheusOptions,
    callback?: CallbackFunction
  ) {
    if (!element) {
      throw new Error('SVGMorpheus > "element" is required');
    }

    let targetElement: SVGSVGElement | HTMLObjectElement;

    if (typeof element === 'string') {
      const found = document.querySelector(element) as SVGSVGElement | HTMLObjectElement;
      if (!found) {
        throw new Error('SVGMorpheus > "element" query is not related to an existing DOM node');
      }
      targetElement = found;
    } else {
      targetElement = element;
    }

    if (options && typeof options !== 'object') {
      throw new Error('SVGMorpheus > "options" parameter must be an object');
    }
    options = options || {};

    if (callback && typeof callback !== 'function') {
      throw new Error('SVGMorpheus > "callback" parameter must be a function');
    }

    this._curIconId = options.iconId || '';
    this._defDuration = options.duration || 750;
    this._defEasing = options.easing || 'quad-in-out';
    this._defRotation = options.rotation || 'clock';
    this._defCallback = callback || (() => {});
    this._duration = this._defDuration;
    this._easing = this._defEasing;
    this._rotation = this._defRotation;
    this._callback = this._defCallback;

    this._fnTick = (timePassed: number) => {
      if (!this._startTime) {
        this._startTime = timePassed;
      }
      const progress = Math.min((timePassed - this._startTime) / this._duration, 1);
      this._updateAnimationProgress(progress);
      if (progress < 1) {
        this._rafid = reqAnimFrame(this._fnTick);
      } else {
        if (this._toIconId !== '') {
          this._animationEnd();
        }
      }
    };

    if (targetElement.nodeName.toUpperCase() === 'SVG') {
      this._svgDoc = targetElement as SVGSVGElement;
      this._init();
    } else {
      const objectElement = targetElement as HTMLObjectElement;
      this._svgDoc = objectElement.contentDocument?.querySelector('svg') || null;
      if (!this._svgDoc) {
        objectElement.addEventListener('load', () => {
          this._svgDoc = objectElement.contentDocument?.querySelector('svg') || null;
          this._init();
        }, false);
      } else {
        this._init();
      }
    }
  }

  private _init(): void {
    if (!this._svgDoc) return;

    if (this._svgDoc.nodeName.toUpperCase() !== 'SVG') {
      this._svgDoc = this._svgDoc.querySelector('svg');
      if (!this._svgDoc) return;
    }

    let lastIconId = '';

    // Read Icons Data - Icons = 1st tier G nodes having ID
    const childNodes = Array.from(this._svgDoc.childNodes);
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const nodeIcon = childNodes[i] as Element;
      if (nodeIcon.nodeName.toUpperCase() === 'G') {
        const id = nodeIcon.getAttribute('id');
        if (id) {
          const items: IconItem[] = [];
          const nodeChildren = Array.from(nodeIcon.childNodes);
          
          for (const nodeItem of nodeChildren) {
            if (nodeItem.nodeType !== Node.ELEMENT_NODE) continue;
            
            const element = nodeItem as SVGElement;
            const item: IconItem = {
              path: '',
              attrs: {},
              style: {}
            };

            // Get Item Path (Convert all shapes into Path Data)
            switch (element.nodeName.toUpperCase()) {
              case 'PATH':
                item.path = element.getAttribute('d') || '';
                break;
              case 'CIRCLE': {
                const cx = Number(element.getAttribute('cx')) || 0;
                const cy = Number(element.getAttribute('cy')) || 0;
                const r = Number(element.getAttribute('r')) || 0;
                item.path = `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 -${r * 2},0z`;
                break;
              }
              case 'ELLIPSE': {
                const cx = Number(element.getAttribute('cx')) || 0;
                const cy = Number(element.getAttribute('cy')) || 0;
                const rx = Number(element.getAttribute('rx')) || 0;
                const ry = Number(element.getAttribute('ry')) || 0;
                item.path = `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 -${rx * 2},0z`;
                break;
              }
              case 'RECT': {
                const x = Number(element.getAttribute('x')) || 0;
                const y = Number(element.getAttribute('y')) || 0;
                const w = Number(element.getAttribute('width')) || 0;
                const h = Number(element.getAttribute('height')) || 0;
                const rx = Number(element.getAttribute('rx')) || 0;
                const ry = Number(element.getAttribute('ry')) || 0;
                if (!rx && !ry) {
                  item.path = `M${x},${y}l${w},0l0,${h}l-${w},0z`;
                } else {
                  item.path = `M${x + rx},${y}l${w - rx * 2},0a${rx},${ry} 0 0,1 ${rx},${ry}l0,${h - ry * 2}a${rx},${ry} 0 0,1 -${rx},${ry}l${rx * 2 - w},0a${rx},${ry} 0 0,1 -${rx},-${ry}l0,${ry * 2 - h}a${rx},${ry} 0 0,1 ${rx},-${ry}z`;
                }
                break;
              }
              case 'POLYGON': {
                const points = element.getAttribute('points') || '';
                const p = points.split(/\s+/);
                let path = '';
                for (let k = 0, len = p.length; k < len; k++) {
                  path += (k && 'L' || 'M') + p[k];
                }
                item.path = path + 'z';
                break;
              }
              case 'LINE': {
                const x1 = Number(element.getAttribute('x1')) || 0;
                const y1 = Number(element.getAttribute('y1')) || 0;
                const x2 = Number(element.getAttribute('x2')) || 0;
                const y2 = Number(element.getAttribute('y2')) || 0;
                item.path = `M${x1},${y1}L${x2},${y2}z`;
                break;
              }
            }

            if (item.path !== '') {
              // Traverse all attributes and get style values
              const attributes = element.attributes;
              for (let k = 0; k < attributes.length; k++) {
                const attrib = attributes[k];
                if (attrib.specified) {
                  const name = attrib.name.toLowerCase() as keyof StyleAttributes;
                  switch (name) {
                    case 'fill':
                    case 'fill-opacity':
                    case 'opacity':
                    case 'stroke':
                    case 'stroke-opacity':
                    case 'stroke-width':
                      item.attrs[name] = attrib.value;
                  }
                }
              }

              // Traverse all inline styles and get supported values
              const style = (element as any).style;
              if (style) {
                for (let l = 0; l < style.length; l++) {
                  const styleName = style[l] as keyof StyleAttributes;
                  switch (styleName) {
                    case 'fill':
                    case 'fill-opacity':
                    case 'opacity':
                    case 'stroke':
                    case 'stroke-opacity':
                    case 'stroke-width':
                      item.style[styleName] = style[styleName];
                  }
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

  private _setupAnimation(toIconId: string): void {
    if (!toIconId || !this._icons[toIconId]) return;

    this._toIconId = toIconId;
    this._startTime = undefined;
    this._fromIconItems = clone(this._curIconItems);
    this._toIconItems = clone(this._icons[toIconId].items);

    for (let i = 0; i < this._morphNodes.length; i++) {
      const morphNode = this._morphNodes[i];
      morphNode.fromIconItemIdx = i;
      morphNode.toIconItemIdx = i;
    }

    const maxNum = Math.max(this._fromIconItems.length, this._toIconItems.length);
    let toBB: BoundingBox;

    for (let i = 0; i < maxNum; i++) {
      // Add items to fromIcon/toIcon if needed
      if (!this._fromIconItems[i]) {
        if (this._toIconItems[i]) {
          toBB = curvePathBBox(path2curve(this._toIconItems[i].path)[0]);
          this._fromIconItems.push({
            path: `M${toBB.cx},${toBB.cy}l0,0`,
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
        if (this._fromIconItems[i]) {
          toBB = curvePathBBox(path2curve(this._fromIconItems[i].path)[0]);
          this._toIconItems.push({
            path: `M${toBB.cx},${toBB.cy}l0,0`,
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
      if (!this._morphNodes[i]) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._morphG!.appendChild(node);
        this._morphNodes.push({
          node: node,
          fromIconItemIdx: i,
          toIconItemIdx: i
        });
      }
    }

    for (let i = 0; i < maxNum; i++) {
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
      if (rotation === 'random') {
        rotation = Math.random() < 0.5 ? 'counterclock' : 'clock';
      }
      
      switch (rotation) {
        case 'none':
          if (fromIconItem.trans && fromIconItem.trans.rotate) {
            toIconItem.trans.rotate![0] = fromIconItem.trans.rotate[0];
          }
          break;
        case 'counterclock':
          if (fromIconItem.trans && fromIconItem.trans.rotate) {
            toIconItem.trans.rotate![0] = fromIconItem.trans.rotate[0] - 360;
            const degAdd = -fromIconItem.trans.rotate[0] % 360;
            toIconItem.trans.rotate![0] += (degAdd < 180 ? degAdd : degAdd - 360);
          } else {
            toIconItem.trans.rotate![0] = -360;
          }
          break;
        default: // Clockwise
          if (fromIconItem.trans && fromIconItem.trans.rotate) {
            toIconItem.trans.rotate![0] = fromIconItem.trans.rotate[0] + 360;
            const degAdd = fromIconItem.trans.rotate[0] % 360;
            toIconItem.trans.rotate![0] += (degAdd < 180 ? -degAdd : 360 - degAdd);
          } else {
            toIconItem.trans.rotate![0] = 360;
          }
          break;
      }
    }

    this._curIconItems = clone(this._fromIconItems);
  }

  private _updateAnimationProgress(progress: number): void {
    progress = easings[this._easing](progress);

    // Update path/attrs/transform
    for (let i = 0; i < this._curIconItems.length; i++) {
      this._curIconItems[i].curve = curveCalc(this._fromIconItems[i].curve!, this._toIconItems[i].curve!, progress);
      this._curIconItems[i].path = path2string(this._curIconItems[i].curve!);

      this._curIconItems[i].attrsNorm = styleNormCalc(this._fromIconItems[i].attrsNorm!, this._toIconItems[i].attrsNorm!, progress);
      this._curIconItems[i].attrs = styleNormToString(this._curIconItems[i].attrsNorm!);

      this._curIconItems[i].styleNorm = styleNormCalc(this._fromIconItems[i].styleNorm!, this._toIconItems[i].styleNorm!, progress);
      this._curIconItems[i].style = styleNormToString(this._curIconItems[i].styleNorm!);

      this._curIconItems[i].trans = transCalc(this._fromIconItems[i].trans!, this._toIconItems[i].trans!, progress);
      this._curIconItems[i].transStr = trans2string(this._curIconItems[i].trans!);
    }

    // Update DOM
    for (let i = 0; i < this._morphNodes.length; i++) {
      const morphNode = this._morphNodes[i];
      morphNode.node.setAttribute("d", this._curIconItems[i].path);
      
      const attrs = this._curIconItems[i].attrs;
      for (const key in attrs) {
        morphNode.node.setAttribute(key, attrs[key as keyof StyleAttributes]!);
      }
      
      const style = this._curIconItems[i].style;
      for (const key in style) {
        (morphNode.node.style as any)[key] = style[key as keyof StyleAttributes];
      }
      
      morphNode.node.setAttribute("transform", this._curIconItems[i].transStr || '');
    }
  }

  private _animationEnd(): void {
    for (let i = this._morphNodes.length - 1; i >= 0; i--) {
      const morphNode = this._morphNodes[i];
      if (this._icons[this._toIconId].items[i]) {
        morphNode.node.setAttribute("d", this._icons[this._toIconId].items[i].path);
      } else {
        morphNode.node.parentNode?.removeChild(morphNode.node);
        this._morphNodes.splice(i, 1);
      }
    }

    this._curIconId = this._toIconId;
    this._toIconId = '';

    this._callback();
  }

  // Public methods

  // Morph To Icon
  public to(iconId: string, options?: SVGMorpheusOptions, callback?: CallbackFunction): void {
    if (iconId !== this._toIconId) {
      if (options && typeof options !== 'object') {
        throw new Error('SVGMorpheus.to() > "options" parameter must be an object');
      }
      options = options || {};

      if (callback && typeof callback !== 'function') {
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
  public registerEasing(name: string, fn: (t: number) => number): void {
    easings[name] = fn;
  }
}

// Default export for ESM
export default SVGMorpheus; 