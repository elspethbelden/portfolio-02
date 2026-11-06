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
    href: "case-study.html",
    featured: true,
    imageLabel: "GS AI — product shot",
    imageTint: "warm"
  },
  {
    id: "natwest-ds",
    num: "02",
    year: "2024",
    client: "NatWest",
    title: "Migrating a bank's design system to Figma",
    tagline: "A 400% efficiency improvement by rebuilding the system, the governance, and the team around it.",
    tags: ["Design System", "Governance", "Figma"],
    role: "Experience Lead",
    duration: "12 months",
    imageLabel: "NatWest DS — component grid",
    imageTint: "cool"
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
    imageLabel: "Bupa app — journey map",
    imageTint: "sage"
  }
];

const PAST_CLIENTS = [
  "ASOS", "HSBC", "Guinness Storehouse", "Costa Coffee",
  "GovUK", "E.ON", "Art Fund", "Sainsbury's",
  "National Theatre", "Chelsea FC", "Topman", "Nord Anglia",
  "Diageo", "Freeview", "NowTV", "Bethesda"
];

// ─────────────── COMPONENTS ───────────────

function EBurger_UNUSED({ open }) {
  // Short, wide capital "E" — three equal horizontal bars + vertical spine
  const barColor = "currentColor";
  const W = 44, H = 22, T = 4; // width, height, bar thickness
  return (
    <div style={{
      width: W, height: H,
      position: "relative",
      transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}>
      {/* Vertical spine */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: T, height: H,
        background: barColor,
        transition: "opacity 250ms",
        opacity: open ? 0 : 1,
      }} />
      {/* Top bar (full width) */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: W, height: T,
        background: barColor,
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: open ? `translateY(${(H - T) / 2}px) rotate(45deg)` : "translateY(0) rotate(0)",
        transformOrigin: "center",
      }} />
      {/* Middle bar (same width) */}
      <div style={{
        position: "absolute", left: 0, top: "50%",
        width: W, height: T,
        marginTop: -T / 2,
        background: barColor,
        transition: "opacity 250ms, transform 400ms",
        opacity: open ? 0 : 1,
        transform: open ? "scaleX(0)" : "scaleX(1)",
        transformOrigin: "left center",
      }} />
      {/* Bottom bar (full width) */}
      <div style={{
        position: "absolute", left: 0, bottom: 0,
        width: W, height: T,
        background: barColor,
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: open ? `translateY(${-(H - T) / 2}px) rotate(-45deg)` : "translateY(0) rotate(0)",
        transformOrigin: "center",
      }} />
    </div>
  );
}

