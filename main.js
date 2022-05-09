const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

updateCanvasSize(); // get accurate canvas before laying out screen

const hud = new Hud();
const LANES = 5;
const START_Y = 900000;

let humanPlayer = new HumanControls();
let road = new Road(canvas.width * 0.5, 500 * 0.9, LANES);
const nnVisualizer = new NNVisualizer();

let npcs = [];
let npcCars = [];
for (let i = 0; i < LANES - 1; i++) {
    const car = new Car({
        x: road.laneCenter(i),
        y: START_Y - 300,
        scale: 0.6,
        imageFilename: "van.png",
        maxSpeed: 9,
    });
    const controls = new AIForwardControls(car);
    npcs.push(controls);
    npcCars.push(car);
}

let bots = [];
for (let i = 0; i < 100; i++) {
    const car = new Car({
        x: road.laneCenter(2),
        y: START_Y,
        scale: 0.6,
        imageFilename: "van.png",
        maxSpeed: 11,
    });
    const controls = new NNControls(car);
    bots.push(controls);
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
    npcs.forEach(npc => npc.update(road.borders, []));
    bots.forEach(bot => bot.update(road.borders, npcCars));

    const bestBot = bots.reduce((best, bot) => {
        return bot.car.y < best.car.y ? bot : best;
    }, bots[0]);

    // view ------------------------------------------------------------------
    hud.update(bestBot.car);
    hud.update(bestBot);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    // camera
    context.translate(-bestBot.car.x + canvas.width * 0.5, -bestBot.car.y + canvas.height * 0.65);

    road.draw(context);
    npcs.forEach(npc => npc.car.draw(context));
    bots.forEach(bot => bot.car.draw(context));
    bestBot.sensor.draw(context);

    context.restore();
    nnVisualizer.update(context, {x: 50, y: 50, width: canvas.width - 100, height: canvas.height * 0.6 - 200}, bestBot.brain);

    requestAnimationFrame(animate);
}