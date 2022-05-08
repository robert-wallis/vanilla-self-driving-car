// LCH color space to RGB color space
// LCH preserves luminosity when the hue changes, unlike HSV
// But the CSS lch() function is only available in Safari, not Chrome
// Copyright (C) 2022 Robert A. Wallis

const CIE_kappa = 903.296296296296;
const D65_U = 0.197830006642837;
const D65_V = 0.468319994938791;
const D65_XYZ_sRGB_M = [
	[3.2409699419045214, -1.5373831775700935, -0.4986107602930032],
	[-0.9692436362808798, 1.8759675015077207, 0.0415550574071756],
	[0.0556300796969936, -0.2039769588889766, 1.0569715142428786],
];

function LCHToRGB(lch) {
	return XYZToRGB(LUVToXYZ(LCHToLUV(lch)));
}

function LCHToLUV([l, c, h]) {
	const hRadians = h / 180.0 * Math.PI;
	const U = Math.cos(hRadians) * c;
	const V = Math.sin(hRadians) * c;
	return [l, U, V];
}

function LUVToXYZ([l, u, v]) {
	if (l == 0) {
		return [0, 0, 0];
	}
	const u2 = u / (13.0 * l) + D65_U;
	const v2 = v / (13.0 * l) + D65_V;

	const Y = l <= 8.0 ? l / CIE_kappa : Math.pow((l + 16.0) / 116.0, 3);
	const X = 0.0 - (9.0 * Y * u2) / ((u2 - 4.0) * v2 - u2 * v2);
	const Z = (9.0 * Y - (15.0 * v2 * Y) - (v2 * X)) / (3.0 * v2);
	return [X, Y, Z];
}

function XYZToRGB(xyz) {
	const R = fromLinear(dotProduct(D65_XYZ_sRGB_M[0], xyz));
	const G = fromLinear(dotProduct(D65_XYZ_sRGB_M[1], xyz));
	const B = fromLinear(dotProduct(D65_XYZ_sRGB_M[2], xyz));
	return [R, G, B];
}

function dotProduct(a, b) {
	let sum = 0.0;
	for (let i = 0; i < a.length && i < b.length; i++) {
		sum += a[i] * b[i];
	}
	return sum;
}

function fromLinear(c) {
	return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
