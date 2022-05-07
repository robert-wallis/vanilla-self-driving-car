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
        this.keymap = {
            "ArrowUp": "gas",
            "w": "gas",
            "ArrowDown": "brake",
            "s": "brake",
            "ArrowLeft": "left",
            "a": "left",
            "ArrowRight": "right",
            "d": "right",
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
    constructor() {
        super();
        this.gas = true;
    }
}

class AutopilotControls extends HumanControls {
    constructor() {
        super();
        this.autopilot = true;
    }

    // outputs.0 = gas
    // outputs.1 = brake
    // outputs.2 = left
    // outputs.3 = right
    updateAI(outputs) {
        if (this.autopilot) {
            this.gas = outputs[0] === 1;
            this.brake = outputs[1] === 1;
            this.left = outputs[2] === 1;
            this.right = outputs[3] === 1;
        }
    }
}