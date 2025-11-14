class Snake extends Entity {

    static MIN_METABOLISM = 0.0009;
    static MAX_METABOLISM = 0.009;
    static MIN_HEALTH = 5;
    static MAX_HEALTH = 12;
    static MIN_REPRODUCTION_RATE = 0.05;
    static MAX_REPRODUCTION_RATE = 0.2;
    static MIN_SPEED = 0.7;
    static MAX_SPEED = 1;
    static MIN_SIZE = 7;
    static MAX_SIZE = 10;
    static MIN_PERCEPTION_RADIUS = 60;
    static MAX_PERCEPTION_RADIUS = 128;

    constructor(pos = null, dna = null) {
        super();

        this.pos = pos || createVector(random(0, width), random(background_hills.max_entites_height, height));
        this.balls = [];
        this.nodecount = 50;
        this.step = 1;
        this.healthy_color = color(136, 153, 90);
        this.death_color = color(153, 98, 90);

        this.applyDNA(dna);

        for (let i = 0; i < this.nodecount; i++) {
            this.balls.push(new SnakeBody(this.pos.x, this.pos.y + i * this.step, this.healthy_color))
        }
        this.balls[0].healthy_color = color(227, 214, 157);

    }

    applyDNA(dna) {

        let initial_speed, size, initialperception_radius, metabolism, max_health, reproduction_rate;

        if (dna) {
            ({ initial_speed, size, initialperception_radius, metabolism, max_health, reproduction_rate } = dna.genes);
        } else {

            initial_speed = random(Snake.MIN_SPEED, Snake.MAX_SPEED);
            size = random(Snake.MIN_SIZE, Snake.MAX_SIZE);
            initialperception_radius = random(Snake.MIN_PERCEPTION_RADIUS, Snake.MAX_PERCEPTION_RADIUS);
            metabolism = random(Snake.MIN_METABOLISM, Snake.MAX_METABOLISM);
            max_health = random(Snake.MIN_HEALTH, Snake.MAX_HEALTH);
            reproduction_rate = random(Snake.MIN_REPRODUCTION_RATE, Snake.MAX_REPRODUCTION_RATE);

        }

        this.dna = dna || new DNA({
            initial_speed, size, initialperception_radius, metabolism, max_health, reproduction_rate
        });

        this.initial_speed = initial_speed;
        this.maxSpeed = this.initial_speed;
        this.velocity = new createVector(this.maxSpeed, 0);
        this.size = size;
        this.initialperception_radius = initialperception_radius;
        this.perception_radius = this.initialperception_radius;
        this.metabolism = metabolism
        this.max_health = max_health;
        this.cur_health = this.max_health;
        this.reproduction_rate = reproduction_rate;

    }


    draw(time) {
        super.draw();

        for (let i = this.balls.length - 1; i >= 0; i--) {
            this.balls[i].draw(this.velocity, time, this.death_color, this.cur_health, this.max_health, this.size);
        }
    }
    update(time) {

        if (time <= 0) { // night
            this.perception_radius = this.initialperception_radius * 1.5;
            this.cur_health -= (this.metabolism * 1.3);
            this.maxSpeed += 0.01;
            this.maxSpeed = min(Entity.MAX_SPEED, this.maxSpeed);
        } else { //day
            this.perception_radius = this.initialperception_radius;
            this.cur_health -= (this.metabolism * 0.5);
            this.maxSpeed -= 0.01;
            this.maxSpeed = max(this.initial_speed, this.maxSpeed);
        }

        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].prevpos = this.balls[i].pos;

            let newpos = i == 0 ? this.pos : this.balls[i - 1].prevpos;

            this.balls[i].pos = p5.Vector.lerp(this.balls[i].pos, newpos, this.velocity.mag())

            if (i == this.balls.length - 1) {
                this.temppos = this.balls[i].prevpos
            }

        }
        super.update();

    }

    apply_behavior() {
        this.wander();
        this.seek_rats();
        this.reproduce();
    }

    reproduce() {

        this.get_closest(snakes, (i) => {

            if (this !== snakes[i] && this.cur_health >= 0.8 * this.max_health &&
                random() <= (this.reproduction_rate + snakes[i].reproduction_rate) / 2) {

                let child_snake = new Snake(
                    createVector((this.pos.x + snakes[i].pos.x) / 2,
                        (this.pos.y + snakes[i].pos.y) / 2),
                    this.dna.crossover(snakes[i].dna)
                );

                child_snake.cur_health = child_snake.cur_health / 2;


                snakes.push(child_snake);

                this.cur_health = this.cur_health / 2;
                snakes[i].cur_health = snakes[i].cur_health / 2;
            }

        });

    }

    seek_rats() {

        let closest = this.get_closest(rats, (i) => {

            this.cur_health += 0.8;
            rats.splice(i, 1);
            this.grow();
        });

        if (!closest) return;

        this.applyForce(this.seek(closest));

    }

    grow() {
        this.size += 1;
        this.balls.push(new SnakeBody(this.temppos.x, this.temppos.y, this.healthy_color));
        this.nodecount++;
    }

}

class SnakeBody {
    constructor(x, y, healthy_color) {
        this.pos = createVector(x, y)
        this.healthy_color = healthy_color;
        this.prevpos = this.pos;

    }
    draw(velocity, time, death_color, cur_health, max_health, size) {

        const angle = velocity.heading();

        let snake_color = lerpColor(death_color, this.healthy_color, map(cur_health, 0, max_health, 0, 1));
        snake_color = tint_according_to_time(snake_color, time);

        push();

        translate(this.pos.x, this.pos.y);
        rotate(angle);
        fill(snake_color);
        noStroke();
        ellipse(0, 0, size, size * 0.7);
        pop();
    }
}