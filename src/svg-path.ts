// Path parsing and conversion utilities from snapsvglite.js

const spaces = '\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029';
const pathCommand = new RegExp('([a-z])[' + spaces + ',]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[' + spaces + ']*,?[' + spaces + ']*)+)', 'ig');
const pathValues = new RegExp('(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[' + spaces + ']*,?[' + spaces + ']*', 'ig');

// Parses given path string into an array of arrays of path segments
export function parsePathString(pathString: any): any {
    if (!pathString) { return null; }

    if (Array.isArray(pathString)) {
        return pathString;
    } else {
        const paramCounts: any = { a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0 };
        const data: any = [];

        String(pathString).replace(pathCommand, function (_, b, c) {
            const params: any = [];
            let name = b.toLowerCase();
            c.replace(pathValues, function (_: string, b: string) {
                if (b) params.push(+b);
                return '';
            });
            if (name === 'm' && params.length > 2) {
                data.push([b.charCodeAt(0)].concat(params.splice(0, 2)));
                name = 'l';
                b = b === 'm' ? 'l' : 'L';
            }
            if (name === 'o' && params.length === 1) {
                data.push([b.charCodeAt(0), params[0]]);
            }
            if (name === 'r') {
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
export function pathToAbsolute(pathArray: any): any {
    const parsed = parsePathString(pathArray);

    if (!parsed || !parsed.length) { return [['M', 0, 0]]; } // "M", 0, 0

    const res: any = [];
    let x = 0, y = 0, mx = 0, my = 0;
    let start = 0;

    if (parsed[0][0] === 'M'.charCodeAt(0)) { // "M"
        x = +parsed[0][1];
        y = +parsed[0][2];
        mx = x;
        my = y;
        start++;
        res[0] = ['M', x, y]; // "M"
    }

    for (let i = start, ii = parsed.length; i < ii; i++) {
        const r: any = [];
        const pa = parsed[i];
        const pa0 = pa[0];
        const cmd = String.fromCharCode(pa0);

        if (cmd !== cmd.toUpperCase()) { // relative command (lowercase)
            r[0] = cmd.toUpperCase(); // convert to uppercase
            switch (r[0]) {
            case 'A':
                r[1] = pa[1];
                r[2] = pa[2];
                r[3] = pa[3];
                r[4] = pa[4];
                r[5] = pa[5];
                r[6] = +pa[6] + x;
                r[7] = +pa[7] + y;
                break;
            case 'V':
                r[1] = +pa[1] + y;
                break;
            case 'H':
                r[1] = +pa[1] + x;
                break;
            case 'M':
                mx = +pa[1] + x;
                my = +pa[2] + y;
                // Intentional fallthrough to default case
                 
            default:
                for (let j = 1, jj = pa.length; j < jj; j++) {
                    r[j] = +pa[j] + ((j % 2) ? x : y);
                }
                break;
            }
        } else {
            r[0] = cmd;
            for (let k = 1, kk = pa.length; k < kk; k++) {
                r[k] = pa[k];
            }
        }

        switch (r[0]) {
        case 'Z':
            x = mx;
            y = my;
            break;
        case 'H':
            x = r[1];
            break;
        case 'V':
            y = r[1];
            break;
        case 'M':
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

// Convert path to curves (cubic bezier) - from snapsvglite.js
export function path2curve(path: any, path2?: any): any {
    const p = pathToAbsolute(path);
    const p2 = path2 && pathToAbsolute(path2);
    const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
    const attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
    const processPath = function (path: any, d: any, pcom: any) {
        let nx: any, ny: any;
        if (!path) {
            return ['C', d.x, d.y, d.x, d.y, d.x, d.y];
        }
        !(path[0] in { T: 1, Q: 1 }) && (d.qx = d.qy = null);
        switch (path[0]) {
        case 'M':
            d.X = path[1];
            d.Y = path[2];
            break;
        case 'A':
            path = ['C'].concat((a2c as any).apply(0, [d.x, d.y].concat(path.slice(1))));
            break;
        case 'S':
            if (pcom == 'C' || pcom == 'S') { // In "S" case we have to take into account, if the previous command is C/S.
                nx = d.x * 2 - d.bx;          // And reflect the previous
                ny = d.y * 2 - d.by;          // command's control point relative to the current point.
            }
            else {                            // or some else or nothing
                nx = d.x;
                ny = d.y;
            }
            path = ['C', nx, ny].concat(path.slice(1));
            break;
        case 'T':
            if (pcom == 'Q' || pcom == 'T') { // In "T" case we have to take into account, if the previous command is Q/T.
                d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                d.qy = d.y * 2 - d.qy;        // to case "S".
            }
            else {                            // or something else or nothing
                d.qx = d.x;
                d.qy = d.y;
            }
            path = ['C'].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
            break;
        case 'Q':
            d.qx = path[1];
            d.qy = path[2];
            path = ['C'].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
            break;
        case 'L':
            path = ['C'].concat(l2c(d.x, d.y, path[1], path[2]));
            break;
        case 'H':
            path = ['C'].concat(l2c(d.x, d.y, path[1], d.y));
            break;
        case 'V':
            path = ['C'].concat(l2c(d.x, d.y, d.x, path[1]));
            break;
        case 'Z':
            path = ['C'].concat(l2c(d.x, d.y, d.X, d.Y));
            break;
        }
        return path;
    };
    const fixArc = function (pp: any, i: any) {
        if (pp[i].length > 7) {
            pp[i].shift();
            const pi = pp[i];
            while (pi.length) {
                pcoms1[i] = 'A'; // if created multiple C:s, their original seg is saved
                p2 && (pcoms2[i] = 'A'); // the same as above
                pp.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
            }
            pp.splice(i, 1);
        }
    };
    const fixM = function (path1: any, path2: any, a1: any, a2: any, i: any) {
        if (path1 && path2 && path1[i][0] == 'M' && path2[i][0] != 'M') {
            path2.splice(i, 0, ['M', a2.x, a2.y]);
            a1.bx = 0;
            a1.by = 0;
            a1.x = path1[i][1];
            a1.y = path1[i][2];
        }
    };
    const pcoms1: any = []; // path commands of original path p
    const pcoms2: any = []; // path commands of original path p2
    let pfirst = ''; // temporary holder for original path command
    let pcom = ''; // holder for previous path command of original path
    for (let i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
        p[i] && (pfirst = p[i][0]); // save current path command

        if (pfirst != 'C') { // C is not saved yet, because it may be result of conversion
            pcoms1[i] = pfirst; // Save current path command
            i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
        }
        p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

        if (pcoms1[i] != 'A' && pfirst == 'C') pcoms1[i] = 'C'; // A is the only command
        // which may produce multiple C:s
        // so we have to make sure that C is also C in original path

        fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

        if (p2) { // the same procedures is done to p2
            p2[i] && (pfirst = p2[i][0]);
            if (pfirst != 'C') {
                pcoms2[i] = pfirst;
                i && (pcom = pcoms2[i - 1]);
            }
            p2[i] = processPath(p2[i], attrs2, pcom);

            if (pcoms2[i] != 'A' && pfirst == 'C') { pcoms2[i] = 'C'; }

            fixArc(p2, i);
        }
        fixM(p, p2, attrs, attrs2, i);
        fixM(p2, p, attrs2, attrs, i);
        const seg = p[i];
        const seg2 = p2 && p2[i];
        const seglen = seg.length;
        const seg2len = p2 && seg2.length;
        attrs.x = seg[seglen - 2];
        attrs.y = seg[seglen - 1];
        attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
        attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
        attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
        attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
        attrs2.x = p2 && seg2[seg2len - 2];
        attrs2.y = p2 && seg2[seg2len - 1];
    }

    return p2 ? [p, p2] : p;
}

// Helper functions for path conversion
function l2c(x1: any, y1: any, x2: any, y2: any) {
    return [x1, y1, x2, y2, x2, y2];
}

function q2c(x1: any, y1: any, ax: any, ay: any, x2: any, y2: any) {
    var _13 = 1 / 3,
        _23 = 2 / 3;
    return [
        _13 * x1 + _23 * ax,
        _13 * y1 + _23 * ay,
        _13 * x2 + _23 * ax,
        _13 * y2 + _23 * ay,
        x2,
        y2
    ];
}

function a2c(x1: any, y1: any, rx: any, ry: any, angle: any, large_arc_flag: any, sweep_flag: any, x2: any, y2: any, recursive?: any) {
    // for more information of where this math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (+angle || 0),
        res: any = [],
        xy: any,
        rotate = function (x: any, y: any, rad: any) {
            return { x: x * Math.cos(rad) - y * Math.sin(rad), y: x * Math.sin(rad) + y * Math.cos(rad) };
        };
    if (!recursive) {
        xy = rotate(x1, y1, -rad);
        x1 = xy.x;
        y1 = xy.y;
        xy = rotate(x2, y2, -rad);
        x2 = xy.x;
        y2 = xy.y;
        var x = (x1 - x2) / 2,
            y = (y1 - y2) / 2;
        var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
        if (h > 1) {
            h = Math.sqrt(h);
            rx = h * rx;
            ry = h * ry;
        }
        var rx2 = rx * rx,
            ry2 = ry * ry,
            k = (large_arc_flag == sweep_flag ? -1 : 1) *
                Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
            cx = k * rx * y / ry + (x1 + x2) / 2,
            cy = k * -ry * x / rx + (y1 + y2) / 2,
            f1 = Math.asin(+((y1 - cy) / ry).toFixed(9)),
            f2 = Math.asin(+((y2 - cy) / ry).toFixed(9));

        f1 = x1 < cx ? Math.PI - f1 : f1;
        f2 = x2 < cx ? Math.PI - f2 : f2;
        f1 < 0 && (f1 = Math.PI * 2 + f1);
        f2 < 0 && (f2 = Math.PI * 2 + f2);
        if (sweep_flag && f1 > f2) { f1 = f1 - Math.PI * 2; }
        if (!sweep_flag && f2 > f1) { f2 = f2 - Math.PI * 2; }
    } else {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
        var f2old = f2,
            x2old = x2,
            y2old = y2;
        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
        x2 = cx + rx * Math.cos(f2);
        y2 = cy + ry * Math.sin(f2);
        res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
        return [m2, m3, m4].concat(res);
    } else {
        res = [m2, m3, m4].concat(res).join().split(',');
        var newres = [];
        for (var i = 0, ii = res.length; i < ii; i++) {
            newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
        }
        return newres;
    }
}

// Convert curve back to path string
const p2s = /,?([a-z]),?/gi;
export function path2string(path: any): any {
    return path.join(',').replace(p2s, '$1');
}

// Calculate bounding box of a curve path
export function curvePathBBox(path: any): any {
    // 如果路径为空或无效，返回默认边界框
    if (!path || !Array.isArray(path) || path.length === 0) { return box(0, 0, 0, 0); }

    let x = 0;
    let y = 0;
    const X: number[] = [];
    const Y: number[] = [];
    let p: any;

    for (let i = 0, ii = path.length; i < ii; i++) {
        p = path[i];
        if (p[0] == 'M') {
            x = isFinite(p[1]) ? p[1] : 0;
            y = isFinite(p[2]) ? p[2] : 0;
            X.push(x);
            Y.push(y);
        } else {
            const x0 = x, y0 = y;
            const x1 = isFinite(p[1]) ? p[1] : 0;
            const y1 = isFinite(p[2]) ? p[2] : 0;
            const x2 = isFinite(p[3]) ? p[3] : 0;
            const y2 = isFinite(p[4]) ? p[4] : 0;
            const x3 = isFinite(p[5]) ? p[5] : 0;
            const y3 = isFinite(p[6]) ? p[6] : 0;

            const dim = curveDim(x0, y0, x1, y1, x2, y2, x3, y3);
            if (isFinite(dim.min.x) && isFinite(dim.max.x) && isFinite(dim.min.y) && isFinite(dim.max.y)) {
                X.push(dim.min.x, dim.max.x);
                Y.push(dim.min.y, dim.max.y);
            }
            x = x3;
            y = y3;
        }
    }

    // 确保有有效的边界值
    if (X.length === 0 || Y.length === 0) { return box(0, 0, 0, 0); }

    const xmin = Math.min(...X);
    const ymin = Math.min(...Y);
    const xmax = Math.max(...X);
    const ymax = Math.max(...Y);

    // 验证计算结果
    if (!isFinite(xmin) || !isFinite(ymin) || !isFinite(xmax) || !isFinite(ymax)) {
        return box(0, 0, 0, 0);
    }

    return box(xmin, ymin, xmax - xmin, ymax - ymin);
}

function box(x: number, y: number, width: number, height: number) {
    // 确保所有值都是有效数字
    x = isFinite(x) ? x : 0;
    y = isFinite(y) ? y : 0;
    width = isFinite(width) ? width : 0;
    height = isFinite(height) ? height : 0;

    return {
        x: x,
        y: y,
        w: width,
        h: height,
        cx: x + width / 2,
        cy: y + height / 2
    };
}

// Returns bounding box of cubic bezier curve.
function curveDim(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, x3: any, y3: any) {
    var tvalues: any = [],
        bounds: any = [[], []],
        a: any, b: any, c: any, t: any, t1: any, t2: any, b2ac: any, sqrtb2ac: any;
    for (var i = 0; i < 2; ++i) {
        if (i == 0) {
            b = 6 * x0 - 12 * x1 + 6 * x2;
            a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
            c = 3 * x1 - 3 * x0;
        } else {
            b = 6 * y0 - 12 * y1 + 6 * y2;
            a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
            c = 3 * y1 - 3 * y0;
        }
        if (Math.abs(a) < 1e-12) {
            if (Math.abs(b) < 1e-12) { continue; }
            t = -c / b;
            if (0 < t && t < 1) { tvalues.push(t); }
            continue;
        }
        b2ac = b * b - 4 * c * a;
        sqrtb2ac = Math.sqrt(b2ac);
        if (b2ac < 0) { continue; }
        t1 = (-b + sqrtb2ac) / (2 * a);
        if (0 < t1 && t1 < 1) { tvalues.push(t1); }
        t2 = (-b - sqrtb2ac) / (2 * a);
        if (0 < t2 && t2 < 1) { tvalues.push(t2); }
    }

    var j = tvalues.length,
        jlen = j,
        mt: any;
    while (j--) {
        t = tvalues[j];
        mt = 1 - t;
        bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
        bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
    }

    bounds[0][jlen] = x0;
    bounds[1][jlen] = y0;
    bounds[0][jlen + 1] = x3;
    bounds[1][jlen + 1] = y3;
    bounds[0].length = bounds[1].length = jlen + 2;

    return {
        min: { x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1]) },
        max: { x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1]) }
    };
}
