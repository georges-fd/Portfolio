// Base class for entites containing some common logics
class Entity {

    static MAX_SPEED = 1;

    constructor() {
        this.noiseX = random(0, 100000);
        this.maxForce = 1;
        this.velocity = createVector(0);
        this.acceleration = createVector(0);
        this.perception_radius = random(20, 100);
    }

    // simulating a basic physics engine
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    // Seeking behavior is applied by making the entity steer according to the target position
    seek(target) {
        const desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxSpeed);
        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    // Wandering is done by following a path genreated randomly according to perlin noise 
    wander() {
        let angle = noise(this.noiseX) * TWO_PI * 2;
        let steer = p5.Vector.fromAngle(angle);
        steer.setMag(this.maxForce / 10);
        this.applyForce(steer);
        this.noiseX += 0.005;
    }

    // Evade or flee behavior is achived technically by following a target in the oposit direction
    evade(target) {
        return this.followTarget(target).mult(-1);
    }

    // Following a target by predecting its next position according to its velocity
    followTarget(entity) {
        let target = entity.pos.copy();
        let prediction = entity.velocity.copy();
        prediction.mult(10);
        target.add(prediction);
        return this.seek(target);
    }

    boundaries() {
        const d = -20;
        const { pos, velocity, maxSpeed, maxForce } = this;
        const { x, y } = pos;

        let desired = null;


        if (x < d) {
            desired = createVector(maxSpeed, velocity.y);
        } else if (x > width - d) {
            desired = createVector(-maxSpeed, velocity.y);
        }
        if (y < background_hills.max_entites_height) {
            desired = createVector(velocity.x, maxSpeed);
        } else if (y > height - d) {
            desired = createVector(velocity.x, -maxSpeed);
        }


        if (desired) {
            desired.normalize();
            desired.mult(maxSpeed);
            this.applyForce(p5.Vector.sub(desired, velocity).limit(maxForce));
        }
    }

    // Returns the closest entity, and apply on_contact_do callback when the entities well,, gets in contact
    get_closest(entities, on_contact_do) {

        let record = Infinity;
        let closest = null;

        for (let i = entities.length - 1; i >= 0; i--) {


            const d = this.pos.dist(entities[i].pos);

            if (d < this.size) {
                on_contact_do(i);
                continue;
            }
            if (d < record && d < this.perception_radius) {

                record = d;
                closest = entities[i].pos;

            }

        }

        return closest;

    }

    draw() {

        if (perception_rings && perception_rings.checked()) {
            push();
            translate(this.pos.x, this.pos.y);
            strokeWeight(2);
            stroke('red');
            noFill();
            ellipse(0, 0, this.perception_radius);
            pop();
        }
    }

}
