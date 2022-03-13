const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

updateCanvasSize()
const hud = new Hud();
// pollute console with hud for global access
console.hud = hud.update;
window.road = new Road(canvas.width * 0.5, 500 * 0.9, 3);
window.car = new Car(road.laneCenter(road.lanes - 1), canvas.height * 0.8, 30, 50);
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
    context.translate(0, -car.y + canvas.height * 0.8);

    road.draw(context);
    car.draw(context);

    context.restore();

    requestAnimationFrame(animate);
}