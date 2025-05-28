// Request animation frame polyfills
export const reqAnimFrame = window.requestAnimationFrame || 
  (window as any).mozRequestAnimationFrame || 
  (window as any).webkitRequestAnimationFrame || 
  (window as any).oRequestAnimationFrame;

export const cancelAnimFrame = window.cancelAnimationFrame || 
  (window as any).mozCancelAnimationFrame || 
  (window as any).webkitCancelAnimationFrame || 
  (window as any).oCancelAnimationFrame;

// Calculate style
export function styleNormCalc(styleNormFrom: any, styleNormTo: any, progress: any): any {
  var i: any, styleNorm: any={};
  for(i in styleNormFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[i]=clone(styleNormFrom[i]);
        styleNorm[i].r=styleNormFrom[i].r+(styleNormTo[i].r-styleNormFrom[i].r)*progress;
        styleNorm[i].g=styleNormFrom[i].g+(styleNormTo[i].g-styleNormFrom[i].g)*progress;
        styleNorm[i].b=styleNormFrom[i].b+(styleNormTo[i].b-styleNormFrom[i].b)*progress;
        styleNorm[i].opacity=styleNormFrom[i].opacity+(styleNormTo[i].opacity-styleNormFrom[i].opacity)*progress;
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[i]=styleNormFrom[i]+(styleNormTo[i]-styleNormFrom[i])*progress;
        break;
    }
  }
  return styleNorm;
}

export function styleNormToString(styleNorm: any): any {
  var i: any;
  var style: any={};
  for(i in styleNorm) {
    switch (i) {
      case 'fill':
      case 'stroke':
        style[i]=rgbToString(styleNorm[i]);
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        style[i]=styleNorm[i];
        break;
    }
  }
  return style;
}

export function styleToNorm(styleFrom: any, styleTo: any): any {
  var styleNorm: any=[{},{}];
  var i: any;
  for(i in styleFrom) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[0][i]=getRGB(styleFrom[i]);
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=getRGB(styleFrom[i]);
          styleNorm[1][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[0][i]=styleFrom[i];
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=1;
        }
        break;
    }
  }
  for(i in styleTo) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[1][i]=getRGB(styleTo[i]);
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=getRGB(styleTo[i]);
          styleNorm[0][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[1][i]=styleTo[i];
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=1;
        }
        break;
    }
  }
  return styleNorm;
}

// Calculate transform progress
export function transCalc(transFrom: any, transTo: any, progress: any): any {
  var res: any={};
  for(var i in transFrom) {
    switch(i) {
      case 'rotate':
        res[i]=[0,0,0];
        for(var j=0;j<3;j++) {
          res[i][j]=transFrom[i][j]+(transTo[i][j]-transFrom[i][j])*progress;
        }
        break;
    }
  }
  return res;
}

export function trans2string(trans: any): any {
  var res='';
  if(!!trans.rotate) {
    res+='rotate('+trans.rotate.join(' ')+')';
  }
  return res;
}

// Calculate curve progress
export function curveCalc(curveFrom: any, curveTo: any, progress: any): any {
  var curve: any=[];
  for(var i=0,len1=curveFrom.length;i<len1;i++) {
    curve.push([curveFrom[i][0]]);
    for(var j=1,len2=curveFrom[i].length;j<len2;j++) {
      curve[i].push(curveFrom[i][j]+(curveTo[i][j]-curveFrom[i][j])*progress);
    }
  }
  return curve;
}

export function clone(obj: any): any {
  var copy: any;

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr]);
      }
    }
    return copy;
  }

  return obj;
}

// Helper functions for color conversion - from snapsvglite.js
const spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
const hsrg = {hs: 1, rg: 1};
const has = "hasOwnProperty";
const colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i;
const commaSpaces = new RegExp("[" + spaces + "]*,[" + spaces + "]*");

// Converts RGB values to a hex representation of the color
const rgbToString = function (rgb: any) {
  var round = Math.round;
  return "rgba(" + [round(rgb.r), round(rgb.g), round(rgb.b), +rgb.opacity.toFixed(2)] + ")";
};

const toHex = function (color: any) {
  var i = window.document.getElementsByTagName("head")[0] || window.document.getElementsByTagName("svg")[0],
      red = "rgb(255, 0, 0)";
  const toHexFunc = function (color: any) {
    if (color.toLowerCase() == "red") {
      return red;
    }
    i.style.color = red;
    i.style.color = color;
    var out = window.document.defaultView?.getComputedStyle(i, "").getPropertyValue("color");
    return out == red ? null : out;
  };
  return toHexFunc(color);
};

const packageRGB = function (r: any, g: any, b: any, o: any) {
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  var rgb = {
      r: r,
      g: g,
      b: b,
      opacity: isFinite(o) ? o : 1
  };
  return rgb;
};

// Converts HSB values to an RGB object
const hsb2rgb = function (h: any, s: any, v: any, o: any) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "b" in h) {
      v = h.b;
      s = h.s;
      h = h.h;
      o = h.o;
  }
  h *= 360;
  var R: any, G: any, B: any, X: any, C: any;
  h = (h % 360) / 60;
  C = v * s;
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = v - C;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Converts HSL values to an RGB object
const hsl2rgb = function (h: any, s: any, l: any, o: any) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "l" in h) {
    l = h.l;
    s = h.s;
    h = h.h;
  }
  if (h > 1 || s > 1 || l > 1) {
    h /= 360;
    s /= 100;
    l /= 100;
  }
  h *= 360;
  var R: any, G: any, B: any, X: any, C: any;
  h = (h % 360) / 60;
  C = 2 * s * (l < .5 ? l : 1 - l);
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = l - C / 2;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Parses color string as RGB object
const getRGB = function (colour: any) {
  if (!colour || !!((colour = String(colour)).indexOf("-") + 1)) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  if (colour == "none") {
    return {r: -1, g: -1, b: -1, opacity: -1};
  }
  !((hsrg as any)[(has as any)](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
  if (!colour) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  var red: any,
      green: any,
      blue: any,
      opacity: any,
      t: any,
      values: any,
      rgb = colour.match(colourRegExp);
  if (rgb) {
    if (rgb[2]) {
      blue = parseInt(rgb[2].substring(5), 16);
      green = parseInt(rgb[2].substring(3, 5), 16);
      red = parseInt(rgb[2].substring(1, 3), 16);
    }
    if (rgb[3]) {
      blue = parseInt((t = rgb[3].charAt(3)) + t, 16);
      green = parseInt((t = rgb[3].charAt(2)) + t, 16);
      red = parseInt((t = rgb[3].charAt(1)) + t, 16);
    }
    if (rgb[4]) {
      values = rgb[4].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red *= 2.55);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green *= 2.55);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue *= 2.55);
      rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
    }
    if (rgb[5]) {
      values = rgb[5].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsb2rgb(red, green, blue, opacity);
    }
    if (rgb[6]) {
      values = rgb[6].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsl2rgb(red, green, blue, opacity);
    }
    red = Math.min(Math.round(red), 255);
    green = Math.min(Math.round(green), 255);
    blue = Math.min(Math.round(blue), 255);
    opacity = Math.min(Math.max(opacity, 0), 1);
    rgb = {r: red, g: green, b: blue};
    rgb.opacity = isFinite(opacity) ? opacity : 1;
    return rgb;
  }
  return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
}; 