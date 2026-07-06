(function initHero() {
  var carousel = document.getElementById("heroCarousel");
  if (carousel) {
    var slides = carousel.querySelectorAll("img");
    var idx = 0;
    if (slides.length > 1) {
      setInterval(function () {
        slides[idx].classList.remove("active");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("active");
      }, 4500);
    }
  }

  function duplicateTrack(id) {
    var track = document.getElementById(id);
    if (track && !track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "1";
    }
  }

  duplicateTrack("expCarousel");
  duplicateTrack("techCarousel");
})();

function go(id) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });
  var el = document.getElementById(id);
  if (el) el.classList.add("active");
  var nav = document.getElementById("navlinks");
  if (nav) nav.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.getElementById("burger") &&
  document.getElementById("burger").addEventListener("click", function () {
    document.getElementById("navlinks").classList.toggle("open");
  });

/* chat interactivo: ver js/whatsapp-chat.js */