function TopBar() {
  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 200,
      padding: "24px 32px",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      mixBlendMode: "difference",
      color: "#F4F1EC",
      pointerEvents: "none",
    }}>
      <a
        href="#contact"
        className="mono"
        style={{
          pointerEvents: "auto",
          color: "#F4F1EC",
          transition: "opacity 200ms",
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
      >
        Let's talk
      </a>
    </header>
  );
}

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
  const tint = TINT_COLORS && TINT_COLORS.warm ? TINT_COLORS.warm : { bg: "#E8DFD2", stripe: "#DCCFB9", solid: "#C9A07A" };
  const HERO_IMAGES = [
    "assets/hero/01-art-pass.webp",
    "assets/hero/02-costa.webp",
    "assets/hero/03-eon.webp",
    "assets/hero/04-hsbc.webp",
    "assets/hero/05-innocent.webp",
  ];
  const [loaded, setLoaded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
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
    <section style={{
      minHeight: "92vh",
      height: "92vh",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      color: "#F4F1EC",
    }}>
      {/* Background images — cross-fading carousel, full bleed.
          Loading animation: zoom 110% -> 100% and blur(20px) -> blur(0). */}
      <div style={{
        position: "absolute", inset: 0,
        zIndex: 0,
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
              // Subtle Ken-Burns-ish drift on the active image
              transform: i === activeImg ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1800ms ease-in-out, transform 6000ms ease-out",
              willChange: "opacity, transform",
            }}
          />
        ))}
      </div>
      {/* Striped overlay to read as a placeholder photo — also zooms in */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(135deg, rgba(0,0,0,0) 0 14px, rgba(0,0,0,0.08) 14px 28px)",
        zIndex: 0,
        transform: loaded ? "scale(1)" : "scale(1.1)",
        opacity: loaded ? 1 : 0,
        transition: "transform 1800ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1200ms ease-out",
      }} />
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

      {/* Top utility row — Experience Designer top-right.
          TopBar's "Let's talk" sits at top-left at z 200. */}
      <div style={{
        position: "relative", zIndex: 3,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 900ms ease-out 400ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 400ms",
        display: "flex", justifyContent: "flex-end",
        alignItems: "center",
        padding: "26px 32px 0",
      }}>
        <div className="mono" style={{
          color: "rgba(244,241,236,0.85)",
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          <div>Experience Designer</div>
          <div style={{ opacity: 0.7 }}>Based in London</div>
        </div>
      </div>

      {/* Full-width name */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "16px 24px 0",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 1100ms ease-out 600ms, transform 1100ms cubic-bezier(0.2, 0.8, 0.2, 1) 600ms",
      }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(64px, 16vw, 300px)",
          lineHeight: 0.88,
          fontWeight: 400,
          letterSpacing: "-0.04em",
          margin: 0,
          color: "#F4F1EC",
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}>
          <span>Elspeth</span>
          <span>Belden</span>
        </h1>
      </div>

      {/* Tags row beneath the name — flanking left/right to mirror the name */}
      <div style={{
        position: "relative", zIndex: 3,
        display: "flex", justifyContent: "space-between",
        padding: "20px 32px 0",
        flexWrap: "wrap",
        gap: 16,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 900ms ease-out 900ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 900ms",
      }}>
        {["#EXPERIENCE", "#PRODUCT", "#AI NATIVE", "#DESIGN SYSTEMS"].map(t => (
          <span key={t} className="mono" style={{
            color: "rgba(244,241,236,0.75)",
            fontSize: 12,
          }}>{t}</span>
        ))}
      </div>

      {/* Spacer pushes tagline to bottom */}
      <div style={{ flex: 1 }} />

      {/* Bottom: tagline + scroll cue */}
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
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 2.2vw, 30px)",
          lineHeight: 1.3,
          color: "#F4F1EC",
          fontWeight: 400,
          maxWidth: "36ch",
        }}>
          I design digital products, systems<br/>and stories for brands with scale.
        </p>

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
  return (
    <section style={{
      padding: "120px 32px",
      borderTop: "1px solid var(--line-faint)",
      borderBottom: "1px solid var(--line-faint)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr 1fr",
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
          I design with{" "}
          <span className="italic-accent" style={{ color: "var(--accent)" }}>refined aesthetics</span>
          {" "}and functional clarity — shaping systems that hold up under scale, pressure, and pixel-perfect scrutiny.
        </blockquote>
        <div className="mono" style={{
          color: "var(--ink-soft)",
          textAlign: "right",
          alignSelf: "end"
        }}>
          <span className="bracket">01</span>
        </div>
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
};

function SelectedWork() {
  const [density, setDensity] = useState(window.__tweaks.gridDensity);
  useEffect(() => {
    const onChange = (e) => setDensity(e.detail.gridDensity);
    window.addEventListener('tweaks-changed', onChange);
    return () => window.removeEventListener('tweaks-changed', onChange);
  }, []);

  return (
    <section id="work" style={{ padding: 0 }}>
      {/* Header sits above the immersive panels */}
      <div style={{
        padding: "100px 32px 60px",
        display: "grid",
        gridTemplateColumns: "1fr 3fr 1fr",
        gap: 32,
        alignItems: "end",
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">SELECTED WORK · {CASE_STUDIES.length} PROJECTS</span>
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
        <div className="mono" style={{ textAlign: "right", color: "var(--ink-soft)" }}>
          2022—2026
        </div>
      </div>

      {/* Immersive case-study panels — sticky stack.
          The wrapping div gets enough height for all cards to stack,
          and each <article> is position:sticky top:0 so it pins as the next rises over. */}
      <div style={{
        position: "relative",
        // Each card pins for ~80vh of scroll before the next one slides over.
        // Total scroll length = (count - 1) * pinDistance + 1 viewport for the last card.
        // We achieve this naturally by giving each article a height of 100vh
        // (the sticky pin stops when the article's bottom reaches the viewport bottom).
      }}>
        {CASE_STUDIES.map((cs, i) => (
          <CaseStudyPanel key={cs.id} cs={cs} index={i} total={CASE_STUDIES.length} />
        ))}
      </div>
    </section>
  );
}

function CaseStudyPanel({ cs, index, total }) {
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const stickyRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1 visibility (legacy parallax)
  const [coverProgress, setCoverProgress] = useState(0); // 0..1 next-card-coverage
  const tint = TINT_COLORS[cs.imageTint] || TINT_COLORS.warm;

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Legacy: visibility-based parallax for inner content
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - vh / 2) / vh;
      setProgress(Math.max(0, 1 - dist));

      // Cover progress: how far we've scrolled past the start of this article.
      // Article is taller than viewport (e.g. 160vh). Sticky pins for ~60vh of scroll,
      // during which the NEXT article begins rising over it.
      const articleH = el.offsetHeight;
      const pinScrollRange = articleH - vh; // distance over which sticky stays pinned
      const scrolled = -r.top; // how far past article top we've scrolled
      let cp = scrolled / Math.max(pinScrollRange, 1);
      cp = Math.max(0, Math.min(1, cp));
      // Last card never gets covered
      if (index === total - 1) cp = 0;
      setCoverProgress(cp);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [index, total]);

  // Subtle parallax + reveal driven by progress
  const thumbScale = 0.94 + 0.06 * progress;
  const thumbOpacity = 0.4 + 0.6 * progress;
  const textShift = (1 - progress) * 24;

  // Sticky stack: cards pile up. Each card slides over the previous one.
  // No shrink/dim; just clean stacking with a subtle shadow under the rising card.
  const cardScale = 1;
  const cardOpacity = 1;
  const cardRadius = 0;
  // Last card has no extra height so its sticky simply releases
  const articleHeight = index === total - 1 ? "100vh" : "160vh";

  return (
    <article
      ref={ref}
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        minHeight: 640,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Solid base so the card is fully opaque even before the gradient layers paint.
        background: tint.bg,
        // Stack so newer cards sit above older ones
        zIndex: index + 1,
        // Subtle shadow on the top edge so the rising card visually sits on the previous
        boxShadow: index > 0
          ? "0 -24px 60px -16px rgba(0,0,0,0.35)"
          : "none",
      }}
    >
      {/* Blurred backdrop (giant version of the thumbnail) — fully opaque now */}
      <div style={{
        position: "absolute",
        inset: "-10%",
        background: `radial-gradient(ellipse at 30% 40%, ${tint.solid} 0%, ${tint.stripe} 45%, ${tint.bg} 100%)`,
        filter: "blur(80px) saturate(1.1)",
        transform: `scale(${1 + 0.1 * progress})`,
        transition: "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      }} />

      {/* Soft vignette to keep text readable */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to right, rgba(244,241,236,0.55) 0%, rgba(244,241,236,0) 30%, rgba(244,241,236,0) 70%, rgba(244,241,236,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Index counter, top-left */}
      <div style={{
        position: "absolute",
        top: 32, left: 32,
        zIndex: 3,
      }}>
        <div className="mono" style={{ color: "var(--ink)", opacity: 0.6 }}>
          <span className="bracket">{cs.num} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Year, top-right */}
      <div style={{
        position: "absolute",
        top: 32, right: 32,
        zIndex: 3,
      }}>
        <div className="mono" style={{ color: "var(--ink)", opacity: 0.6 }}>
          {cs.year}
        </div>
      </div>

      {/* Three-column composition: client | thumbnail | meta */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "clamp(24px, 5vw, 80px)",
        padding: "0 48px",
      }}>
        {/* Left: client name */}
        <div style={{
          opacity: progress,
          transform: `translateX(${-textShift}px)`,
          transition: "opacity 500ms, transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}>
          <div className="mono" style={{
            color: "var(--ink-soft)",
            marginBottom: 16,
          }}>
            <span className="bracket">CLIENT</span>
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 7vw, 112px)",
            lineHeight: 0.95,
            fontWeight: 400,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}>
            {cs.client}
          </h3>
        </div>

        {/* Middle: thumbnail */}
        <a
          href={cs.href || "#"}
          onClick={(e) => { if (!cs.href) e.preventDefault(); }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: "block",
            width: "clamp(360px, 36vw, 560px)",
            aspectRatio: "4/3",
            position: "relative",
            cursor: cs.href ? "pointer" : "default",
            opacity: thumbOpacity,
            transform: `scale(${thumbScale}) ${hover ? "translateY(-6px)" : "translateY(0)"}`,
            transition: "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 600ms, box-shadow 400ms",
            boxShadow: hover
              ? "0 40px 80px -20px rgba(0,0,0,0.35)"
              : "0 24px 60px -20px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          <ImagePlaceholder label={cs.imageLabel} full tint={cs.imageTint} />
          {cs.href && (
            <div style={{
              position: "absolute",
              bottom: 16, right: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#F4F1EC",
              background: "rgba(26,26,26,0.85)",
              padding: "10px 14px",
              transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms",
              transform: hover ? "translate(0,0)" : "translate(6px,6px)",
              opacity: hover ? 1 : 0.7,
            }}>
              See case →
            </div>
          )}
        </a>

        {/* Right: title + tags */}
        <div style={{
          opacity: progress,
          transform: `translateX(${textShift}px)`,
          transition: "opacity 500ms, transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          textAlign: "right",
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 1.8vw, 26px)",
            lineHeight: 1.25,
            fontWeight: 400,
            letterSpacing: "-0.015em",
            color: "var(--ink)",
            marginBottom: 24,
            maxWidth: "22ch",
            marginLeft: "auto",
          }}>
            <span className="italic-accent" style={{ color: "var(--accent)" }}>“</span>
            {cs.title}
            <span className="italic-accent" style={{ color: "var(--accent)" }}>”</span>
          </h4>
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
        </div>
      </div>

      {/* Bottom: scroll cue / panel divider */}
      <div style={{
        position: "absolute",
        bottom: 32, left: 32, right: 32,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        zIndex: 3,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          {cs.role} · {cs.duration}
        </div>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          {index < total - 1 ? "Scroll ↓" : "End ·"}
        </div>
      </div>
    </article>
  );
}

// ─────────────── ABOUT ───────────────

function About() {
  return (
    <section id="about" style={{
      padding: "160px 32px",
      borderTop: "1px solid var(--line-faint)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 80,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">ABOUT / BIO</span>
        </div>

        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 2.6vw, 36px)",
            lineHeight: 1.35,
            fontWeight: 300,
            color: "var(--ink)",
            maxWidth: "40ch",
            marginBottom: 80,
          }}>
            <p style={{ marginBottom: "1em" }}>
              I've spent{" "}
              <span className="italic-accent" style={{ color: "var(--accent)" }}>nineteen years</span>
              {" "}designing digital products — from North Star visions at agency scale to pixel-level component specs.
            </p>
            <p style={{ marginBottom: "1em" }}>
              My work lives where craft meets system: design tokens with 1:1 code parity, governance models that actually get adopted, and interfaces that feel{" "}
              <span className="italic-accent" style={{ color: "var(--accent)" }}>considered</span>.
            </p>
            <p>
              I'm currently Experience Lead at Publicis Sapient, based in London.
            </p>
          </div>

          {/* Experience rail */}
          <div>
            <div className="mono" style={{
              color: "var(--ink-faint)",
              marginBottom: 24,
              paddingBottom: 12,
              borderBottom: "1px solid var(--line-faint)"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: 24
              }}>
                <span>Period</span>
                <span>Role</span>
                <span>Studio</span>
              </div>
            </div>
            {[
              ["2022—", "Experience Lead", "Publicis Sapient"],
              ["2019–22", "Lead Product Designer", "Mullen Lowe Profero"],
              ["2015–19", "Senior UI Designer", "Engine"],
              ["2014–15", "Designer", "FullSix / Havas"],
              ["2007–13", "Digital Designer", "Neoco"],
            ].map(([period, role, studio]) => (
              <div key={period} style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: 24,
                padding: "20px 0",
                borderBottom: "1px solid var(--line-faint)",
                alignItems: "baseline",
              }}>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>{period}</span>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 400,
                }}>{role}</span>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>{studio}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
          <span className="bracket">ALSO WORKED WITH — {PAST_CLIENTS.length} BRANDS</span>
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
  return (
    <section id="contact" style={{
      padding: "160px 32px 80px",
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 80,
        marginBottom: 120,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">CONTACT · 2026</span>
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
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            maxWidth: 840,
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
                  wordBreak: "break-all",
                }}
              >
                elspethbelden@gmail.com
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
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 32,
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
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
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
      <TopBar />
      <Hero />
      <PullQuote />
      <SelectedWork />
      <ClientStrip />
      <About />
      <Contact />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
