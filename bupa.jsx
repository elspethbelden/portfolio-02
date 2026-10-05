// Case study — Bupa Global Connect
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

function VideoSlot({ src, type = "video/mp4", aspect }) {
  return (
    <div style={{ width: "100%", aspectRatio: aspect || "auto", overflow: "hidden", background: "#000" }}>
      <video autoPlay loop muted playsInline style={{ width: "100%", height: aspect ? "100%" : "auto", objectFit: aspect ? "cover" : "initial", display: "block" }}>
        <source src={src} type={type} />
      </video>
    </div>
  );
}

function ImagePlaceholder({ id, label = "image", aspect = "4/3", full = false, src, objectPosition = "center" }) {
  const slotId = id || ("bupa-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
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
    const intId = setInterval(probe, 400);
    probe();
    return () => { stopped = true; clearInterval(intId); };
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
        style={{ width: "100%", height: "100%", display: "block", background: "var(--bg-alt)", objectPosition }}
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
        position: "absolute", top: 28, left: 32, right: 32,
        zIndex: 10, color: "#F4F1EC", mixBlendMode: "difference"
      }}>
        <div className="mono">
          <a href="index.html" style={{ color: "rgba(244,241,236,0.7)" }}>Home</a>
          <span style={{ margin: "0 10px", color: "rgba(244,241,236,0.5)" }}>/</span>
          <span style={{ color: "#F4F1EC" }}>Bupa Global Connect</span>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%", transform: `translateY(${y}px)`, opacity, willChange: "transform, opacity" }}>
        <ImagePlaceholder id="bupa-cover" label="Bupa Global Connect — hero product mockup" full src={isMobile ? "uploads/Bupa/mobile/Bupa-Hero.png" : "uploads/Bupa/Bupa-Hero.png"} objectPosition={isMobile ? "top" : "center"} />
      </div>
    </section>
  );
}

function Opener() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "32px 20px 32px" : "40px 32px 40px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr", gap: isMobile ? 20 : 32,
        paddingBottom: isMobile ? 32 : 60, borderBottom: "1px solid var(--line-faint)"
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400 }}>Bupa</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            Experience Strategy<br />
            Service Design<br />
            UX Design<br />
            Research
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95, letterSpacing: "-0.035em",
          maxWidth: "20ch", fontWeight: 500
        }}>
          Global cover.{" "}
          <span style={{ fontStyle: "italic" }}>Local experience.</span>
        </h1>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr 1fr", gap: isMobile ? 20 : 40,
        paddingTop: isMobile ? 24 : 40, paddingBottom: isMobile ? 24 : 40
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          INTRO
        </div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(16px, 1.8vw, 20px)",
          lineHeight: 1.4, fontWeight: 300, color: "var(--ink)"
        }}>
          Bupa's international health offering spanned several markets and apps, and customers couldn't find their way around it. I led the experience design for Bupa Global Connect, a single journey built into the existing local apps. Customers reach their global cover from the app they already use.
        </p>
      </div>
    </section>
  );
}

function ChallengeSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          01 — THE CHALLENGE
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1, fontWeight: 300,
            letterSpacing: "-0.025em", marginBottom: 40
          }}>
            Fragmented systems,{" "}
            frustrated customers.
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 32 : 64 }}>
        {!isMobile && <div />}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 64 }}>
          <div>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 24 }}>
              CUSTOMERS
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)" }}>
              <p style={{ marginBottom: "0.4em" }}>Couldn't understand what their policy covered.</p>
              <p style={{ marginBottom: "0.4em" }}>Struggled to find and access care when abroad.</p>
              <p>Had no clear way to track claims with confidence.</p>
            </div>
          </div>
          <div>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 24 }}>
              THE BUSINESS
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)" }}>
              <p style={{ marginBottom: "0.4em" }}>Needed to drive growth through global and modular products.</p>
              <p style={{ marginBottom: "0.4em" }}>Wanted to improve retention and build trust across markets.</p>
              <p>Had high cost-to-serve from manual support and fragmented processes.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <figure style={{ padding: isMobile ? 0 : "0 30%" }}>
          <ImagePlaceholder id="bupa-before-state" label="Before-state — fragmented apps, channels, and manual touchpoints" aspect="3/4" src="uploads/bupa/Screenshot 2026-05-30 at 19.38.17.png" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14
          }}>
            <span><span className="bracket">FIG. 02</span> Before-state — fragmented apps, channels, and touchpoints.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function OpportunitySection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          02 — THE OPPORTUNITY
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1, fontWeight: 300,
            letterSpacing: "-0.025em", marginBottom: 40
          }}>
            Use the apps{" "}
            customers already trust.
          </h2>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              We proposed embedding a consistent global experience in the local apps customers already used and trusted.
            </p>
            <p style={{ marginBottom: "1.2em" }}>
              This approach meant a faster rollout with less technical disruption, and customers kept the app they knew. It also meant each new market could reuse the same global layer and keep its own app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


function ApproachSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "48px 20px" : "80px 32px",
      background: "#040C20",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
      ["--bg-alt"]: "#0D1E3A",
      ["--accent"]: "rgb(130, 185, 255)"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          03 — APPROACH
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1, fontWeight: 300,
            letterSpacing: "-0.025em", marginBottom: 40
          }}>
            Local-first,{" "}
            globally consistent.
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginBottom: isMobile ? 24 : 40 }}>
        <div>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 8 }}>
            STEP 01
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>Understand real needs</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "55ch" }}>
          <p>
            We conducted customer interviews and prototype testing across UK and Hong Kong. The pattern was consistent: policy complexity, unclear coverage, slow claims processes, and fragmented digital experiences. Customers didn't need a new product. They needed clarity on the one they already had.
          </p>
        </div>
      </div>

      <figure style={{ marginBottom: isMobile ? 40 : 60, padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder id="bupa-journey-map" label="Customer journey map — pain points and enhancements across 7 stages" aspect="16/7" src="uploads/bupa/Screenshot 2026-05-30 at 19.33.54.png" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14
        }}>
          <span><span className="bracket">FIG. 01</span> Customer journey map — pain points and enhancements validated with customers.</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginBottom: isMobile ? 24 : 40 }}>
        <div>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 8 }}>
            STEP 02
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>Define experience principles</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "55ch" }}>
          <p>We defined four principles to guide all design decisions across markets.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 40 : 60 }}>
        {[
          { n: "01", title: "Modular & Composable UI", body: "Build reusable UI components (cards, forms, navigation) that snap together across products. The experience stays consistent and each market can still customise its layouts." },
          { n: "02", title: "Seamless Cross-Region Identity", body: "A member's login and profile should work fluidly across geographies, with no friction from switching regions or re-authenticating." },
          { n: "03", title: "Contextual & Localised Experience", body: "Adapt language, currency, provider directories and content to each user's location automatically. The interface should feel native wherever they are." },
          { n: "04", title: "Holistic User Profile", body: "Show the member's claims, coverage and interactions in one view, so they never have to repeat themselves or hunt across disconnected screens." },
        ].map(({ n, title, body }) => (
          <div key={n} style={{
            padding: 32,
            background: "var(--bg-alt)",
            borderTop: "2px solid var(--accent)"
          }}>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 20 }}>{n}</div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: 12
            }}>{title}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)" }}>{body}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64 }}>
        <div>
          <div className="mono" style={{ color: "var(--accent)", marginBottom: 8 }}>
            STEP 03
          </div>
          <div className="mono" style={{ color: "var(--ink-soft)" }}>Prototype and validate</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "55ch" }}>
          <p>
            We tested interactive prototypes with five customers, three in the UK and two in Hong Kong. Each took part in a 60-minute one-to-one session run by our user researchers, using the version built for their market.
          </p>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          04 — THE SOLUTION
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1, fontWeight: 300,
            letterSpacing: "-0.025em", marginBottom: 40
          }}>
            A connected layer in the{" "}
            app they already use.
          </h2>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              We designed Bupa Global Connect as a layer inside the existing local apps, MyBupa UK and Blua HK. Customers reached their global cover through an app they already knew, which showed local providers, language and currency for wherever they were.
            </p>
            <div style={{ margin: "2em 0 0", fontFamily: "var(--font-body)" }}>
              {/* Top — Global app */}
              <div style={{ background: "#1A9FD4", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <circle cx="18" cy="18" r="17" stroke="white" strokeWidth="2"/>
                  <ellipse cx="18" cy="18" rx="7" ry="17" stroke="white" strokeWidth="2"/>
                  <line x1="1" y1="18" x2="35" y2="18" stroke="white" strokeWidth="2"/>
                  <path d="M4 11h28M4 25h28" stroke="white" strokeWidth="2"/>
                </svg>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 2 }}>Bupa Global Member's World</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Global digital app experience</div>
                </div>
              </div>

              {/* Arrows */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "6px 0", color: "#1B2249", fontSize: 24, lineHeight: 1 }}>
                <span>↓</span><span>↑</span>
              </div>

              {/* Middle — Infrastructure */}
              <div style={{ background: "#1B2249", borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 2 }}>Bupa Global Infrastructure</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Shared platform micro-services — data layer</div>
              </div>

              {/* Arrows */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "6px 0", color: "#1B2249", fontSize: 24, lineHeight: 1 }}>
                <span>↓</span><span>↑</span>
              </div>

              {/* Bottom — Local apps */}
              <div style={{ background: "#F0F2F8", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #dde0ed" }}>
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M18 3C12.477 3 8 7.477 8 13c0 8 10 20 10 20s10-12 10-20c0-5.523-4.477-10-10-10z" stroke="#1B2249" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="13" r="3.5" stroke="#1B2249" strokeWidth="2"/>
                </svg>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#1B2249", marginBottom: 2 }}>Local Bupa Market Apps</div>
                  <div style={{ fontSize: 13, color: "#4A5070" }}>Bupa market apps with local integrations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: isMobile ? 40 : 64 }}>
        <ImagePlaceholder id="bupa-proposed-ia" label="Proposed IA — information architecture" aspect="16/9" src="uploads/bupa/PROPOSED IA.png" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14
        }}>
          <span><span className="bracket">FIG. 03</span> Proposed information architecture.</span>
        </figcaption>
      </figure>

      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(36px, 4.2vw, 56px)",
        lineHeight: 1.1,
        fontWeight: 300,
        letterSpacing: "-0.025em",
        color: "var(--ink)",
        marginBottom: isMobile ? 24 : 32
      }}>Customer-driven insights</h2>

      {/* Key innovations */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 40 : 64 }}>
        {[
          { label: "CARE DISCOVERY", body: "Find doctors by location, language, and coverage. Guided pathways into trusted local networks, wherever the customer is in the world." },
          { label: "CLAIMS", body: "Real-time claim status, clear coverage feedback, and digital submission by OCR or upload, so customers don't have to phone to find out where a claim is." },
          { label: "TRAVEL SUPPORT", body: "A location-aware travel hub with emergency info, local providers, and pre-travel nudges, shown only when the customer needs them." },
        ].map(item => (
          <div key={item.label} style={{
            padding: 32,
            background: "var(--bg-alt)",
            borderTop: "2px solid var(--accent)"
          }}>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 20 }}>
              {item.label}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)" }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* Findings from prototype testing */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 40 : 64 }}>
        {[
          { label: "Allowances first", body: "Customers rated allowances and personalised recommendations highly. We prioritised allowances and added tailored recommendations to a new Health Dashboard." },
          { label: "Plain labels for preauthorisation", body: "Some customers couldn't tell pre-approved clinics from those needing upfront payment. We rewrote the preauthorisation labels to remove the jargon." },
          { label: "Visible waiting times", body: "Customers wanted to know how long things would take. We added a time estimate to claims progress and an expected wait for e-pharmacy." },
        ].map(item => (
          <div key={item.label} style={{
            padding: 32,
            background: "var(--bg-alt)",
            borderTop: "2px solid var(--accent)"
          }}>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 20 }}>
              {item.label}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)" }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: isMobile ? 32 : 40, marginBottom: isMobile ? 24 : 40 }}>
        <figure style={{ width: isMobile ? "100%" : "80%", margin: isMobile ? 0 : "0 auto" }}>
          <ImagePlaceholder id="bupa-travel-hub" label="Travel hub — screens" aspect="4/3" src="uploads/bupa/Travel hub.png" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 04</span> Travel hub.
          </figcaption>
        </figure>
        <figure style={{ width: isMobile ? "100%" : "80%", margin: isMobile ? 0 : "0 auto" }}>
          <ImagePlaceholder id="bupa-find-care" label="Find care and claims — screens" aspect="4/3" src="uploads/bupa/Find care and claims.png" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 05</span> Find care and claims.
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginBottom: isMobile ? 24 : 32 }}>
        {!isMobile && <div />}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4.2vw, 56px)",
          lineHeight: 1.1,
          fontWeight: 300,
          letterSpacing: "-0.025em",
          color: "var(--ink)"
        }}>Designed inside each market's app.</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginTop: isMobile ? 24 : 40 }}>
        {!isMobile && <div />}
        <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", maxWidth: "55ch" }}>
          <p style={{ marginBottom: "1.2em" }}>
            Dan upgrades to global cover in his existing app. When he travels, the app surfaces localised care information for his destination. He finds a doctor based on his coverage and preferred language, and tracks the claim from the same place he booked the appointment.
          </p>
        </div>
      </div>

      <figure style={{ marginTop: isMobile ? 24 : 40 }}>
        {isMobile ? (
          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ overflow: "hidden", width: "100%" }}>
              <div style={{ width: "200%" }}>
                <VideoSlot src="uploads/bupa/Journey overview.mp4" />
              </div>
            </div>
            <div style={{ overflow: "hidden", width: "100%" }}>
              <div style={{ width: "200%", marginLeft: "-100%" }}>
                <VideoSlot src="uploads/bupa/Journey overview.mp4" />
              </div>
            </div>
          </div>
        ) : (
          <VideoSlot src="uploads/bupa/Journey overview.mp4" />
        )}
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14
        }}>
          <span><span className="bracket">FIG. 06</span> High Level Journey.</span>
        </figcaption>
      </figure>

      <figure style={{ marginTop: 24 }}>
        <ImagePlaceholder id="bupa-full-journey" label="Full journey — end-to-end annotated screens" src="uploads/bupa/Full journey.png" />
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginTop: isMobile ? 24 : 40 }}>
        {!isMobile && <div />}
        <div style={{ maxWidth: "55ch" }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 2.8vw, 32px)",
            lineHeight: 1.2,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 16
          }}>Built into each app as it already was</h3>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)" }}>
            <p style={{ marginBottom: "1.2em" }}>
              A key part of the brief was to fit the existing apps. MyBupa UK and Blua HK have different design languages and UX patterns, so we designed the same journey twice, once in each. We designed nothing from scratch. Every screen reuses the structure, components and navigation of the app it sits in.
            </p>
            <p>
              We produced two full customer journeys, one per region, in three weeks. The screens were conceptual, built for user testing rather than handoff. Because they stayed close to production, the work could move into build with minimal rework if testing validated the direction.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 24, marginTop: isMobile ? 24 : 40 }}>
        <figure>
          <ImagePlaceholder id="bupa-uk-journey" label="UK journey — screens" aspect="4/3" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 07</span> UK journey.
          </figcaption>
        </figure>
        <figure>
          <ImagePlaceholder id="bupa-hk-journey" label="HK journey — screens" aspect="4/3" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 08</span> HK journey.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ImpactSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          05 — IMPACT
        </div>
        <div style={{ maxWidth: "60ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4.2vw, 56px)",
            lineHeight: 1.1, fontWeight: 300,
            letterSpacing: "-0.025em", marginBottom: 40
          }}>
            The output unlocked{" "}
            £20m+
            {" "}of follow-on work.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            The design phase closed with a validated direction. Two tested journeys in three weeks were enough for Bupa to fund the next phase.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 24 : 32 }}>
        {!isMobile && <div />}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 2.8vw, 32px)",
          lineHeight: 1.2,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "var(--ink)"
        }}>What the next phase sets out to prove</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 32 : 64, marginBottom: isMobile ? 40 : 80 }}>
        {!isMobile && <div />}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 64 }}>
          <div>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 24 }}>
              FOR CUSTOMERS
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)" }}>
              <p style={{ marginBottom: "0.8em" }}>Customers are more confident about what their policy covers.</p>
              <p style={{ marginBottom: "0.8em" }}>Fewer customers need manual support.</p>
              <p>The experience is easier to use across markets and languages.</p>
            </div>
          </div>
          <div>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 24 }}>
              FOR BUSINESS
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)" }}>
              <p style={{ marginBottom: "0.8em" }}>Supports global product growth with a scalable, modular foundation.</p>
              <p style={{ marginBottom: "0.8em" }}>Enables automation and a lower cost-to-serve.</p>
              <p>Sets the pattern for future market expansion.</p>
            </div>
          </div>
        </div>
      </div>

      <figure style={{ marginTop: 0, padding: isMobile ? 0 : "0 10%" }}>
        <ImagePlaceholder id="bupa-year-in-review" label="Year in review" aspect="16/9" src="uploads/bupa/year in review.png" />
      </figure>
    </section>
  );
}

