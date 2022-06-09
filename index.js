import "./components/Boomword.js";
import "./components/BoomwordKeyboard.js";

if (window.localStorage.getItem("firstTime") == null) {
  window.localStorage.setItem("score", 0);
  window.localStorage.setItem("nextDay", getTodayTimestamp());
  window.localStorage.setItem("firstTime", "YES");
  window.localStorage.setItem("lives", 3);
  window.localStorage.setItem("win", "NO");
}

if (window.localStorage.getItem("firstTime") == "YES") {
  openInstructions();
} else {
  closeInstructions();
}

document.getElementById("buttonInstructions").addEventListener("click", openInstructions);
document.getElementById("buttonCloseInstructions").addEventListener("click", closeInstructions);

document.getElementById("buttonStats").addEventListener("click", openStats);
document.getElementById("buttonCloseStats").addEventListener("click", closeStats);

document.getElementById("buttonOptions").addEventListener("click", openOptions);
document.getElementById("buttonCloseOptions").addEventListener("click", closeOptions);



function getTodayTimestamp() {
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}


function closeInstructions() {
  document.getElementById("help").style.display = "none";
  document.getElementById("header").style.display = "flex";
  document.getElementById("container").style.display = "flex";
}

function openInstructions() {
  document.getElementById("header").style.display = "none";
  document.getElementById("container").style.display = "none";
  document.getElementById("help").style.display = "block";
}

function closeStats() {
  document.getElementById("stats").style.display = "none";
  document.getElementById("header").style.display = "flex";
  document.getElementById("container").style.display = "flex";
}

function openStats() {
  document.getElementById("header").style.display = "none";
  document.getElementById("container").style.display = "none";
  document.getElementById("stats").style.display = "block";
}

function closeOptions() {
  document.getElementById("options").style.display = "none";
  document.getElementById("header").style.display = "flex";
  document.getElementById("container").style.display = "flex";
}

function openOptions() {
  document.getElementById("header").style.display = "none";
  document.getElementById("container").style.display = "none";
  document.getElementById("options").style.display = "block";
}
