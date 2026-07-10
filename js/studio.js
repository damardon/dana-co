/* Studio — interacciones generales */
(function () {
  "use strict";

  document.querySelectorAll(".industry-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".industry-chip").forEach(function (c) {
        c.classList.remove("active");
      });
      chip.classList.add("active");
      var detail = document.getElementById("industry-detail");
      if (detail) detail.textContent = chip.dataset.desc || "";
    });
  });

  document.querySelectorAll(".flow-node").forEach(function (node, i) {
    node.addEventListener("mouseenter", function () {
      document.querySelectorAll(".flow-node").forEach(function (n, j) {
        n.classList.toggle("lit", j <= i);
      });
      var tip = document.getElementById("flow-mascot-tip");
      if (tip) tip.textContent = node.dataset.tip || "";
    });
  });

})();
