var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}

// Dark mode
function switchToLightMode() {
  document.querySelector(".gg-moon").style.display = "block";
  document.querySelector(".gg-sun").style.display = "none";
}

function switchToDarkMode() {
  document.querySelector(".gg-moon").style.display = "none";
  document.querySelector(".gg-sun").style.display = "block";
}

const btn = document.querySelector(".btn-toggle-dark-mode");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "light") {
  document.body.classList.toggle("light-theme");
  switchToLightMode();
} else if (currentTheme == "dark" || prefersDarkScheme.matches) {
  document.body.classList.toggle("dark-theme");
  switchToDarkMode();
}

btn.addEventListener("click", function () {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-theme");
    var theme = document.body.classList.contains("light-theme") ? "light" : "dark";
  } else {
    document.body.classList.toggle("dark-theme");
    var theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  }
  if (theme === "dark") {
    switchToDarkMode();
  } else {
    switchToLightMode();
  }
  localStorage.setItem("theme", theme);
});
