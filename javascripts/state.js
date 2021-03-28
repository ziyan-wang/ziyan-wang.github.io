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
        if (prefersDarkScheme.matches) {
          document.body.classList.toggle("light-theme");
          var theme = document.body.classList.contains("light-theme") ? "light" : "dark";
        } else {
          document.body.classList.toggle("dark-theme");
          var theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
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
        window.location.replace('index.html');
      } else if (targetLanguage === "chinese" && htmlLanguage !== 'zh') {
        localStorage.setItem("language", "chinese");
        window.location.replace('index_cn.html');
      }
    }

    // listen to switch language link
    var switchLanguageLink = document.getElementById("link-switch-language");
    var htmlLanguage = document.documentElement.lang;
    switchLanguageLink.addEventListener("click", function() {
      document.getElementById('link-switch-language').innerHTML += "&#8987;";  // add hourglass loading icon
      switchLanguageAndRedirect(htmlLanguage, getOpposingTargetLanguageFromHtmlLanguage(htmlLanguage));
    });

    // switch language at page load according to localStorage
    var languageState = localStorage.getItem("language");
    if (languageState !== null) {
      if (!isValidTargetLanguage(languageState)) {
        // unsupported legacy languageState, reset to English
        localStorage.setItem("language", "english");
        languageState = "english";
      }
      switchLanguageAndRedirect(htmlLanguage, languageState);
    }
  }

  initializeDarkMode();
  initializeBiographyReadMore();
  initializeLanguages();

})();
