// Case study — NatWest Made to Matter (WGDLL)
const { useState, useEffect } = React;

function RollingLink({ href, children, style, onClick, as = "a", className, hover: hoverProp, target, rel, download }) {
  const [internalHover, setInternalHover] = useState(false);
  const hover = hoverProp !== undefined ? hoverProp : internalHover;
  const reduced = typeof window !== "undefined" && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const text = String(children);
  const Tag = as;
  const tagProps = as === "a"
    ? { href, onClick, target, rel, download, "aria-label": text }
    : { "aria-label": text };
  const hoverHandlers = hoverProp === undefined
    ? { onMouseEnter: () => setInternalHover(true), onMouseLeave: () => setInternalHover(false) }
    : {};

  return (
    <Tag
      {...tagProps}
      className={className}
      {...hoverHandlers}
      style={{ position: "relative", display: "inline-flex", cursor: "pointer", ...style }}
    >
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {text.split("").map((ch, i) => (
          <span key={i} style={{
            position: "relative", display: "inline-block",
            height: "1em", lineHeight: "1em", overflow: reduced ? "visible" : "hidden"
          }}>
            {reduced ? (
              <span style={{ display: "block", opacity: hover ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
                {ch === " " ? " " : ch}
              </span>
            ) : (
              <span style={{
                display: "block",
                transform: hover ? "translateY(1em)" : "translateY(0)",
                transition: "transform 0.55s cubic-bezier(0.43, 0.195, 0.02, 1)",
                transitionDelay: `${i * 0.025}s`
              }}>
                <span style={{ display: "block", height: "1em" }}>{ch === " " ? " " : ch}</span>
                <span style={{ display: "block", height: "1em", opacity: 0.6, position: "absolute", top: "-1em", left: 0 }}>
                  {ch === " " ? " " : ch}
                </span>
              </span>
            )}
          </span>
        ))}
      </span>
      <span aria-hidden="true" style={{
        position: "absolute", left: 0, right: 0, bottom: -4,
        height: 1, background: "currentColor",
        transformOrigin: "right",
        transform: hover ? "scaleX(0)" : "scaleX(1)",
        transition: "transform 0.22s ease"
      }} />
    </Tag>
  );
}

function BrandMark() {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", display: "inline-block", width: 21, height: 21 }}
    >
      <svg width="21" height="21" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0,
        transform: hover ? "scale(0) rotate(-14deg)" : "scale(1) rotate(0deg)",
        transition: "transform 0.25s ease"
      }}>
        <path d="M0 5 H32 V9 H4 V14 H32 V18 H4 V23 H32 V27 H0 Z" />
      </svg>
      <svg width="21" height="21" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0,
        transform: hover ? "scale(1) rotate(0deg)" : "scale(0) rotate(14deg)",
        transition: "transform 0.25s ease"
      }}>
        <path d="M16 4 L3 17 L3 29 L29 29 L29 17 Z" />
      </svg>
    </span>
  );
}

