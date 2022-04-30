function lerp(a, b, t) {
    return a + (b - a) * t;
}

function intersect(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom === 0) {
        return null;
    }

    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t < 0 || t > 1 || u < 0 || u > 1) {
        return null;
    }
    return {x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), offset: t}
}