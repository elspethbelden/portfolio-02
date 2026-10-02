// Portfolio landing page — Elspeth Belden
const { useState, useEffect, useRef } = React;

// ─────────────── DATA ───────────────
const CASE_STUDIES = [
  {
    id: "goldman-ai",
    num: "01",
    year: "2026",
    client: "Goldman Sachs",
    title: "An AI companion for the trading floor",
    tagline: "A north star for an in-house proprietary AI tool, built on the design system I helped establish.",
    tags: ["AI / LLM", "Product Vision", "Design System"],
    role: "Experience Lead",
    duration: "6 months",
    locked: true,
    featured: true,
    imageLabel: "GS AI — product shot",
    imageTint: "goldman",
    thumbSrc: "assets/thumbnails/GS Thumb.png",
    bgImage: "assets/card-backgrounds/image.png"
  },
  {
    id: "natwest-ds",
    num: "02",
    year: "2024",
    client: "NatWest",
    title: "Building a bank's design system from scratch",
    tagline: "A 400% efficiency improvement by rebuilding the system, the governance, and the team around it.",
    tags: ["Design Systems", "Tokenisation", "Governance"],
    role: "Experience Lead",
    duration: "12 months",
    href: "natwest.html",
    thumbSrc: "assets/thumbnails/Pulse_logo loop.gif",
    thumbFit: "contain",
    thumbBg: "#3C1053",
    imageLabel: "NatWest DS — component grid",
    imageTint: "natwest",
    bgImage: "assets/card-backgrounds/Cover.webp"
  },
  {
    id: "bupa-north-star",
    num: "03",
    year: "2023",
    client: "Bupa",
    title: "A North Star vision for Bupa's app",
    tagline: "Unifying the customer experience across markets. The output unlocked £20m+ of follow-on work.",
    tags: ["Experience Strategy", "Service Design", "UX Design", "Research"],
    role: "Experience Lead",
    duration: "4 months",
    href: "bupa.html",
    protected: true,
    imageLabel: "Bupa app — journey map",
    imageTint: "bupa",
    thumbSrc: "assets/thumbnails/Bupa-thumbnail.png",
    bgImage: "assets/hero/Bupa-hero.jpg"
  },
  {
    id: "costa-express",
    num: "04",
    year: "2019",
    client: "Costa Express",
    title: "A facelift for Costa's self-serve coffee machines",
    tagline: "UI redesign across two screen formats, aligned to the new Costa brand. One visual language, two very different canvases.",
    tags: ["Brand Refresh", "GUI Design", "Concept"],
    role: "Senior Designer",
    duration: "2 formats",
    href: "costa.html",
    imageLabel: "Costa Express — machine in-situ",
    imageTint: "costa",
    thumbSrc: "assets/thumbnails/Costa-thumb.png",
    bgImage: "assets/card-backgrounds/costa.png"
  },
  {
    id: "nord-anglia",
    num: "05",
    year: "2022",
    client: "Nord Anglia",
    title: "One digital identity for a global network of schools",
    tagline: "Delivering a component library for 76 international schools, designed in parallel with an evolving brand.",
    tags: ["UX / UI Design", "Component Library", "User Testing", "Brand Translation"],
    role: "Experience Designer",
    duration: "60+ modules",
    href: "nord-anglia.html",
    imageLabel: "Nord Anglia — school pages mockup",
    imageTint: "nordanglia",
    thumbSrc: "assets/thumbnails/Nord Thumbnail.webp",
    bgImage: "assets/hero/Nord Hero.webp"
  }
];

const PAST_CLIENTS = [
  "ASOS", "HSBC", "Guinness Storehouse", "Costa Coffee",
  "GovUK", "E.ON", "Art Fund", "Sainsbury's",
  "National Theatre", "Chelsea FC", "Topman", "Nord Anglia",
  "Diageo", "Freeview", "NowTV", "Bethesda"
];

// ─────────────── RESPONSIVE HOOK ───────────────