function useIsMobile(bp = 768) {
  const [m, setM] = React.useState(window.innerWidth < bp);
  React.useEffect(() => {
    const fn = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return m;
}

function ImagePlaceholder({ id, label = "image", aspect = "4/3", full = false, tint = "warm" }) {
  const slotId = id || ("slot-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  const wrapRef = React.useRef(null);
  const [natAspect, setNatAspect] = React.useState(null);

  React.useEffect(() => {
    if (full) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const slot = wrap.querySelector("image-slot");
    if (!slot) return;
    let stopped = false;
    const probe = () => {
      if (stopped) return;
      const img = slot.shadowRoot && slot.shadowRoot.querySelector("img");
      if (img && img.naturalWidth && img.naturalHeight) {
        setNatAspect(img.naturalWidth + " / " + img.naturalHeight);
      }
    };
    const id = setInterval(probe, 400);
    probe();
    return () => { stopped = true; clearInterval(id); };
  }, [full]);

  return (
    <div ref={wrapRef} style={{
      width: "100%",
      height: full ? "100%" : "auto",
      aspectRatio: full ? "auto" : (natAspect || aspect),
      position: "relative",
      overflow: "hidden"
    }}>
      <image-slot
        id={slotId}
        placeholder={label}
        fit={full ? "cover" : (natAspect ? "fill" : "contain")}
        style={{ width: "100%", height: "100%", display: "block", background: "var(--bg-alt)" }}
      ></image-slot>
    </div>
  );
}

function HeroTop() {
  const heroRef = React.useRef(null);
  const progress = useHeroScrollProgress(heroRef);
  const heroHeight = heroRef.current ? heroRef.current.getBoundingClientRect().height : 0;
  const y = progress * heroHeight * 0.7;
  const opacity = mapRange(progress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <section ref={heroRef} style={{ position: "relative", height: "calc(100dvh - 185px)", width: "100%", overflow: "hidden" }}>
      {/* Breadcrumbs overlay — left untouched, only the background media below moves/fades. */}
      <div style={{
        position: "absolute",
        top: 28, left: 32, right: 32,
        zIndex: 10,
        color: "#F4F1EC",
        mixBlendMode: "difference"
      }}>
        <div className="mono">
          <a href="index.html" aria-label="Home" style={{ color: "rgba(244,241,236,0.7)", display: "inline-flex", verticalAlign: "-6px" }}>
            <BrandMark />
          </a>
          <span style={{ margin: "0 10px", color: "rgba(244,241,236,0.5)" }}>/</span>
          <span style={{ color: "#F4F1EC" }}>NatWest Made to Matter</span>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%", transform: `translateY(${y}px)`, opacity, willChange: "transform, opacity" }}>
        <ImagePlaceholder id="mtm-hero" label="hero — NatWest Made to Matter" full tint="cool" />
      </div>
    </section>
  );
}

function Opener() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "32px 20px 32px" : "40px 32px 40px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "3fr 1fr",
        gap: isMobile ? 20 : 64
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 32, fontWeight: 200, lineHeight: 1.26
        }}>NatWest</div>
        {!isMobile && (
          <div>
            {["Strategy", "Experience Design", "Vision"].map(tag => (
              <div key={tag} style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "6px 0",
                borderTop: "1px solid var(--line-faint)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: 16,
                letterSpacing: "-0.025em",
                color: "var(--ink)"
              }}>{tag}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9.7vw, 140px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          maxWidth: "18ch", fontWeight: 200
        }}>
          Made to Matter.
        </h1>
      </div>

      {isMobile && (
        <div style={{ marginBottom: 24 }}>
          {["Strategy", "Experience Design", "Vision"].map(tag => (
            <div key={tag} style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "6px 0",
              borderTop: "1px solid var(--line-faint)",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 16,
              letterSpacing: "-0.025em",
              color: "var(--ink)"
            }}>{tag}</div>
          ))}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        paddingTop: isMobile ? 24 : 40,
        paddingBottom: isMobile ? 24 : 40
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          INTRO
        </div>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: isMobile ? 18 : 20,
          lineHeight: isMobile ? "26px" : "28px",
          fontWeight: 300,
          color: "var(--ink)",
          paddingRight: isMobile ? 0 : 80
        }}>
          Defining what good looks like for{" "}
          NatWest's digital experience
          {" "}— a strategic vision piece that set the direction for design quality across the bank.
        </p>
      </div>
    </section>
  );
}

function ContextSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          01 — CONTEXT
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1,
            fontWeight: 200,
            letterSpacing: "-0.025em",
            marginBottom: 40
          }}>
            Setting the bar for{" "}
            digital quality.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              As NatWest's design practice matured, there was a growing need to articulate what "good" looked like across the bank's digital touchpoints. Not just technically, but experientially.
            </p>
            <p>
              This project was about creating a shared language and visual benchmark for design excellence, giving teams a north star to work towards and a framework for evaluating their output.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <ImagePlaceholder id="mtm-context" label="context — what good looks like" aspect="16/9" tint="cool" />
        <div className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 01</span> Defining quality benchmarks across NatWest's digital estate.</span>
          <span className="bracket">STRATEGY</span>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          02 — VISION
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          A benchmark for what great feels like.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start", marginBottom: isMobile ? 40 : 80 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            V.01 — INSPIRATION
          </div>
          Pulling together the best-in-class references from across finance, retail and beyond to establish what a premium, trusted digital experience could look like for NatWest customers.
        </div>
        <figure>
          <ImagePlaceholder id="mtm-vision-01" label="vision — inspiration board" aspect="16/9" tint="cool" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 02</span> Best-in-class references curated for relevance to NatWest's context.</span>
            <span className="bracket">INSPIRATION</span>
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            V.02 — PRINCIPLES
          </div>
          Translating the inspiration into a set of guiding principles that could inform design decisions at every level, from component detail to journey flow.
        </div>
        <figure>
          <ImagePlaceholder id="mtm-vision-02" label="vision — design principles" aspect="16/9" tint="cool" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 03</span> Principles distilled from the research into actionable design guidance.</span>
            <span className="bracket">PRINCIPLES</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ProcessSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          03 — PROCESS
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          Research, distillation, provocation.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start", marginBottom: isMobile ? 40 : 80 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            P.01 — AUDIT
          </div>
          Reviewing NatWest's existing digital touchpoints against the benchmark — identifying the gaps, the quick wins, and the structural changes needed to close the distance.
        </div>
        <figure>
          <ImagePlaceholder id="mtm-process-01" label="process — current state audit" aspect="16/9" tint="cool" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 04</span> Current state audit against the benchmark.</span>
            <span className="bracket">AUDIT</span>
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            P.02 — SHOWCASE
          </div>
          Presenting the vision to senior stakeholders in a format that was engaging and persuasive, not just a document. The breakfast deck format was designed to create conversation, not just inform.
        </div>
        <figure>
          <ImagePlaceholder id="mtm-process-02" label="process — breakfast deck slides" aspect="16/9" tint="cool" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 05</span> The Made to Matter breakfast deck — vision presented to NatWest leadership.</span>
            <span className="bracket">PRESENTATION</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function OutcomeSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          04 — OUTCOME
        </div>
        <div style={{ maxWidth: "55ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 76px)",
            lineHeight: 1,
            fontWeight: 200,
            letterSpacing: "-0.03em",
            marginBottom: 40
          }}>
            A shared language for quality.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              The Made to Matter deck gave NatWest's leadership team a concrete, visual articulation of design ambition. It created a common reference point for conversations about quality that had previously been subjective.
            </p>
            <p>
              More practically, it gave the design team a framework to evaluate work against and a compelling case to make internally for investment in design quality.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <ImagePlaceholder id="mtm-outcome" label="outcome — vision realised" aspect="16/9" tint="cool" />
        <div className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 06</span> The vision, realised.</span>
          <span className="bracket">OUTCOME</span>
        </div>
      </div>
    </section>
  );
}

function NextProject() {
  const isMobile = useIsMobile();
  const [cardHover, setCardHover] = useState(false);
  return (
    <section style={{ padding: isMobile ? "60px 20px 70px" : "120px 32px 140px", borderTop: "1px solid var(--line-faint)" }}>
      <a href="natwest.html" style={{ display: "block" }} onMouseEnter={() => setCardHover(true)} onMouseLeave={() => setCardHover(false)}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}>
          <div style={{ order: isMobile ? 0 : 1 }}>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>NatWest · 2023—2024</div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 200,
              letterSpacing: "-0.035em",
              marginBottom: 24
            }}>
              A design system built to survive a rebrand.
            </h3>
            <RollingLink as="span" hover={cardHover} className="mono" style={{ paddingBottom: 4 }}>Read case study</RollingLink>
          </div>
          <div style={{ order: isMobile ? 0 : 2, height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined }}>
            <ImagePlaceholder id="next-natwest-ds" label="NatWest — Design System" full tint="cool" />
          </div>
        </div>
      </a>
    </section>
  );
}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "48px 20px" : "80px 32px",
      borderTop: "1px solid var(--line-faint)",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
      gap: isMobile ? 24 : 32
    }}>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>© 2026</div>
        Elspeth Belden
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>EMAIL</div>
        <RollingLink href="mailto:elspethbelden@gmail.com">elspethbelden@gmail.com</RollingLink>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>LINKEDIN</div>
        <RollingLink href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener">/in/elspethbelden ↗</RollingLink>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <RollingLink href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</RollingLink>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>BACK</div>
            <RollingLink href="index.html">Home ↑</RollingLink>
          </>
        )}
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <div style={{
        background: "#1A1A1A",
        color: "#F4F1EC",
        ["--ink"]: "#F4F1EC",
        ["--ink-soft"]: "rgba(244,241,236,0.75)",
        ["--ink-faint"]: "rgba(244,241,236,0.5)",
        ["--line-faint"]: "rgba(244,241,236,0.18)",
        ["--bg-alt"]: "#222222"
      }}>
        <HeroTop />
        <Opener />
      </div>
      <ContextSection />
      <VisionSection />
      <ProcessSection />
      <OutcomeSection />
      <NextProject />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
