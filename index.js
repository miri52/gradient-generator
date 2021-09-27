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

const picker1 = document.getElementById("picker-1");
const picker2 = document.getElementById("picker-2");
const split = document.getElementById("split");
const direction = document.getElementById("direction");
const gradientForm = document.getElementById("gradient");
const target = document.getElementById("target");

const inspirationsContainer = document.getElementById("container-inspiration");

/******************
 * Initialization
 ***************/

/* Initialize gradient form */

(function () {
  const initialGradient = `linear-gradient(90deg, ${picker1.value} ${split.value}%, ${picker2.value})`;
  gradientForm.style.background = initialGradient;
  target.textContent = `background: ${initialGradient}`;
})();

/* Initialize inspirations */

function renderInspirations(data) {
  let html = `<h3>Get Inspired</h3>`;
  let backgroundStyle = "";
  data.inspirations.forEach((el) => {
    backgroundStyle = `linear-gradient(${el.degrees}deg, ${el.firstColor} ${el.split}%, ${el.secondColor})`;
    html += `
     <a class="inspiration inspiration-${el.id}" style="background: ${backgroundStyle}" href="#gradient">
    <div ><span>${el.firstColor}</span><i class="fas fa-long-arrow-alt-right"></i><span>${el.secondColor}</span></div></a>
    `;
  });
  inspirationsContainer.innerHTML = html;
}

(async function getInspirations() {
  try {
    const res = await fetch("inspirations.json");
    if (!res.ok)
      throw new Error("Problem getting information about the inspirations");
    const data = await res.json();
    renderInspirations(data);
    addEventListeners(data);
  } catch (err) {
    console.error(err.message);
  }
})();

/**********************
 * Main functionality - updating gradients
 ***********/

/* Update gradient based on inspiration clicked */

function updateGradient(inspiration) {
  const degreeValue = inspiration.degrees;
  picker1.value = inspiration.firstColor;
  picker2.value = inspiration.secondColor;
  split.value = inspiration.split;
  styleGradientForm(degreeValue);
  updateSplit();
  setContrastingColor();
}

function addEventListeners(data) {
  data.inspirations.forEach((el) => {
    document
      .querySelector(`.inspiration-${el.id}`)
      .addEventListener("click", () => updateGradient(el));
  });
}

/* Update gradient based on user's interaction with the form */

function changeGradient() {
  const degreesArr = direction.value.split("°");
  const degreeValue = Number(degreesArr[0]);
  if (isNaN(degreeValue)) {
    degreeValue = 0;
  }
  styleGradientForm(degreeValue);
  setContrastingColor();
}

/***********************
 *  Form styling
 * ***************/

function styleGradientForm(degreeValue) {
  const newGradient =
    degreeValue === 0
      ? `linear-gradient(${picker1.value} ${split.value}%, ${picker2.value})`
      : `linear-gradient(${degreeValue}deg, ${picker1.value} ${split.value}%, ${picker2.value})`;
  gradientForm.style.background = newGradient;
  target.textContent = `background: ${newGradient}`;
  direction.value = `${degreeValue}°`;
}

/* Check for contrast ratio and style text accordingly */

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

function setContrastingColor() {
  const contrastingTextColor = getContrast(picker1.value);
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

/* Control and style the split slider */

function updateSplit() {
  let value = ((split.value - split.min) / (split.max - split.min)) * 100;
  if (split.classList.contains("input-range-dark")) {
    split.style.background = `linear-gradient(to right, #171b41 0%, #171b41 ${value}%, #fff ${value}%, #fff 100%`;
  } else if (split.classList.contains("input-range-light")) {
    split.style.background = `linear-gradient(to right, #fff 0%, #fff ${value}%, #171b41 ${value}%, #171b41 100%`;
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

/*********************
 *  Event listeners
 * *********************/

picker1.addEventListener("input", changeGradient);
picker2.addEventListener("input", changeGradient);
direction.addEventListener("input", changeGradient);
gradientForm.addEventListener("submit", (e) => e.preventDefault());
split.addEventListener("input", () => {
  changeGradient();
  updateSplit();
});
