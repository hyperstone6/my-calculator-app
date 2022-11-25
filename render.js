//Constants for linking the DOM nodes from the document

const numBtns = document.querySelectorAll("[data-number]");
const operatorBtns = document.querySelectorAll(".operators");
const currentOutput = document.querySelector(".main-result");
const previousOutput = document.querySelector(".sub-result");
const allClearBtn = document.querySelector(".AC");
const equalsBtn = document.querySelector(".equals");
const deleteBtn = document.querySelector(".del");
const plusMinusBtn = document.querySelector(".invert");

//Shared global variables

let curr = "";
let prev = "";
let operate = "";
let computation = undefined;
let equaled = false;
let mode = "";

//Function to update the screen

const updateScreen = () => {
  if (!isNaN(curr)) {
    currentOutput.innerText = curr.toLocaleString("en-GB");
    if (computation) {
      currentOutput.classList.add("result");
    }
  }

  previousOutput.innerText = `${prev} ${operate}`;
};

//Function to perform the math operation

const compute = () => {
  if (isNaN(curr) || isNaN(prev)) return;

  curr = parseFloat(curr);
  prev = parseFloat(prev);

  switch (operate) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    default:
      return;
  }

  curr = computation;
  prev = "";
  operate = "";

  updateScreen();

  computation = undefined;
};

//Functions for AC 'All Clear' and its event listener

const clearFn = () => {
  curr = "";
  prev = "";
  operate = "";
  equaled = false;
  computation = undefined;
};

const allClear = allClearBtn.addEventListener("click", () => {
  clearFn();

  updateScreen();
});

//Function for clicking or keypressing numbers and its event listener

const numberFn = (e) => {
  if (equaled) return;

  currentOutput.classList.remove("result");

  if (mode === "numclicking") {
    if (e.target.innerText === "." && curr.includes(".")) return;
    curr += e.target.innerText;
  }

  if (mode === "keypressing") {
    if (e === "." && curr.includes(".")) return;
    curr += e;
  }

  updateScreen();

  if (curr.length > 16) {
    clearFn();
    currentOutput.innerText = "Maximum number of digits: 16";
  }
};

const numClicks = numBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    mode = "numclicking";
    numberFn(e);
  });
});

//Function to change the mode of operation

const operatorFn = (e) => {
  equaled = false;

  if (!curr) return;
  if (prev) {
    compute();
  }

  if (mode === "numclicking") {
    operate = e.target.innerText;
  }

  if (mode === "operating") {
    if (e === "/") {
      e = "÷";
    }
    operate = e;
  }

  prev = curr;
  curr = "";

  updateScreen();
};

const operators = operatorBtns.forEach((btn) => {
  btn.addEventListener("click", operatorFn);
});

//Function to delete one number
//If the equal button was pressed, it invokes the All Clear
//function instead unless an operator key is pressed

const deleteFn = () => {
  if (typeof curr === "string") {
    curr = curr.slice(0, curr.length - 1);
  } else {
    clearFn();
  }

  updateScreen();

  if (computation) return;
};

const del = deleteBtn.addEventListener("click", deleteFn);

//Function to return and compute the inputted numbers

const equals = equalsBtn.addEventListener("click", () => {
  compute();

  if (curr) {
    equaled = true;
  }
});

//Function to toggle between positive and negative integers

const plusMinusFn = () => {
  curr = curr * -1;
  curr = curr.toString();

  updateScreen();
};

const plusMinus = plusMinusBtn.addEventListener("click", plusMinusFn);

//Function to enable keyboard pressing of numbers and operators

window.addEventListener("load", () => {
  document.addEventListener("keydown", (e) => {
    let item = e.key;
    let filteredNums = "";
    let filteredOperators = "";

    if (item.includes(item[item.search(/[0-9,'.']/g)])) {
      mode = "keypressing";
      filteredNums = item;
      numberFn(filteredNums);
    } else if (item.includes(item[item.search(/[-'+','*','/']/g)])) {
      filteredOperators = item;
      mode = "operating";
      operatorFn(filteredOperators);
    } else if (item === "Enter") {
      compute();
    } else if (item === "Backspace") {
      deleteFn();
    }
  });
});