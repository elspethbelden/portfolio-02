// Case study — Goldman Sachs AI Companion
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
          <span style={{ color: "#F4F1EC" }}>Goldman Sachs · AI Companion</span>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%", transform: `translateY(${y}px)`, opacity, willChange: "transform, opacity" }}>
        <ImagePlaceholder id="gs-hero" label="hero — Goldman Sachs AI companion" full tint="warm" />
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
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400 }}>Goldman Sachs</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            AI / LLM<br />
            Product Vision<br />
            Design System
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          maxWidth: "18ch", fontWeight: 200
        }}>
          An AI companion for the trading floor.
        </h1>
      </div>

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
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "flex-end",
          gap: isMobile ? 16 : 24
        }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.4,
            fontWeight: 300,
            color: "var(--ink)"
          }}>
            A north star vision for Goldman Sachs's in-house proprietary AI tool, built on the{" "}
            design system
            {" "}we helped establish. Designing for some of the most demanding, data-driven users in the world.
          </p>
          <div className="mono" style={{ color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
            6 MO.
          </div>
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
            Proprietary AI, built for{" "}
            professionals.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              Goldman Sachs had been building an internal AI platform used across the firm. The tool was powerful, but its design hadn't kept pace with the engineering. The brief was to define what the experience could be, not just what it was.
            </p>
            <p>
              We were working with traders, analysts and operations teams whose relationship with information is professional-grade. Every design decision had to earn its place.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <ImagePlaceholder id="gs-context" label="context — AI companion interface overview" aspect="16/9" tint="warm" />
        <div className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 01</span> The AI companion interface — designed for professional-grade users.</span>
          <span className="bracket">OVERVIEW</span>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const isMobile = useIsMobile();
  const principles = [
    {
      num: "P.01",
      title: "Trust over novelty",
      body: "AI outputs for financial professionals need to earn trust on every interaction. The design prioritised clarity, provenance and confidence intervals over impressive visual complexity."
    },
    {
      num: "P.02",
      title: "Built on the system",
      body: "The GS design system provided the foundation. Every component, token and pattern in the companion traced back to the existing library, ensuring consistency across the firm's growing suite of internal tools."
    },
    {
      num: "P.03",
      title: "Ambient intelligence",
      body: "The most powerful AI interfaces disappear when they're working well. The design aimed to surface the right information at the right moment without demanding attention when things were running smoothly."
    }
  ];

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          02 — PRINCIPLES
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          Designing for demanding users.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 32 : 48 }}>
        {principles.map((p) => (
          <div key={p.num} style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 20 }}>
              {p.num}
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30, lineHeight: 1.15,
              fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 16
            }}>{p.title}</h3>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)"
            }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExplorationSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 60 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          03 — EXPLORATION
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          From concept to north star.
        </h2>
      </div>

      <figure style={{ marginBottom: isMobile ? 40 : 80 }}>
        <ImagePlaceholder id="gs-explore-01" label="exploration — AI companion dashboard concept" aspect="16/9" tint="warm" />
        <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 02</span> Dashboard concept — information density calibrated for professional users.</span>
          <span className="bracket">CONCEPT · DASHBOARD</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start", marginBottom: isMobile ? 40 : 80 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            E.01 — CONVERSATION DESIGN
          </div>
          Financial queries are complex, multi-part and often ambiguous. We designed a conversation model that handled context carry-over, source attribution and confidence signalling — reducing cognitive load without hiding the complexity.
        </div>
        <figure>
          <ImagePlaceholder id="gs-explore-02" label="exploration — conversation interface" aspect="16/9" tint="warm" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 03</span> Conversation interface with source attribution and confidence indicators.</span>
            <span className="bracket">CONVERSATION</span>
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, alignItems: "start" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            E.02 — SYSTEM INTEGRATION
          </div>
          The companion needed to sit inside an ecosystem of GS tools. We mapped the integration points and designed the transitions so the AI surface felt like a natural extension of the existing workflow rather than a parallel product.
        </div>
        <figure>
          <ImagePlaceholder id="gs-explore-03" label="exploration — system integration flow" aspect="16/9" tint="warm" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <span><span className="bracket">FIG. 04</span> Integration with the GS tool ecosystem — seamless transitions between surfaces.</span>
            <span className="bracket">INTEGRATION</span>
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
            A north star that stuck.
          </h2>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              The vision gave the GS engineering and product teams a clear target: what the experience could be when the technical pieces came together. It resolved ambiguity around scope, priority and design quality early in the process.
            </p>
            <p>
              Built entirely on the GS design system we had helped establish, the companion designs fed directly back into the system, extending it with AI-specific patterns that other internal tools could adopt.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <ImagePlaceholder id="gs-outcome" label="outcome — final AI companion north star" aspect="16/9" tint="warm" />
        <div className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 05</span> The north star — where the AI companion experience is headed.</span>
          <span className="bracket">NORTH STAR</span>
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
        NEXT CASE · 02 / 03
      </div>
      <a href="natwest.html" style={{ display: "block" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}>
          <div style={{ order: isMobile ? 0 : 1 }}>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>NatWest · 2023—2024</div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 400,
              letterSpacing: "-0.035em",
              marginBottom: 24
            }}>
              A design system built to survive a rebrand.
            </h3>
            <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>
              Read case study <span>→</span>
            </div>
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
        <a href="mailto:elspethbelden@gmail.com" style={{ borderBottom: "1px solid currentColor" }}>elspethbelden@gmail.com</a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>LINKEDIN</div>
        <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ borderBottom: "1px solid currentColor" }}>/in/elspethbelden ↗</a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <a href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ borderBottom: "1px solid currentColor" }}>Back to top ↑</a>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>BACK</div>
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
        background: "#0E0E0F",
        color: "#F4F1EC",
        ["--ink"]: "#F4F1EC",
        ["--ink-soft"]: "rgba(244,241,236,0.75)",
        ["--ink-faint"]: "rgba(244,241,236,0.5)",
        ["--line-faint"]: "rgba(244,241,236,0.18)",
        ["--bg-alt"]: "#1A1A1A"
      }}>
        <HeroTop />
        <Opener />
      </div>
      <ContextSection />
      <PrinciplesSection />
      <ExplorationSection />
      <OutcomeSection />
      <NextProject />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
