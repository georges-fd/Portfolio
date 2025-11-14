
const _spots_colors = [
    [0, 0, 0, 50],
    [245, 108, 66, 75],
    [245, 182, 66, 75],
    [173, 245, 66, 75],
    [245, 224, 66, 75]
];

// Adding some spots on the sand so that it feels less deserty :)
class SandSpot {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.color = this.get_color();
        this.size = 5;
    }

    get_color() {
        return color(..._spots_colors[floor(random() * _spots_colors.length)]);
    }

    draw_spot(time) {

        fill(get_time_color(time, this.color, this.color, color(0, 50)));
        square(this.pos.x, this.pos.y, this.size);

    }

}

// Generate Sand hills from pre-defined random seed points
class Background {

    constructor() {
        this.background_seeds = [34, 85, 141, 142, 152, 196, 208];
        this.backround_vertexes = [];
        this.sand_spots = [];
        this.sand_spots_ratio = 0.05;
        this.day_color = color(244, 164, 96);
        this.night_color = color(94, 56, 109);
        this.sunrise_color = color(255, 94, 41);
        this.max_entites_height = 0;
    }

    generate_backgound() {
        let noiseLevel = - height / 3;
        let noiseScale = 0.0017;

        noiseSeed(this.background_seeds[floor(random() * this.background_seeds.length)]);

        this.backround_vertexes.push(createVector(0, height));

        for (let x = 0; x < width; x++) {
            let nx = noiseScale * x;
            let y = (noise(nx) * noiseLevel) + height - (height / 4);
            this.backround_vertexes.push(createVector(x, y));

            if (y > this.max_entites_height) {
                this.max_entites_height = y;
            }

            if (random() < this.sand_spots_ratio) {
                y = random(y + 10, height);
                this.sand_spots.push(new SandSpot(x, y));
            }

        }

        this.backround_vertexes.push(createVector(width, height));

    }

    draw_background(time) {

        stroke(0);
        strokeWeight(2);
        fill(get_time_color(time, this.sunrise_color, this.day_color, this.night_color));
        beginShape();
        for (let point of this.backround_vertexes) {
            vertex(point.x, point.y);
        }
        endShape(CLOSE);

        noStroke();

        for (let spot of this.sand_spots) {
            spot.draw_spot(time);
        }

    }

}











