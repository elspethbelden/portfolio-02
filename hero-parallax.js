// Case study hero parallax.
//
// Intent (per spec): Lenis for smooth scroll, hero as a normal-flow 100dvh
// section (no sticky/fixed pin), Framer Motion's useScroll({ target, offset:
// ["start start", "end start"] }) to get scrollYProgress 0->1 over exactly
// the hero's own height, mapped to translateY (progress * heroHeight * 0.7)
// and opacity (useTransform(progress, [0, 0.5, 1], [1, 1, 0])), applied only
// to the background media layer.
//
// This project loads React as a classic UMD global (unpkg react.development.js)
// with no bundler, rather than via npm/import. framer-motion's React hooks
// are only published as ESM/CJS for bundlers — pulling them in through an
// ESM CDN (e.g. esm.sh) would drag in a second, separate copy of React
// alongside the UMD one already on the page, and hooks called against a
// different React instance than the one rendering the tree throw "Invalid
// hook call" — there's no reliable way to dedupe that against a UMD global
// from an ESM import. So this reimplements the exact same scrollYProgress +
// useTransform math directly against window.React, rather than the actual
// framer-motion package.
(function () {
  function useHeroScrollProgress(ref) {
    var state = React.useState(0);
    var progress = state[0];
    var setProgress = state[1];

    React.useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var raf = null;
      var onScroll = function () {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var rect = el.getBoundingClientRect();
          // offset: ["start start", "end start"] — 0 when the section's
          // top hits the viewport top, 1 when its bottom reaches the
          // viewport top (i.e. progress over exactly this section's height).
          var p = -rect.top / rect.height;
          setProgress(Math.max(0, Math.min(1, p)));
        });
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return function () {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }, [ref]);

    return progress;
  }

  // Piecewise-linear interpolation, matching Framer Motion's useTransform
  // when given parallel input/output breakpoint arrays.
  function mapRange(value, inputRange, outputRange) {
    if (value <= inputRange[0]) return outputRange[0];
    var last = inputRange.length - 1;
    if (value >= inputRange[last]) return outputRange[last];
    for (var i = 1; i <= last; i++) {
      if (value <= inputRange[i]) {
        var t = (value - inputRange[i - 1]) / (inputRange[i] - inputRange[i - 1]);
        return outputRange[i - 1] + t * (outputRange[i] - outputRange[i - 1]);
      }
    }
    return outputRange[last];
  }

  window.useHeroScrollProgress = useHeroScrollProgress;
  window.mapRange = mapRange;
})();
