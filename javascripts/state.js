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
    var toggleDarkModeButton = document.getElementById("btn-toggle-dark-mode");
    var toggleDarkModeButtonClickListener = function() {
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
    };
    toggleDarkModeButton.addEventListener("click", toggleDarkModeButtonClickListener);
    toggleDarkModeButton.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        toggleDarkModeButtonClickListener();
      }
    });
  
    // listen to resetDarkModeButton
    resetDarkModeButton.addEventListener("click", function () {
      localStorage.removeItem("theme");
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
      document.body.classList.remove("manual-theme");
    });
  }

  function initializeHeaderLogo() {
    var logo1 = document.getElementById("logo1");
    var logo2 = document.getElementById("logo2");
    var logoSwitchHint = document.getElementById("logo-switch-hint");
    var logoIdKey = "logoId";
    var hideLogoSwitchHintKey = "hideLogoSwitchHint";
    var displayNoneClass = "display-none";

    // decide which logo to use by localStorage
    var logoIdState = localStorage.getItem(logoIdKey);
    if (logoIdState === "2") {
      logo1.classList.add(displayNoneClass);
      logo2.classList.remove(displayNoneClass);
    }

    // decide whether to hide logo switch hint by localStorage
    var hideLogoSwitchHintState = localStorage.getItem(hideLogoSwitchHintKey);
    if (hideLogoSwitchHintState === "true") {
      logoSwitchHint.classList.add(displayNoneClass);
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
      logoSwitchHint.classList.add(displayNoneClass); // hide logo switch hint
      if (localStorage.getItem(hideLogoSwitchHintKey) !== "true") {
        localStorage.setItem(hideLogoSwitchHintKey, "true");
      }
    };
    var logoWrapper = document.getElementById("logo-wrapper");
    logoWrapper.addEventListener("click", logoOnClickListener);
    logoWrapper.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        logoOnClickListener();
      }
    });
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
        window.location.replace("/en/index.html");
      } else if (targetLanguage === "chinese" && htmlLanguage !== "zh") {
        localStorage.setItem("language", "chinese");
        window.location.replace("/zh/index.html");
      }
    }

    // listen to switch language link
    var switchLanguageLink = document.getElementById("link-switch-language");
    var htmlLanguage = document.documentElement.lang;
    var htmlLanguageClickListener = function() {
      switchLanguageLink.innerHTML += "&#8987;";  // add hourglass loading icon
      switchLanguageAndRedirect(htmlLanguage, getOpposingTargetLanguageFromHtmlLanguage(htmlLanguage));
    };
    switchLanguageLink.addEventListener("click", htmlLanguageClickListener);
    switchLanguageLink.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        htmlLanguageClickListener();
      }
    })
  }

  function initializeAccessibilityMode() {
    // listen to toggle-accessibility-mode button
    var toggleAccessibilityModeButton = document.getElementById("toggle-accessibility-mode");
    var accessibilityModeClass = "accessibility-mode";
    var accessibilityModeKey = "accessibilityMode";
    var checkSign = " &check;";
    var toggleAccessibilityMode = function(isPageLoad) {
      if (isPageLoad === true) {
        document.body.classList.add(accessibilityModeClass);
        toggleAccessibilityModeButton.innerHTML += checkSign;
      } else {
        document.body.classList.toggle(accessibilityModeClass);
        if (document.body.classList.contains(accessibilityModeClass)) {
          toggleAccessibilityModeButton.innerHTML += checkSign;
          localStorage.setItem(accessibilityModeKey, "true");
        } else {
          toggleAccessibilityModeButton.innerHTML =
            toggleAccessibilityModeButton.innerHTML.substring(0, toggleAccessibilityModeButton.innerHTML.length - 2);
          localStorage.removeItem(accessibilityModeKey);
        }
      }
    }
    toggleAccessibilityModeButton.addEventListener("click", function() {
      toggleAccessibilityMode(false);
    });

    // decide whether to use accessibility mode by localStorage
    if (localStorage.getItem(accessibilityModeKey) === "true") {
      toggleAccessibilityMode(true);
    }
  }

  function handleDetailTagsWhenPrint() {
    var printHandler = (function () {
      var details = document.getElementsByTagName("details");
      var detailsOriginallyOpened = [];
      var forceOpenDetail = function() {
        if (detailsOriginallyOpened.length > 0) {
          detailsOriginallyOpened = [];
        }
        for (var i = 0; i < details.length; i += 1) {
          detailsOriginallyOpened.push(details[i].open);
          details[i].open = true;
        }
      };

      var restoreDetailOpenState = function() {
        for (var i = 0; i < detailsOriginallyOpened.length; i += 1) {
          if (!detailsOriginallyOpened[i]) {
            details[i].open = false;
          }
        }
        detailsOriginallyOpened = [];
      };
      return {before: forceOpenDetail, after: restoreDetailOpenState};
    })();

    window.onbeforeprint = printHandler.before;
    window.onafterprint = printHandler.after;
  }

  function upgradeLocalStorageDataVersion() {
    // data versions for localStorage data
    // v1: theme["dark", "light"], biographyFold["unfolded", "folded"]
    // v2: theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese", "esperanto"]
    // v3: dataVersion["3"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"]
    // v4: dataVersion["4"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"], logoId["1", "2"]
    // v5: dataVersion["5"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"], logoId["1", "2"], accessibilityMode["false", "true"]
    // v6: dataVersion["5"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"], logoId["1", "2"], accessibilityMode["false", "true"], hideLogoSwitchHint["false", "true"]
    // v7: dataVersion["5"], theme["dark", "light"], biographyFold["unfolded", "folded"], language["english", "chinese"], logoId["1", "2"], accessibilityMode["false", "true"], hideLogoSwitchHint["false", "true"], noConfirmForUnavailableLinks["true"]

    // note: Before v3, version flags (v1 and v2) are not recorded in localStorage
    // breaking changes: v2 -> v3

    var currentDataVersion = "7";
    var versionState = localStorage.getItem("dataVersion");
    if (versionState === null) {
      // set version flag during the first page load
      localStorage.setItem("dataVersion", currentDataVersion);

      // upgrade from v2 to v3
      // unsupported legacy Esperanto language, reset to English
      if (localStorage.getItem("language") === "esperanto") {
        console.log("Local data upgraded: supports for Esperanto have been removed, resetting language");
        localStorage.removeItem("language");
      }
    } else if (versionState === "3" || versionState === "4" || versionState === "5" || versionState === "6") {
      // set version flag during the first page load
      // upgrade from v3/v4/v5/v6 to v7, no action is needed
      localStorage.setItem("dataVersion", currentDataVersion);
    }
  }

  upgradeLocalStorageDataVersion();
  initializeDarkMode();
  initializeHeaderLogo();
  initializeBiographyReadMore();
  initializeAccessibilityMode();
  initializeLanguages();
  handleDetailTagsWhenPrint();

})();
