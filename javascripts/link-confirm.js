"use strict";
(function () {
  function hasArgumentInQueryString(argumentName) {
    var matches = new RegExp(argumentName + "=([^&]+)").exec(window.location.search);
    return !(matches === null || matches.length !== 2);
  }

  function getArgumentFromQueryString(argumentName) {
    var matches = new RegExp(argumentName + "=([^&]+)").exec(window.location.search);
    if (matches === null || matches.length !== 2) {
      throw new Error('Illegal query string');
    }
    return matches[1];
  }

  function initPage() {
    var siteNameMap = {
      "en.wikipedia.org": "维基百科",
      "scholar.google.com": "谷歌学术",
      "github.com": "GitHub",
      "@/.+/link-captcha": "GitHub",
    };

    function getSiteNameFromUrl(url) {
      for (var key in siteNameMap) {
        if (new RegExp(key).test(url)) {
          return siteNameMap[key];
        }
      }
      throw new Error("Unrecognized url");
    }

    var url = getArgumentFromQueryString("url");
    document.getElementById("url").innerHTML = url;
    document.getElementById("link-site-name").innerHTML = getSiteNameFromUrl(url);
    if (hasArgumentInQueryString("hideUrl") && getArgumentFromQueryString("hideUrl") === "true") {
      document.getElementById("url-wrapper").style.display = "none";
    }
  }

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

  function goBack() {
    window.close(); // for PC and mobile browsers
    window.history.back(); // for mobile apps which disallow window.close()
  }

  function goForward() {
    var url = getArgumentFromQueryString("url");
    window.location.replace(url.replace("@", window.location.origin));
  }

  function goForwardForce() {
    localStorage.setItem("noConfirmForUnavailableLinks", "true");
    goForward();
  }

  window.goBack = goBack;
  window.goForward = goForward;
  window.goForwardForce = goForwardForce;

  initPage();
  initDarkMode();
  initAccessibilityMode();
})();