function useIsMobile(bp = 768) {
  const [m, setM] = React.useState(window.innerWidth < bp);
  React.useEffect(() => {
    const fn = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return m;
}

// Splits text into individually-animated letter spans, each rising in on
// its own staggered delay instead of the whole word arriving as one block.
// Words are kept as their own nowrap groups with a real breakable space
// between them, so multi-word names can still wrap at a word boundary
// instead of becoming one unbreakable run of letters. `tracking` restores
// the letter-spacing an inline-block split otherwise loses (each letter is
// its own atomic box, so a parent's CSS letter-spacing no longer pulls
// them together).
function renderStaggeredLetters(text, loaded, baseDelay, { stagger = 35, tracking = "0em" } = {}) {
  const words = text.split(" ");
  let i = 0;
  const nodes = [];
  words.forEach((word, wi) => {
    nodes.push(
      <span key={"w" + wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        {word.split("").map((ch, ci) => {
          const delay = baseDelay + i * stagger;
          i++;
          return (
            <span
              key={ci}
              style={{
                display: "inline-block",
                marginRight: tracking,
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(0.3em)",
                transition: `opacity 650ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
    if (wi < words.length - 1) {
      i++;
      nodes.push(" ");
    }
  });
  return nodes;
}

// One row of the footer's scrolling client-name marquee. `animationName`
// picks the direction (see the client-scroll / client-scroll-reverse
// keyframes in Contact) so two rows can run opposite ways. Giving the two
// mobile rows different `duration`s (rather than just opposite direction
// at the same speed) keeps their phase constantly drifting apart, so the
// ✺ symbols don't keep lining up between rows the way they do at a
// shared speed. A negative `delay` starts the row as if it had already
// been playing for that long — i.e. mid-cycle, not flush at the very
// start of the loop — useful for the first row so its first name isn't
// sitting right at the left edge on load.
function renderClientMarqueeRow(list, animationName, duration = 60, delay = 0) {
  return (
    <div style={{
      display: "flex",
      animation: `${animationName} ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      whiteSpace: "nowrap",
    }}>
      {[...list, ...list].map((c, i) => (
        <span key={i} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 56px)",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          padding: "0 24px",
          color: "var(--ink)",
          display: "inline-flex",
          alignItems: "center",
          gap: 40,
        }}>
          {c}
          <span style={{
            color: "var(--ink)",
            fontSize: "0.5em",
            verticalAlign: "middle",
          }}>✺</span>
        </span>
      ))}
    </div>
  );
}

// ─────────────── COMPONENTS ───────────────

function Hero() {
  const [layout, setLayout] = useState(window.__tweaks.heroLayout);
  useEffect(() => {
    const onChange = (e) => setLayout(e.detail.heroLayout);
    window.addEventListener('tweaks-changed', onChange);
    return () => window.removeEventListener('tweaks-changed', onChange);
  }, []);

  if (layout === "split") return <HeroSplit />;
  if (layout === "marquee") return <HeroMarquee />;
  return <HeroStacked />;
}

function HeroStacked() {
  const isMobile = useIsMobile();
  const HERO_IMAGES = [
    isMobile ? "assets/hero/mobile/Bupa-Hero.jpg" : "assets/hero/Hero-2.png",
    isMobile ? "assets/hero/mobile/Costa.jpg" : "assets/hero/Costa.png",
    isMobile ? "assets/hero/mobile/HSBC-Hero.jpg" : "assets/hero/HSBC-Hero.jpg",
    isMobile ? "assets/hero/mobile/NatWest-Hero.jpg" : "assets/hero/NatWest-Hero.jpg",
    isMobile ? "assets/hero/mobile/NatWest-Hero-WGDLL.jpg" : "assets/hero/NatWest-Hero-WGDLL.png",
  ];
  const [loaded, setLoaded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const heroRef = useRef(null);
  // Same scroll-linked reveal as the case study covers: the carousel is
  // static, and scrolling past the hero pans it down and fades it out.
  const scrollProgress = useHeroScrollProgress(heroRef);
  const heroHeight = heroRef.current ? heroRef.current.getBoundingClientRect().height : 0;
  const scrollY = scrollProgress * heroHeight * 0.7;
  const scrollOpacity = mapRange(scrollProgress, [0, 0.5, 1], [1, 1, 0]);
  useEffect(() => {
    // Trigger the loading animation on next frame so transitions apply.
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    // Gentle cycle every 5s with a long crossfade.
    const t = setInterval(() => {
      setActiveImg(i => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section ref={heroRef} style={{
      minHeight: isMobile ? "100vh" : "92vh",
      height: isMobile ? "100vh" : "92vh",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      color: "#F4F1EC",
    }}>
      {/* Background carousel — scroll-driven pan/fade wrapper (no
          transition, tracks scroll directly) wraps the load-in wrapper
          (scale/blur zoom-in, which keeps its own eased transition). */}
      <div style={{
        position: "absolute", inset: 0,
        zIndex: 0,
        transform: `translateY(${scrollY}px)`,
        opacity: scrollOpacity,
        willChange: "transform, opacity",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: loaded ? "scale(1)" : "scale(1.1)",
          filter: loaded ? "blur(0px)" : "blur(20px)",
          transition: "transform 1800ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 1400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          willChange: "transform, filter",
          // Fallback color in case images haven't loaded
          background: "#1F1A14",
        }}>
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("${src}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === activeImg ? 1 : 0,
                transition: "opacity 1800ms ease-in-out",
              }}
            />
          ))}
        </div>
      </div>

      {/* Darken for legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)",
        zIndex: 1,
      }} />

      {/* Foreground text wrapper — fades in on load. */}
      <div style={{
        position: "relative",
        zIndex: 3,
        display: "contents",
        // Note: display:contents lets children keep their original layout.
      }}>
      {/* Inner fade-in wrapper handled per child below via `loaded` opacity. */}
      </div>

      {/* Full-width name — each letter fades/rises in on its own staggered
          delay rather than the whole word arriving as one block. */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: isMobile ? "16px 20px 0" : "16px 24px 0",
      }}>
        <h1 style={{
          fontFamily: "var(--font-name)",
          // Kept on one line on mobile too — sized to fill the available
          // width edge to edge (mirrors the footer name's size, computed
          // from the real measured width of "Elspeth" + image + "Belden"
          // in Perfektta against the 20px side padding both share).
          fontSize: isMobile ? "calc((100vw - 40px) / 6.008)" : "clamp(58px, 14.5vw, 270px)",
          lineHeight: 0.88,
          fontWeight: 400,
          letterSpacing: "-0.035em",
          margin: 0,
          color: "#F4F1EC",
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}>
          <span style={{ whiteSpace: "nowrap" }}>{renderStaggeredLetters("Elspeth", loaded, 600, { tracking: "-0.035em" })}</span>
          <span style={{ whiteSpace: "nowrap" }}>{renderStaggeredLetters("Belden", loaded, 845, { tracking: "-0.035em" })}</span>
        </h1>
      </div>

      {/* Spacer pushes tagline to bottom */}
      <div style={{ flex: 1 }} />

      {/* Bottom: tagline + scroll cue. On mobile the tagline spans full
          width on its own row, with "Let's talk" and "Scroll" aligned
          together on the row beneath it; desktop keeps them stacked in
          a left column next to the scroll cue on the right. */}
      {isMobile ? (
        <div style={{
          position: "relative", zIndex: 3,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "0 20px 28px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 900ms ease-out 1100ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 1100ms",
        }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 2.2vw, 30px)",
            lineHeight: 1.3,
            color: "#F4F1EC",
            fontWeight: 400,
            maxWidth: "32ch",
          }}>
            Design lead. Systems thinker.{" "}
            <span style={{ opacity: 0.8 }}>Making complexity look effortless.</span>
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a
              href="#contact"
              className="mono"
              style={{
                color: "#F4F1EC",
                borderBottom: "1px solid rgba(244,241,236,0.5)",
                paddingBottom: 4,
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Let's talk
            </a>
            <a href="#work" className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#F4F1EC", borderBottom: "1px solid rgba(244,241,236,0.5)",
              paddingBottom: 4
            }}>
              Scroll <span style={{ fontSize: 14 }}>↓</span>
            </a>
          </div>
        </div>
      ) : (
        <div style={{
          position: "relative", zIndex: 3,
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: 40,
          alignItems: "end",
          padding: "0 32px 40px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 900ms ease-out 1100ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 1100ms",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 2.2vw, 30px)",
              lineHeight: 1.3,
              color: "#F4F1EC",
              fontWeight: 400,
              maxWidth: "32ch",
            }}>
              Design lead. Systems thinker.{" "}
              <span style={{ opacity: 0.8 }}>Making complexity look effortless.</span>
            </p>

            <a
              href="#contact"
              className="mono"
              style={{
                display: "inline-block",
                marginTop: 16,
                color: "#F4F1EC",
                borderBottom: "1px solid rgba(244,241,236,0.5)",
                paddingBottom: 4,
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Let's talk
            </a>
          </div>

          <div style={{ textAlign: "right" }}>
            <a href="#work" className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#F4F1EC", borderBottom: "1px solid rgba(244,241,236,0.5)",
              paddingBottom: 4
            }}>
              Scroll <span style={{ fontSize: 14 }}>↓</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function HeroSplit() {
  return (
    <section style={{
      minHeight: "100vh",
      padding: "140px 0 64px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      position: "relative",
    }}>
      {/* Left: image placeholder */}
      <div style={{
        padding: "0 0 0 32px",
        display: "flex", alignItems: "center",
      }}>
        <ImagePlaceholder label="portrait / studio shot" aspect="3/4" full tint="warm" />
      </div>

      {/* Right: type */}
      <div style={{
        padding: "0 32px 0 64px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">EB — EXPERIENCE DESIGNER · 2026</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(64px, 9vw, 160px)",
          lineHeight: 0.92,
          fontWeight: 300,
          letterSpacing: "-0.035em",
          margin: "40px 0",
        }}>
          Products, systems,
          <br />and stories.
        </h1>

        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          lineHeight: 1.4,
          maxWidth: "38ch",
          color: "var(--ink-soft)",
        }}>
          I'm Elspeth — an experience lead at{" "}
          Publicis Sapient
          , designing work for Goldman Sachs, NatWest and Bupa.
        </p>
      </div>
    </section>
  );
}

function HeroMarquee() {
  return (
    <section style={{
      minHeight: "100vh",
      padding: "140px 0 64px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Marquee rows */}
      {[0, 1, 2].map(row => (
        <div key={row} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 14vw, 220px)",
          fontWeight: 300,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          padding: "8px 0",
          color: row === 1 ? "var(--accent)" : "var(--ink)",
          fontStyle: row === 1 ? "italic" : "normal",
          fontFamily: row === 1 ? "var(--font-italic)" : "var(--font-display)"
        }}>
          <MarqueeRow
            text={row === 1 ? "Belden — Experience Designer —" : "Elspeth Belden — Experience Designer —"}
            reverse={row === 1}
            speed={row === 1 ? 55 : 80}
          />
        </div>
      ))}

      <div style={{
        position: "absolute", bottom: 40, left: 32, right: 32,
        display: "flex", justifyContent: "space-between", alignItems: "end"
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">PORTFOLIO · 2026</span>
        </div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          maxWidth: "38ch",
          textAlign: "right",
          color: "var(--ink-soft)",
        }}>
          Designing for Goldman Sachs, NatWest & Bupa at{" "}
          Publicis Sapient.
        </p>
      </div>
    </section>
  );
}

function MarqueeRow({ text, reverse, speed = 80 }) {
  return (
    <div style={{
      display: "flex",
      animation: `marquee-${reverse ? 'right' : 'left'} ${speed}s linear infinite`
    }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} style={{ paddingRight: "0.5em" }}>{text}</span>
      ))}
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────── IMAGE PLACEHOLDER ───────────────

function ImagePlaceholder({ label = "image", aspect = "4/3", full = false, tint = "warm" }) {
  const tints = {
    warm:    { bg: "#E8DFD2", stripe: "#DCCFB9", text: "#6B5E48" },
    cool:    { bg: "#D9DDE2", stripe: "#C5CBD3", text: "#5A6370" },
    sage:    { bg: "#D5DCCC", stripe: "#C3CCB4", text: "#5B6750" },
    accent:  { bg: "#EBD6C6", stripe: "#E0C4AE", text: "#7A4A2B" },
  };
  const c = tints[tint] || tints.warm;
  return (
    <div style={{
      width: full ? "100%" : "100%",
      height: full ? "100%" : "auto",
      aspectRatio: full ? "auto" : aspect,
      background: `repeating-linear-gradient(135deg, ${c.bg} 0 14px, ${c.stripe} 14px 28px)`,
      position: "relative",
      display: "flex", alignItems: "end", justifyContent: "space-between",
      padding: 18,
      overflow: "hidden",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: c.text,
      }}>
        [ {label} ]
      </div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        color: c.text,
      }}>
        ░░░
      </div>
    </div>
  );
}

// ─────────────── PULL QUOTE ───────────────

function PullQuote() {
  const isMobile = useIsMobile();
  return (
    <section id="approach" style={{
      padding: isMobile ? "60px 20px" : "120px 32px",
      borderTop: "1px solid var(--line-faint)",
      borderBottom: "1px solid var(--line-faint)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr 1fr",
        gap: 40,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">APPROACH</span>
        </div>
        <blockquote style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 3.9vw, 56px)",
          lineHeight: 1.15,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          margin: 0,
        }}>
          I've spent over a decade designing digital products for{" "}
          <span style={{ fontStyle: "italic", color: "var(--accent)" }}>finance, healthcare</span>
          {" "}and{" "}
          <span style={{ fontStyle: "italic", color: "var(--accent)" }}>retail</span>
          . Lately, most of that has been AI products. I set the vision, design the product, and build the component libraries teams ship from.
        </blockquote>
        <div />
      </div>
    </section>
  );
}

// ─────────────── SELECTED WORK ───────────────

// Tints used both in placeholder + as blurred backdrop
const TINT_COLORS = {
  warm:   { bg: "#E8DFD2", stripe: "#DCCFB9", text: "#6B5E48", solid: "#C9A07A" },
  cool:   { bg: "#D9DDE2", stripe: "#C5CBD3", text: "#5A6370", solid: "#7B8896" },
  sage:   { bg: "#D5DCCC", stripe: "#C3CCB4", text: "#5B6750", solid: "#8FA180" },
  accent: { bg: "#EBD6C6", stripe: "#E0C4AE", text: "#7A4A2B", solid: "#B66B40" },
  costa:  { bg: "#F3E2DA", stripe: "#ECD6CA", text: "#6E1F37", solid: "#B51244" },
  nordanglia: { bg: "#E3EEF5", stripe: "#CDE0EC", text: "#2A5A72", solid: "#0D7EA8", dark: "#060F18", overlay: "rgba(6,14,26,0.48)" },
  goldman: { bg: "#1A2D45", stripe: "#4A6FA3", text: "#5A80B5", solid: "#7297C5", dark: "#0E1E30", overlay: "rgba(10,20,38,0.22)" },
  bupa:    { bg: "#C8E4F5", stripe: "#015A96", text: "#3050A0", solid: "#0179C8", dark: "#011C38", overlay: "rgba(1,28,56,0.42)" },
  natwest: { bg: "#1A0A30", stripe: "#3A1A55", text: "#7A48A0", solid: "#5A287D", dark: "#100820", overlay: "rgba(16,8,30,0.52)" },
};

function SelectedWork() {
  const isMobile = useIsMobile();
  const stackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = stackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const perCard = rect.height / CASE_STUDIES.length;
        const scrolledIntoStack = -rect.top;
        const idx = Math.max(0, Math.min(CASE_STUDIES.length - 1, Math.floor(scrolledIntoStack / perCard)));
        setActiveIndex(idx);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // Mirrors the last card's own closing fade (see CaseStudyPanel) so the
  // sticky "N / total" indicator — which lives here, not on the card
  // itself — fades out in step with it as the footer arrives, instead of
  // floating on top of the fading/shrinking card underneath it.
  const [footerCloseProgress, setFooterCloseProgress] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const footer = document.getElementById('contact');
        if (!footer) return;
        const vh = window.innerHeight || 1;
        const rect = footer.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh - rect.top) / vh));
        setFooterCloseProgress(p);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const activeCard = CASE_STUDIES[activeIndex];

  return (
    <section id="work" style={{ padding: 0 }}>
      {/* Header sits above the immersive panels */}
      <div style={{
        padding: isMobile ? "60px 20px 32px" : "100px 32px 60px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr 1fr",
        gap: 32,
        alignItems: "start",
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">CASE STUDIES</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 7vw, 112px)",
          lineHeight: 0.95,
          fontWeight: 400,
          letterSpacing: "-0.035em",
          color: "var(--ink)",
        }}>
          Recent <span style={{ fontStyle: "italic", color: "var(--accent)" }}>work</span>
        </h2>
        <div />
      </div>

      <style>{`
        .case-thumb image-slot {
          transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .case-thumb:hover image-slot {
          transform: scale(1.05);
        }
        .case-badge {
          opacity: 0.7;
          transition: opacity 300ms;
        }
        .case-thumb:hover .case-badge {
          opacity: 1;
        }
        /* Goldman thumbnail crops from the right on mobile so the GS mark
           stays in frame, instead of the default centred cover crop. */
        @media (max-width: 767px) {
          #cs-goldman-ai::part(image) {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            transform: none !important;
            object-fit: cover !important;
            object-position: right center !important;
          }
        }
      `}</style>

      {/* Immersive case-study panels — sticky stack.
          The wrapping div gets enough height for all cards to stack,
          and each <article> is position:sticky top:0 so it pins as the next rises over. */}
      <div ref={stackRef} style={{
        position: "relative",
        marginTop: -1,
        // Each card pins for ~80vh of scroll before the next one slides over.
        // Total scroll length = (count - 1) * pinDistance + 1 viewport for the last card.
        // We achieve this naturally by giving each article a height of 100vh
        // (the sticky pin stops when the article's bottom reaches the viewport bottom).
      }}>
        {/* Sticky number — mobile only. Lives outside the card stack so it
            stays pinned top-right for the whole section, updating as the
            active card changes, instead of being tied to one card's pin window. */}
        {isMobile && (
          <div style={{ position: "sticky", top: 0, height: 0, zIndex: CASE_STUDIES.length + 10, pointerEvents: "none" }}>
            <div className="mono" style={{
              position: "absolute",
              top: 20, right: 20,
              color: activeCard.bgImage ? "rgba(244,241,236,0.85)" : "#4A4A48",
              opacity: activeIndex === CASE_STUDIES.length - 1 ? 1 - footerCloseProgress : 1,
            }}>
              <span className="bracket">{activeCard.num} / {String(CASE_STUDIES.length).padStart(2, "0")}</span>
            </div>
          </div>
        )}

        {CASE_STUDIES.map((cs, i) => (
          <CaseStudyPanel key={cs.id} cs={cs} index={i} total={CASE_STUDIES.length} />
        ))}
      </div>
    </section>
  );
}

