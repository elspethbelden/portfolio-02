// Case study — NatWest Made to Matter (WGDLL)
const { useState, useEffect } = React;

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
          <a href="index.html" style={{ color: "rgba(244,241,236,0.7)" }}>Home</a>
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
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr",
        gap: isMobile ? 20 : 32,
        paddingBottom: isMobile ? 32 : 60,
        borderBottom: "1px solid var(--line-faint)"
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400 }}>NatWest</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            Strategy<br />
            Experience Design<br />
            Vision
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: isMobile ? 24 : 40 }}>
          <span className="bracket">CASE STUDY · NATWEST</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          maxWidth: "18ch", fontWeight: 500
        }}>
          Made to Matter.
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr 1fr",
        gap: isMobile ? 20 : 40,
        paddingTop: isMobile ? 24 : 40,
        paddingBottom: isMobile ? 24 : 40
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">INTRO</span>
        </div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(16px, 1.8vw, 20px)",
          lineHeight: 1.4,
          fontWeight: 300,
          color: "var(--ink)"
        }}>
          Defining what good looks like for{" "}
          NatWest's digital experience
          {" "}— a strategic vision piece that set the direction for design quality across the bank.
        </p>
        <div className="mono" style={{ textAlign: isMobile ? "left" : "right", color: "var(--ink-soft)", alignSelf: isMobile ? "auto" : "end" }}>
          WGDLL
        </div>
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
          <span className="bracket">01 — CONTEXT</span>
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1,
            fontWeight: 300,
            letterSpacing: "-0.025em",
            marginBottom: 40
          }}>
            Setting the bar for{" "}
            digital quality.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
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
          <span className="bracket">02 — VISION</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          A benchmark for what great feels like.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start", marginBottom: isMobile ? 40 : 80 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">V.01 — INSPIRATION</span>
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
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">V.02 — PRINCIPLES</span>
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
          <span className="bracket">03 — PROCESS</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Research, distillation, provocation.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start", marginBottom: isMobile ? 40 : 80 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.01 — AUDIT</span>
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
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.02 — SHOWCASE</span>
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
          <span className="bracket">04 — OUTCOME</span>
        </div>
        <div style={{ maxWidth: "55ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 76px)",
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: "-0.03em",
            marginBottom: 40
          }}>
            A shared language for quality.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
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
  return (
    <section style={{ padding: isMobile ? "60px 20px 70px" : "120px 32px 140px", borderTop: "1px solid var(--line-faint)" }}>
      <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: isMobile ? 24 : 40 }}>
        <span className="bracket">NEXT CASE</span>
      </div>
      <a href="natwest.html" style={{ display: "block" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}>
          <div style={{ height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined }}>
            <ImagePlaceholder id="next-natwest-ds" label="NatWest — Design System" full tint="cool" />
          </div>
          <div>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>NatWest · 2023—2024</div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              marginBottom: 24
            }}>
              Building a bank's design system from scratch.
            </h3>
            <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>
              Read case study <span>→</span>
            </div>
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
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">© 2026</span></div>
        Elspeth Belden
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">EMAIL</span></div>
        <a href="mailto:elspethbelden@gmail.com" style={{ borderBottom: "1px solid currentColor" }}>elspethbelden@gmail.com</a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">LINKEDIN</span></div>
        <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ borderBottom: "1px solid currentColor" }}>/in/elspethbelden ↗</a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <a href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ borderBottom: "1px solid currentColor" }}>Back to top ↑</a>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">BACK</span></div>
            <a href="index.html" style={{ borderBottom: "1px solid currentColor" }}>Home ↑</a>
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
