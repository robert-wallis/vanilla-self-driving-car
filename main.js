const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

updateCanvasSize()
const hud = new Hud();
// pollute console with hud for global access
console.hud = hud.update;
const car = new Car(canvas.width*0.5, canvas.height * 0.8, 30, 50);

animate();

function updateCanvasSize() {
    if (canvas.height !== canvas.clientHeight ||
        canvas.width !== canvas.clientWidth) {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    }
}

function animate() {
    car.update();

    updateCanvasSize()

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    // context.translate(0, -car.y + canvas.height * 0.8);

    car.draw(context);

    context.restore();

    requestAnimationFrame(animate);
}