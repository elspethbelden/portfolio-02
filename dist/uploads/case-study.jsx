// Case study — Goldman Sachs AI Companion
const { useState, useEffect } = React;

function ImagePlaceholder({ label = "image", aspect = "4/3", full = false, tint = "warm", darkMode = false }) {
  const tints = {
    warm:    { bg: "#E8DFD2", stripe: "#DCCFB9", text: "#6B5E48" },
    cool:    { bg: "#D9DDE2", stripe: "#C5CBD3", text: "#5A6370" },
    sage:    { bg: "#D5DCCC", stripe: "#C3CCB4", text: "#5B6750" },
    accent:  { bg: "#EBD6C6", stripe: "#E0C4AE", text: "#7A4A2B" },
    dark:    { bg: "#2A2A2A", stripe: "#333333", text: "#9A9590" },
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
      padding: 18, overflow: "hidden",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: c.text,
      }}>[ {label} ]</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.14em", color: c.text,
      }}>░░░</div>
    </div>
  );
}

function EBurger({ open }) {
  const barColor = "currentColor";
  const W = 44, H = 22, T = 4;
  return (
    <div style={{
      width: W, height: H, position: "relative",
      transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: T, height: H, background: barColor,
        transition: "opacity 250ms",
        opacity: open ? 0 : 1,
      }} />
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: W, height: T, background: barColor,
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: open ? `translateY(${(H - T) / 2}px) rotate(45deg)` : "translateY(0) rotate(0)",
        transformOrigin: "center",
      }} />
      <div style={{
        position: "absolute", left: 0, top: "50%",
        width: W, height: T, marginTop: -T / 2, background: barColor,
        transition: "opacity 250ms, transform 400ms",
        opacity: open ? 0 : 1,
        transform: open ? "scaleX(0)" : "scaleX(1)",
        transformOrigin: "left center",
      }} />
      <div style={{
        position: "absolute", left: 0, bottom: 0,
        width: W, height: T, background: barColor,
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: open ? `translateY(${-(H - T) / 2}px) rotate(-45deg)` : "translateY(0) rotate(0)",
        transformOrigin: "center",
      }} />
    </div>
  );
}

function TopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navItems = [
    { label: "Work", href: "index.html#work", num: "01" },
    { label: "About", href: "index.html#about", num: "02" },
    { label: "Contact", href: "index.html#contact", num: "03" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        style={{
          position: "fixed", top: 20, left: 28, zIndex: 200,
          width: 56, height: 56,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer", padding: 0,
          mixBlendMode: open ? "normal" : "difference",
          color: "#F4F1EC",
        }}
      >
        <EBurger open={open} />
      </button>

      <div style={{
        position: "fixed", inset: 0, zIndex: 150,
        background: "#1A1A1A", color: "#F4F1EC",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        display: "flex", flexDirection: "column",
        padding: "96px 32px 40px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 60 }}>
          <div className="mono" style={{ color: "rgba(244,241,236,0.55)" }}>
            <span className="bracket">MENU · 2026</span>
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.55)" }}>
            <span className="bracket">03 / DESTINATIONS</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          {navItems.map((item, i) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: 40, alignItems: "baseline",
                padding: "24px 0",
                borderTop: i === 0 ? "1px solid rgba(244,241,236,0.15)" : "none",
                borderBottom: "1px solid rgba(244,241,236,0.15)",
                color: "#F4F1EC",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ${150 + i * 80}ms, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1) ${150 + i * 80}ms, color 200ms`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#F4F1EC"}
            >
              <span className="mono" style={{ color: "rgba(244,241,236,0.5)" }}>
                <span className="bracket">{item.num}</span>
              </span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(72px, 12vw, 200px)",
                lineHeight: 0.95, fontWeight: 300, letterSpacing: "-0.04em",
              }}>{item.label}</span>
              <span className="italic-accent" style={{
                fontSize: "clamp(24px, 3vw, 40px)", color: "var(--accent)",
              }}>↗</span>
            </a>
          ))}
        </nav>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 32, paddingTop: 40, marginTop: 40,
          borderTop: "1px solid rgba(244,241,236,0.15)",
        }}>
          <div className="mono" style={{ color: "rgba(244,241,236,0.55)" }}>
            <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.3)" }}><span className="bracket">EMAIL</span></div>
            <a href="mailto:elspethbelden@gmail.com" style={{ color: "#F4F1EC", borderBottom: "1px solid rgba(244,241,236,0.3)" }}>
              elspethbelden@gmail.com
            </a>
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.55)", textAlign: "center" }}>
            <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.3)" }}><span className="bracket">LOCATION</span></div>
            London, UK
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.55)", textAlign: "right" }}>
            <div style={{ marginBottom: 6, color: "rgba(244,241,236,0.3)" }}><span className="bracket">ELSEWHERE</span></div>
            <a href="https://www.linkedin.com/in/elspethbelden/" target="_blank" rel="noopener" style={{ color: "#F4F1EC", borderBottom: "1px solid rgba(244,241,236,0.3)" }}>
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Breadcrumb() {
  return (
    <div style={{ padding: "120px 32px 40px" }}>
      <div className="mono" style={{ color: "var(--ink-soft)" }}>
        <a href="index.html" style={{ color: "var(--ink-faint)" }}>Index</a>
        <span style={{ margin: "0 10px", color: "var(--ink-faint)" }}>/</span>
        <a href="index.html#work" style={{ color: "var(--ink-faint)" }}>Selected Work</a>
        <span style={{ margin: "0 10px", color: "var(--ink-faint)" }}>/</span>
        <span>Case 01 — Goldman Sachs</span>
      </div>
    </div>
  );
}

function Opener() {
  return (
    <section style={{ padding: "0 32px 40px" }}>
      {/* Meta grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 32,
        paddingBottom: 60,
        borderBottom: "1px solid var(--line-faint)",
      }}>
        <div>
          <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 8 }}>
            <span className="bracket">CLIENT</span>
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 400,
          }}>Goldman Sachs</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 8 }}>
            <span className="bracket">ROLE</span>
          </div>
          <div className="mono" style={{ color: "var(--ink)" }}>Experience Lead</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 8 }}>
            <span className="bracket">YEAR</span>
          </div>
          <div className="mono" style={{ color: "var(--ink)" }}>2025—2026</div>
        </div>
        <div>
          <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 8 }}>
            <span className="bracket">DISCIPLINES</span>
          </div>
          <div className="mono" style={{ color: "var(--ink)", lineHeight: 1.8 }}>
            AI / LLM UX<br/>
            Product Vision<br/>
            Design System
          </div>
        </div>
      </div>

      {/* Huge title */}
      <div style={{ padding: "80px 0 40px" }}>
        <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 40 }}>
          <span className="bracket">CASE STUDY · 01 / 03</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 9vw, 160px)",
          lineHeight: 0.95,
          fontWeight: 300,
          letterSpacing: "-0.035em",
          maxWidth: "18ch",
        }}>
          An AI <span className="italic-accent" style={{ color: "var(--accent)" }}>companion</span> for the trading floor.
        </h1>
      </div>

      {/* Dek */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        gap: 40,
        paddingTop: 40,
        paddingBottom: 40,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">INTRO</span>
        </div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(22px, 2.4vw, 32px)",
          lineHeight: 1.4,
          fontWeight: 300,
          color: "var(--ink)",
        }}>
          A north star for an in-house, proprietary AI tool for Goldman Sachs employees — one that extends the{" "}
          <span className="italic-accent" style={{ color: "var(--accent)" }}>design system and brand language</span>
          {" "}I helped establish the year before, and reframes how the firm's people work with their own knowledge.
        </p>
        <div className="mono" style={{
          textAlign: "right", color: "var(--ink-soft)", alignSelf: "end"
        }}>
          2026 — 6 MO.
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <section style={{ padding: "40px 32px 120px" }}>
      <div style={{ height: "80vh", minHeight: 560 }}>
        <ImagePlaceholder label="hero — AI companion UI, dashboard view" full tint="warm" />
      </div>
      <div className="mono" style={{
        color: "var(--ink-faint)",
        marginTop: 14,
        display: "flex", justifyContent: "space-between",
      }}>
        <span><span className="bracket">FIG. 01</span> Hero moment · primary surface</span>
        <span className="bracket">16:9 · 2560</span>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section style={{ padding: "80px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
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
            marginBottom: 40,
          }}>
            Goldman had the{" "}
            <span className="italic-accent" style={{ color: "var(--accent)" }}>system</span>.
            {" "}Now they needed the surface.
          </h2>

          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, lineHeight: 1.6,
            color: "var(--ink-soft)",
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              Following the global rebrand and the rebuild of the Goldman design system, the firm wanted to unlock their most ambitious use-case yet: a proprietary AI tool woven into employees' daily work.
            </p>
            <p style={{ marginBottom: "1.2em" }}>
              The challenge wasn't ideation — Goldman had the ideas. It was definition. What should this tool <em>feel</em> like? Where should it live? How does a conservative, risk-aware institution adopt generative AI in a way that feels inevitable, trustworthy, and unmistakably theirs?
            </p>
            <p>
              My role was to set the north star — translating strategy into a high-fidelity vision the business could rally behind, and engineering could build from.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = [
    { num: "6", unit: "months", label: "discovery → vision" },
    { num: "1:1", unit: "parity", label: "with existing DS tokens" },
    { num: "4", unit: "streams", label: "cross-functional" },
    { num: "20+", unit: "surfaces", label: "mapped end-to-end" },
  ];
  return (
    <section style={{
      padding: "80px 32px",
      background: "var(--bg-alt)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            borderTop: "1px solid var(--line-faint)",
            paddingTop: 20,
          }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 6vw, 88px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: 8,
            }}>
              {s.num}
              <span className="italic-accent" style={{
                color: "var(--accent)",
                fontSize: "0.45em",
                marginLeft: 8,
                fontWeight: 400,
              }}>{s.unit}</span>
            </div>
            <div className="mono" style={{ color: "var(--ink-soft)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const principles = [
    {
      num: "P.01",
      title: "Understated, not impressive",
      body: "The tool had to feel like part of Goldman — not a third-party overlay. We stripped the interface of AI tropes (sparkles, shimmers, fake personality) and leaned into the measured confidence of the brand itself."
    },
    {
      num: "P.02",
      title: "Quote the source, always",
      body: "In a firm where every claim is auditable, answers had to be traceable. Every generated response is anchored to a citation — the source document is one tap away, with provenance baked into the surface, not appended."
    },
    {
      num: "P.03",
      title: "Extend the system, don't fork it",
      body: "The AI tool uses the same tokens, components, and governance as the public web. No new design language — only new patterns where the existing system fell short (streaming responses, confidence states, composer behaviour)."
    }
  ];

  return (
    <section style={{ padding: "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
        marginBottom: 80,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">02 — PRINCIPLES</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em",
        }}>
          Three principles that shaped <span className="italic-accent" style={{ color: "var(--accent)" }}>every pixel</span>.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 48,
      }}>
        {principles.map(p => (
          <div key={p.num} style={{
            borderTop: "1px solid var(--ink)",
            paddingTop: 24,
          }}>
            <div className="mono" style={{
              color: "var(--accent)",
              marginBottom: 20,
            }}>
              <span className="bracket">{p.num}</span>
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}>{p.title}</h3>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--ink-soft)",
            }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryAsymmetric() {
  return (
    <section style={{ padding: "80px 32px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
        marginBottom: 60,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">03 — EXPLORATION</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em",
        }}>
          From composer to <span className="italic-accent" style={{ color: "var(--accent)" }}>canvas</span>.
        </h2>
      </div>

      {/* Asymmetric image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: 32, marginBottom: 32 }}>
        <div style={{ height: 540 }}>
          <ImagePlaceholder label="composer — primary entry surface" full tint="warm" />
        </div>
        <div style={{ height: 540 }}>
          <ImagePlaceholder label="thread view — citation drawer" full tint="cool" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 3fr", gap: 32, marginBottom: 32 }}>
        <div style={{ height: 380 }}>
          <ImagePlaceholder label="empty state" full tint="sage" />
        </div>
        <div style={{ height: 380 }}>
          <ImagePlaceholder label="streaming response" full tint="warm" />
        </div>
        <div style={{ height: 380 }}>
          <ImagePlaceholder label="source panel" full tint="accent" />
        </div>
      </div>

      <div style={{ height: 640 }}>
        <ImagePlaceholder label="full workspace — desktop, 1920×1080" full tint="cool" />
      </div>
      <div className="mono" style={{
        color: "var(--ink-faint)",
        marginTop: 14,
        display: "flex", justifyContent: "space-between",
      }}>
        <span><span className="bracket">FIG. 08</span> Workspace overview · landscape</span>
        <span className="bracket">HI-FI PROTOTYPE</span>
      </div>
    </section>
  );
}

function PullQuoteDark() {
  return (
    <section style={{
      background: "var(--bg-dark)",
      color: "#F4F1EC",
      padding: "160px 32px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
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
            marginBottom: 40,
          }}>
            <span style={{ color: "var(--accent)" }}>“</span>
            It finally feels like a Goldman product — restrained, intelligent, and aware of its own limits. Elspeth made an AI tool feel <span style={{ color: "var(--accent)" }}>institutional</span>.
            <span style={{ color: "var(--accent)" }}>”</span>
          </div>
          <div className="mono" style={{ color: "rgba(244,241,236,0.6)" }}>
            <span className="bracket">GS DIGITAL LEADERSHIP · 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const phases = [
    { phase: "01", name: "Discovery", weeks: "W.01—04", desc: "Stakeholder interviews across research, trading, compliance and engineering. Mapped 20+ latent use-cases." },
    { phase: "02", name: "Framing", weeks: "W.05—08", desc: "Synthesised constraints into three north-star scenarios. Aligned principals on a single hero use-case." },
    { phase: "03", name: "Definition", weeks: "W.09—16", desc: "Information architecture, conversation model, citation grammar. Paired with engineering on LLM capability boundaries." },
    { phase: "04", name: "Vision", weeks: "W.17—24", desc: "Hi-fi prototype, design system extensions, moderated user testing, and the handoff package to the build team." },
  ];
  return (
    <section style={{ padding: "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
        marginBottom: 80,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">04 — PROCESS</span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 5vw, 76px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.03em",
        }}>
          Six months, <span className="italic-accent" style={{ color: "var(--accent)" }}>four phases</span>.
        </h2>
      </div>

      <div>
        {phases.map((p, i) => (
          <div key={p.phase} style={{
            display: "grid",
            gridTemplateColumns: "80px 200px 1fr 2fr",
            gap: 32,
            padding: "32px 0",
            borderBottom: "1px solid var(--line-faint)",
            borderTop: i === 0 ? "1px solid var(--ink)" : "none",
            alignItems: "baseline",
          }}>
            <div className="mono" style={{ color: "var(--accent)" }}>
              <span className="bracket">{p.phase}</span>
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.02em",
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
              maxWidth: "52ch",
            }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OutcomeSection() {
  return (
    <section style={{ padding: "160px 32px", borderTop: "1px solid var(--line-faint)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: 64,
      }}>
        <div className="mono" style={{ color: "var(--ink-soft)" }}>
          <span className="bracket">05 — OUTCOME</span>
        </div>

        <div style={{ maxWidth: "55ch" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 76px)",
            lineHeight: 1,
            fontWeight: 300,
            letterSpacing: "-0.03em",
            marginBottom: 40,
          }}>
            A vision greenlit for <span className="italic-accent" style={{ color: "var(--accent)" }}>build</span>.
          </h2>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 20, lineHeight: 1.6,
            color: "var(--ink-soft)",
          }}>
            <p style={{ marginBottom: "1.2em" }}>
              The north star was signed off by Goldman digital leadership in Q1 2026, with an initial pilot scoped for Q3. The work sits on top of the design system I helped rebuild — meaning zero net-new tokens, and a path from vision to production measured in months, not years.
            </p>
            <p>
              More quietly: the project reframed how the firm talks about AI internally. Not as a feature, but as a posture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextProject() {
  return (
    <section style={{
      padding: "120px 32px 140px",
      borderTop: "1px solid var(--line-faint)",
    }}>
      <div className="mono" style={{ color: "var(--ink-faint)", marginBottom: 40 }}>
        <span className="bracket">NEXT CASE · 02 / 03</span>
      </div>

      <a href="index.html#work" style={{ display: "block" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}>
          <div style={{ height: 420 }}>
            <ImagePlaceholder label="NatWest — DS migration" full tint="cool" />
          </div>
          <div>
            <div className="mono" style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
              NatWest · 2024
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5.5vw, 88px)",
              lineHeight: 0.95,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              marginBottom: 24,
            }}>
              Migrating a bank's design system to <span className="italic-accent" style={{ color: "var(--accent)" }}>Figma</span>.
            </h3>
            <div className="mono" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid var(--ink)", paddingBottom: 4,
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
  return (
    <section style={{
      padding: "80px 32px",
      borderTop: "1px solid var(--line-faint)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: 32,
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
      <div className="mono" style={{ color: "var(--ink-soft)", textAlign: "right" }}>
        <div style={{ marginBottom: 6, color: "var(--ink-faint)" }}><span className="bracket">BACK</span></div>
        <a href="index.html" style={{ borderBottom: "1px solid currentColor" }}>
          Index ↑
        </a>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <TopBar />
      <Breadcrumb />
      <Opener />
      <HeroImage />
      <ContextSection />
      <StatsBand />
      <PrinciplesSection />
      <GalleryAsymmetric />
      <PullQuoteDark />
      <ProcessSection />
      <OutcomeSection />
      <NextProject />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
