// Case study — Costa Express
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

// Drop-in replacement: <ImagePlaceholder> now renders an <image-slot>
// (user can drag-drop an image directly onto it; persists by id).
function ImagePlaceholder({ id, label = "image", aspect = "4/3", full = false, tint = "warm", src }) {
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
      overflow: "hidden",
      borderRadius: full ? 0 : 12
    }}>
      <image-slot
        id={slotId}
        placeholder={label}
        fit={full ? "cover" : (natAspect ? "fill" : "contain")}
        shape={full ? "rect" : undefined}
        src={src || undefined}
        style={{ width: "100%", height: "100%", display: "block", background: "var(--bg-alt)" }}
      ></image-slot>
    </div>
  );
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
        color: "#FFFFFF"
      }}>
        <div className="mono">
          <a href="index.html" style={{ color: "#FFFFFF" }}>Home</a>
          <span style={{ margin: "0 10px", color: "#FFFFFF" }}>/</span>
          <span style={{ color: "#FFFFFF" }}>Costa Express</span>
        </div>
      </div>

      <div style={{ width: "100%", height: "100%", transform: `translateY(${y}px)`, opacity, willChange: "transform, opacity" }}>
        <ImagePlaceholder label="hero — Costa Express machine in-situ" full tint="coffee" src={isMobile ? "uploads/Costa/mobile/Costa-Hero.jpg" : "uploads/Costa/Costa-Hero.jpg"} />
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
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 400
          }}>Costa Express</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            Brand Refresh<br />
            UI Design<br />
            Concept
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: isMobile ? 24 : 40 }}>
          <span className="bracket">CASE STUDY · COSTA EXPRESS</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          maxWidth: "20ch", fontWeight: 500
        }}>
          A facelift for the nation's most-loved <span className="italic-accent" style={{ color: "#B51244" }}>self-serve coffee</span>.
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
          fontSize: "clamp(22px, 2.4vw, 32px)",
          lineHeight: 1.4,
          fontWeight: 300,
          color: "var(--ink)"
        }}>
          Facelift for the popular Costa Express self-serve machines, designed to flex across{" "}
          <span className="italic-accent" style={{ color: "rgb(238, 221, 208)" }}>two screen formats</span>
          {" "}— the new flagship hardware and the compact unit in petrol stations across the country.
        </p>
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
            Functional, but{" "}
            <span className="italic-accent" style={{ color: "var(--accent)" }}>dated</span>.
          </h2>

          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17, lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              The Costa Express interface was functional but dated. With the new Costa brand launch, it was time to give these machines a much-needed update — one that reflected the parent brand's new visual language and felt at home next to the staffed stores on the high street.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64, padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder label="brand context — old vs new" aspect="16/9" tint="crema" src="uploads/Costa/Old-costa-visuals.png" />
        <div className="mono" style={{
          color: "var(--ink-faint)",
          marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 01</span> Brand context — before / after.</span>
          <span className="bracket">REBRAND</span>
        </div>
      </div>
    </section>);
}

function PhotographySection() {
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
          <span className="bracket">02 — PHOTOGRAPHY &amp; SCREENS</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Rich new imagery, built to <span className="italic-accent" style={{ color: "var(--accent)" }}>flex</span>.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 24 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 60
      }}>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 16, lineHeight: 1.7,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">P.01 — A FLEXIBLE LIBRARY</span>
          </div>
          Starting with rich new product photography, flexible enough to cater to both existing flavours and new seasonal additions — a library that could scale with the menu rather than getting reshot every quarter.
        </div>
        <figure>
          <ImagePlaceholder label="coffee flavours — photography spread" aspect="16/9" tint="coffee" src="uploads/Costa/coffee-flavours.jpg" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 02</span> Coffee flavours — photography library.</span>
            <span className="bracket">PHOTOGRAPHY</span>
          </figcaption>
        </figure>
      </div>

      {/* Compact format */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 24 : 64,
        alignItems: "start",
        marginTop: isMobile ? 40 : 60,
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 16, lineHeight: 1.7,
          color: "var(--ink-soft)"
        }}>
          The design aesthetic needed to flex between the newer, most advanced model of machine and the more compact model with a completely different screen orientation. One visual language, two very different canvases.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, background: "var(--bg-alt)", padding: isMobile ? 20 : 32, borderRadius: 16 }}>
          <figure>
            <ImagePlaceholder label="compact screens — two formats" aspect="16/7" tint="crema" src="uploads/Costa/Compact-screens-together-01.png" />
            <figcaption className="mono" style={{
              color: "var(--ink-faint)", marginTop: 14,
              display: "flex", justifyContent: "space-between"
            }}>
              <span><span className="bracket">FIG. 05</span> Compact format screens.</span>
              <span className="bracket">COMPACT FORMAT</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div style={{
        margin: isMobile ? "40px -20px -80px" : "80px -32px -160px",
        background: "#32001E",
        padding: isMobile ? "24px 20px" : "40px 32px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 32 : 2,
          alignItems: "start"
        }}>
          <figure style={{ padding: isMobile ? 0 : "0 8% 0 18%" }}>
            <ImagePlaceholder label="syrup selection screen" aspect="16/6" tint="crema" />
            <figcaption className="mono" style={{
              color: "rgba(244,241,236,0.5)", marginTop: 14,
              display: "flex", justifyContent: "space-between"
            }}>
              <span><span className="bracket">FIG. 03</span> Syrup selection.</span>
              <span className="bracket">UI</span>
            </figcaption>
          </figure>
          <figure style={{ padding: isMobile ? 0 : "0 18% 0 8%" }}>
            <ImagePlaceholder label="sugar selection screen" aspect="16/6" tint="crema" />
            <figcaption className="mono" style={{
              color: "rgba(244,241,236,0.5)", marginTop: 14,
              display: "flex", justifyContent: "space-between"
            }}>
              <span><span className="bracket">FIG. 04</span> Sugar selection.</span>
              <span className="bracket">UI</span>
            </figcaption>
          </figure>
          <figure style={{ gridColumn: isMobile ? "auto" : "1 / -1", padding: isMobile ? 0 : "0 9%", marginTop: isMobile ? 8 : 48 }}>
            <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: 0 }}>
              <image-slot
                id="slot-compact-screen-designs-side-by-side"
                placeholder="compact screen designs side by side"
                fit="contain"
                shape="rect"
                src="uploads/Costa/3-screens-together.png"
                style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
              ></image-slot>
            </div>
            <figcaption className="mono" style={{
              color: "rgba(244,241,236,0.5)", marginTop: 14,
              display: "flex", justifyContent: "space-between"
            }}>
              <span><span className="bracket">FIG. 06</span> Compact screen designs, side by side.</span>
              <span className="bracket">COMPACT FORMAT</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>);
}

