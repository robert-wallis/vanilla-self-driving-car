class Car {
    constructor(x, y, scale, imageFilename, controls) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.controls = controls;

        this.image = new Image();
        this.image.src = imageFilename;
        this.corners = [];

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 9;
        this.minSpeed = -this.maxSpeed * 0.5;
        this.friction = 0.05;
        this.angle = 0;
        this.gear = "N";
        this.damaged = false;
    }

    update(roadBorders) {
        this.#updateInput();
        this.#updatePhysics();
        this.corners = this.#findCorners();
        this.#updateCollision(roadBorders);
        this.#updateImageState();
        console.hud(this);
        console.hud(this.controls);
    }

    draw(ctx) {
        ctx.save();

        const width = this.image.width * this.scale;
        const height = this.image.height * this.scale;

        if (this.damaged) {
            ctx.fillStyle = "#571414";
            ctx.beginPath();
            ctx.moveTo(this.corners[0].x, this.corners[0].y);
            for (let i = 1; i < this.corners.length; i++) {
                ctx.lineTo(this.corners[i].x, this.corners[i].y);
            }
            ctx.fill();
        }

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -width * 0.5, -height * 0.5, width, height);

        ctx.restore();
    }

    #updateInput() {
        // input
        if (this.controls.gas) {
            this.speed += this.acceleration;
        }
        if (this.controls.brake) {
            this.speed -= this.acceleration;
        }
    }

    #updatePhysics() {
        if (this.damaged) {
            this.speed = 0;
            return;
        }
        // physics bounds checking
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.gear === "D") {
            if (this.speed < 0) {
                this.speed = 0;
            } else if (this.speed === 0) {
                this.gear = "N";
            }
        } else if (this.gear === "R") {
            if (this.speed < this.minSpeed) {
                this.speed = this.minSpeed;
            } else if (this.speed > 0) {
                this.speed = 0;
            } else if (this.speed === 0) {
                this.gear = "N";
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
            let newAngle = null;
            if (this.controls.right) {
                newAngle = this.angle + angleDelta;
            }
            if (this.controls.left) {
                newAngle = this.angle - angleDelta;
            }
            if (newAngle) {
                this.angle = newAngle % (Math.PI * 2);
            }
        }

        // position update
        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed; // y starts at top so subtract
    }

    #updateCollision(roadBorders) {
        let damaged = false;
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.corners, roadBorders[i])) {
                damaged = true;
                break;
            }
        }
        this.damaged = damaged;
    }

    #updateImageState() {
        let src = "van.png";
        if (this.gear === "D") {
            if (this.controls.brake) {
                src = "van_D_brake.png";
            }
        } else if (this.gear === "R") {
            src = "van_R_brake.png";
        }
        if (this.image.src !== src) {
            this.image.src = src;
        }
    }

    #findCorners() {
        const corners = [];
        const radius = Math.hypot(this.image.width, this.image.height) * 0.5;
        const a = Math.atan2(this.image.width, this.image.height);
        const rs = radius * this.scale * 0.9;
        corners.push({
            x: this.x + Math.sin(-this.angle + a) * rs,
            y: this.y + Math.cos(-this.angle + a) * rs
        });
        corners.push({
            x: this.x + Math.sin(-this.angle - a) * rs,
            y: this.y + Math.cos(-this.angle - a) * rs
        });
        corners.push({
            x: this.x + Math.sin(-this.angle + a + Math.PI) * rs,
            y: this.y + Math.cos(-this.angle + a + Math.PI) * rs
        });
        corners.push({
            x: this.x + Math.sin(-this.angle - a - Math.PI) * rs,
            y: this.y + Math.cos(-this.angle - a - Math.PI) * rs
        });
        return corners;
    }
}