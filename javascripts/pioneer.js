"use strict";
(function () {

  // switch language (redirect) at page load according to localStorage
  // should be executed before the user sees the page content to avoid "blink"
  function switchLanguage() {
    var languageState = localStorage.getItem("language");
    if (languageState !== null) {
      var htmlLanguage = document.documentElement.lang;
      if (languageState === "english" && htmlLanguage !== "en") {
        console.log('switch en');
        window.stop();
        window.location.replace('index.html');
      } else if (languageState === "chinese" && htmlLanguage !== 'zh') {
        console.log('switch cn');
        window.stop();
        window.location.replace('index_cn.html');
      }
    }
  }

  switchLanguage();

})();
