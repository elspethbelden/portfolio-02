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

function ImagePlaceholder({ label = "image", aspect = "4/3", full = false, tint = "warm", darkMode = false }) {
  const tints = {
    warm: { bg: "#E8DFD2", stripe: "#DCCFB9", text: "#6B5E48" },
    cool: { bg: "#D9DDE2", stripe: "#C5CBD3", text: "#5A6370" },
    sage: { bg: "#D5DCCC", stripe: "#C3CCB4", text: "#5B6750" },
    accent: { bg: "#EBD6C6", stripe: "#E0C4AE", text: "#7A4A2B" },
    dark: { bg: "#2A2A2A", stripe: "#333333", text: "#9A9590" }
  };
  const c = tints[tint] || tints.warm;
  return (
    <div style={{
      width: "100%",
      height: full ? "100%" : "auto",
      aspectRatio: full ? "auto" : aspect,
      background: `repeating-linear-gradient(135deg, ${c.bg} 0 14px, ${c.stripe} 14px 28px)`,
      position: "relative",
      display: "flex", alignItems: "end", justifyContent: "space-between",
      padding: 18, overflow: "hidden"
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: c.text
      }}>[ {label} ]</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.14em", color: c.text
      }}>░░░</div>
    </div>);

}

function HeroTop() {
  const isMobile = useIsMobile();
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
          <span style={{ color: "#F4F1EC" }}>Case 02 · NatWest</span>
        </div>
      </div>

      <div style={{
        width: "100%", height: "100%",
        backgroundImage: isMobile ? "url('uploads/NatWest/mobile/Screen-comp2.jpg')" : "url('uploads/NatWest/Screen-comp2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "top" : "center",
        transform: `translateY(${y}px)`,
        opacity,
        willChange: "transform, opacity",
      }} />
    </section>
  );
}

function Opener() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "32px 20px 32px" : "40px 32px 40px" }}>
      {/* Meta grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr",
        gap: isMobile ? 20 : 32,
        paddingBottom: isMobile ? 32 : 60,
        borderBottom: "1px solid var(--line-faint)"
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 400
          }}>NatWest</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            Design Systems<br />
            Tokenisation<br />
            Governance
          </div>
        </div>
      </div>

      {/* Huge title */}
      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: isMobile ? 24 : 40 }}>
          <span className="bracket">CASE STUDY · 02 / 03</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,

          letterSpacing: "-0.035em",
          maxWidth: "18ch", fontWeight: "500"
        }}>
          Building a bank's design system from <span className="italic-accent" style={{ color: "var(--accent)", fontFamily: "\"Instrument Serif\"" }}>scratch</span>.
        </h1>
      </div>

      {/* Dek */}
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
          fontSize: "clamp(22px, 2.4vw, 32px)",
          lineHeight: 1.4,
          fontWeight: 300,
          color: "var(--ink)"
        }}>
          We rebuilt the foundations from the ground up, collapsing four siloed UI kits into one tokenised{" "}
          <span className="italic-accent" style={{ color: "var(--accent)" }}>source of truth</span>
          {" "}for hundreds of designers. Governance, documentation and a federated contribution model came along for the ride.
        </p>
        <div className="mono" style={{
          textAlign: isMobile ? "left" : "right", color: "var(--ink-soft)", alignSelf: isMobile ? "auto" : "end"
        }}>
          12 + 6 WK.
        </div>
      </div>
    </section>);

}

function HeroImage() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "24px 20px 60px" : "40px 32px 120px" }}>
      <div style={{ height: isMobile ? "60vh" : "80vh", minHeight: isMobile ? 420 : 560 }}>
        <ImagePlaceholder label="hero — AI companion UI, dashboard view" full tint="warm" />
      </div>
      <div className="mono" style={{
        color: "var(--ink-faint)",
        marginTop: 14,
        display: "flex", justifyContent: "space-between"
      }}>
        <span><span className="bracket">FIG. 01</span> Hero moment · primary surface</span>
        <span className="bracket">16:9 · 2560</span>
      </div>
    </section>);

}

function ContextSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64
      }}>
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
            Four siloed UI kits,{" "}
            <span className="italic-accent" style={{ color: "var(--accent)" }}>no shared language</span>.
          </h2>

          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, lineHeight: 1.6,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              NatWest Retail had four separate UI kits, one per channel, spread across Sketch, Frontify, Mural, Illustrator and PowerPoint. Mobile alone had over 115 variations of input fields. Naming was inconsistent, governance was informal, and updating anything meant updating it everywhere.
            </p>
            <img src="Audit.png" alt="Audit overview"
              style={isMobile
                ? { width: "100%", height: "auto", display: "block", margin: "2em 0" }
                : { width: "70vw", height: "auto", display: "block", position: "relative", left: "calc(-10vw - 96px)", margin: "2em 0" }} />
            <p style={{ marginBottom: "1.2em" }}>
              The bank wanted to move to Figma, and was simultaneously going through a major rebrand. The brief was twelve weeks for the audit and rebuild, six weeks for the brand refresh, with the same team carrying both.
            </p>
            <p>
              My job was to use the moment for more than a tool change. We collapsed four UI kits into one shared system, tokenised the foundations, and put governance in place that would survive the next rebrand without any of this happening again.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64, padding: isMobile ? 0 : "0 32px" }}>
        <video
          src="context-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "auto", display: "block" }} />
        <div className="mono" style={{
          color: "var(--ink-faint)",
          marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 02</span> Four siloed UI kits, no shared language. The rebrand was the moment to collapse them into one.</span>
          <span className="bracket">SKETCH · BEFORE</span>
        </div>
      </div>
    </section>);

}

function StatsBand() {
  const isMobile = useIsMobile();
  const stats = [
  { num: "4→11", unit: "", label: "systems consolidated" },
  { num: "1,162", unit: "comp.", label: "audited end-to-end" },
  { num: "21", unit: "libs", label: "foundation libraries" },
  { num: "400%", unit: "↑", label: "designer efficiency, yr 1" }];

  return (
    <section style={{
      padding: isMobile ? "48px 20px" : "80px 32px",
      background: "var(--bg-alt)", backgroundColor: "rgb(243, 242, 248)"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? 24 : 32
      }}>
        {stats.map((s, i) =>
        <div key={i} style={{
          borderTop: "1px solid var(--line-faint)",
          paddingTop: 20
        }}>
            <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 6vw, 88px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: 8
          }}>
              {s.num}
              <span className="italic-accent" style={{
              color: "var(--accent)",
              fontSize: "0.45em",
              marginLeft: 8,
              fontWeight: 400
            }}>{s.unit}</span>
            </div>
            <div className="mono" style={{ color: "var(--ink-soft)" }}>
              {s.label}
            </div>
          </div>
        )}
      </div>
    </section>);

}

function PrinciplesSection() {
  const isMobile = useIsMobile();
  const principles = [
  {
    num: "P.01",
    title: "One source of truth, not four",
    body: "We collapsed four channel-specific UI kits into a single tokenised foundation. Components were rebuilt from the ground up: responsive, scalable, shared across platforms rather than duplicated. Naming was unified to match code."
  },
  {
    num: "P.02",
    title: "Tokens close to code",
    body: "Working alongside engineering, we aligned colour, spacing and type tokens to the names already in production. Variables in Figma meant the rebrand could ship as a library swap. Hours of work, not months."
  },
  {
    num: "P.03",
    title: "Federated, never policed",
    body: "We moved away from the 'overlord' model and appointed advocates across each tenant team. Twice-weekly clinics, weekly releases, transparent change logs. The system became something designers contributed to, rather than something imposed on them."
  }];


  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        marginBottom: isMobile ? 40 : 80
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">02 — PRINCIPLES</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Three principles that shaped <span className="italic-accent" style={{ color: "var(--accent)" }}>the build</span>.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: isMobile ? 32 : 48
      }}>
        {principles.map((p) =>
        <div key={p.num} style={{
          borderTop: "1px solid var(--ink)",
          paddingTop: 24
        }}>
            <div className="mono" style={{
            color: "var(--accent)",
            marginBottom: 20
          }}>
              <span className="bracket">{p.num}</span>
            </div>
            <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: 16
          }}>{p.title}</h3>
            <p style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--ink-soft)"
          }}>{p.body}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: isMobile ? 40 : 80, display: "flex", justifyContent: "center" }}>
        <img src="tokens.jpg" alt="Token API mapping, Figma to API" style={{ width: isMobile ? "100%" : "70%", height: "auto", display: "block" }} />
      </div>
    </section>);

}

