class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;
        this.rays = [];
        this.readings = [];
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            const reading = this.#getReading(this.rays[i], roadBorders);
            this.readings.push(reading);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#c0a00c";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000000";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
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

        const start = {x: this.car.x, y: this.car.y};
        const end = {
            x: this.car.x + Math.sin(rayAngle) * this.rayLength,
            y: this.car.y - Math.cos(rayAngle) * this.rayLength
        };

        return [start, end];
    }

    #getReading(ray, roadBorders) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = intersect(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if (touch) {
                touches.push(touch);
            }
        }

        if (touches.length === 0) {
            return null;
        }
        const offsets = touches.map(t=>t.offset);
        const minOffset = Math.min(...offsets);
        return touches.find(t => t.offset === minOffset);
    }
}