function PullQuoteDark() {
  return <div style={{ borderTop: "1px solid var(--line-faint)" }} />;
}

function AppIntegrationSection() {
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
          <span className="bracket">03 — APP INTEGRATION</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em"
        }}>
          Machine + app, <span className="italic-accent" style={{ color: "var(--accent)" }}>one journey</span>.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
        gap: isMobile ? 24 : 64,
        alignItems: "start",
        marginBottom: isMobile ? 40 : 80
      }}>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 16, lineHeight: 1.7,
          color: "var(--ink-soft)"
        }}>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
            <span className="bracket">C.01 — FROM HABIT TO INTERFACE</span>
          </div>
          Fast-turnaround, high-concept design exploring how the mobile app and the machine could become a more joined-up user experience — and how the coffee-ordering moment could fit seamlessly into the morning commute rather than interrupting it.
        </div>
        <figure>
          <ImagePlaceholder label="car dashboard, in-situ" aspect="16/9" tint="dark" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 07</span> Order ahead from the car dashboard — concept.</span>
            <span className="bracket">IN-SITU</span>
          </figcaption>
        </figure>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 24,
        marginBottom: isMobile ? 40 : 60,
        alignItems: "stretch"
      }}>
        <figure>
          <ImagePlaceholder label="early scamps / concept sketches" aspect="4/3" tint="crema" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 08</span> Early scamps.</span>
            <span className="bracket">SKETCH</span>
          </figcaption>
        </figure>
        <figure style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, aspectRatio: isMobile ? "4/3" : undefined, borderRadius: 12, overflow: "hidden" }}>
            <image-slot
              id="slot-morning-commuter-cups-lifestyle"
              placeholder="morning commuter cups, lifestyle"
              fit="cover"
              src="uploads/Costa/Compact-screens-together-01.png"
              style={{ width: "100%", height: "100%", display: "block", background: "var(--bg-alt)" }}
            ></image-slot>
          </div>
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 09</span> Morning commuter cups.</span>
            <span className="bracket">LIFESTYLE</span>
          </figcaption>
        </figure>
      </div>

      <figure style={{ padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder label="payment screen — in-situ" aspect="16/9" tint="coffee" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 10</span> Payment moment, in-situ on the machine.</span>
          <span className="bracket">PAYMENT</span>
        </figcaption>
      </figure>
    </section>);
}

function NextProject() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 20px 70px" : "120px 32px 140px",
      background: "#0B1F30",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
    }}>
      <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: isMobile ? 24 : 40 }}>
        <span className="bracket">NEXT</span>
      </div>

      <a href="nord-anglia.html" style={{ display: "block" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 24 : 64,
          alignItems: "center"
        }}>
          <div style={{ height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined, overflow: "hidden", borderRadius: 12 }}>
            <ImagePlaceholder label="Nord Anglia — school pages mockup" full src="assets/thumbnails/Nord Thumbnail.webp" />
          </div>
          <div>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
              Nord Anglia
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              marginBottom: 24
            }}>
              One system. 76 schools. <span className="italic-accent" style={{ color: "#A7D5E8" }}>Counting.</span>
            </h3>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid var(--ink)", paddingBottom: 4
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
      borderTop: "1px solid rgba(244,241,236,0.15)",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
      gap: isMobile ? 24 : 32,
      background: "#0B1F30",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
    }}>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">© 2026</span></div>
        Elspeth Belden
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">EMAIL</span></div>
        <a href="mailto:elspethbelden@gmail.com" style={{ borderBottom: "1px solid currentColor" }}>
          elspethbelden@gmail.com
        </a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">LINKEDIN</span></div>
        <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ borderBottom: "1px solid currentColor" }}>
          /in/elspethbelden ↗
        </a>
      </div>
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <a href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ borderBottom: "1px solid currentColor" }}>
            Back to top ↑
          </a>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">BACK</span></div>
            <a href="index.html" style={{ borderBottom: "1px solid currentColor" }}>
              Home ↑
            </a>
          </>
        )}
      </div>
    </section>);
}

function App() {
  return (
    <>
      <div style={{
        background: "#32001E",
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
      <PhotographySection />
      <PullQuoteDark />
      <AppIntegrationSection />
      <NextProject />
      <Footer />
    </>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);