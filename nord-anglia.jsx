// Case study — Nord Anglia Education
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

function ImagePlaceholder({ id, label = "image", aspect = "4/3", full = false, src, objectPosition = "center" }) {
  const slotId = id || ("na-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
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

function VideoSlot({ src, type, aspect = "16/9" }) {
  return (
    <div style={{ width: "100%", aspectRatio: aspect, overflow: "hidden", background: "#000" }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src={src} type={type} />
      </video>
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
          <span style={{ color: "#FFFFFF" }}>Nord Anglia Education</span>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%", transform: `translateY(${y}px)`, opacity, willChange: "transform, opacity" }}>
        <ImagePlaceholder id="na-cover" label="Cover 1 — desktop and mobile UI mockups" full src={isMobile ? "uploads/NordAnglia/mobile/Nord Hero-2.jpg" : "uploads/NordAnglia/Nord Hero-2.jpg"} objectPosition={isMobile ? "top" : "center"} />
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
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400 }}>
            Nord Anglia Education
          </div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            UX / UI Design<br />
            Component Library<br />
            User Testing<br />
            Brand Translation
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "40px 0 24px" : "80px 0 40px" }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: isMobile ? 24 : 40 }}>
          <span className="bracket">CASE STUDY · NORD ANGLIA EDUCATION</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          maxWidth: "20ch",
          fontWeight: 500
        }}>
          One system.{" "}
          <span style={{ fontStyle: "italic" }}>76 schools.</span>
          {" "}Counting.
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
          Nord Anglia is a network of 76 (and counting) premium international schools across the globe.
          I partnered with a brand agency to refresh their online identity and deliver a{" "}
          component system
          {" "}to serve both the corporate site and individual school sites.
        </p>
        <div className="mono" style={{ textAlign: isMobile ? "left" : "right", color: "var(--ink-soft)", alignSelf: isMobile ? "auto" : "end" }}>
          76 SCHOOLS
        </div>
      </div>
    </section>
  );
}

function DiscoverySection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">01 — DISCOVERY</span>
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
            Interpreting the{" "}
            brand online.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              During the initial design exploration, I worked as part of a collaborative UX/UI team to explore how to interpret the — still-evolving — brand online, while defining key user journeys and page content.
            </p>
            <p>
              A core goal was to use design to articulate what makes Nord Anglia's offering distinctive. The outcome was a desktop and mobile prototype ready for user testing.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: isMobile ? 40 : 64 }}>
        <figure>
          <ImagePlaceholder id="na-discovery" label="Early work — wireframes and content architecture" aspect="16/9" src="uploads/NordAnglia/Early+work.webp" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 02</span> Early explorations — wireframes and content architecture.</span>
            <span className="bracket">DISCOVERY</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HomepageTestingSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">02 — USER TESTING</span>
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
            Testing two{" "}
            competing
            {" "}approaches.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              As part of the golden path user testing, we wanted to compare two different design approaches to the homepage — one oriented towards a more visionary persona, one more traditionalist.
            </p>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: 24, padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder id="na-homepage-ia" label="Homepage IA — before and forward architecture" aspect="16/9" src="uploads/NordAnglia/HomeB&F.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 03</span> Homepage IA — before and forward content architecture.</span>
          <span className="bracket">CONTENT DESIGN</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 24, marginBottom: isMobile ? 32 : 24 }}>
        <figure>
          <ImagePlaceholder id="na-homepage-1" label="Homepage 1 — The Visionary" aspect="4/3" src="uploads/NordAnglia/ezgif.com-gif-maker+(24).gif" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 04</span> Homepage 1, for 'The Visionary'.</span>
            <span className="bracket">PROTOTYPE</span>
          </figcaption>
        </figure>
        <figure>
          <ImagePlaceholder id="na-homepage-2" label="Homepage 2 — The Traditionalist" aspect="4/3" src="uploads/NordAnglia/ezgif.com-gif-maker+(25).gif" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 05</span> Homepage 2, for 'The Traditionalist'.</span>
            <span className="bracket">PROTOTYPE</span>
          </figcaption>
        </figure>
      </div>

      <figure style={{ padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder id="na-user-testing" label="User testing — 2 — feedback from participants" aspect="16/9" src="uploads/NordAnglia/User+testing+–+2.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 06</span> User testing — feedback from participants.</span>
          <span className="bracket">RESEARCH</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginTop: isMobile ? 40 : 80 }}>
        {!isMobile && <div />}
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--ink-soft)",
          maxWidth: "55ch"
        }}>
          <p style={{ marginBottom: "1.2em" }}>
            The overall design was well received. It gave a premium, modern impression of the school and was considered both recognisable and professional.
          </p>
          <p>
            However, the collage elements from the brand identity didn't translate well digitally. Users wanted to see authentic photography of the school environment, and found the illustrations confusing and inauthentic. The digital design needed to use these elements more sparingly, and the context and purpose of each page needed to be made clearer.
          </p>
        </div>
      </div>
    </section>
  );
}

function GoldenPathSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">03 — GOLDEN PATH</span>
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
            Two days to implement{" "}
            the changes.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              Following user testing, we had two days to implement the recommended updates to the golden path, plus additional feedback we hadn't had time to address prior to testing.
            </p>
          </div>
        </div>
      </div>

      <figure>
        <ImagePlaceholder id="na-golden-path" label="Golden path — annotated screens, end-to-end user journey" aspect="16/9" src="uploads/NordAnglia/Golden+path.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 07</span> Golden path — annotated screens showing the end-to-end user journey.</span>
          <span className="bracket">UX</span>
        </figcaption>
      </figure>
    </section>
  );
}


function IterationSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">04 — ITERATION</span>
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
            Three sprints. A{" "}
            rapidly evolving
            {" "}brand.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              With a tight timeline, we needed to rapidly define and build out the backlog for the development team and content editors to have enough to work with during the build phase. Looking beyond the golden path, we worked with the Product Owners to identify the key pages and templates to prioritise within the time available.
            </p>
            <p style={{ marginBottom: "1.2em" }}>
              The brand and digital transformation ran as concurrent workstreams. We worked as closely as possible with the appointed brand agency to iterate on the visual language of our components as the brand evolved. By maintaining a strict, embedded component library, I was able to push brand updates through into page designs with minimal effort.
            </p>
            <p>
              Design exploration moved quickly, to say the least. Some key components — such as the page hero — required multiple design trials to determine how the brand could be applied effectively in a digital context.
            </p>
          </div>
        </div>
      </div>

      {/* Hero iterations grid */}
      <div style={{ marginBottom: isMobile ? 40 : 80 }}>
        <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 16 }}>
          <span className="bracket">PAGE HERO — DESIGN ITERATIONS</span>
        </div>
        <figure style={{ padding: isMobile ? 0 : "0 15%" }}>
          <ImagePlaceholder id="na-hero-iter-1" label="Hero component — iteration 1" aspect="4/3" src="uploads/NordAnglia/Component+alignment.webp" />
          <figcaption className="mono" style={{
            color: "var(--ink-faint)", marginTop: 14,
            display: "flex", justifyContent: "space-between"
          }}>
            <span><span className="bracket">FIG. 08</span> Page hero — design iterations.</span>
            <span className="bracket">COMPONENT DESIGN</span>
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64 }}>
        {!isMobile && <div />}
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--ink-soft)",
          maxWidth: "55ch"
        }}>
          <p>
            Other components were complex and required multiple rounds of iteration to get right. These were largely developed directly in design with UX guidance feeding in throughout.
          </p>
        </div>
      </div>
    </section>
  );
}

function NavigationSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">05 — NAVIGATION</span>
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
            Simple concept.{" "}
            Evolving
            {" "}execution.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              The navigation continued to evolve throughout the project. The simplicity of the conceptual nav tested very well with users. By adding additional subsections we were able to improve wayfinding without compromising the clarity of the golden path journey.
            </p>
          </div>
        </div>
      </div>

      <figure>
        <VideoSlot src="uploads/NordAnglia/Nav+video.mp4" type="video/mp4" aspect="16/9" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 13</span> Navigation — evolution across the project.</span>
          <span className="bracket">PROTOTYPE</span>
        </figcaption>
      </figure>
    </section>
  );
}

function FindASchoolSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">06 — FIND A SCHOOL</span>
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
            Making a global network{" "}
            navigable.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              The ability for parents to find the most relevant school within the Nord Anglia network was a key feature of the corporate website. We ran a dedicated sprint to make this process more intuitive and user-friendly.
            </p>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: 24 }}>
        <ImagePlaceholder id="na-find-school" label="Find A School — school search experience" aspect="16/9" src="uploads/NordAnglia/Find+a+school+tool.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 14</span> Find A School — school search experience.</span>
          <span className="bracket">UI</span>
        </figcaption>
      </figure>

      <figure style={{ padding: isMobile ? 0 : "0 15%" }}>
        <VideoSlot src="uploads/NordAnglia/Find+a+School.mp4" type="video/mp4" aspect="16/9" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 15</span> Find A School — interactive prototype.</span>
          <span className="bracket">PROTOTYPE</span>
        </figcaption>
      </figure>
    </section>
  );
}

function LanguageSupportSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">07 — LANGUAGE SUPPORT</span>
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
            Designing for a{" "}
            global
            {" "}audience.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              Nord Anglia has a global network of schools, so although we designed English-first, it was important to design flexibly with varying copy lengths in mind. Most schools would have their site available in multiple languages.
            </p>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: isMobile ? 40 : 80, padding: isMobile ? 0 : "0 15%" }}>
        <ImagePlaceholder id="na-stress-test" label="Content stress test — component with English, Chinese, and Vietnamese copy" aspect="16/9" src="uploads/NordAnglia/content-stress-test.gif" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 16</span> Content stress test — the same component across three languages.</span>
          <span className="bracket">LOCALISATION</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginBottom: isMobile ? 32 : 64 }}>
        {!isMobile && <div />}
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--ink-soft)",
          maxWidth: "55ch"
        }}>
          <p style={{ marginBottom: "1.2em" }}>
            China was a key audience for MVP launch. We conducted a second round of user testing with a Chinese-speaking audience to identify where regional design changes were appropriate.
          </p>
          <p>
            One key insight led to the creation of a China-specific typographic treatment, distinct from the Latin script style sheet used for other launch regions. This significantly improved legibility and overall accessibility of the site for that audience.
          </p>
        </div>
      </div>

      <figure style={{ marginBottom: 24 }}>
        <ImagePlaceholder id="na-chinese-prototype" label="Chinese language prototype screens" aspect="16/9" src="uploads/NordAnglia/CHINESE+PROTOTYPE.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 17</span> Chinese language prototype — regional typographic treatment.</span>
          <span className="bracket">LOCALISATION</span>
        </figcaption>
      </figure>

      <figure>
        <ImagePlaceholder id="na-chinese-style-guide" label="Chinese typography and form component style guide" aspect="16/9" src="uploads/NordAnglia/Screenshot+2021-07-19+at+17.16.57.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 18</span> Chinese digital style guide — typography scale and form components.</span>
          <span className="bracket">DOCUMENTATION</span>
        </figcaption>
      </figure>
    </section>
  );
}

function DocumentationSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">08 — DOCUMENTATION</span>
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
            Building the{" "}
            reference.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              To support our China-based development team and facilitate the wider stakeholder sign-off process, I produced an extensively detailed component library and digital style guide.
            </p>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: 24 }}>
        <ImagePlaceholder id="na-docs-modules" label="Component library documentation and style guide" aspect="16/9" src="uploads/NordAnglia/Components.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 19</span> Component library documentation — style guide and module specs.</span>
          <span className="bracket">DOCUMENTATION</span>
        </figcaption>
      </figure>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 12, marginBottom: isMobile ? 40 : 80 }}>
        <figure>
          <ImagePlaceholder id="na-fluid-type-1" label="Fluid type — scale and breakpoints" aspect="16/9" src="uploads/NordAnglia/Fluid+type+–+1.webp" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 20</span> Fluid type — scale specification.
          </figcaption>
        </figure>
        <figure>
          <ImagePlaceholder id="na-fluid-type-2" label="Fluid type — responsive breakpoints" aspect="16/9" src="uploads/NordAnglia/Fluid+type+–+2.webp" />
          <figcaption className="mono" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
            <span className="bracket">FIG. 21</span> Fluid type — responsive breakpoints.
          </figcaption>
        </figure>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 12 : 64, marginBottom: isMobile ? 32 : 64 }}>
        {!isMobile && <div />}
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--ink-soft)",
          maxWidth: "55ch"
        }}>
          <p>
            More complex motion design that couldn't be replicated within standard design tools was prototyped in React using Framer. This helped communicate behaviour to both developers and the client, while demonstrating motion that was code-friendly — as opposed to more traditional methods like After Effects.
          </p>
        </div>
      </div>

      <figure>
        <VideoSlot src="uploads/NordAnglia/scroll+code.mp4" type="video/mp4" aspect="16/9" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 20</span> Motion design — Framer prototype demonstrating component animations.</span>
          <span className="bracket">MOTION</span>
        </figcaption>
      </figure>
    </section>
  );
}

function ResultSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "48px 20px" : "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 20 : 64, marginBottom: isMobile ? 32 : 64 }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">09 — THE RESULT</span>
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
            60+ modules.
            {" "}76 schools.
          </h2>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--ink-soft)"
          }}>
            <p>
              A flexible, scalable library of 60+ modules that can be adapted and personalised across Nord Anglia Education's network of 76 schools according to their individual needs.
            </p>
          </div>
        </div>
      </div>

      <figure style={{ marginBottom: 24 }}>
        <VideoSlot src="uploads/NordAnglia/Home+scroll+full+vid.mp4" type="video/mp4" aspect="16/9" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 21</span> Final product walkthrough.</span>
          <span className="bracket">RESULT</span>
        </figcaption>
      </figure>

      <figure style={{ marginBottom: 24 }}>
        <ImagePlaceholder id="na-golden-path-rest" label="Rest of golden path — supplementary UI views" aspect="16/9" src="uploads/NordAnglia/Rest+of+Golden+path.webp" />
        <figcaption className="mono" style={{
          color: "var(--ink-faint)", marginTop: 14,
          display: "flex", justifyContent: "space-between"
        }}>
          <span><span className="bracket">FIG. 22</span> Additional golden path screens.</span>
          <span className="bracket">UI</span>
        </figcaption>
      </figure>

    </section>
  );
}

function NextProject() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 20px 70px" : "120px 32px 140px",
      background: "#160D24",
      color: "#F4F1EC",
      ["--ink"]: "#F4F1EC",
      ["--ink-soft"]: "rgba(244,241,236,0.75)",
      ["--ink-faint"]: "rgba(244,241,236,0.45)",
      ["--line-faint"]: "rgba(244,241,236,0.15)",
    }}>
      <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: isMobile ? 24 : 40 }}>
        <span className="bracket">NEXT</span>
      </div>

      <a href="natwest.html" style={{ display: "block" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 24 : 64,
          alignItems: "center"
        }}>
          <div style={{ height: isMobile ? "auto" : 420, aspectRatio: isMobile ? "4/3" : undefined, position: "relative", overflow: "hidden", borderRadius: 12 }}>
            <image-slot
              id="na-next-thumb"
              placeholder="NatWest — Design System"
              fit="contain"
              src="assets/thumbnails/Pulse_logo loop.gif"
              style={{ width: "100%", height: "100%", display: "block", background: "#3C1053" }}
            ></image-slot>
          </div>
          <div>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
              NatWest
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              marginBottom: 24
            }}>
              Building a bank's design system from{" "}
              scratch.
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
    </section>
  );
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
      background: "#160D24",
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
    </section>
  );
}

function App() {
  return (
    <>
      <div style={{
        background: "#0B1F30",
        color: "#F4F1EC",
        ["--ink"]: "#F4F1EC",
        ["--ink-soft"]: "rgba(244,241,236,0.75)",
        ["--ink-faint"]: "rgba(244,241,236,0.5)",
        ["--line-faint"]: "rgba(244,241,236,0.18)",
        ["--bg-alt"]: "#1A3347"
      }}>
        <HeroTop />
        <Opener />
      </div>
      <DiscoverySection />
      <HomepageTestingSection />
      <GoldenPathSection />
      <IterationSection />
      <NavigationSection />
      <FindASchoolSection />
      <LanguageSupportSection />
      <DocumentationSection />
      <ResultSection />
      <NextProject />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
