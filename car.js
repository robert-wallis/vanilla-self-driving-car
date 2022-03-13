class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.minSpeed = -this.maxSpeed * 0.5;
        this.friction = 0.05;
        this.angle = 0;

        this.gear = "N";

        this.controls = new HumanControls();
    }

    update() {
        // input
        if (this.controls.gas) {
            this.speed += this.acceleration;
        }
        if (this.controls.brake) {
            this.speed -= this.acceleration;
        }

        // physics bounds checking
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.gear === "D") {
            if (this.speed < 0) {
                this.speed = 0;
            } else if (this.speed === 0) {
                this.gear = null;
            }
        } else if (this.gear === "R") {
            if (this.speed < this.minSpeed) {
                this.speed = this.minSpeed;
            } else if (this.speed > 0) {
                this.speed = 0;
            } else if (this.speed === 0) {
                this.gear = null;
            }
        } else { // neutral gear
            if (this.speed > 0) {
                this.gear = "D";
            } else if (this.speed < 0) {
                this.gear = "R";
            }
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // rotation update
        if (this.speed !== 0) {
            const angleDelta = this.speed > 0 ? 0.03 : -0.03;
            if (this.controls.right) {
                this.angle += angleDelta;
            }
            if (this.controls.left) {
                this.angle -= angleDelta;
            }
        }

        // position update
        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed; // y starts at top so subtract
        console.hud(this);
        console.hud(this.controls);
    }

    draw(context) {
        context.save();
        context.fillStyle="#FFFFFF";
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        context.beginPath();
        context.rect(-this.width/2, -this.height/2, this.width, this.height);
        context.fill();

        context.restore();
    }
}