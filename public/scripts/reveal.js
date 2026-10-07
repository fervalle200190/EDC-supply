/**
 * Scroll reveal: content fades/slides in as it enters the viewport.
 *  - Targets are discovered automatically inside <main> (outermost heading / paragraph / card / image / button).
 *  - Pure CSS animation (see `.rv` rules in global.css); this script only marks elements and starts them.
 *  - Disabled for `prefers-reduced-motion` and when JS is off (nothing is hidden until this script runs).
 */
(function () {
  if (window.__revealInit) return;
  window.__revealInit = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TARGET = 'h1,h2,h3,h4,p,li,article,img,a,button,blockquote,figure,svg';
  var SKIP = '.sr-only,[aria-label="Featured"],.marquee,[aria-label="Related products"],[role="tablist"],[data-no-reveal]';
  var observer = null;

  function visible(el) {
    return el.getClientRects().length > 0;
  }

  function collect(root) {
    var out = [];
    (function walk(node) {
      for (var el = node.firstElementChild; el; el = el.nextElementSibling) {
        // Frosted-glass boxes (backdrop-filter) glitch when an ancestor fades: keep the box still, reveal only its content.
        if (el.hasAttribute('data-rv-inner')) { walk(el); continue; }
        if (el.matches(SKIP) || el.hasAttribute('data-rv') || el.tagName === 'ASTRO-ISLAND' && el.hasAttribute('ssr')) continue;
        if (el.matches(TARGET)) {
          var display = getComputedStyle(el).display;
          if (display === 'contents') {
            // no box of its own: animate its children instead
            for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (visible(c) && !c.matches(SKIP)) out.push(c);
          } else if (visible(el)) {
            out.push(el);
          }
          continue; // never animate nested targets twice
        }
        walk(el);
      }
    })(root);
    return out;
  }

  function mark(el) {
    el.setAttribute('data-rv', getComputedStyle(el).position === 'absolute' && el.tagName === 'IMG' ? 'fade' : 'up');
    observer.observe(el);
  }

  function start(entries) {
    var shown = entries
      .filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; });
    shown.forEach(function (entry, i) {
      var el = entry.target;
      observer.unobserve(el);
      el.style.setProperty('--rv-d', Math.min(i * 80, 480) + 'ms');
      el.setAttribute('data-rv-in', '');
      el.addEventListener('animationend', function done(e) {
        if (e.target !== el) return;
        el.removeEventListener('animationend', done);
        el.removeAttribute('data-rv');
        el.removeAttribute('data-rv-in');
        el.style.removeProperty('--rv-d');
      });
    });
  }

  function init() {
    if (reduce || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('rv-on');
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(start, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    var main = document.querySelector('main');
    if (!main) return;
    collect(main).forEach(mark);
  }

  // Islands (React) hydrate after load: mark their content once they are ready so hydration never sees our attributes.
  document.addEventListener('astro:hydrate', function () {
    if (!observer) return;
    var main = document.querySelector('main');
    if (main) collect(main).forEach(mark);
  });
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', function () {
    if (observer) observer.disconnect();
  });
})();
