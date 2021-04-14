"use strict";
(function () {
  function assert(predicate, errorMessage) {
    if (!predicate) {
      throw new Error(errorMessage);
    }
  }

  function isValidHtmlLanguage(htmlLanguage) {
    return htmlLanguage === "en" || htmlLanguage === "zh";
  }

  function isValidTargetLanguage(targetLanguage) {
    return targetLanguage === "english" || targetLanguage === "chinese";
  }

  function getOpposingTargetLanguageFromHtmlLanguage(htmlLanguage) {
    assert(isValidHtmlLanguage(htmlLanguage), "Unrecognized htmlLanguage: " + htmlLanguage);
    return htmlLanguage === "en" ? "chinese" : "english";
  }

  function initializeDarkMode() {
    var toggleDarkModeButtons = [".gg-moon", ".gg-sun"].map(function(className) { 
      return document.querySelector(className);
    });
    var resetDarkModeButton = document.querySelector(".link-reset-dark-mode");
    var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
    // decide which theme to use by localStorage and media
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

    // listen to toggleDarkModeButton
    toggleDarkModeButtons.forEach(function(button) {
      button.addEventListener("click", function () {
        var theme;
        if (prefersDarkScheme.matches) {
          document.body.classList.toggle("light-theme");
          theme = document.body.classList.contains("light-theme") ? "light" : "dark";
        } else {
          document.body.classList.toggle("dark-theme");
          theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        }
        document.body.classList.add("manual-theme");
        localStorage.setItem("theme", theme);
      });
    })
  
    // listen to resetDarkModeButton
    resetDarkModeButton.addEventListener("click", function () {
      localStorage.removeItem("theme");
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
      document.body.classList.remove("manual-theme");
    });
  }

  function initializeHeaderLogo() {
    var logoIdKey = "logoId";
    var logo1 = document.getElementById("logo1");
    var logo2 = document.getElementById("logo2");
    var displayNoneClass = "display-none";

    // decide which logo to use by localStorage
    var logoIdState = localStorage.getItem(logoIdKey);
    if (logoIdState === "2") {
      logo1.classList.add(displayNoneClass);
      logo2.classList.remove(displayNoneClass);
    }

    // listen to click event on header logo
    var logoOnClickListener = function() {
      logo1.classList.toggle(displayNoneClass);
      logo2.classList.toggle(displayNoneClass);
      if (!logo1.classList.contains(displayNoneClass)) { // showing logo 1
        localStorage.removeItem(logoIdKey);
      } else if (!logo2.classList.contains(displayNoneClass)) { // showing logo 2
        localStorage.setItem(logoIdKey, "2");
      }
    };
    logo1.addEventListener("click", logoOnClickListener);
    logo2.addEventListener("click", logoOnClickListener);
  }

  function initializeBiographyReadMore() {
    var readMoreButton = document.querySelector(".btn-read-more-biography");
    var biographyParagraph = document.querySelector(".biography");
    var htmlLanguage = document.documentElement.lang;
    if (!isValidHtmlLanguage(htmlLanguage)) {
      console.error("Unsupported html.lang, defaulting to English");
      htmlLanguage = "en";
    }
    var readMoreText = {
      "en": "Read more &#9660;",
      "zh": "全文 &#9660;",
    };
    var readLessText = {
      "en": "Read less &#9650;",
      "zh": "收起 &#9650;",
    }

    // decide whether to unfold by localStorage
    var storageFoldState = localStorage.getItem("biographyFold");
    var foldState = (storageFoldState === null) ? "folded" : storageFoldState;
    if (foldState === "unfolded") {
      biographyParagraph.classList.remove("text-fade-out");
      readMoreButton.innerHTML = readLessText[htmlLanguage];
    }

    // listen to readMoreButton
    readMoreButton.addEventListener("click", function () {
      biographyParagraph.classList.toggle("text-fade-out");
      if (foldState === "folded") {
        // unfold
        readMoreButton.innerHTML = readLessText[htmlLanguage];
        foldState = "unfolded";
        localStorage.setItem("biographyFold", foldState);
      } else if (foldState === "unfolded") {
        // fold
        readMoreButton.innerHTML = readMoreText[htmlLanguage];
        foldState = "folded";
        localStorage.removeItem("biographyFold");
      } else {
        throw new Error("Unexpected foldState: " + foldState.toString());
      }
    });
  }

  function initializeLanguages() {
    function switchLanguageAndRedirect(htmlLanguage, targetLanguage) {
      assert(isValidHtmlLanguage(htmlLanguage), "Unrecognized htmlLanguage: " + htmlLanguage);
      assert(isValidTargetLanguage(targetLanguage), "Unrecognized targetLanguage: " + targetLanguage);
      if (targetLanguage === "english" && htmlLanguage !== "en") {
        localStorage.setItem("language", "english");
        window.location.replace("index.html");
      } else if (targetLanguage === "chinese" && htmlLanguage !== "zh") {
        localStorage.setItem("language", "chinese");
        window.location.replace("index_cn.html");
      }
    }

    // listen to switch language link
    var switchLanguageLink = document.getElementById("link-switch-language");
    var htmlLanguage = document.documentElement.lang;
    switchLanguageLink.addEventListener("click", function() {
      switchLanguageLink.innerHTML += "&#8987;";  // add hourglass loading icon
      switchLanguageAndRedirect(htmlLanguage, getOpposingTargetLanguageFromHtmlLanguage(htmlLanguage));
    });
  }

  function upgradeLocalStorageDataVersion() {
    // data versions for localStorage data
    // v1: theme["dark", "light"], biographyFold["unfolded", "folded"]
    // v2: theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese", "esperanto"]
    // v3: dataVersion["3"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"]
    // v4: dataVersion["4"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"], logoId["1", "2"]

    // note: Before v3, version flags (v1 and v2) are not recorded in localStorage

    var versionState = localStorage.getItem("dataVersion");
    if (versionState === null) {
      // set version flag during the first page load
      localStorage.setItem("dataVersion", "4");

      // upgrade from v2 to v4
      // unsupported legacy Esperanto language, reset to English
      if (localStorage.getItem("language") === "esperanto") {
        console.log("Local data upgraded: supports for Esperanto have been removed, resetting language");
        localStorage.removeItem("language");
      }
    } else if (versionState === "3") {
      // set version flag during the first page load
      // upgrade from v3 to v4, no action is needed
      localStorage.setItem("dataVersion", "4");
    }
  }

  upgradeLocalStorageDataVersion();
  initializeDarkMode();
  initializeHeaderLogo();
  initializeBiographyReadMore();
  initializeLanguages();

})();
