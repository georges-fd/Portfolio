class Rat extends Entity {

    static MIN_METABOLISM = 0.0002;
    static MAX_METABOLISM = 0.002;
    static MIN_HEALTH = 2.5;
    static MAX_HEALTH = 6;
    static MIN_REPRODUCTION_RATE = 0.3;
    static MAX_REPRODUCTION_RATE = 0.6;
    static MIN_SPEED = 0.3;
    static MAX_SPEED = 1;
    static MIN_SIZE = 7;
    static MAX_SIZE = 12;
    static MIN_PERCEPTION_RADIUS = 40;
    static MAX_PERCEPTION_RADIUS = 110;

    constructor(pos = null, dna = null) {
        super();
        this.applyDNA(dna);

        this.pos = pos || createVector(random(0, width), random(background_hills.max_entites_height, height));
        this.healthy_color = color(255, 239, 204);
        this.death_color = color(153, 102, 99);

    }

    applyDNA(dna) {

        let initial_speed, size, perception_radius, reproduction_rate, metabolism, max_health;

        if (dna) {
            ({ initial_speed, size, perception_radius, reproduction_rate, metabolism, max_health } = dna.genes);
        } else {
            initial_speed = random(Rat.MIN_SPEED, Rat.MAX_SPEED);
            size = random(Rat.MIN_SIZE, Rat.MAX_SIZE);
            perception_radius = random(Rat.MIN_PERCEPTION_RADIUS, Rat.MAX_PERCEPTION_RADIUS);
            reproduction_rate = random(Rat.MIN_REPRODUCTION_RATE, Rat.MAX_REPRODUCTION_RATE);
            metabolism = random(Rat.MIN_METABOLISM, Rat.MAX_METABOLISM);
            max_health = random(Rat.MIN_HEALTH, Rat.MAX_HEALTH);

        }

        this.dna = dna || new DNA({
            initial_speed, size, perception_radius, reproduction_rate, metabolism, max_health
        });


        this.initial_speed = initial_speed;
        this.maxSpeed = this.initial_speed;
        this.size = size;
        this.velocity = new createVector(this.maxSpeed, 0);
        this.perception_radius = perception_radius;
        this.reproduction_rate = reproduction_rate;
        this.metabolism = metabolism;
        this.max_health = max_health;
        this.cur_health = this.max_health * 0.5;

    }

    draw(time) {
        super.draw();

        const angle = this.velocity.heading();
        let rat_color = lerpColor(this.death_color, this.healthy_color, map(this.cur_health, 0, this.max_health, 0, 1));

        rat_color = tint_according_to_time(rat_color, time);

        push();

        translate(this.pos.x, this.pos.y);
        rotate(angle);
        fill(rat_color);
        noStroke();
        ellipse(0, 0, this.size, this.size * 0.7);
        pop();

    }

    update(time) {
        super.update();

        if (time > 0) { //day
            this.cur_health -= this.metabolism;
            this.maxSpeed += 0.01;
            this.maxSpeed = min(Entity.MAX_SPEED, this.maxSpeed);
        } else { // night
            this.cur_health -= this.metabolism * 1.3;
            this.maxSpeed -= 0.01;
            this.maxSpeed = max(this.initial_speed * 0.8, this.maxSpeed);
        }

    }
    apply_behavior() {
        this.wander();
        this.flee_snake();
        this.seek_food();
        this.reproduce();
    }


    reproduce() {

        this.get_closest(rats, (i) => {

            if (this !== rats[i] && this.cur_health >= 0.8 * this.max_health &&
                random() <= (this.reproduction_rate + rats[i].reproduction_rate) / 2) {

                let child_rat = new Rat(
                    createVector((this.pos.x + rats[i].pos.x) / 2,
                        (this.pos.y + rats[i].pos.y) / 2),
                    this.dna.crossover(rats[i].dna)
                );

                child_rat.cur_health = child_rat.cur_health / 2;


                rats.push(child_rat);

                this.cur_health = this.cur_health / 2;
                rats[i].cur_health = rats[i].cur_health / 2;
            }

        });

    }

    seek_food() {

        let closest = this.get_closest(foods, (i) => {
            this.cur_health = this.cur_health * 1.6;
            this.size += 1;
            foods.splice(i, 1);
        });

        if (!closest) return;

        if (this.cur_health >= this.max_health * 0.8)
            this.applyForce(this.seek(closest).mult(-1));
        else
            this.applyForce(this.seek(closest));

    }

    flee_snake() {


        let record = Infinity;
        let closest = null;

        for (let i = 0; i < snakes.length; i++) {


            const d = this.pos.dist(snakes[i].pos) + snakes[i].size;
            if (d >= this.perception_radius || d >= record) continue;

            record = d;
            closest = snakes[i].pos;
        }

        if (!closest) return;

        this.applyForce(this.seek(closest).mult(-1));


    }


}