function GalleryAsymmetric() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        marginBottom: isMobile ? 32 : 60
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">03 — EXPLORATION</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          From audit to <span className="italic-accent" style={{ color: "var(--accent)" }}>foundation</span>.
        </h2>
      </div>

      {/* 1. Components audited + streamlined */}
      <figure style={{ marginBottom: isMobile ? 40 : 80, marginLeft: isMobile ? -20 : -32, marginRight: isMobile ? -20 : -32 }}>
        <img src="ds-components.webp" alt="Components audited and streamlined"
          style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)",
          marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 03</span> 1,162 components, audited end-to-end and streamlined into a single library.</span>
          <span className="bracket">AUDIT · COMPONENTS</span>
        </figcaption>
      </figure>

      {/* 2. Semantic tokens — diagram + body copy side by side */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.01 — TOKENS NEAR CODE</span>
          </div>
          We worked closely with engineering to align colour, spacing and text naming to code. Internal alignment between design and dev was still maturing, so getting the system as close as possible was the first step toward future synchronisation and efficiencies.
        </div>
        <figure>
          <img src="semantic-tokens.jpg" alt="Primitive → semantic token → UI mapping"
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 04</span> Primitive → semantic → UI. Token names mirror engineering's, so design and code stay in lockstep.</span>
            <span className="bracket">FIGMA VARIABLES</span>
          </figcaption>
        </figure>
      </div>

      {/* 3. Light + dark — body copy left, video right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start"
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.02 — LIGHT ↔ DARK</span>
          </div>
          Previously, the app team shipped both modes by hand. Slow, and prone to mismatched colour logic between design and code. With Figma colour variables hot off the press at the time, we set the system up to switch automatically.
        </div>
        <figure>
          <video src="uploads/NatWest/light to dark.mp4" autoPlay loop muted playsInline
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 05</span> Light and dark, fully automated through colour variables. No parallel files.</span>
            <span className="bracket">FIGMA · LIVE</span>
          </figcaption>
        </figure>
      </div>

      {/* 4. Responsive — body copy left, video right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginTop: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.03 — DESIGNS THAT BEHAVE LIKE A WEBSITE</span>
          </div>
          Components are built the way engineering builds them, with full consideration of how they reflow responsively, and the customisation and authoring available inside the CMS.
        </div>
        <figure>
          <video src="responsive.mp4" autoPlay loop muted playsInline
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 06</span> Components reflow responsively in Figma, matching the breakpoints engineering ships.</span>
            <span className="bracket">FIGMA · RESPONSIVE</span>
          </figcaption>
        </figure>
      </div>

      {/* 5. Documentation — body copy left, video right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginTop: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.04 — A SINGLE SOURCE OF TRUTH</span>
          </div>
          <p style={{ marginBottom: "1.2em" }}>
            Documentation already existed, but it was scattered across platforms and often stale. We needed a trustworthy, maintained source of truth, and since the core audience was designers, we built it inside Figma itself.
          </p>
          <p>
            With many designers new to Figma after the Sketch move, we layered on onboarding for the questions that came up most: light to dark, variables, governance and brand themes.
          </p>
        </div>
        <figure>
          <video src="documentation.mp4" autoPlay loop muted playsInline
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 07</span> Documentation embedded in the library itself. Accessible, maintained, where designers already live.</span>
            <span className="bracket">FIGMA · DOCS</span>
          </figcaption>
        </figure>
      </div>
    </section>);

}

function PullQuoteDark() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      background: "var(--bg-dark)",
      color: "#F4F1EC",
      padding: isMobile ? "64px 20px" : "160px 32px"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64
      }}>
        <div className="mono" style={{ color: "rgba(244,241,236,0.5)" }}>
          <span className="bracket">TESTIMONY</span>
        </div>

        <div>
          <div style={{
            fontFamily: "var(--font-italic)",
            fontSize: "clamp(36px, 5vw, 72px)",
            lineHeight: 1.15,
            fontWeight: 400,
            fontStyle: "italic",
            color: "#F4F1EC",
            maxWidth: "22ch",
            marginBottom: 40
          }}>
            <span style={{ color: "var(--accent)" }}>“</span>
            The system finally feels like ours — designers contribute back to it, onboard from it, and trust it. It bought us the time to actually <span style={{ color: "var(--accent)" }}>think</span>.
            <span style={{ color: "var(--accent)" }}>”</span>
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.6)" }}>
            <span className="bracket">NATWEST HCD LEADERSHIP · 2024</span>
          </div>
        </div>
      </div>
    </section>);

}

function ProcessSection() {
  const isMobile = useIsMobile();
  const phases = [
  { phase: "01", name: "Audit", weeks: "W.01—04", desc: "Mapped 1,162 components across 4 channels and 21 foundation libraries. Catalogued duplications, surfaced naming inconsistencies, identified the documentation worth carrying forward." },
  { phase: "02", name: "Foundation", weeks: "W.05—10", desc: "Built the new Figma library from the ground up. Tokens for colour, spacing and type aligned to engineering's naming. Light and dark mode automated via variables." },
  { phase: "03", name: "Migration", weeks: "W.11—12", desc: "Cut over from Sketch. Wrote onboarding for designers new to Figma, embedded usage docs into the library itself, started the weekly release cadence." },
  { phase: "04", name: "Rebrand", weeks: "W.13—18", desc: "Brand refresh shipped as a library swap and variable update, not a redo. Federated governance went live: tenant advocates, twice-weekly clinics, transparent change logs." }];

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        marginBottom: isMobile ? 40 : 80
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">04 — PROCESS</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Eighteen weeks, <span className="italic-accent" style={{ color: "var(--accent)" }}>four phases</span>.
        </h2>
      </div>

      <div>
        {phases.map((p, i) =>
        <div key={p.phase} style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "80px 200px 1fr 2fr",
          gap: isMobile ? 8 : 32,
          padding: "32px 0",
          borderBottom: "1px solid var(--line-faint)",
          borderTop: i === 0 ? "1px solid var(--ink)" : "none",
          alignItems: isMobile ? "start" : "baseline"
        }}>
            <div className="mono" style={{ color: "var(--accent)" }}>
              <span className="bracket">{p.phase}</span>
            </div>
            <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: "-0.02em"
          }}>
              {p.name}
            </div>
            <div className="mono" style={{ color: "var(--ink-soft)" }}>
              {p.weeks}
            </div>
            <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--ink-soft)",
            maxWidth: "52ch"
          }}>
              {p.desc}
            </div>
          </div>
        )}
      </div>

      <figure style={{ marginTop: isMobile ? 40 : 80 }}>
        <video src="rebrand-video.mp4" autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block" }} />
        <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14, display: "flex", justifyContent: "space-between" }}>
          <span><span className="bracket">FIG. 08</span> Tokenised foundations turned the rebrand into a library swap. Components updated in hours, not months.</span>
          <span className="bracket">REBRAND · LIVE</span>
        </figcaption>
      </figure>
    </section>);

}

function GovernanceSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        marginBottom: isMobile ? 40 : 80
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">05 — GOVERNANCE</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Shepherding the system, <span className="italic-accent" style={{ color: "var(--accent)" }}>not policing it</span>.
        </h2>
      </div>

      {/* Federated diagram */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">G.01 — FEDERATED, NOT GATED</span>
          </div>
          <p style={{ marginBottom: "1.2em" }}>
            Once the system was established, we moved off the central-overlord model (a guaranteed bottleneck) and welcomed contributions from designers across every channel.
          </p>
          <p>
            Two-way flow, not one-way decree.
          </p>
        </div>
        <figure>
          <img src="gov-overlord-federated.png" alt="From overlord to federated model"
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 09</span> Overlord → federated. Contribution flows both ways once the system has advocates inside every team.</span>
            <span className="bracket">MODEL · SHIFT</span>
          </figcaption>
        </figure>
      </div>

      {/* Champions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">G.02 — OWNERSHIP &amp; ADVOCACY</span>
          </div>
          We embedded advocates across the bank and the consultancy, channel by channel, building shared ownership where departmental teams had historically struggled to talk to each other.
        </div>
        <figure>
          <img src="gov-champions.png" alt="Design system champions across channels"
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 10</span> DS Champions: one advocate per channel, mapping each library to a name and a face.</span>
            <span className="bracket">CHAMPIONS</span>
          </figcaption>
        </figure>
      </div>

      {/* Clinics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">G.03 — SHEPHERDS, NOT POLICE</span>
          </div>
          <p style={{ marginBottom: "1.2em" }}>
            Twice-weekly drop-in clinics where we taught, advised and guided. Components landed via shared acceptance criteria, and designers stayed owners of their contribution all the way through review.
          </p>
          <p>
            Successful submissions were celebrated by name across email and Teams.
          </p>
        </div>
        <figure>
          <img src="gov-clinics.png" alt="Drop-in clinics, no stupid questions, build excitement"
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 11</span> Drop-in clinics, no stupid questions, self-help. The cultural scaffolding around the system.</span>
            <span className="bracket">CULTURE</span>
          </figcaption>
        </figure>
      </div>

      {/* Releases */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        alignItems: "start"
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">G.04 — CADENCE &amp; TRANSPARENCY</span>
          </div>
          A strict weekly release cadence: fewer interruptions, no surprises. Every change documented three ways: in the Figma file, in the Updates panel, and in the DS Teams channel.
        </div>
        <figure>
          <img src="gov-releases.jpg" alt="Release notes and Figma updates panel"
            style={{ width: "100%", height: "auto", display: "block", background: "var(--bg-alt)" }} />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)",
            marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 12</span> Weekly releases, documented three ways: release notes, Figma updates panel, Teams.</span>
            <span className="bracket">RELEASES · WEEKLY</span>
          </figcaption>
        </figure>
      </div>
    </section>);

}

function OutcomeSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">06 — OUTCOME</span>
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
            One year on, <span className="italic-accent" style={{ color: "var(--accent)" }}>400% faster</span>.
          </h2>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, lineHeight: 1.6,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              A year after launch, designers using the new system reported a 400% efficiency gain on production work, with the system itself doubling as onboarding material, brand reference, and the connective tissue between previously-siloed channel teams.
            </p>
            <p style={{ marginBottom: "1.2em" }}>
              The federated model held: contributions came from across the bank, governed by acceptance criteria rather than gatekeeping. Weekly releases, transparent change logs, no surprises.
            </p>
            <p>
              And the design system stopped being a chore. It became something the community actively maintained: a living product, not a museum piece.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64, display: "grid", gap: 24 }}>
        <img src="results-time.webp" alt="Results, time savings" style={{ width: isMobile ? "100%" : "70%", height: "auto", display: "block", margin: "0 auto" }} />
        <img src="results-numbers.webp" alt="Our journey in numbers" style={{ width: isMobile ? "100%" : "70%", height: "auto", display: "block", margin: "0 auto" }} />
        <img src="results-insights.webp" alt="Insights survey" style={{ width: isMobile ? "100%" : "70%", height: "auto", display: "block", margin: "0 auto" }} />
      </div>
    </section>);

}

