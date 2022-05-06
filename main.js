const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const humanPlayer = new HumanControls();

updateCanvasSize(); // get accurate canvas before laying out screen

const hud = new Hud();
const LANES = 5;
const START_Y = 1000000;

let road = new Road(canvas.width * 0.5, 500 * 0.9, LANES);
let player = new Car({
    x: road.laneCenter(-1),
    y: START_Y,
    scale: 0.6,
    imageFilename: "van.png",
    controls: humanPlayer,
    maxSpeed: 11,
    initialSpeed: 9.05,
    hud: hud,
});
let sensor = new Sensor(player);

let cars = [];
cars.push(player);
for (let i = 0; i < LANES - 1; i++) {
    const car = new Car({
        x: road.laneCenter(i),
        y: START_Y - 140,
        scale: 0.6,
        imageFilename: "van.png",
        controls: new AIForwardControls(),
        maxSpeed: 9,
    });
    cars.push(car);
}

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
    // input -----------------------------------------------------------------
    if (humanPlayer.reset) {
        // noinspection SillyAssignmentJS
        window.location.href = window.location.href;
    }

    // physics ---------------------------------------------------------------
    cars.forEach(car => car.update(road.borders, cars));
    sensor.update(road.borders, cars);

    // view ------------------------------------------------------------------
    hud.update(player);
    hud.update(humanPlayer);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    // camera
    context.translate(-player.x + canvas.width * 0.5, -player.y + canvas.height * 0.65);

    road.draw(context);
    cars.forEach(car => car.draw(context));
    sensor.draw(context);

    context.restore();

    requestAnimationFrame(animate);
}