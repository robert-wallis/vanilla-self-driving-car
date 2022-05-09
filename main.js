const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

updateCanvasSize(); // get accurate canvas before laying out screen

const hud = new Hud();
const LANES = 5;
const START_Y = 900000;
const RAY_COUNT = 5;

let humanPlayer = new HumanControls();
let road = new Road(canvas.width * 0.5, 500 * 0.9, LANES);
const nnVisualizer = new NNVisualizer();

let npcs = [];
let npcCars = [];
function makeWave(wave, yOffset) {
    for (let i = 0; i < wave.length; i++) {
        if (!wave[i])
            continue;
        const car = new Car({
            x: road.laneCenter(i),
            y: START_Y - yOffset,
            scale: 0.6,
            imageFilename: "van.png",
            maxSpeed: 9,
        });
        const controls = new AIForwardControls(car);
        npcs.push(controls);
        npcCars.push(car);
    }
}
let yOffset = 0;
makeWave([true, false, true, true, true], yOffset+=500);
makeWave([true, true, false, true, true], yOffset+=300);
makeWave([true, true, false, true, true], yOffset+=300);
makeWave([false, true, true, true, true], yOffset+=330);
makeWave([true, true, true, false, true], yOffset+=350);
makeWave([true, true, false, true, true], yOffset+=300);
makeWave([true, true, true, true, false], yOffset+=300);
makeWave([false, true, true, true, true], yOffset+=300);

let viewNetwork = labelInputLoad("viewNetwork", false);
let mutateAmount = labelInputLoad("mutateAmount", 0.1);
let scientificMode = labelInputLoad("scientific", false);
let scientificIterations = 1;
let bots = [];
let npcCount = labelInputLoad("npcCount", 100);
for (let i = 0; i < npcCount; i++) {
    let brain;
    if (i == 0) {
        brain = loadBest();
        if (!brain) {
            mutateAmount = 1.0;
            brain = NeuralNetwork.initRandom([RAY_COUNT + 1, RAY_COUNT + 2, 4], ['gas', 'brake', 'left', 'right']);
        }
        if (scientificMode) {
            let brainSize = brain.countNetworkSize();
            scientificIterations = Math.max(1, Math.floor(npcCount / brainSize));
            npcCount = brainSize * scientificIterations;
            labelInputSave("npcCount", npcCount);
        }
    } else {
        brain = NeuralNetwork.initDeserialize(bots[0].brain);
        if (scientificMode) {
            // i - 1 because 0 is the original car, and 0 is the first weight too
            brain.mutateScientifically(i - 1, mutateAmount * 2 - 1, 0.5 / (i % scientificIterations));
        } else {
            brain.mutateWeightsAndBiases(mutateAmount);
        }
    }
    const car = new Car({
        x: road.laneCenter(2),
        y: START_Y,
        scale: 0.6,
        imageFilename: "van.png",
        maxSpeed: 11,
    });
    const controls = new NNControls(car, brain, RAY_COUNT, Math.PI * 0.25);
    bots.push(controls);
}
let bestBot = bots[0];

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

function loadBest() {
    let json = localStorage.getItem("bestBrain");
    if (!json) {
        return null;
    }
    let obj = JSON.parse(json);
    return NeuralNetwork.initDeserialize(obj);
}

function onSave() {
    localStorage.setItem("bestBrain", JSON.stringify(bestBot.brain));
}

function onReset() {
    // noinspection SillyAssignmentJS
    window.location.href = window.location.href;
}

function onDeleteSave() {
    localStorage.removeItem("bestBrain");
}

function animate() {
    // input -----------------------------------------------------------------
    if (humanPlayer.reset === true) {
        onReset();
    }
    if (humanPlayer.save === true) {
        onSave();
    }
    if (humanPlayer.delete === true) {
        onDeleteSave();
    }

    // physics ---------------------------------------------------------------
    npcs.forEach(npc => npc.update(road.borders, []));
    bots.forEach(bot => bot.update(road.borders, npcCars));

    bestBot = bots.reduce((best, bot) => {
        return bot.car.y < best.car.y ? bot : best;
    }, bots[0]);

    // view ------------------------------------------------------------------
    hud.update({
        remaining: bots.reduce((count, bot) => count + (bot.car.damaged ? 0 : 1), 0),
    });
    hud.update(bestBot.car);
    hud.update(bestBot);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    // camera
    context.translate(-bestBot.car.x + canvas.width * 0.5, -bestBot.car.y + canvas.height * 0.65);

    road.draw(context);
    npcs.forEach(npc => npc.car.draw(context));

    context.globalAlpha=0.2;
    bots.forEach(bot => bot.car.draw(context));
    context.globalAlpha=1.0;
    bestBot.car.draw(context);

    bestBot.sensor.draw(context);

    context.restore();
    if (localStorage.viewNetwork == 'true') {
        nnVisualizer.update(context, {x: 50, y: 50, width: canvas.width - 100, height: canvas.height * 0.6 - 200}, bestBot.brain);
    }

    requestAnimationFrame(animate);
}