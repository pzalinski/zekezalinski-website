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

  /* ── About page: accordion sections ───────────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other open items
      document.querySelectorAll('.accordion-item').forEach(function (otherItem) {
        otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion-body').classList.remove('is-open');
      });

      // Toggle this one
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('is-open');
      }
    });
  });

  /* ── Work pages: More / Less image expand ─────────────────────── */
  document.querySelectorAll('.project-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var section = btn.closest('.content-section');
      var isExpanded = section.classList.toggle('is-expanded');
      btn.querySelector('.more-label').textContent = isExpanded ? 'Less' : 'More';
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  });

  /* ── Lightbox ─────────────────────────────────────────────────── */
  var cellImgs = document.querySelectorAll('.image-cell img');

  if (cellImgs.length > 0) {

    // Inject lightbox DOM once
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<div class="lightbox-overlay"></div>' +
      '<div class="lightbox-frame">' +
      '  <button class="lightbox-close" aria-label="Close image viewer">' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
      '    </svg>' +
      '  </button>' +
      '  <img class="lightbox-img" src="" alt="">' +
      '</div>';
    document.body.appendChild(lb);

    var lbOverlay = lb.querySelector('.lightbox-overlay');
    var lbClose   = lb.querySelector('.lightbox-close');
    var lbImg     = lb.querySelector('.lightbox-img');
    var lbOpener  = null;

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = '';
      if (lbOpener) { lbOpener.focus(); }
    }

    cellImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        lbOpener = img;
        openLightbox(img.src, img.alt);
      });
    });

    lbOverlay.addEventListener('click', closeLightbox);
    lbClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

}());
