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
var toggleDarkModeButtons = [".gg-moon", ".gg-sun"].map(function(className) { 
  return document.querySelector(className);
});
var resetDarkModeButton = document.querySelector(".link-reset-dark-mode");
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

var currentTheme = localStorage.getItem("theme");
if (prefersDarkScheme.matches) {
  if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
  }
} else {
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
  }
}

toggleDarkModeButtons.forEach(function(button) {
  button.addEventListener("click", function () {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("light-theme");
      var theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    } else {
      document.body.classList.toggle("dark-theme");
      var theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    }
    localStorage.setItem("theme", theme);
    resetDarkModeButton.style.display = "inline";
  });
})

resetDarkModeButton.addEventListener("click", function () {
  localStorage.removeItem("theme");
  document.body.classList.remove("light-theme");
  document.body.classList.remove("dark-theme");
  resetDarkModeButton.style.display = "none";
});
