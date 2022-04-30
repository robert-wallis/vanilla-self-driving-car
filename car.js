class Car {
    constructor(x, y, scale, imageFilename, controls) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.controls = controls;

        this.image = new Image();
        this.image.src = imageFilename;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 9;
        this.minSpeed = -this.maxSpeed * 0.5;
        this.friction = 0.05;
        this.angle = 0;
        this.gear = "N";
    }

    update() {
        this.#updateInput();
        this.#updatePhysics();
        this.#updateImageState();
        console.hud(this);
        console.hud(this.controls);
    }

    draw(context) {
        context.save();

        const width = this.image.width * this.scale;
        const height = this.image.height * this.scale;

        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -width * 0.5, -height * .6, width, height);


        // context.beginPath();
        // context.fillStyle = "#FFFFFF";
        // context.rect(-this.width/2, -this.height/2, this.width, this.height);
        // context.fill();

        context.restore();
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

    #updateImageState() {
        let src = "van.png";
        if (this.gear === "D") {
            if (this.controls.brake) {
                src = "van_D_brake.png"
            }
        } else if (this.gear === "R") {
            src = "van_R_brake.png"
        }
        if (this.image.src !== src) {
            this.image.src = src;
        }
    }

}