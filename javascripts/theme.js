"use strict";
(function () {
  function initDarkMode() {
    var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    var currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.body.classList.add("manual-theme");
    }
    if (prefersDarkScheme.matches) {
      if (currentTheme === "light") {
        document.body.classList.toggle("light-theme");
      }
    } else {
      if (currentTheme === "dark") {
        document.body.classList.toggle("dark-theme");
      }
    }
  }

  function initAccessibilityMode() {
    if (localStorage.getItem("accessibilityMode") === "true") {
      document.body.classList.add("accessibility-mode");
    }
  }

  initDarkMode();
  initAccessibilityMode();
})();
