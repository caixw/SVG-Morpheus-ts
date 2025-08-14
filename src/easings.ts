// Easing functions collection - from easings.js

const asin1 = Math.asin(1);
const pi2 = Math.PI * 2;

export const easings = {
    ['circ-in']: (t: number) => -1 * (Math.sqrt(1 - t * t) - 1),
    ['circ-out']: (t: number) => Math.sqrt(1 - (t = t - 1) * t),
    ['circ-in-out']: (t: number) => {
        if ((t /= .5) < 1) { return -.5 * (Math.sqrt(1 - t * t) - 1); }
        return .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    ['cubic-in']: (t: number) => t * t * t,
    ['cubic-out']: (t: number) => (--t) * t * t + 1,
    ['cubic-in-out']: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    ['elastic-in']: (t: number) => {
        if (t == 0) { return 0; }
        if (t == 1) { return 1; }

        const p = .3;
        const s = p / pi2 * asin1;
        return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / p));
    },
    ['elastic-out']: (t: number) => {
        if (t == 0) { return 0; }
        if (t == 1) { return 1; }

        const p = .3;
        const s = p / pi2 * asin1;
        return Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / p) + 1;
    },
    ['elastic-in-out']: (t: number) => {
        if (t == 0) { return 0; }
        if ((t /= .5) == 2) { return 1; }

        const p = .45;
        const s = p / pi2 * asin1;
        if (t < 1) { return -.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / p)); }
        return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / p) * .5 + 1;
    },
    ['expo-in']: (t: number) => (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)),
    ['expo-out']: (t: number) => (t == 1) ? 1 : 1 - Math.pow(2, -10 * t),
    ['expo-in-out']: (t: number) => {
        if (t == 0) { return 0; }
        if (t == 1) { return 1; }
        if ((t /= .5) < 1) { return .5 * Math.pow(2, 10 * (t - 1)); }
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    },
    ['linear']: (t: number) => t,
    ['quad-in']: (t: number) => t * t,
    ['quad-out']: (t: number) => t * (2 - t),
    ['quad-in-out']: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    ['quart-in']: (t: number) => t * t * t * t,
    ['quart-out']: (t: number) => 1 - (--t) * t * t * t,
    ['quart-in-out']: (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    ['quint-in']: (t: number) => t * t * t * t * t,
    ['quint-out']: (t: number) => 1 + (--t) * t * t * t * t,
    ['quint-in-out']: (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    ['sine-in']: (t: number) => 1 - Math.cos(t * (Math.PI / 2)),
    ['sine-out']: (t: number) => Math.sin(t * (Math.PI / 2)),
    ['sine-in-out']: (t: number) => .5 * (1 - Math.cos(Math.PI * t)),
};
