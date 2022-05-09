class Sensor {
    constructor(car, rayCount, raySpread) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = 300;
        this.raySpread = raySpread;
        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, cars) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.#getReading(this.rays[i], roadBorders, cars);
            this.readings.push(reading);
        }
    }

    draw(ctx) {
        for (let r = 0; r < this.rays.length; r++) {
            const ray = this.rays[r];

            let start = ray[0];
            let end = ray[1];
            if (this.readings[r]) {
                end = this.readings[r];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#c0a00c80";
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ff000080";
            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const ray = this.#castRay(i);
            this.rays.push(ray);
        }
    }

    #castRay(rayNumber) {
        const t = this.rayCount === 1 ? 0.5 : rayNumber / (this.rayCount - 1);
        const l = this.raySpread / 2;
        const rayAngle = lerp(-l, l, t) + this.car.angle;

        const start = { x: this.car.x, y: this.car.y };
        const end = {
            x: this.car.x + Math.sin(rayAngle) * this.rayLength,
            y: this.car.y + Math.cos(rayAngle) * this.rayLength
        };

        return [start, end];
    }

    #getReading(ray, roadBorders, cars) {
        let hits = [];

        for (const border of roadBorders) {
            const touch = intersect(ray[0], ray[1], border[0], border[1]);
            if (touch) {
                hits.push(touch);
            }
        }
        for (const car of cars) {
            if (car === this.car)
                continue;
            const polygon = car.corners;
            for (let v = 0; v < polygon.length; v++) {
                const touch = intersect(
                    ray[0],
                    ray[1],
                    polygon[v],
                    polygon[(v + 1) % polygon.length],
                );
                if (touch) {
                    hits.push(touch);
                }
            }
        }

        if (hits.length === 0) {
            return null;
        }
        const offsets = hits.map(h => h.offset);
        const minOffset = Math.min(...offsets);
        return hits.find(h => h.offset === minOffset);
    }
}