function NextProject() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 20px 70px" : "120px 32px 140px",
      background: "#32001E",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
    }}>
      <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: isMobile ? 24 : 40 }}>
        NEXT
      </div>

      <a href="costa.html" style={{ display: "block" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}>
          <div style={{ order: isMobile ? 0 : 1 }}>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
              Costa Express
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95, fontWeight: 300,
              letterSpacing: "-0.035em", marginBottom: 24
            }}>
              A facelift for the nation's most-loved{" "}
              self-serve coffee.
            </h3>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid var(--ink)", paddingBottom: 4
            }}>
              Read case study <span>→</span>
            </div>
          </div>
          <div style={{ order: isMobile ? 0 : 2, height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined, overflow: "hidden", borderRadius: 12 }}>
            <ImagePlaceholder id="bupa-next-thumb" label="Costa Express — machine in-situ" full src="assets/thumbnails/Costa-thumb.png" />
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
      borderTop: "1px solid rgba(244,241,236,0.15)",
      display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isMobile ? 24 : 32,
      background: "#32001E",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
    }}>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>© 2026</div>
        Elspeth Belden
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
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: isMobile ? "left" : "right" }}>
        {isMobile ? (
          <a href="#" onClick={(e) => { e.preventDefault(); if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ borderBottom: "1px solid currentColor" }}>
            Back to top ↑
          </a>
        ) : (
          <>
            <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}>BACK</div>
            <a href="index.html" style={{ borderBottom: "1px solid currentColor" }}>
              Home ↑
            </a>
          </>
        )}
      </div>
    </section>
  );
}

