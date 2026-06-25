/* main.js — zekezalinski.com */
(function () {
  'use strict';

  /* ── Mobile nav toggle ─────────────────────────────────────────── */
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelectorAll('.nav-links a');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── About page: rotating hero images ─────────────────────────── */
  var heroImgs = document.querySelectorAll('.about-hero-img');
  var heroDots = document.querySelectorAll('.about-dot');

  if (heroImgs.length > 1) {
    var current = 0;

    function showSlide(index) {
      heroImgs[current].classList.remove('active');
      heroDots[current].classList.remove('active');
      current = index % heroImgs.length;
      heroImgs[current].classList.add('active');
      heroDots[current].classList.add('active');
    }

    setInterval(function () {
      showSlide(current + 1);
    }, 4000);
  }

}());
