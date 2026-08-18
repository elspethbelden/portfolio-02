// Site-wide smooth, inertia-based scrolling (Lenis). Scroll input is
// interpolated frame-by-frame via requestAnimationFrame instead of being
// applied natively — same idea as neuemontreal.com.
(function () {
  var lenis = new Lenis({
    duration: 1.1,
    // Ease-out exponential: fast start, long soft settle.
    easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    autoRaf: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Route in-page hash links (nav, "Scroll ↓" cues, etc.) through Lenis so
  // they share the same duration/easing instead of jumping or fighting
  // with native scroll-behavior.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el);
  });

  window.__lenis = lenis;
})();
