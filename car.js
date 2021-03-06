class Car {
    constructor({ x, y, scale, imageFilename, maxSpeed = 9, initialSpeed = 9 }) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.image = new Image();
        this.image.src = imageFilename;
        this.corners = [];

        this.speed = initialSpeed;
        this.turnSpeed = 0.03;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.minSpeed = -this.maxSpeed * 0.5;
        this.friction = 0.05;
        this.angle = Math.PI;
        this.gear = "N";
        this.damaged = false;
    }

    update(controls, roadBorders, cars) {
        this.#updateInput(controls);
        this.#updatePhysics(controls);
        this.corners = this.#findCorners();
        this.#updateCollision(roadBorders, cars);
        this.#updateImageState(controls);
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
        ctx.rotate(-this.angle);
        ctx.drawImage(this.image, -width * 0.5, -height * 0.5, width, height);

        ctx.restore();
    }

    #updateInput(controls) {
        // input
        if (controls.gas) {
            this.speed += this.acceleration;
        }
        if (controls.brake) {
            this.speed -= this.acceleration;
        }
    }

    #updatePhysics(controls) {
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

        if (this.speed > 0) {
            this.speed -= this.friction;
        } else if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // rotation update
        if (this.speed !== 0) {
            const reversing = this.speed > 0 ? 1.0 : -1.0;
            const turnDelta = this.turnSpeed * reversing;
            let newAngle = 0;
            if (controls.right) {
                newAngle -= turnDelta;
            }
            if (controls.left) {
                newAngle += turnDelta;
            }
            if (newAngle !== 0) {
                this.angle = (this.angle + newAngle) % (Math.PI * 2.0);
            }
        }

        // position update
        this.x += Math.sin(this.angle) * this.speed;
        this.y += Math.cos(this.angle) * this.speed;
    }

    #updateCollision(roadBorders, cars) {
        let borderHit = roadBorders.find(
            border => polysIntersect(this.corners, border)
        );
        if (borderHit) {
            this.damaged = true;
            return;
        }
        let carHit = cars.find(
            car => car !== this && polysIntersect(this.corners, car.corners)
        );
        if (carHit) {
            this.damaged = true;
            // don't damage other car, so that we can run multiple AIs against the NPCs
            // carHit.damaged = true;
        }
    }

    #updateImageState(controls) {
        let src = "van.png";
        if (this.gear === "D") {
            if (controls.brake) {
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
            x: this.x + Math.sin(this.angle + a) * rs,
            y: this.y + Math.cos(this.angle + a) * rs
        });
        corners.push({
            x: this.x + Math.sin(this.angle - a) * rs,
            y: this.y + Math.cos(this.angle - a) * rs
        });
        corners.push({
            x: this.x + Math.sin(this.angle + a + Math.PI) * rs,
            y: this.y + Math.cos(this.angle + a + Math.PI) * rs
        });
        corners.push({
            x: this.x + Math.sin(this.angle - a - Math.PI) * rs,
            y: this.y + Math.cos(this.angle - a - Math.PI) * rs
        });
        return corners;
    }
}