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
/* .gradient {background: linear-gradient(90deg, #33ccff 0%, #ff99cc);} */

const picker1 = document.getElementById("picker-1");
const picker2 = document.getElementById("picker-2");
const split = document.getElementById("split");
const direction = document.getElementById("direction");
const gradientForm = document.getElementById("gradient");
const target = document.getElementById("target");

/* Initialize */

(function () {
  const initialGradient = `linear-gradient(90deg, ${picker1.value} ${split.value}%, ${picker2.value})`;
  gradientForm.style.background = initialGradient;
  target.textContent = `background: ${initialGradient}`;
})();

/* Update gradient based on user's interaction */

function changeGradient() {
  const degreesArr = direction.value.split("°");
  let degreeValue = Number(degreesArr[0]);
  if (isNaN(degreeValue)) {
    degreeValue = 0;
  }
  const newGradient =
    degreeValue === 0
      ? `linear-gradient(${picker1.value} ${split.value}%, ${picker2.value})`
      : `linear-gradient(${degreeValue}deg, ${picker1.value} ${split.value}%, ${picker2.value})`;
  gradientForm.style.background = newGradient;
  target.textContent = `background: ${newGradient}`;
  direction.value = `${degreeValue}°`;
  console.log(newGradient);
  const contrastingTextColor = getContrast(picker1.value);
  console.log(contrastingTextColor);
  gradientForm.style.color = contrastingTextColor;
  if (contrastingTextColor === "white") {
    split.classList.add("input-range-light");
    split.classList.remove("input-range-dark");
    updateSplit();
  } else if (contrastingTextColor === "#171b41") {
    split.classList.add("input-range-dark");
    split.classList.remove("input-range-light");
    updateSplit();
  }
}

/* Select the code div to make it easier to copy */

function selectText() {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(target);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}

const clickable = document.querySelector(".click-me");
clickable.addEventListener("click", () => selectText());

/* Control and style the split slider */

function updateSplit() {
  let value = ((split.value - split.min) / (split.max - split.min)) * 100;
  if (split.classList.contains("input-range-dark")) {
    split.style.background = `linear-gradient(to right, #171b41 0%, #171b41 ${value}%, #fff ${value}%, #fff 100%`;
  } else if (split.classList.contains("input-range-light")) {
    split.style.background = `linear-gradient(to right, #fff 0%, #fff ${value}%, #171b41 ${value}%, #171b41 100%`;
  }
}

/* Event listeners */

picker1.addEventListener("input", changeGradient);
picker2.addEventListener("input", changeGradient);
direction.addEventListener("input", changeGradient);
gradientForm.addEventListener("submit", (e) => e.preventDefault());
split.addEventListener("input", () => {
  changeGradient();
  updateSplit();
});

/* Check for contrast ratio */

function getContrast(hexcolor) {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#171b41" : "white";
}