function NextProject() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 20px 70px" : "120px 32px 140px",
      background: "#040C20",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.5)",
      ["--line-faint"]: "rgba(244,241,236,0.18)"
    }}>
      <div className="mono" style={{ color: "rgba(244,241,236,0.5)", marginBottom: isMobile ? 24 : 40 }}>
        <span className="bracket">NEXT CASE</span>
      </div>

      <a href="bupa.html" style={{ display: "block", color: "#F4F1EC" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 24 : 64,
          alignItems: "center"
        }}>
          <div style={{ height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined, overflow: "hidden" }}>
            <img src="assets/hero/Bupa-hero.jpg" alt="Bupa Global Connect"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <div className="mono" style={{ color: "rgba(244,241,236,0.75)", marginBottom: 20 }}>
              Bupa · 2022
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              marginBottom: 24,
              color: "#F4F1EC"
            }}>
              Global cover.{" "}<span className="italic-accent" style={{ color: "#82B9FF" }}>Local experience.</span>
            </h3>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid #F4F1EC", paddingBottom: 4,
              color: "#F4F1EC"
            }}>
              Read case study <span>→</span>
            </div>
          </div>
        </div>
      </a>
    </section>);

}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "48px 20px" : "80px 32px",
      borderTop: "1px solid rgba(244,241,236,0.18)",
      background: "#040C20",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
      gap: isMobile ? 24 : 32
    }}>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)" }}>
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}><span className="bracket">© 2026</span></div>
        Elspeth Belden
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)" }}>
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}><span className="bracket">EMAIL</span></div>
        <a href="mailto:elspethbelden@gmail.com" style={{ borderBottom: "1px solid currentColor", color: "rgba(244,241,236,0.75)" }}>
          elspethbelden@gmail.com
        </a>
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)" }}>
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}><span className="bracket">LINKEDIN</span></div>
        <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ borderBottom: "1px solid currentColor", color: "rgba(244,241,236,0.75)" }}>
          /in/elspethbelden ↗
        </a>
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <a href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ borderBottom: "1px solid currentColor", color: "rgba(244,241,236,0.75)" }}>
            Back to top ↑
          </a>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}><span className="bracket">BACK</span></div>
            <a href="index.html" style={{ borderBottom: "1px solid currentColor", color: "rgba(244,241,236,0.75)" }}>
              Home ↑
            </a>
          </>
        )}
      </div>
    </section>);

}

function CoverImage() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "24px 20px 48px" : "40px 32px 80px" }}>
      <div style={{
        width: "100%",

        minHeight: isMobile ? 260 : 500,
        backgroundImage: "url('Cover.jpg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center", height: isMobile ? "360px" : "800px"
      }} />
    </section>);

}

function App() {
  return (
    <>
      <div style={{
        background: "#160D24",
        color: "#F4F1EC",
        ["--ink"]: "#F4F1EC",
        ["--ink-soft"]: "rgba(244,241,236,0.75)",
        ["--ink-faint"]: "rgba(244,241,236,0.5)",
        ["--line-faint"]: "rgba(244,241,236,0.18)",
        ["--bg-alt"]: "#222222"
      }}>
        <HeroTop />
        <Opener />
        <CoverImage />
      </div>
      <ContextSection />
      <StatsBand />
      <PrinciplesSection />
      <GalleryAsymmetric />
      <ProcessSection />
      <GovernanceSection />
      <OutcomeSection />
      <NextProject />
      <Footer />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);