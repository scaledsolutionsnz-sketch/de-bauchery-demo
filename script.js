/* De Bauchery, Tikipunga Whangarei */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Opening curtain ---- */
  var curtain = document.getElementById("curtain");
  function lift() {
    if (!curtain) return;
    curtain.classList.add("done");
    setTimeout(function () {
      if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
    }, 900);
  }
  if (curtain) {
    window.addEventListener("load", function () { setTimeout(lift, reduced ? 120 : 850); });
    setTimeout(lift, 3200);
  }

  /* ---- Build the email button link in JS so it cannot be rewritten ---- */
  document.querySelectorAll("a[data-gmail]").forEach(function (a) {
    var to = a.getAttribute("data-user") + "@" + a.getAttribute("data-domain");
    a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) +
             "&su=" + (a.getAttribute("data-su") || "") +
             "&body=" + (a.getAttribute("data-body") || "");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---- Nav ---- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("solid");
    else if (!menu || !menu.classList.contains("open")) nav.classList.remove("solid");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open && nav) nav.classList.add("solid");
      else onScroll();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        onScroll();
      });
    });
  }

  /* ---- Hero slide rotation ---- */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1 && !reduced) {
    var s = 0;
    setInterval(function () {
      slides[s].classList.remove("on");
      s = (s + 1) % slides.length;
      slides[s].classList.add("on");
    }, 5600);
  }

  /* ---- Shared review quotes: hero widget and the cards below ---- */
  var QUOTES = window.DB_REVIEWS || [];
  var qText = document.getElementById("hqText");
  var qName = document.getElementById("hqName");
  if (qText && qName && QUOTES.length) {
    var q = 0;
    var paint = function () {
      qText.textContent = "“" + QUOTES[q].short + "”";
      qName.textContent = QUOTES[q].name + ", " + QUOTES[q].place;
    };
    paint();
    if (!reduced && QUOTES.length > 1) {
      setInterval(function () {
        qText.classList.add("hq-fade");
        qName.classList.add("hq-fade");
        setTimeout(function () {
          q = (q + 1) % QUOTES.length;
          paint();
          qText.classList.remove("hq-fade");
          qName.classList.remove("hq-fade");
        }, 520);
      }, 6200);
    }
  }

  /* ---- Reveal on scroll ---- */
  var items = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) || reduced) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = e.target.getAttribute("data-d") || 0;
          setTimeout(function () { e.target.classList.add("in"); }, d * 90);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