function PasswordGate({ children }) {
  const KEY = "bupa-auth-v2";
  const PASS = "lettherightonein";
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(KEY) === "1");
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (value.trim().toLowerCase() === PASS) {
      sessionStorage.setItem(KEY, "1");
      setUnlocked(true);
    } else {
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 500);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#040C20",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-body)",
    }}>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-8px); }
          40%,80%  { transform: translateX(8px); }
        }
        .gate-shake { animation: shake 0.45s ease; }
      `}</style>

      <div style={{ textAlign: "center", padding: "0 32px" }}>
        <div className="mono" style={{ color: "rgba(244,241,236,0.4)", marginBottom: 32, letterSpacing: "0.14em" }}>
          BUPA GLOBAL CONNECT
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 400,
          color: "#F4F1EC",
          marginBottom: 48,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}>
          This case study is<br />
          password protected.
        </h1>

        <form
          className={shake ? "gate-shake" : ""}
          onSubmit={e => { e.preventDefault(); attempt(); }}
          style={{ display: "inline-flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 360 }}
        >
          <input
            type="password"
            placeholder="Enter password"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            style={{
              background: "rgba(244,241,236,0.07)",
              border: "1px solid rgba(244,241,236,0.18)",
              borderRadius: 0,
              color: "#F4F1EC",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.1em",
              padding: "16px 20px",
              outline: "none",
              width: "100%",
              textAlign: "center",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#0179C8",
              border: "none",
              color: "#F4F1EC",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "16px 20px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Enter →
          </button>
        </form>

        <div style={{ marginTop: 48 }}>
          <a href="index.html" className="mono" style={{ color: "rgba(244,241,236,0.3)", fontSize: 11 }}>
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <PasswordGate>
      <div style={{
        background: "#040C20",
        color: "#F4F1EC",
        ["--ink"]: "#F4F1EC",
        ["--ink-soft"]: "rgba(244,241,236,0.75)",
        ["--ink-faint"]: "rgba(244,241,236,0.5)",
        ["--line-faint"]: "rgba(244,241,236,0.18)",
        ["--bg-alt"]: "#0D1E3A"
      }}>
        <HeroTop />
        <Opener />
      </div>
      <ChallengeSection />
      <OpportunitySection />
      <ApproachSection />
      <SolutionSection />
      <ImpactSection />
      <NextProject />
      <Footer />
    </PasswordGate>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
