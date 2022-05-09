class Controls {
    constructor() {
        this.gas = false;
        this.brake = false;
        this.left = false;
        this.right = false;
        this.reset = false;
    }
}

class HumanControls extends Controls {
    constructor() {
        super();
        this.save = null;
        this.delete = null;
        this.keymap = {
            "ArrowUp": "gas",
            "ArrowDown": "brake",
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "s": "save",
            "r": "reset",
            "x": "delete",
            "Escape": "reset",
            "Esc": "reset",
        }
        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        document.addEventListener("keydown", (event) => {
            const controlName = this.keymap[event.key];
            if (controlName !== undefined && this[controlName] !== undefined) {
                this[controlName] = true;
            }
        })
        document.addEventListener("keyup", (event) => {
            const controlName = this.keymap[event.key];
            if (controlName !== undefined && this[controlName] !== undefined) {
                this[controlName] = false;
            }
        })
    }
}

class AIForwardControls extends Controls {
    constructor(car) {
        super();
        this.car = car;
        this.gas = true;
    }

    update(borders, npcs) {
        this.car.update(this, borders, npcs);
    }
}

class NNControls extends Controls {
    constructor(car, brain=null, rayCount=5) {
        super();
        this.car = car;
        this.sensor = new Sensor(car, rayCount);
        this.brain = brain;
    }

    update(borders, npcs) {
        if (this.car.damaged) {
            return;
        }
        this.sensor.update(borders, npcs);
        const inputs = this.sensor.readings.map(s => s === null ? 0.0 : 1.0 - s.offset);
        inputs.push(this.car.speed / this.car.maxSpeed);
        const outputs = this.brain.feedForward(inputs);
        this.gas = outputs[0] === 1;
        this.brake = outputs[1] === 1;
        this.left = outputs[2] === 1;
        this.right = outputs[3] === 1;
        this.car.update(this, borders, npcs);
    }
}
