// Defining simulation constants
const CLOUD_COUNT = 3;
const CACTUS_COUNT = 12;
const SNAKES_COUNT = 4;
const RATS_COUNT = 35;

let day_color, night_color, sunrise_color, perception_rings, stats;

let background_hills, cactuses = [], clouds = [], foods = [], snakes = [], rats = [];

function setup() {
    createCanvas(displayWidth, displayHeight * 78 / 100);
    perception_rings = createCheckbox('Perception Rings');
    stats = createSpan();

    day_color = color(150, 220, 255);
    night_color = color(0, 0, 50);
    sunrise_color = color(252, 194, 126);
    background_hills = new Background();
    background_hills.generate_backgound();

    // Adding the entities into the simulation
    for (let i = 0; i < CACTUS_COUNT; i++) {
        cactuses.push(new Cactus());
    }

    for (let i = 0; i < CLOUD_COUNT; i++) {
        clouds.push(new Cloud());
    }

    for (let i = 0; i < SNAKES_COUNT; i++) {
        snakes.push(new Snake());
    }
    for (let i = 0; i < RATS_COUNT; i++) {
        rats.push(new Rat());
    }

}

function draw() {

    // Create a time variable that will be used in order to change colors of the entities and backgroud during day/night cycles
    let time = cos(frameCount / 500);

    // Updating the background colors
    background(get_time_color(time, sunrise_color, day_color, night_color));
    background_hills.draw_background(time);

    // Iterating over the entities
    iterate_over(rats, time);
    iterate_over(snakes, time);
    iterate_over(cactuses, time);
    iterate_over(clouds, time);

    // Foods gets a special treatments
    for (let food of foods) {
        food.draw(time);
    }

    stats.html(`Snakes: ${snakes.length} | Rats: ${rats.length} | Food: ${foods.length}`);

}

function iterate_over(entities, time) {

    for (let i = entities.length - 1; i >= 0; i--) {
        entities[i].boundaries();
        entities[i].update(time);
        entities[i].apply_behavior(time);
        entities[i].draw(time);

        if (entities[i].cur_health < 0) {
            entities.splice(i, 1);
        }

    }

}

