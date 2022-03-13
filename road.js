class Road {
    constructor(x, width, lanes) {
        this.x = x;
        this.width = width;
        this.lanes = lanes;

        this.left = x - width * 0.5;
        this.right = x + width * 0.5;

        this.top = -1000000;
        this.bottom = 1000000;

        this.borders = [
            [{x: this.left, y: this.top}, {x: this.left, y: this.bottom}],
            [{x: this.right, y: this.top}, {x: this.right, y: this.bottom}]
        ];
    }

    laneCenter(laneId) {
        const laneWidth = this.width / this.lanes;
        const offset = this.left + laneWidth * 0.5;
        return offset + laneId * this.lanes;
    }

    draw(context) {
        context.lineWidth = 4;
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#101010";

        const tarmacOvershoot = 10;

        context.beginPath();
        context.rect(this.left - tarmacOvershoot, this.top,
            this.width + tarmacOvershoot * 2.0, this.bottom - this.top);
        context.fill();

        context.setLineDash([15, 20]);
        for (let i = 1; i < this.lanes; i++) {
            const x = lerp(this.left, this.right, i / this.lanes);
            context.beginPath();
            context.moveTo(x, this.top);
            context.lineTo(x, this.bottom);
            context.stroke();
        }

        context.lineWidth = 4;
        context.strokeStyle = "#A0A0A0";
        context.setLineDash([]);
        this.borders.forEach(border => {
            context.beginPath();
            context.moveTo(border[0].x, border[0].y);
            context.lineTo(border[1].x, border[1].y);
            context.stroke();
        })
    }
}