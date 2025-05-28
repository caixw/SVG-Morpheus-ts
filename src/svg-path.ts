import type { BoundingBox } from './types.js';

// Path parsing and conversion utilities

const spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
const pathCommand = new RegExp("([a-z])[" + spaces + ",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[" + spaces + "]*,?[" + spaces + "]*)+)", "ig");
const pathValues = new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[" + spaces + "]*,?[" + spaces + "]*", "ig");

// Parses given path string into an array of arrays of path segments
export function parsePathString(pathString: string | number[][]): number[][] | null {
  if (!pathString) {
    return null;
  }

  if (Array.isArray(pathString)) {
    return pathString;
  } else {
    const paramCounts: Record<string, number> = {
      a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0
    };
    const data: number[][] = [];

    String(pathString).replace(pathCommand, function (_, b, c) {
      const params: number[] = [];
      let name = b.toLowerCase();
      c.replace(pathValues, function (_: string, b: string) {
        if (b) params.push(+b);
        return '';
      });
      if (name === "m" && params.length > 2) {
        data.push([b.charCodeAt(0)].concat(params.splice(0, 2)));
        name = "l";
        b = b === "m" ? "l" : "L";
      }
      if (name === "o" && params.length === 1) {
        data.push([b.charCodeAt(0), params[0]]);
      }
      if (name === "r") {
        data.push([b.charCodeAt(0)].concat(params));
      } else {
        while (params.length >= paramCounts[name]) {
          data.push([b.charCodeAt(0)].concat(params.splice(0, paramCounts[name])));
          if (!paramCounts[name]) {
            break;
          }
        }
      }
      return '';
    });

    return data;
  }
}

// Convert path to absolute coordinates
export function pathToAbsolute(pathArray: string | number[][]): number[][] {
  const parsed = parsePathString(pathArray);
  
  if (!parsed || !parsed.length) {
    return [[77, 0, 0]]; // "M", 0, 0
  }
  
  const res: number[][] = [];
  let x = 0, y = 0, mx = 0, my = 0;
  let start = 0;
  
  if (parsed[0][0] === 77) { // "M"
    x = +parsed[0][1];
    y = +parsed[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = [77, x, y]; // "M"
  }
  
  for (let i = start, ii = parsed.length; i < ii; i++) {
    const r: number[] = [];
    const pa = parsed[i];
    const pa0 = pa[0];
    
    if (pa0 !== pa0) { // relative command (lowercase)
      r[0] = pa0; // convert to uppercase equivalent
      switch (r[0]) {
        case 65: // "A"
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case 86: // "V"
          r[1] = +pa[1] + y;
          break;
        case 72: // "H"
          r[1] = +pa[1] + x;
          break;
        case 77: // "M"
          mx = +pa[1] + x;
          my = +pa[2] + y;
          // Intentional fallthrough to default case
          // eslint-disable-next-line no-fallthrough
        default:
          for (let j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] + ((j % 2) ? x : y);
          }
          break;
      }
    } else {
      for (let k = 0, kk = pa.length; k < kk; k++) {
        r[k] = pa[k];
      }
    }
    
    switch (r[0]) {
      case 90: // "Z"
        x = mx;
        y = my;
        break;
      case 72: // "H"
        x = r[1];
        break;
      case 86: // "V"
        y = r[1];
        break;
      case 77: // "M"
        mx = r[1];
        my = r[2];
        x = r[1];
        y = r[2];
        break;
      default:
        x = r[r.length - 2];
        y = r[r.length - 1];
    }
    res.push(r);
  }
  
  return res;
}

// Convert path to curves (cubic bezier)
export function path2curve(path: string, path2?: string): [number[][], number[][]] {
  const p = pathToAbsolute(path);
  const p2 = path2 ? pathToAbsolute(path2) : null;
  const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: 0, qy: 0 };
  const attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: 0, qy: 0 };
  
  const pcoms1: number[][] = [];
  const pcoms2: number[][] = [];
  
  function processPath(path: number[][], attrs: any, pcoms: number[][]) {
    for (let i = 0, ii = path.length; i < ii; i++) {
      const seg = path[i];
      const cmd = seg[0];
      
      switch (cmd) {
        case 77: // "M"
          attrs.X = attrs.x = seg[1];
          attrs.Y = attrs.y = seg[2];
          pcoms.push([67, seg[1], seg[2], seg[1], seg[2], seg[1], seg[2]]); // "C"
          break;
        case 76: // "L"
          pcoms.push([67, attrs.x, attrs.y, seg[1], seg[2], seg[1], seg[2]]); // "C"
          attrs.x = seg[1];
          attrs.y = seg[2];
          break;
        case 67: // "C"
          pcoms.push([67, seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]]);
          attrs.x = seg[5];
          attrs.y = seg[6];
          attrs.bx = seg[3];
          attrs.by = seg[4];
          break;
        case 81: // "Q"
          const qx = attrs.x + 2 / 3 * (seg[1] - attrs.x);
          const qy = attrs.y + 2 / 3 * (seg[2] - attrs.y);
          pcoms.push([67, 
            qx, 
            qy, 
            seg[3] + 2 / 3 * (seg[1] - seg[3]), 
            seg[4] + 2 / 3 * (seg[2] - seg[4]), 
            seg[3], 
            seg[4]
          ]);
          attrs.x = seg[3];
          attrs.y = seg[4];
          attrs.qx = seg[1];
          attrs.qy = seg[2];
          break;
        case 90: // "Z"
          pcoms.push([67, attrs.x, attrs.y, attrs.X, attrs.Y, attrs.X, attrs.Y]);
          attrs.x = attrs.X;
          attrs.y = attrs.Y;
          break;
        default:
          // Default to line
          pcoms.push([67, attrs.x, attrs.y, seg[seg.length - 2], seg[seg.length - 1], seg[seg.length - 2], seg[seg.length - 1]]);
          attrs.x = seg[seg.length - 2];
          attrs.y = seg[seg.length - 1];
      }
    }
  }
  
  processPath(p, attrs, pcoms1);
  if (p2) {
    processPath(p2, attrs2, pcoms2);
  } else {
    pcoms2.push(...pcoms1);
  }
  
  // Equalize path lengths
  while (pcoms1.length < pcoms2.length) {
    const last = pcoms1[pcoms1.length - 1];
    pcoms1.push([67, last[5], last[6], last[5], last[6], last[5], last[6]]);
  }
  while (pcoms2.length < pcoms1.length) {
    const last = pcoms2[pcoms2.length - 1];
    pcoms2.push([67, last[5], last[6], last[5], last[6], last[5], last[6]]);
  }
  
  return [pcoms1, pcoms2];
}

// Convert curve back to path string
export function path2string(curve: number[][]): string {
  let result = '';
  for (let i = 0; i < curve.length; i++) {
    const seg = curve[i];
    if (i === 0) {
      result += `M${seg[1]},${seg[2]}`;
    } else {
      result += `C${seg[1]},${seg[2]} ${seg[3]},${seg[4]} ${seg[5]},${seg[6]}`;
    }
  }
  return result;
}

// Calculate bounding box of a curve path
export function curvePathBBox(curve: number[][]): BoundingBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  for (const seg of curve) {
    for (let i = 1; i < seg.length; i += 2) {
      const x = seg[i];
      const y = seg[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  return {
    x: minX,
    y: minY,
    width,
    height,
    cx: minX + width / 2,
    cy: minY + height / 2
  };
} 