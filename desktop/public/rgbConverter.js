const RGBtoHEX = (r, g, b) => {
    if (typeof r === 'object') {
        g = r.g || r[1];
        b = r.b || r[2];
        r = r.r || r[0];
    }
    r = r || 0, g = g || 0, b = b || 0;
    if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
        throw new TypeError('Values for red, green and blue must be numbers.');
    }
    if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0) {
        throw new TypeError('Values for red, green and blue must be within 0-255.');
    }
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const HEXtoRGB = (hex) => {
    if (hex[0] === '#') {
        hex = hex.slice(1);
    }
    if (hex.length !== 3 && hex.length !== 6) {
        throw new TypeError('The hex value must be 3 or 6 characters long.');
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + '';
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
