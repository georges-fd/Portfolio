
// lerping between the day and night colors depending the time
function get_time_color(time, sunrise_color, day_color, night_color) {

    let lerp_params = [
        [sunrise_color, night_color, abs(time)],
        [sunrise_color, day_color, time]
    ];

    return lerpColor(...lerp_params[time < 0 ? 0 : 1]);

}

// Returns the average color between two colors
function get_average_color(c1, c2) {

    let avgR = floor((red(c1) + red(c2)) / 2);
    let avgG = floor((green(c1) + green(c2)) / 2);
    let avgB = floor((blue(c1) + blue(c2)) / 2);

    return color(avgR, avgG, avgB);
}

// Returns a new color which is the result of substracting val amount of each rgb color value
function sub_val_from_color(c, val) {

    let newR = red(c) - val;
    let newG = green(c) - val;
    let newB = blue(c) - val;

    return color(newR, newG, newB);
}

// Applying a tint to a collor according to the time 
function tint_according_to_time(c, time) {

    let c_sunrize_color = get_average_color(sunrise_color, c);

    let c_night_color = get_average_color(night_color, c);

    return get_time_color(time, c_sunrize_color, c, c_night_color);

}