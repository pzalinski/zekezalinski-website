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
      '  <button class="lightbox-nav lightbox-prev" aria-label="Previous image">' +
      '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '  </button>' +
      '  <img class="lightbox-img" src="" alt="">' +
      '  <button class="lightbox-nav lightbox-next" aria-label="Next image">' +
      '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '  </button>' +
      '</div>';
    document.body.appendChild(lb);

    var lbOverlay = lb.querySelector('.lightbox-overlay');
    var lbClose   = lb.querySelector('.lightbox-close');
    var lbPrev    = lb.querySelector('.lightbox-prev');
    var lbNext    = lb.querySelector('.lightbox-next');
    var lbImg     = lb.querySelector('.lightbox-img');
    var lbOpener  = null;
    var gallery   = [];
    var galleryIndex = -1;

    function showAt(index) {
      if (!gallery.length) { return; }
      galleryIndex = (index + gallery.length) % gallery.length;
      var img = gallery[galleryIndex];
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      var multiple = gallery.length > 1;
      lbPrev.disabled = !multiple;
      lbNext.disabled = !multiple;
    }

    function openLightbox(img) {
      // Gallery scope = every image in the same project/chapter block,
      // so chevrons flip through that set only, not the whole page.
      var scope = img.closest('.content-section') || document;
      gallery = Array.prototype.slice.call(scope.querySelectorAll('.image-cell img'));
      if (!gallery.length) { gallery = [img]; }

      lbOpener = img;
      showAt(gallery.indexOf(img));
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
      gallery = [];
      galleryIndex = -1;
      if (lbOpener) { lbOpener.focus(); }
    }

    cellImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(img);
      });
    });

    lbOverlay.addEventListener('click', closeLightbox);
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showAt(galleryIndex - 1); });
    lbNext.addEventListener('click', function () { showAt(galleryIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      if (e.key === 'ArrowLeft') { showAt(galleryIndex - 1); }
      if (e.key === 'ArrowRight') { showAt(galleryIndex + 1); }
    });
  }

}());
