import { driveColors, driveImages } from "../../../_reactComponents/Drive/util";

// Finds name of image from util.js file in the Drive folder for accessibility
export function find_image_label(image) {
  // creates array of all numbers found in image name
  const regexp = /\d/gm;
  const array = [...image.matchAll(regexp)];
  // sets num_string equal to the first number found
  var num_string = array[0][0];
  // checks if there is a second number and appends it to num_string
  if (array[1] !== undefined) {
    num_string += array[1][0];
  }
  const num = parseInt(num_string);
  // accesses corresponding spot in driveImages array and returns the name
  return driveImages[num - 1].Name;
}

// Finds color name from util.js in the Drive folder for accessibility
export function find_color_label(color) {
  // goes through driveColors array looking for matching color
  for (let i = 0; i < driveColors.length; i++) {
    if (driveColors[i].Color == color) {
      // returns the name of the color
      return driveColors[i].Name;
    }
  }
  // returns phrase "some color" if color not found
  return "some color";
}
