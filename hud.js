class Hud {
    update(table) {
        for (const [key, value] of Object.entries(table)) {
            Hud.#updateKey(key, value)
        }
    }

    static #updateKey = (key, value) => {
        const el = document.getElementById(key + "Value")
        if (!el) {
            return;
        }
        let html = value;
        if (typeof value === "number") {
            html = value.toFixed(2)
        }
        el.innerHTML = html;
    };
}