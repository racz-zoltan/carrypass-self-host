(function () {
  "use strict";
  var theme = "light";
  try {
    var saved = localStorage.getItem("dw-theme");
    if (saved === "dark" || saved === "light") {
      theme = saved;
    } else {
      localStorage.setItem("dw-theme", theme);
    }
  } catch (_) {
  }
  document.documentElement.setAttribute("data-theme", theme);
})();