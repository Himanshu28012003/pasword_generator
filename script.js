const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]");
const upperCasecheck = document.querySelector("#vehicle1");
const lowerCasecheck = document.querySelector("#vehicle2");
const numberscheck = document.querySelector("#vehicle3");
const Symbolscheck = document.querySelector("#vehicle4");
const Generatebtn = document.querySelector(".a");
const Indicatorbtn = document.querySelector("[data-indicator]");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&()_+=/?.,><-";

let password = "";
let passwordLength = 10;
let checkCount = 0;

function handleslider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setindicator(color) {
  Indicatorbtn.style.backgroundColor = color;
}

function getrndinteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getrndnumber() {
  return getrndinteger(0, 10); 
}

function getlowercase() {
  return String.fromCharCode(getrndinteger(97, 123));
}

function getuppercase() {
  return String.fromCharCode(getrndinteger(65, 91));
}

function getsymbols() {
  const rnd = getrndinteger(0, symbols.length);
  return symbols.charAt(rnd);
}

function calcStrength() {
  let hasupper = upperCasecheck.checked;
  let haslower = lowerCasecheck.checked;
  let hassymbol = Symbolscheck.checked;
  let hasnumber = numberscheck.checked;

  if (hasupper && haslower && (hassymbol || hasnumber) && passwordLength >= 8) {
    setindicator("#0f0");
  } else if ((hasupper || haslower) && (hassymbol || hasnumber) && passwordLength >= 6) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copymsg.innerText = "Copied";
  } catch (e) {
    copymsg.innerText = "Failed";
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

function handlecheckboxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  if (passwordLength < checkCount) passwordLength = checkCount;
  handleslider();
}

function generatePassword() {
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) passwordLength = checkCount;

  let funArr = [];
  if (upperCasecheck.checked) funArr.push(getuppercase);
  if (lowerCasecheck.checked) funArr.push(getlowercase);
  if (numberscheck.checked) funArr.push(getrndnumber);
  if (Symbolscheck.checked) funArr.push(getsymbols);


  password = "";
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  for (let i = funArr.length; i < passwordLength; i++) {
    let rndindex = getrndinteger(0, funArr.length);
    password += funArr[rndindex]();
  }

 
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  
  calcStrength();
}

allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleslider();
});

copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

Generatebtn.addEventListener("click", () => {
  generatePassword();
});
handleslider();