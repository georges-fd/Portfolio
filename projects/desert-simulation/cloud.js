

// Wandering clouds that grow only in the day, because physics duh..
class Cloud extends Entity {

    static SCALE_MIN = 0.5;
    static SCALE_MAX = 3.5;
    static MAIN_CLOUD_BODY_WIDTH = 80;
    static MAIN_CLOUD_BODY_HEIGHT = 40;

    constructor(pos = null) {
        super();
        this.pos = pos == null ? createVector(random(0, width), random(20, height / 5)) : pos;
        this.initial_scale = random(Cloud.SCALE_MIN, Cloud.SCALE_MAX - 2); // the scale affects the cloud speed, water capacity
        this.set_scale(this.initial_scale);
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(this.maxSpeed, 0);
        this.wonder_force = 0.0001;
        this.evaporation_absorbtion_factor = random(0.001, 0.002);
        this.raining_rate = random(0.001, 0.005);
        this.drops = this.create_rain_drops();
    }

    // Initializing rain drops 
    create_rain_drops() {
        let drops = [];
        for (var i = 0; i < 200; i++) {
            drops[i] = new Drop();
        }
        return drops;
    }

    draw(time) {

        for (let drop of this.drops) {
            drop.update(this.is_raining, this.pos, Cloud.MAIN_CLOUD_BODY_WIDTH * this.scale, this.target_rain);
            drop.draw();
        }

        let cloud_color = color(map(this.scale, Cloud.SCALE_MIN, Cloud.SCALE_MAX, 255, 135));

        let cloud_sunrize_color = get_average_color(sunrise_color, cloud_color);

        let cloud_night_color = get_average_color(night_color, cloud_color);

        cloud_color = get_time_color(time, cloud_sunrize_color, cloud_color, cloud_night_color);

        fill(cloud_color);
        push();
        translate(this.pos.x, this.pos.y);
        scale(this.scale);

        // main cloud
        ellipse(0, 0, Cloud.MAIN_CLOUD_BODY_WIDTH, Cloud.MAIN_CLOUD_BODY_HEIGHT);
        ellipse(-30, 0, 50, 30);
        ellipse(30, 0, 50, 30);

        // details
        fill(sub_val_from_color(cloud_color, 25));
        ellipse(-10, -10, 10, 5);
        ellipse(10, -10, 10, 5);
        pop();

    }

    boundaries() {

        // Wrapping the clouds arround
        if (this.pos.x > width + 200) {
            this.pos.x = -200;
        }

        if (this.pos.x < -300) {
            this.pos.x = width + 200;
        }

    }

    apply_behavior(time) {
        this.wander();
        this.absorb_evaporation(time);
        this.rain();
    }

    // During the day the water evaporate due to high temperatures, the coulds grow as result.
    absorb_evaporation(time) {

        if (time <= 0) return;
        this.set_scale(this.scale + this.evaporation_absorbtion_factor);

    }

    // Clouds rain when they reach a certain threshold
    rain() {
        if (this.is_raining) {
            if (this.scale > this.initial_scale) {
                this.set_scale(this.scale - this.raining_rate);

                for (let cactus of cactuses) {
                    if (this.target_rain > cactus.pos.y &&
                        cactus.pos.y >= this.target_rain - cactus.h &&
                        cactus.pos.x > this.pos.x - Cloud.MAIN_CLOUD_BODY_WIDTH * this.scale / 2 &&
                        cactus.pos.x < this.pos.x + Cloud.MAIN_CLOUD_BODY_WIDTH * this.scale / 2) {

                        cactus.grow_fruit(0.05);
                    }
                }

            }
            else {
                this.is_raining = false;
            }
            return;
        }

        if (this.scale < Cloud.SCALE_MAX) return;

        this.is_raining = true;

        this.target_rain = random(height, height - 200);

    }

    set_scale(new_scale) {
        new_scale = min(new_scale, Cloud.SCALE_MAX);
        new_scale = max(new_scale, Cloud.SCALE_MIN);

        this.scale = new_scale;
        this.maxSpeed = map(new_scale, Cloud.SCALE_MIN, Cloud.SCALE_MAX, 0.5, 0.001);

    }

    // Clouds wander within the screen boundaries
    wander() {

        let angle = noise(this.noiseX) * TWO_PI * 2;
        let steer = p5.Vector.fromAngle(angle);
        steer.setMag(this.wonder_force);
        this.applyForce(steer);
        this.noiseX += 0.0001;

        if (this.pos.y <= 20) {
            this.applyForce(createVector(0, 1.4 * this.wonder_force));
        }

        if (this.pos.y > height / 4) {
            this.applyForce(createVector(0, -1.4 * this.wonder_force));
        }

    }

}

class Drop {

    constructor() {

        this.pos = createVector();
        this.keep_falling = false;
        this.speed = random(5, 10);
        this.gravity = random(0.5, 1.2);
    }

    draw() {
        if (!this.keep_falling) return;
        noStroke();
        fill(255);
        ellipse(this.pos.x, this.pos.y, random(1, 5), random(1, 5));
    }

    update(is_raining, cloud_pos, cloud_width, target_rain) {

        if (is_raining) this.keep_falling = true;
        if (!this.keep_falling) return;

        if (this.pos.x == 0) {
            this.pos.y = cloud_pos.y;
            this.pos.x = random(cloud_pos.x - cloud_width / 2, cloud_pos.x + cloud_width / 2)
        }

        this.pos.y = this.pos.y + this.speed * this.gravity;

        if (this.pos.y > target_rain) {
            this.pos.y = cloud_pos.y;
            this.pos.x = random(cloud_pos.x - cloud_width / 2, cloud_pos.x + cloud_width / 2);

            if (!is_raining) {
                this.keep_falling = false;
                this.pos.x = 0;
            };
        }
    }
}


