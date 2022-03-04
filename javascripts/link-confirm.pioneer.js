"use strict";
(function () {
  if (localStorage.getItem("noConfirmForUnavailableLinks") === "true") {
    var urlMatches = new RegExp("url=([^&]+)").exec(window.location.search);
    if (urlMatches === null || urlMatches.length !== 2) {
      throw new Error('Illegal query string');
    }
    window.stop();
    window.location.replace(urlMatches[1]);
  }
})();