function CaseStudyPanel({ cs, index, total }) {
  const isMobile = useIsMobile();
  const tint = TINT_COLORS[cs.imageTint] || TINT_COLORS.warm;
  const articleRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const isBento = index === 0 && !!cs.bgImage;
  const [bentoProgress, setBentoProgress] = useState(0);

  useEffect(() => {
    // The bento panel triggers its letter-reveal itself, once the reveal
    // animation reaches full width — not on generic scroll-visibility.
    if (isBento) return;
    const el = articleRef.current;
    if (!el) return;
    // Fires partway through the card's slide-in (not right as it first
    // peeks into view, and not only once it's already fully settled) —
    // that's the sweet spot where it's far enough into frame to be the
    // focus of attention but still has room left to visibly cascade in.
    // Then stops watching (the animation shouldn't replay on re-entry).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isBento]);

  // Bento-to-full-screen reveal — first case study only. p runs 0 (panel
  // half into view — its top edge is half the viewport down from the
  // top) to 1 (its top edge has reached the very top of the screen, i.e.
  // the moment sticky pinning engages), so the reveal gets more of the
  // scroll-in to play out in rather than being compressed into just the
  // final third — it was starting late enough to feel like nothing was
  // happening for most of the card's entrance. Driven by
  // getBoundingClientRect(), which reflects the panel's actual rendered
  // position regardless of sticky state, so there's no ambiguity once
  // it's pinned the way an offsetTop-based measurement would have.
  useEffect(() => {
    if (!isBento) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = articleRef.current;
        if (!el) return;
        const vh = window.innerHeight || 1;
        const startTop = vh / 2;
        const p = Math.max(0, Math.min(1, (startTop - el.getBoundingClientRect().top) / startTop));
        setBentoProgress(p);
        // Fires a little into the reveal rather than right as it starts
        // or only once it's finished — still well before the panel
        // settles, so the text visibly cascades in during the motion.
        if (p > 0.2) setRevealed(true);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isBento]);

  // Closing bookend on the last case study — as the footer rises into
  // view behind it, this panel shrinks back down to the same 85%-width
  // framed-card look the first case study started at. Driven by the
  // footer's own position (0 = footer not yet visible, 1 = footer fully
  // on screen) rather than this panel's position, since by the time the
  // footer is on screen this panel itself may already be mid-cover.
  const isLast = index === total - 1;
  const [closeProgress, setCloseProgress] = useState(0);

  useEffect(() => {
    if (!isLast) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const footer = document.getElementById('contact');
        if (!footer) return;
        const vh = window.innerHeight || 1;
        // On mobile, wait until the footer is already a quarter of a
        // viewport-height into view before starting to close, rather
        // than the instant it starts peeking in — it was starting to
        // shrink too early. Desktop keeps the original immediate start.
        const startThreshold = isMobile ? vh * 0.75 : vh;
        const rect = footer.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (startThreshold - rect.top) / startThreshold));
        setCloseProgress(p);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isLast, isMobile]);

  // Opening bookend in reverse — as the first case study is scrolled
  // back up and out of view, its text fades out the same way the last
  // card's fades out as the footer arrives, just mirrored. Driven by
  // this card's OWN top edge: once un-pinned by scrolling back up past
  // it, a sticky element's rect.top grows from 0 as it's pushed back
  // down the screen, which is the real moment it's being left behind.
  // Before the card has ever actually been reached, though, rect.top
  // sits at some large positive "not scrolled to yet" value that would
  // clamp to the exact same 1 as a genuine exit — hasEnteredRef guards
  // against reading that early, large-but-unrelated value as an exit.
  const [openBackProgress, setOpenBackProgress] = useState(0);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    if (!isBento) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = articleRef.current;
        if (!el) return;
        const vh = window.innerHeight || 1;
        const top = el.getBoundingClientRect().top;
        if (top <= 0) hasEnteredRef.current = true;
        // Compressed into a third of a viewport-height of upward scroll
        // (the same distance the forward entry reveal uses) rather than
        // a full one, so the fade is noticeable much sooner after the
        // card starts un-pinning instead of needing a long scroll-up.
        const exitRange = vh / 3;
        const p = hasEnteredRef.current ? Math.max(0, Math.min(1, top / exitRange)) : 0;
        setOpenBackProgress(p);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isBento]);

  // On mobile, the smallest (starting) state is a fixed 20px margin each
  // side, converted to a percentage of the real viewport width — not a
  // floor on the open end, which always goes all the way to literal
  // 100% (full-bleed, no margin) on both mobile and desktop.
  const vw = typeof window !== "undefined" ? window.innerWidth : 375;
  const startSide = isMobile ? 100 - (20 / vw) * 100 : 92.5;
  const endSide = 100;

  // Everything besides the client name's own letter-stagger (the index
  // label, title and tags) fades in as a block on the bento panel's
  // initial entrance, keyed to the same `revealed` trigger — rather than
  // just appearing instantly while the name is still cascading in.
  const bentoEntranceFade = isBento
    ? { opacity: revealed ? 1 : 0, transition: "opacity 700ms ease-out" }
    : {};

  // Starts at its smallest margin and opens linearly to full-bleed as
  // bentoProgress runs 0→1. The last panel's bars are the footer's own
  // red, not the page background, so the shrink reads as revealing the
  // footer behind it rather than the page.
  let barBottom = 90, barSide = startSide, barColor = "var(--bg)";
  if (isBento) {
    barBottom = 90 + bentoProgress * 10;
    barSide = startSide + bentoProgress * (endSide - startSide);
  } else if (isLast) {
    barBottom = 100 - closeProgress * 10;
    barSide = endSide - closeProgress * (endSide - startSide);
    barColor = "var(--accent)";
  }

  return (
    <article
      ref={articleRef}
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        minHeight: 640,
        overflow: "hidden",
        display: "flex",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "center",
        background: cs.bgImage ? (tint.dark || "#120808") : tint.bg,
        zIndex: index + 1,
        // No shadow on the last panel — that "rising card" shadow is for
        // one case study sliding over the previous one; the footer rises
        // over this one instead, and shouldn't show a shadow of its own.
        boxShadow: (index > 0 && index !== total - 1) ? "0 -20px 60px -10px rgba(0,0,0,0.4)" : "none",
        ...(cs.bgImage && {
          "--ink":      "#F4F1EC",
          "--ink-soft": "rgba(244,241,236,0.75)",
          "--ink-faint":"rgba(244,241,236,0.5)",
          "--line":     "#F4F1EC",
        }),
      }}
    >
      {/* Colour gradient backdrop */}
      <div style={{
        position: "absolute",
        inset: "-10%",
        background: `radial-gradient(ellipse at 30% 40%, ${tint.solid} 0%, ${tint.stripe} 45%, ${tint.bg} 100%)`,
        filter: "blur(80px) saturate(1.1)",
        opacity: cs.bgImage ? 0.30 : 1,
      }} />

      {/* Photo texture — background-attachment:fixed pins the image to the
          viewport, so it never moves; only the card's own overflow:hidden
          frame moves (via its sticky slide-in), which is what reveals it. */}
      {cs.bgImage && (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${cs.bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(14px) saturate(0.75)",
          opacity: 0.85,
          zIndex: 1,
        }} />
      )}

      {/* Dark overlay */}
      {cs.bgImage && (
        <div style={{
          position: "absolute", inset: 0,
          background: tint.overlay || "rgba(16,5,5,0.45)",
          zIndex: 1,
          pointerEvents: "none",
        }} />
      )}

      {/* Edge vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: cs.bgImage
          ? "linear-gradient(to right, rgba(16,5,5,0.5) 0%, rgba(16,5,5,0) 30%, rgba(16,5,5,0) 70%, rgba(16,5,5,0.5) 100%)"
          : "linear-gradient(to right, rgba(244,241,236,0.55) 0%, rgba(244,241,236,0) 30%, rgba(244,241,236,0) 70%, rgba(244,241,236,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Bento bars — solid, page-coloured strips over the photo,
          clipped down with clip-path so only part of each shows.
          Shrinking that visible part is what "opens" the first case
          study; growing it back is what "closes" the last one as the
          footer arrives, bookending the stack. No bottom strip — the
          panel's bottom edge stays below the fold for the whole move. */}
      {(isBento || isLast) && (
        <>
          <div style={{
            position: "absolute", inset: 0,
            background: barColor,
            clipPath: `inset(0 0 ${barBottom}% 0)`,
            willChange: "clip-path",
            zIndex: 2,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: barColor,
            clipPath: `inset(0 ${barSide}% 0 0)`,
            willChange: "clip-path",
            zIndex: 2,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: barColor,
            clipPath: `inset(0 0 0 ${barSide}%)`,
            willChange: "clip-path",
            zIndex: 2,
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* Three-column composition: client | thumbnail | meta */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        height: isMobile ? "100%" : undefined,
        display: isMobile ? "flex" : "grid",
        flexDirection: isMobile ? "column" : undefined,
        gridTemplateColumns: isMobile ? undefined : "1fr auto 1fr",
        alignItems: "center",
        gap: isMobile ? 16 : "clamp(16px, 3vw, 40px)",
        padding: isMobile ? "56px 20px 40px" : "0 48px",
      }}>
        {/* Left / Top: client name — vertically centred in the space
            above the thumbnail on mobile. Fades out on its own (not the
            thumbnail, which stays at full opacity): last card as soon as
            the closing bars start moving, first card as it's scrolled
            back up and out of view — the same closing/opening-reversed
            fade, just scoped to text instead of the whole composition. */}
        <div style={{
          flex: isMobile ? 1 : undefined,
          display: isMobile ? "flex" : undefined,
          flexDirection: isMobile ? "column" : undefined,
          justifyContent: isMobile ? "center" : undefined,
          alignItems: isMobile ? "center" : undefined,
          width: isMobile ? "100%" : undefined,
          textAlign: isMobile ? "center" : "left",
          ...(isLast && { opacity: 1 - closeProgress }),
          ...(isBento && { opacity: 1 - openBackProgress }),
        }}>
          {!isMobile && (
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 16, ...bentoEntranceFade }}>
              <span className="bracket">{cs.num} / {String(total).padStart(2, "0")}</span>
            </div>
          )}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "48px" : "clamp(48px, 7vw, 112px)",
            lineHeight: 0.95,
            fontWeight: 400,
            letterSpacing: "-0.035em",
            color: "var(--ink)",
          }}>
            {renderStaggeredLetters(cs.client, revealed, 0, { tracking: "-0.035em" })}
          </h3>
        </div>

        {/* Middle: thumbnail */}
        <a
          href={cs.href && !cs.locked ? cs.href : "#"}
          onClick={(e) => { if (!cs.href || cs.locked) e.preventDefault(); }}
          className="case-thumb"
          style={{
            display: "block",
            width: isMobile ? "min(85vw, 380px)" : "clamp(360px, 36vw, 560px)",
            aspectRatio: isMobile ? "1/1" : "4/3",
            position: "relative",
            cursor: (cs.href && !cs.locked) ? "pointer" : "default",
            overflow: "hidden",
            borderRadius: 12,
            boxShadow: isLast ? "none" : "0 24px 60px -20px rgba(0,0,0,0.3)",
            alignSelf: isMobile ? "center" : undefined,
            flexShrink: isMobile ? 0 : undefined,
            margin: isMobile ? "0 auto" : undefined,
          }}
        >
          <image-slot
            id={"cs-" + cs.id}
            placeholder={cs.imageLabel}
            fit={cs.thumbFit || "cover"}
            src={cs.thumbSrc}
            style={{ width: "100%", height: "100%", display: "block", background: cs.thumbBg || "var(--bg-alt)" }}
          ></image-slot>
          {cs.locked ? (
            <div className="case-badge" style={{
              position: "absolute",
              bottom: 16, right: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#F4F1EC",
              background: "rgba(26,26,26,0.85)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="5.5" width="9" height="7" rx="1.2" stroke="#F4F1EC" strokeWidth="1.4"/>
                <path d="M3 5.5V3.5a2.5 2.5 0 0 1 5 0v2" stroke="#F4F1EC" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Available on request
            </div>
          ) : cs.href && (
            <div className="case-badge" style={{
              position: "absolute",
              bottom: 16, right: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#F4F1EC",
              background: "rgba(26,26,26,0.85)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}>
              {cs.protected && (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.7" y="5" width="8.6" height="6.6" rx="1.1" stroke="#F4F1EC" strokeWidth="1.3"/>
                  <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="#F4F1EC" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              )}
              SEE WORK →
            </div>
          )}
        </a>

        {/* Right / Bottom: title + tags — vertically centred in the
            space below the thumbnail on mobile. Same text-only fade as
            the client name on the left. */}
        <div style={{
          flex: isMobile ? 1 : undefined,
          display: isMobile ? "flex" : undefined,
          flexDirection: isMobile ? "column" : undefined,
          justifyContent: isMobile ? "center" : undefined,
          alignItems: isMobile ? "center" : undefined,
          width: isMobile ? "100%" : undefined,
          textAlign: isMobile ? "center" : "right",
          ...(isLast && { opacity: 1 - closeProgress }),
          ...(isBento && { opacity: 1 - openBackProgress }),
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 2.5vw, 34px)",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: isMobile ? 12 : 24,
            maxWidth: isMobile ? "28ch" : "32ch",
            marginLeft: isMobile ? "auto" : "auto",
            marginRight: isMobile ? "auto" : undefined,
            ...bentoEntranceFade,
          }}>
            {cs.title}
          </h4>
          {!isMobile && (
            <div className="mono" style={{
              color: "var(--ink-soft)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              ...bentoEntranceFade,
            }}>
              {cs.tags.map(t => (
                <div key={t}>{t}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta — no "Scroll" cue on the last card, nothing to
          scroll to within the stack anymore. */}
      {index < total - 1 && (
        <div style={{
          position: "absolute",
          bottom: 32, left: 32, right: 32,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "end",
          zIndex: 3,
        }}>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>
            Scroll ↓
          </div>
        </div>
      )}
    </article>
  );
}

// ─────────────── CONTACT ───────────────

function Contact() {
  const isMobile = useIsMobile();
  return (
    <section id="contact" style={{
      position: "relative",
      // Above the case-study stack (max z-index 5) so its solid red
      // covers the last card's blurred layers, which bleed a little past
      // the card's own bottom edge despite its overflow:hidden — rather
      // than touching those layers directly, which also soften every
      // card's top/side edges.
      zIndex: 20,
      // Pulls the footer up 1px to overlap the card beneath it, covering
      // the sub-pixel rounding seam that vh-based heights (92vh hero,
      // 100vh cards, 90vh footer, all rounding independently) can leave
      // between sections at certain viewport heights.
      marginTop: "-1px",
      height: "90vh",
      padding: isMobile ? "56px 20px 40px" : "90px 32px 56px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      background: "var(--accent)",
      "--ink": "#F4F1EC",
      "--ink-soft": "#F4F1EC",
      "--ink-faint": "rgba(244,241,236,0.65)",
      "--line-faint": "rgba(244,241,236,0.3)",
    }}>
      {/* Scrolling client marquee — now part of the footer module's
          own height rather than a separate section above it. */}
      <div style={{ borderBottom: "1px solid var(--line-faint)", paddingBottom: isMobile ? 32 : 40 }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: isMobile ? 24 : 32 }}>
          I'VE ALSO WORKED WITH
        </div>
        {/* On mobile, two rows moving in opposite directions fill the
            extra vertical space better than one thin line would; desktop
            keeps the single row with the full client list. */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {renderClientMarqueeRow(PAST_CLIENTS.slice(0, 8), "client-scroll", 30, -10)}
            {renderClientMarqueeRow(PAST_CLIENTS.slice(8), "client-scroll-reverse", 23)}
          </div>
        ) : (
          renderClientMarqueeRow(PAST_CLIENTS, "client-scroll")
        )}
      </div>

      {/* Contact info + name, grouped so the small-caps links sit
          directly above the big name, both pinned to the bottom of
          the section via the outer space-between. Link styling matches
          the case-study footers: bracketed mono label, mono value with
          an underline, no separate display-font treatment. */}
      <div>
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "flex-end",
          gap: isMobile ? 16 : 32,
          marginBottom: isMobile ? 24 : 32,
        }}>
          <div className="mono" style={{ color: "var(--ink-soft)", alignSelf: isMobile ? undefined : "flex-start" }}>
            Let's talk
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>EMAIL</div>
            <a href="mailto:elspethbelden@gmail.com" style={{ borderBottom: "1px solid currentColor" }}>
              elspethbelden@gmail.com
            </a>
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>LINKEDIN</div>
            <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ borderBottom: "1px solid currentColor" }}>
              /in/elspethbelden ↗
            </a>
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>CV</div>
            <a href="assets/Elspeth-Belden-CV.pdf" download style={{ borderBottom: "1px solid currentColor" }}>
              Download ↓
            </a>
          </div>
        </div>

        {/* Big name — the same split "Elspeth" / "Belden" construction
            and size as the hero. */}
        <h2 style={{
          fontFamily: "var(--font-name)",
          // Kept on one line on mobile too, sized so "Elspeth" + the
          // signature image + "Belden" fill the available width edge to
          // edge — the ratio (100vw minus the 20px side padding, divided
          // by the measured width-per-font-size of this exact string +
          // image combo in Perfektta) solves for the font-size that does
          // that at any mobile viewport.
          fontSize: isMobile ? "calc((100vw - 40px) / 6.008)" : "clamp(58px, 14.5vw, 270px)",
          lineHeight: 0.88,
          fontWeight: 400,
          letterSpacing: "-0.035em",
          margin: 0,
          color: "var(--ink)",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}>
          <span style={{ whiteSpace: "nowrap" }}>{renderStaggeredLetters("Elspeth", true, 0, { tracking: "-0.035em" })}</span>
          <img
            src="assets/hair-like-this-2.png"
            alt=""
            style={{
              height: "0.75em",
              width: "auto",
              flexShrink: 0,
            }}
          />
          <span style={{ whiteSpace: "nowrap" }}>{renderStaggeredLetters("Belden", true, 0, { tracking: "-0.035em" })}</span>
        </h2>
      </div>

      <style>{`
        @keyframes client-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes client-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

// ─────────────── APP ───────────────

function App() {
  return (
    <>
      <Hero />
      <PullQuote />
      <SelectedWork />
      <Contact />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
