// Case study — Goldman Sachs AI Companion
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
          <a href="index.html" aria-label="Home" style={{ color: "rgba(244,241,236,0.7)", display: "inline-flex", verticalAlign: "-6px" }}>
            <BrandMark />
          </a>
          <span style={{ margin: "0 10px", color: "rgba(244,241,236,0.5)" }}>/</span>
          <span style={{ color: "#F4F1EC" }}>NatWest</span>
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
        gridTemplateColumns: isMobile ? "1fr" : "3fr 1fr",
        gap: isMobile ? 20 : 64
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 32, fontWeight: 200, lineHeight: 1.26
        }}>NatWest</div>
        {!isMobile && (
          <div>
            {["Design Systems", "Tokenisation", "Governance"].map(tag => (
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

      {/* Huge title */}
      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9.7vw, 140px)",
          lineHeight: 0.95,

          letterSpacing: "-0.035em",
          maxWidth: "18ch", fontWeight: 200
        }}>
          A design system built to <span style={{ color: "var(--accent)" }}>survive a rebrand</span>.
        </h1>
      </div>

      {/* Skills — stacks under the H1 on mobile only (desktop keeps it
          beside the client name above the title, per the meta grid). */}
      {isMobile && (
        <div style={{ marginBottom: 24 }}>
          {["Design Systems", "Tokenisation", "Governance"].map(tag => (
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

      {/* Dek */}
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
          We collapsed four siloed UI kits into one tokenised system for hundreds of designers, and built the governance, documentation and federated contribution model to run it.
        </p>
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
            Four siloed UI kits,{" "}
            no shared language.
          </h2>

          <div style={{
            fontFamily: "var(--font-body)",
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
              My job was to use the moment for more than a tool change. We collapsed four UI kits into one shared system, tokenised the foundations, and put governance in place so the next rebrand wouldn't mean starting over.
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
          style={{ width: isMobile ? "100%" : "80%", height: "auto", display: "block", margin: isMobile ? 0 : "0 auto" }} />
        <div className="mono" style={{
          color: "var(--ink-faint)",
          display: "flex", justifyContent: "space-between",
          width: isMobile ? "100%" : "80%",
          margin: isMobile ? "14px 0 0" : "14px auto 0"
        }}>
          <span><span className="bracket">FIG. 02</span> Four siloed UI kits, no shared language. The rebrand was the moment to collapse them into one.</span>
        </div>
      </div>
    </section>);

}

function StatsBand() {
  const isMobile = useIsMobile();
  const stats = [
  { num: "4→1", unit: "", label: "design systems consolidated" },
  { num: "1,162", unit: "comp.", label: "audited end-to-end" },
  { num: "21", unit: "libs", label: "libraries audited" },
  { num: "400%", unit: "↑", label: "efficiency gain, time per screen, yr 1" }];

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
            fontWeight: 200,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: 8
          }}>
              {s.num}
              <span style={{
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
    title: "One source of truth",
    body: "We collapsed four channel-specific UI kits into a single tokenised foundation. We rebuilt every component to be responsive and shared across platforms, and renamed them to match code."
  },
  {
    num: "P.02",
    title: "Tokens close to code",
    body: "Working alongside engineering, we aligned colour, spacing and type tokens to the names already in production. Variables in Figma meant the rebrand could ship as a library swap, in hours."
  },
  {
    num: "P.03",
    title: "Federated governance",
    body: "We dropped the 'overlord' model and appointed advocates in each tenant team. Designers contributed through twice-weekly clinics and weekly releases."
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
          02 — PRINCIPLES
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          Three principles that shaped the build.
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
            color: "var(--ink)",
            marginBottom: 20
          }}>
              <span className="bracket">{p.num}</span>
            </div>
            <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>{p.title}</h3>
            <p style={{
            fontFamily: "var(--font-body)",
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
          03 — EXPLORATION
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          From audit to foundation.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Token names that match code</h3>
          We worked closely with engineering to align colour, spacing and text naming to code. Design and dev weren't yet working in sync, so matching names was the first step.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Light and dark from one set of variables</h3>
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Components that reflow like the build</h3>
          Components are built the way engineering builds them. They reflow at the same breakpoints and offer the same options authors get in the CMS.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Documentation inside Figma</h3>
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
            <span><span className="bracket">FIG. 07</span> Documentation embedded in the library itself. Maintained, and where designers already work.</span>
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
          TESTIMONY
        </div>

        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 72px)",
            lineHeight: 1.15,
            fontWeight: 200,
            color: "#F4F1EC",
            maxWidth: "22ch",
            marginBottom: 40
          }}>
            “The system finally feels like ours — designers contribute back to it, onboard from it, and trust it. It bought us the time to actually think.”
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.6)" }}>
            NATWEST HCD LEADERSHIP · 2024
          </div>
        </div>
      </div>
    </section>);

}

function ProcessSection() {
  const isMobile = useIsMobile();
  const phases = [
  { phase: "01", name: "Audit", weeks: "W.01—04", desc: "Mapped 1,162 components across 4 retail banking channels and 21 foundation libraries. Catalogued duplications, surfaced naming inconsistencies, identified the documentation worth carrying forward." },
  { phase: "02", name: "Foundation", weeks: "W.05—10", desc: "Built the new Figma library from the ground up. Tokens for colour, spacing and type aligned to engineering's naming. Light and dark mode automated via variables." },
  { phase: "03", name: "Migration", weeks: "W.11—12", desc: "Cut over from Sketch. Wrote onboarding for designers new to Figma, embedded usage docs into the library itself, started the weekly release cadence." },
  { phase: "04", name: "Rebrand", weeks: "W.13—18", desc: "Brand refresh shipped as a library swap and variable update. Federated governance went live: tenant advocates, twice-weekly clinics, transparent change logs." }];

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 20 : 64,
        marginBottom: isMobile ? 40 : 80
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          04 — PROCESS
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          Eighteen weeks, four phases.
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
              {p.phase}
            </div>
            <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 200,
            letterSpacing: "-0.02em"
          }}>
              {p.name}
            </div>
            <div className="mono" style={{ color: "var(--ink-soft)" }}>
              <span className="bracket">{p.weeks}</span>
            </div>
            <div style={{
            fontFamily: "var(--font-body)",
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
          05 — GOVERNANCE
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 200,
          letterSpacing: "-0.03em"
        }}>
          Shepherding the system, not policing it.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Federated, not gated</h3>
          <p>
            Once the system was established, we moved off the central-overlord model (a guaranteed bottleneck) and welcomed contributions from designers across every channel.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Ownership and advocacy</h3>
          We embedded advocates across the bank and the consultancy, channel by channel, so teams that rarely spoke to each other owned the system together.
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Shepherds, not police</h3>
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
            <span><span className="bracket">FIG. 11</span> Drop-in clinics, no stupid questions, self-help.</span>
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
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-soft)"
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.15,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: "var(--accent)",
            marginBottom: 16
          }}>Cadence and transparency</h3>
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
          06 — OUTCOME
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
            One year on, 400% faster.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 20, lineHeight: 1.6,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              A year after launch, time per screen showed a 400% efficiency gain on production work. The system also served as onboarding material and brand reference, and was the one thing every channel team shared.
            </p>
            <p style={{ marginBottom: "1.2em" }}>
              The federated model held. Contributions came from across the bank and landed through shared acceptance criteria.
            </p>
            <p>
              And the design system stopped being a chore. The community maintained it.
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
  const [cardHover, setCardHover] = useState(false);
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

      <a href="bupa.html" style={{ display: "block", color: "#F4F1EC" }} onMouseEnter={() => setCardHover(true)} onMouseLeave={() => setCardHover(false)}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 24 : 64,
          alignItems: "center"
        }}>
          <div style={{ order: isMobile ? 0 : 1 }}>
            <div className="mono" style={{ color: "rgba(244,241,236,0.75)", marginBottom: 20 }}>
              Bupa · 2022
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 200,
              letterSpacing: "-0.035em",
              marginBottom: 24,
              color: "#F4F1EC"
            }}>
              Global cover.{" "}Local experience.
            </h3>
            <RollingLink as="span" hover={cardHover} className="mono" style={{ paddingBottom: 4, color: "#F4F1EC" }}>Read case study</RollingLink>
          </div>
          <div style={{ order: isMobile ? 0 : 2, height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined, overflow: "hidden" }}>
            <img src="assets/hero/Bupa-hero.jpg" alt="Bupa Global Connect"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}>© 2026</div>
        Elspeth Belden
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)" }}>
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}>EMAIL</div>
        <RollingLink href="mailto:elspethbelden@gmail.com" style={{ color: "rgba(244,241,236,0.75)" }}>elspethbelden@gmail.com</RollingLink>
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)" }}>
        <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}>LINKEDIN</div>
        <RollingLink href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ color: "rgba(244,241,236,0.75)" }}>/in/elspethbelden ↗</RollingLink>
      </div>
      <div className="mono" style={{ color: "rgba(244,241,236,0.75)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <RollingLink href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ color: "rgba(244,241,236,0.75)" }}>Back to top ↑</RollingLink>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.5)" }}>BACK</div>
            <RollingLink href="index.html" style={{ color: "rgba(244,241,236,0.75)" }}>Home ↑</RollingLink>
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