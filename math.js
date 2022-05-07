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
    return { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), offset: t }
}

function polysIntersect(P1, P2) {
    for (let i = 0; i < P1.length; i++) {
        for (let j = 0; j < P2.length; j++) {
            const hit = intersect(
                P1[i],
                P1[(i + 1) % P1.length],
                P2[j],
                P2[(j + 1) % P2.length]
            );
            if (hit) {
                return true;
            }
        }
    }
    return false;
}