"use strict";
(function () {
  // does not support IE
  // WARNING: cannot use window.stop() in IE
  if (window.navigator.userAgent.match(/(MSIE|Trident)/) !== null) {
    window.location.replace('/unsupported.html');
  }
})();
