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
    tags: ["Design System", "Governance", "Figma"],
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
    title: "A North Star for global health insurance",
    tagline: "Unifying the customer experience across markets. The output unlocked £20m+ of follow-on work.",
    tags: ["Product Vision", "User Research", "Prototyping"],
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
    title: "A facelift for the nation's most-loved self-serve coffee",
    tagline: "UI redesign across two screen formats, aligned to the new Costa brand. One visual language, two very different canvases.",
    tags: ["Brand Refresh", "UI Design", "Concept"],
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
    title: "A flexible digital identity for a global network of premium schools",
    tagline: "Delivering a component library for 76 international schools, designed in parallel with an evolving brand.",
    tags: ["UX / UI", "Component Library", "Brand Translation"],
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
          fontFamily: "var(--font-display)",
          fontSize: "clamp(64px, 16vw, 300px)",
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
            maxWidth: "36ch",
          }}>
            Design lead. Systems thinker.{" "}
            <span style={{ fontStyle: "italic", opacity: 0.8 }}>Making complexity look effortless.</span>
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
              maxWidth: "36ch",
            }}>
              Design lead. Systems thinker.{" "}
              <span style={{ fontStyle: "italic", opacity: 0.8 }}>Making complexity look effortless.</span>
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
          Products, <span className="italic-accent" style={{ color: "var(--accent)" }}>systems</span>,
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
          <span className="italic-accent" style={{ color: "var(--accent)" }}>Publicis Sapient</span>
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
          <span className="italic-accent" style={{ color: "var(--accent)" }}>Publicis Sapient</span>.
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
    <section style={{
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
          fontSize: "clamp(32px, 4.2vw, 60px)",
          lineHeight: 1.15,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          margin: 0,
        }}>
          I lead{" "}
          <span className="italic-accent" style={{ color: "var(--accent)" }}>product vision</span>
          {" "}and design system work for brands at scale. From AI interfaces and app strategies to tokenised component libraries, I bring structure to complex problems.
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
          <span className="bracket">SELECTED WORK</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 7vw, 112px)",
          lineHeight: 0.95,
          fontWeight: 300,
          letterSpacing: "-0.035em",
        }}>
          Recent <span className="italic-accent" style={{ color: "var(--accent)" }}>work</span>.
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

  useEffect(() => {
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
  }, []);

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
        boxShadow: index > 0 ? "0 -20px 60px -10px rgba(0,0,0,0.4)" : "none",
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
            above the thumbnail on mobile. */}
        <div style={{
          flex: isMobile ? 1 : undefined,
          display: isMobile ? "flex" : undefined,
          flexDirection: isMobile ? "column" : undefined,
          justifyContent: isMobile ? "center" : undefined,
          alignItems: isMobile ? "center" : undefined,
          width: isMobile ? "100%" : undefined,
          textAlign: isMobile ? "center" : "left",
        }}>
          {!isMobile && (
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 16 }}>
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
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.3)",
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
            space below the thumbnail on mobile. */}
        <div style={{
          flex: isMobile ? 1 : undefined,
          display: isMobile ? "flex" : undefined,
          flexDirection: isMobile ? "column" : undefined,
          justifyContent: isMobile ? "center" : undefined,
          alignItems: isMobile ? "center" : undefined,
          width: isMobile ? "100%" : undefined,
          textAlign: isMobile ? "center" : "right",
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 2.2vw, 30px)",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: isMobile ? 12 : 24,
            maxWidth: isMobile ? "28ch" : "32ch",
            marginLeft: isMobile ? "auto" : "auto",
            marginRight: isMobile ? "auto" : undefined,
          }}>
            {cs.title}
          </h4>
          {!isMobile && (
            <div className="mono" style={{
              color: "var(--ink-soft)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}>
              {cs.tags.map(t => (
                <div key={t}>— {t}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom meta */}
      <div style={{
        position: "absolute",
        bottom: 32, left: 32, right: 32,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "end",
        zIndex: 3,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          {index < total - 1 ? "Scroll ↓" : "End ·"}
        </div>
      </div>
    </article>
  );
}

// ─────────────── CLIENT MARQUEE ───────────────

function ClientStrip() {
  return (
    <section style={{
      padding: "80px 0",
      borderTop: "1px solid var(--line-faint)",
      borderBottom: "1px solid var(--line-faint)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "0 32px", marginBottom: 40 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          I'VE ALSO WORKED WITH
        </div>
      </div>

      <div style={{
        display: "flex",
        animation: "client-scroll 60s linear infinite",
        whiteSpace: "nowrap",
      }}>
        {[...PAST_CLIENTS, ...PAST_CLIENTS].map((c, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 72px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            padding: "0 32px",
            color: "var(--ink)",
            display: "inline-flex",
            alignItems: "center",
            gap: 48,
          }}>
            {c}
            <span style={{
              fontFamily: "var(--font-italic)",
              fontStyle: "italic",
              color: "var(--accent)",
              fontSize: "0.5em",
              verticalAlign: "middle",
            }}>✺</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes client-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// ─────────────── CONTACT ───────────────

function Contact() {
  const isMobile = useIsMobile();
  return (
    <section id="contact" style={{
      padding: isMobile ? "60px 20px 60px" : "80px 32px 80px",
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 24 : 80,
        alignContent: "center",
        marginBottom: isMobile ? 60 : 120,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">CONTACT</span>
        </div>

        <div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(64px, 10vw, 180px)",
            lineHeight: 0.92,
            fontWeight: 300,
            letterSpacing: "-0.04em",
            marginBottom: 56,
          }}>
            Let's <span className="italic-accent" style={{ color: "var(--accent)" }}>talk</span>.
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: isMobile ? 32 : 64,
            maxWidth: 1100,
          }}>
            <div>
              <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 10 }}>
                <span className="bracket">EMAIL</span>
              </div>
              <a
                href="mailto:elspethbelden@gmail.com"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  fontWeight: 400,
                  display: "inline-block",
                  borderBottom: "1px solid var(--ink)",
                  paddingBottom: 2,
                }}
              >
                Send me a message
              </a>
            </div>
            <div>
              <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 10 }}>
                <span className="bracket">ELSEWHERE</span>
              </div>
              <a
                href="https://www.linkedin.com/in/elspethbelden/"
                target="_blank" rel="noopener"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  fontWeight: 400,
                  display: "inline-block",
                  borderBottom: "1px solid var(--ink)",
                  paddingBottom: 2,
                }}
              >
                LinkedIn ↗
              </a>
            </div>
            <div>
              <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 10 }}>
                <span className="bracket">CV</span>
              </div>
              <a
                href="assets/Elspeth-Belden-CV.pdf"
                download
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  fontWeight: 400,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid var(--ink)",
                  paddingBottom: 2,
                }}
              >
                Download
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M8 2v9M4.5 7.5 8 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 13.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
        gap: isMobile ? 24 : 32,
        paddingTop: 40,
        borderTop: "1px solid var(--line-faint)",
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">© 2026</span></div>
          Elspeth Belden
        </div>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">LOCATION</span></div>
          London, UK
        </div>
        <div className="mono" style={{ color: "var(--ink-soft)", gridColumn: isMobile ? "1 / -1" : undefined }}>
          <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">STATUS</span></div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block"
            }}></span>
            Open to conversations
          </span>
        </div>
      </div>
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
      <ClientStrip />
      <Contact />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
