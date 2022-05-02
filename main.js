const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const humanPlayer = new HumanControls();

updateCanvasSize()
const hud = new Hud();
// pollute console with hud for global access
console.hud = hud.update;
window.road = new Road(canvas.width * 0.5, 500 * 0.9, 5);
window.car = new Car(road.laneCenter(-1), canvas.height * 0.8, 0.6, "van.png", humanPlayer);
window.sensor = new Sensor(car);
window.addEventListener("resize", updateCanvasSize);
animate();

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.height !== canvas.clientHeight ||
        canvas.width !== canvas.clientWidth) {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    }
}

function animate() {
    if (humanPlayer.reset) {
        // noinspection SillyAssignmentJS
        window.location.href = window.location.href;
    }

    car.update(road.borders);
    sensor.update(road.borders);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(0, -car.y + canvas.height * 0.65);

    road.draw(context);
    car.draw(context);
    sensor.draw(context);

    context.restore();

    requestAnimationFrame(animate);
}