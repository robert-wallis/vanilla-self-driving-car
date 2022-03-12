class Controls {
    constructor() {
        this.gas = false;
        this.brake = false;
        this.left = false;
        this.right = false;
    }
}

class HumanControls extends Controls {
    constructor() {
        super();
        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        const keymap = {
            "ArrowUp":"gas",
            "ArrowDown":"brake",
            "ArrowLeft":"left",
            "ArrowRight":"right"
        }
        document.addEventListener("keydown", (event) => {
            if (keymap[event.key] !== undefined && this[keymap[event.key]] !== undefined) {
                this[keymap[event.key]] = true;
            }
        })
        document.addEventListener("keyup", (event) => {
            if (keymap[event.key] !== undefined && this[keymap[event.key]] !== undefined) {
                this[keymap[event.key]] = false;
            }
        })
    }
}