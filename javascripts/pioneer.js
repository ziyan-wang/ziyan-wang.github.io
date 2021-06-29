"use strict";
(function () {

  function rejectUnsupportedBrowsers() {
    // does not support IE
    // WARNING: cannot use window.stop() in IE
    if (window.navigator.userAgent.match(/(MSIE|Trident)/) !== null) {
      window.location.replace('unsupported.html');
    }
  }

  // switch language (redirect) at page load according to localStorage
  // should be executed before the user sees the page content to avoid "blink"
  function switchLanguage() {
    var languageState = localStorage.getItem("language");
    if (languageState !== null) {
      var htmlLanguage = document.documentElement.lang;
      if (languageState === "english" && htmlLanguage !== "en") {
        window.stop();
        window.location.replace('index.html');
      } else if (languageState === "chinese" && htmlLanguage !== 'zh') {
        window.stop();
        window.location.replace('index_cn.html');
      }
    }
  }

  rejectUnsupportedBrowsers();
  switchLanguage();

})();
