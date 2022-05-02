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
            "ArrowUp":"gas",
            "ArrowDown":"brake",
            "ArrowLeft":"left",
            "ArrowRight":"right",
            "Escape":"reset",
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