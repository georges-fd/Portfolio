
// Cactus gnerate fruits, yes they do. and those form the primary and unique source food for rats.
class Cactus extends Entity {

    static MIN_SCALE = 0.3;
    static MAX_SCALE = 0.5;
    static MIN_FRUIT_CAPACITY = 3;
    static MAX_FRUIT_CAPACITY = 7;

    constructor() {
        super();

        let padding = 50
        this.pos = createVector(random(padding, width - padding), random(background_hills.max_entites_height, height - padding));
        this.scale = random(Cactus.MIN_SCALE, Cactus.MAX_SCALE);
        this.w = 30 * this.scale;
        this.h = 180 * this.scale
        this.fruit_capacity = floor(random(Cactus.MIN_FRUIT_CAPACITY, Cactus.MAX_FRUIT_CAPACITY));
        this.fruits = this.make_fruits();

    }

    make_fruits() {
        let fruits = [];

        for (let i = 0; i < this.fruit_capacity; i++) {
            fruits.push(new Fruit(createVector(random(this.pos.x, this.pos.x + this.w), random(this.pos.y, this.pos.y + this.h - 20))));
        }

        return fruits;
    }

    draw(time) {

        let cactus_color = color(140, 175, 40);

        let cactus_sunrize_color = get_average_color(sunrise_color, cactus_color);

        let cactus_night_color = get_average_color(night_color, cactus_color);

        cactus_color = get_time_color(time, cactus_sunrize_color, cactus_color, cactus_night_color);

        fill(cactus_color);

        push();
        translate(this.pos.x, this.pos.y);

        rect(0, 0, this.w, this.h, this.w / 2, this.w / 2, this.w / 10, this.w / 10);

        //cactus arm dimensions
        let cactusArmW = 5 * this.w / 6;

        //cactus left arm
        rect(- this.w, 5, cactusArmW, this.w * 2 + 1, cactusArmW / 2, cactusArmW / 2, 0, 0);
        rect(- this.w, 5 + this.w * 2, this.w + 1, cactusArmW, 0, 0, 0, this.w / 2);

        //cactus right arm
        rect(7 * this.w / 6, 20, cactusArmW, this.w * 2 + 1, cactusArmW / 2, cactusArmW / 2, 0, 0);
        rect(this.w - 1, this.w * 2 + 20, this.w + 1, cactusArmW, 0, 0, this.w / 2, 0);
        pop();

        for (let fruit of this.fruits) {
            fruit.draw(time);
        }

    }

    apply_behavior() {
        this.grow_fruit(0.005);
    }

    // Grow fruits and drop them when they get matured
    grow_fruit(grow_rates) {

        for (let i = this.fruits.length - 1; i >= 0; i--) {

            this.fruits[i].grow_fruit(grow_rates);
            if (this.fruits[i].s == Fruit.FRUIT_MAX_SIZE) {
                let [matured_fruit] = this.fruits.splice(i, 1);
                setTimeout(() => {
                    this.fruits.push(new Fruit(createVector(random(this.pos.x, this.pos.x + this.w), random(this.pos.y, this.pos.y + this.h - 20))));
                }, random(1000, 5000));
                matured_fruit.pos.y = this.pos.y + this.h;
                matured_fruit.pos.x = matured_fruit.pos.x + random(-20, 20);
                foods.push(matured_fruit);
            }
        }

    }

}

class Fruit {

    static FRUIT_MIN_SIZE = 3;
    static FRUIT_MAX_SIZE = 13;

    constructor(pos) {
        this.pos = pos;
        this.s = random(Fruit.FRUIT_MIN_SIZE, Fruit.FRUIT_MAX_SIZE);
    }

    grow_fruit(grow_rates) {
        this.s += grow_rates;

        this.s = min(this.s, Fruit.FRUIT_MAX_SIZE);
        this.s = max(this.s, Fruit.FRUIT_MIN_SIZE);
    }

    draw(time) {

        let fruit_color = lerpColor(color(219, 252, 3), color(252, 100, 3), map(this.s, Fruit.FRUIT_MIN_SIZE, Fruit.FRUIT_MAX_SIZE, 0, 1));

        fruit_color = tint_according_to_time(fruit_color, time);

        noStroke();
        fill(fruit_color);
        ellipse(this.pos.x, this.pos.y, this.s, this.s);
    }

}
