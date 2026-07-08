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

        // Scroll so this section's header settles just below the sticky
        // site header, instead of wherever it lands after another
        // section collapses above it — on mobile that shift can push
        // the section you just opened up out of view. Wait for the
        // open/close max-height transitions (350ms, see style.css) to
        // finish so we measure the final resting position, not a
        // mid-animation one.
        setTimeout(function () {
          var header = document.querySelector('.site-header');
          var headerHeight = header ? header.offsetHeight : 0;
          var targetY = item.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }, 360);
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

  /* ── Homepage: hero headline line-reveal animation ────────────────
     EXPERIMENTAL, 2026-07-08. Detects the headline's actual rendered
     line breaks (they change at every breakpoint, so there's no fixed
     set to hand-author in the HTML) and wraps each one in the
     .reveal-line / .reveal-line-inner mask so the CSS slide-up
     animation (see style.css) plays per line, staggered slightly —
     same technique as adrianmuntean.com's homepage headline.
     To undo: delete this whole block, plus the .reveal-line /
     .reveal-line-inner / @keyframes hero-line-in rules in style.css. */
  var heroHeadline = document.querySelector('.hero-headline');

  if (heroHeadline) {
    var LINE_DELAY_MS = 120; // stagger between lines, matches source site

    function buildRevealLines() {
      var originalText = heroHeadline.textContent;

      // Measuring pass: wrap each word so we can read which rendered
      // line it lands on. Split on plain spaces only — the &nbsp;
      // gluing "when … " together stays intact, matching how the
      // browser itself decides where the line is allowed to break.
      var words = originalText.split(' ').filter(function (w) { return w.length > 0; });
      heroHeadline.innerHTML = words.map(function (w) {
        return '<span class="reveal-measure">' + w + '</span>';
      }).join(' ');

      var wordSpans = Array.prototype.slice.call(heroHeadline.querySelectorAll('.reveal-measure'));
      var lineTops = [];
      var lineWords = [];

      wordSpans.forEach(function (span) {
        var top = Math.round(span.getBoundingClientRect().top);
        var idx = lineTops.indexOf(top);
        if (idx === -1) {
          lineTops.push(top);
          lineWords.push([span.textContent]);
        } else {
          lineWords[idx].push(span.textContent);
        }
      });

      heroHeadline.innerHTML = lineWords.map(function (wordsInLine, i) {
        var lineText = wordsInLine.join(' ');
        var delay = i * LINE_DELAY_MS;
        return '<span class="reveal-line"><span class="reveal-line-inner" style="animation-delay:' + delay + 'ms">' + lineText + '</span></span>';
      }).join('');
    }

    // Hide briefly while we measure against the real web font — a
    // fallback-font measurement could group words onto the wrong
    // lines right up until Playfair Display finishes loading.
    heroHeadline.style.visibility = 'hidden';

    var revealed = false;
    function revealHeadline() {
      if (revealed) { return; }
      revealed = true;
      buildRevealLines();
      heroHeadline.style.visibility = '';
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(revealHeadline);
    } else {
      window.addEventListener('load', revealHeadline);
    }
    // Safety net: never leave the headline permanently hidden if font
    // loading stalls for some reason.
    setTimeout(revealHeadline, 1500);
  }

}());
