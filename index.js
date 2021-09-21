// Task: Write a function to:
// - Generate a gradient using the colors from the pickers and split percentage from the slider.
// - Use the gradient as the form background.

// Stretch goals:
// - Add more colors.
// - Add a 'Surprise Me' button which generates random gradients (and updates the inputs).
// - Check for contrast between the gradient and the text.

// 1. grab color values from pickers
// 2. add those colors in a gradient declaration
// 3. use the gradients to style the form

/*THIS IS WHAT WE WANT*/
/* .gradient {background: linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%);} */

const picker1 = document.getElementById("picker-1");
const picker2 = document.getElementById("picker-2");
const split = document.getElementById("split");
const direction = document.getElementById("direction");
const gradientForm = document.getElementById("gradient");

picker1.addEventListener("input", changeGradient);
picker2.addEventListener("input", changeGradient);
split.addEventListener("input", changeGradient);
direction.addEventListener("input", changeGradient);
gradientForm.addEventListener("submit", (e) => e.preventDefault());

function changeGradient() {
  let degreesArr = direction.value.split("°");
  let [degreeValue] = degreesArr;
  console.log(degreeValue);
  gradientForm.style.background = `linear-gradient(${degreeValue}deg, ${picker1.value} ${split.value}%, ${picker2.value})`;
  direction.value = `${degreeValue}°`;
}
