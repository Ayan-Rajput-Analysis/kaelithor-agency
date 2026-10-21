"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  site,
  brandLogos,
  themes,
  masterSections,
  team,
  aboutStats,
  projects,
  projectCategories,
  executionPipeline,
  type ThemeId,
  type FontPresetId,
  type TeamMemberId,
  type ProjectCategory,
  type ProjectItem,
} from "../../content/site";
import { Scene3DCanvas } from "../ui/Scene3DCanvas";

export function GlassAgencyPhaseOne() {
  // Default to "titanium-atelier" (Orange & White Daylight Glass) per user directive
  const [activeTheme, setActiveTheme] = useState<ThemeId>("titanium-atelier");
  const [activeFont, setActiveFont] = useState<FontPresetId>("barlow-plex");
  // Scroll progress lives in a ref (not state) so scrolling never re-renders this component
  const scrollProgressRef = useRef<number>(0);
  const scrollLaserRef = useRef<HTMLDivElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("about-kaelithor");
  const [focusedMember, setFocusedMember] = useState<TeamMemberId>("ayan");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [activeExecIdx, setActiveExecIdx] = useState<number>(0);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Section 05: Interactive WhatsApp & Gmail Project Brief State
  const [briefName, setBriefName] = useState<string>("");
  const [briefEmail, setBriefEmail] = useState<string>("");
  const [briefDomain, setBriefDomain] = useState<string>(team[0].pillarTitle);
  const [briefLeadId, setBriefLeadId] = useState<TeamMemberId>("ayan");
  const [briefTimeline, setBriefTimeline] = useState<string>(
    "7–14 Day Rapid Production Sprint"
  );
  const [briefDetails, setBriefDetails] = useState<string>("");
  const [copiedChannel, setCopiedChannel] = useState<
    "none" | "whatsapp" | "email" | "brief"
  >("none");
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "activation" | "error"
  >("idle");

  // Hero tilt card is driven by CSS variables via rAF (no React re-render per mousemove)
  const heroTiltFrame = useRef<number>(0);

  const handleSelectTheme = useCallback((themeId: ThemeId) => {
    setActiveTheme(themeId);
    const matched = themes.find((t) => t.id === themeId);
    if (matched) {
      setActiveFont(matched.defaultFontId);
    }
  }, []);

  // Single-click toggle between Orange & White (titanium-atelier) and Sovereign Gold (aurum-quant)
  const handleToggleTheme = useCallback(() => {
    const nextTheme: ThemeId =
      activeTheme === "titanium-atelier" ? "aurum-quant" : "titanium-atelier";
    handleSelectTheme(nextTheme);
  }, [activeTheme, handleSelectTheme]);

  // Sync data-theme and data-font attributes on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font", activeFont);
  }, [activeFont]);

  // Sync aria-invalid with native CSS :user-invalid state on blur/input (modern-web-guidance)
  useEffect(() => {
    const syncAria = (target: EventTarget | null) => {
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        try {
          if (target.matches(":user-invalid")) {
            target.setAttribute("aria-invalid", "true");
          } else if (target.hasAttribute("aria-invalid")) {
            target.setAttribute("aria-invalid", "false");
          }
        } catch {
          // Fallback if selector(:user-invalid) is unsupported
          const valid = target.checkValidity();
          target.classList.toggle("user-invalid-fallback", !valid);
          target.setAttribute("aria-invalid", !valid ? "true" : "false");
        }
      }
    };

    const onBlur = (e: FocusEvent) => syncAria(e.target);
    const onInput = (e: Event) => {
      if (
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement) &&
        e.target.hasAttribute("aria-invalid")
      ) {
        syncAria(e.target);
      }
    };

    document.addEventListener("blur", onBlur, true);
    document.addEventListener("input", onInput);
    return () => {
      document.removeEventListener("blur", onBlur, true);
      document.removeEventListener("input", onInput);
    };
  }, []);

  // Keyboard shortcuts for the case-study lightbox only (Escape / Arrow keys)
  useEffect(() => {
    if (!activeModalProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalProject(null);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const currentIndex = projects.findIndex((p) => p.id === activeModalProject.id);
        if (currentIndex !== -1) {
          const delta = e.key === "ArrowRight" ? 1 : -1;
          const nextIndex = (currentIndex + delta + projects.length) % projects.length;
          setActiveModalProject(projects[nextIndex]);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModalProject]);

  // Track scroll progress (ref + direct DOM write) and the active taskbar item.
  // Section tops are measured once per frame at most, and React state only
  // changes when the active section actually changes.
  useEffect(() => {
    let rafId = 0;
    const sectionOrder = [
      "initiate-project",
      "senior-specialists",
      "capabilities-pipeline",
      "shipped-projects",
    ];
    const updateScroll = () => {
      rafId = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      scrollProgressRef.current = clamped;
      if (scrollLaserRef.current) {
        scrollLaserRef.current.style.transform = `scaleX(${clamped})`;
      }

      const threshold = window.innerHeight * 0.45;
      let next = "about-kaelithor";
      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          next = id;
          break;
        }
      }
      setActiveSectionId((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const filterAndScrollToProjects = useCallback(
    (category: ProjectCategory) => {
      setSelectedCategory(category);
      scrollToSection("shipped-projects");
    },
    [scrollToSection]
  );

  const focusSpecialistAndScroll = useCallback(
    (memberId: TeamMemberId) => {
      setFocusedMember(memberId);
      scrollToSection("senior-specialists");
    },
    [scrollToSection]
  );

  const inspectStageForSpecialist = useCallback(
    (stageIdx: number) => {
      setActiveExecIdx(stageIdx);
      scrollToSection("capabilities-pipeline");
    },
    [scrollToSection]
  );

  const scopeWithSpecialist = useCallback(
    (memberId: TeamMemberId, defaultDomainLabel: string) => {
      setBriefLeadId(memberId);
      setBriefDomain(defaultDomainLabel);
      scrollToSection("initiate-project");
    },
    [scrollToSection]
  );

  const handleCopyText = useCallback(
    (text: string, channel: "whatsapp" | "email" | "brief") => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      setCopiedChannel(channel);
      setTimeout(() => {
        setCopiedChannel((prev) => (prev === channel ? "none" : prev));
      }, 2400);
    },
    []
  );

  // Hero card tilt: write CSS custom properties directly (max once per frame)
  const handleHeroCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const { clientX, clientY } = e;
    if (heroTiltFrame.current) return;
    heroTiltFrame.current = requestAnimationFrame(() => {
      heroTiltFrame.current = 0;
      const rect = card.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      card.style.setProperty("--tilt-rx", `${(-(py - 0.5) * 8).toFixed(2)}deg`);
      card.style.setProperty("--tilt-ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
      card.style.setProperty("--glare-x", `${Math.round(px * 100)}%`);
      card.style.setProperty("--glare-y", `${Math.round(py * 100)}%`);
    });
  };

  const resetHeroCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    cancelAnimationFrame(heroTiltFrame.current);
    heroTiltFrame.current = 0;
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
    card.style.setProperty("--glare-x", "50%");
    card.style.setProperty("--glare-y", "30%");
  };

  const currentThemeObj = themes.find((t) => t.id === activeTheme) ?? themes[0];
  const selectedMember = team.find((m) => m.id === focusedMember) ?? team[0];
  const briefLeadObj = team.find((m) => m.id === briefLeadId) ?? team[0];
  const activeExecStage = executionPipeline[activeExecIdx] ?? executionPipeline[0];
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const activeLogoSrc =
    activeTheme === "titanium-atelier"
      ? brandLogos[0].src
      : brandLogos[3].src;

  const serviceOptions = [
    ...team.map((m) => m.pillarTitle),
    "Full-Agency Multi-Pod Retainer",
  ];
  const timelineOptions = [
    "7–14 Day Rapid Production Sprint",
    "2–4 Weeks Production Release",
    "1–3 Months Enterprise Build",
    "Dedicated Monthly Pod Retainer",
  ];

  // FAQ — answers the questions clients ask before reaching out.
  // Pricing is intentionally quoted per project after understanding the problem.
  const faqItems = [
    {
      q: "How much does a project cost?",
      a: "Every project is different, so we don't publish fixed prices. We start with a free discovery call to understand your problem, then send a clear proposal and quote tailored to your scope and timeline.",
    },
    {
      q: "Will I speak with the actual specialist?",
      a: "Yes. You work directly with the lead doing the work — Ayan, Arsalan, Hassan or Naveed. No account managers in between.",
    },
    {
      q: "How quickly can you start?",
      a: "Usually within 48 hours of agreeing on scope. Focused sprints ship in 1–2 weeks; larger builds are delivered in milestones.",
    },
    {
      q: "Do you work with international clients?",
      a: "Yes. We serve clients in Pakistan, the US, UK, EU and the Middle East, with overlapping hours from Pakistan (UTC+5) and async updates.",
    },
    {
      q: "Do I own the final code, models and design files?",
      a: "Yes. On delivery you receive full ownership of source code, trained models, dashboards and editable design files. We're happy to sign an NDA.",
    },
  ];

  const formattedBriefText = [
    `Hello Kaelithor Agency (${briefLeadObj.name} — ${briefLeadObj.shortRole}),`,
    ``,
    `• Client / Company: ${briefName.trim() || "[Your Name / Company]"}`,
    `• Reply Contact: ${briefEmail.trim() || "[Your Email / Phone]"}`,
    `• Selected Pillar: ${briefDomain}`,
    `• Assigned Lead: ${briefLeadObj.name} (${briefLeadObj.sprintSla})`,
    `• Target Timeline: ${briefTimeline}`,
    `• Project Scope & Goals: ${
      briefDetails.trim() ||
      "We would like to scope a production engagement with Kaelithor."
    }`,
  ].join("\n");

  const whatsappDispatchUrl = `https://wa.me/${
    site.whatsappDigits
  }?text=${encodeURIComponent(formattedBriefText)}`;

  const gmailSubject = `Kaelithor Project Inquiry — ${briefDomain} (${
    briefName.trim() || "New Client Brief"
  })`;
  const gmailDispatchUrl = `mailto:${site.email}?subject=${encodeURIComponent(
    gmailSubject
  )}&body=${encodeURIComponent(formattedBriefText)}`;

  // Contact form → delivered straight to the agency Gmail inbox.
  // Uses FormSubmit's AJAX endpoint (no backend / API keys needed, works on
  // Vercel or any static host). Override with NEXT_PUBLIC_FORM_ENDPOINT if you
  // later switch to Web3Forms, Formspree, or your own API route.
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const honeypot = (form.elements.namedItem("_honey") as HTMLInputElement | null)?.value;
    if (honeypot) return;

    setFormStatus("sending");
    const endpoint =
      process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
      `https://formsubmit.co/ajax/${site.email}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: briefName.trim(),
          email: briefEmail.trim(),
          service: briefDomain,
          specialist: `${briefLeadObj.name} — ${briefLeadObj.shortRole}`,
          timeline: briefTimeline,
          message: briefDetails.trim() || "(no message)",
          _subject: gmailSubject,
          _replyto: briefEmail.trim(),
          _template: "table",
          _captcha: "false",
        }),
      });
      const data: { success?: string | boolean; message?: string } = await res
        .json()
        .catch(() => ({}));
      const ok = res.ok && String(data.success) === "true";
      if (ok) {
        setFormStatus("sent");
        setBriefDetails("");
      } else if (data.message && /activat/i.test(data.message)) {
        setFormStatus("activation");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const handleModalStep = (delta: number) => {
    if (!activeModalProject) return;
    const idx = projects.findIndex((p) => p.id === activeModalProject.id);
    if (idx === -1) return;
    const nextIdx = (idx + delta + projects.length) % projects.length;
    setActiveModalProject(projects[nextIdx]);
  };

  // SVG Icons for the Uiverse.io by mymiamo Liquid-Glass Capsule Menu
  const renderMenuIcon = (secId: string) => {
    switch (secId) {
      case "about-kaelithor":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      case "shipped-projects":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        );
      case "capabilities-pipeline":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );
      case "senior-specialists":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        );
    }
  };

  return (
    <div
      className="glass-experience-shell"
      data-theme={activeTheme}
      data-font={activeFont}
    >
      {/* Fixed 3D Polyhedron & Spatial Particle Backdrop */}
      <Scene3DCanvas theme={activeTheme} scrollRef={scrollProgressRef} />

      {/* Ambient Refractive Light Orbs for Optical Glassmorphism */}
      <div className="ambient-orbs-layer" aria-hidden="true">
        <div className="glass-orb glass-orb-primary" />
        <div className="glass-orb glass-orb-secondary" />
        <div className="glass-orb glass-orb-tertiary" />
      </div>

      {/* ================================================================ */}
      {/* UNIFIED VISIONOS / DRIBBBLE CRYSTAL COMMAND TASKBAR              */}
      {/* ================================================================ */}
      <header className="crystal-taskbar-shell">
        <div className="kaelithor-crystal-taskbar">
          {/* Zone 1 (Left): Bespoke 3D Isometric Kaelithor Prism Emblem + Live Telemetry */}
          <a
            href="#about-kaelithor"
            className="taskbar-brand-lockup"
            aria-label={`${site.name} — Home`}
          >
            <span className="kaelithor-prism-jewel" aria-hidden="true">
              <Image
                src={activeLogoSrc}
                alt="Kaelithor Emblem"
                width={40}
                height={40}
                className="kaelithor-brand-avatar-img"
                priority
              />
            </span>

            <div className="taskbar-brand-text">
              <div className="taskbar-brand-row">
                <span className="taskbar-wordmark">{site.name}</span>
                <span className="taskbar-sys-pill">
                  <span className="taskbar-sys-dot" aria-hidden="true" />
                  SYS 2.6
                </span>
              </div>
              <span className="taskbar-sub-domains">
                AI · BI · WEB · BRAND
              </span>
            </div>
          </a>

          <span className="taskbar-etched-divider" aria-hidden="true" />

          {/* Zone 2 (Center): Recessed Optical Well with Horizontal Icon+Label Capsules */}
          <nav
            className="taskbar-recessed-track"
            aria-label="Primary navigation"
          >
            {masterSections.map((sec) => {
              const isActive = activeSectionId === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sec.id);
                  }}
                  className={`taskbar-nav-item ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "location" : undefined}
                  title={`${sec.number}. ${sec.label}`}
                >
                  <span className="taskbar-item-icon" aria-hidden="true">
                    {renderMenuIcon(sec.id)}
                  </span>
                  <span className="taskbar-item-num">{sec.number}</span>
                  <span className="taskbar-item-label">{sec.shortTitle}</span>
                </a>
              );
            })}
          </nav>

          <span className="taskbar-etched-divider hide-on-tablet" aria-hidden="true" />

          {/* Zone 3 (Right): Segmented Theme Switcher (Orange & White Default) + Specular CTA */}
          <div className="taskbar-right-cluster">
            <div
              className="taskbar-theme-segmented"
              role="group"
              aria-label="Color theme switcher (Default: Orange & White)"
            >
              <button
                type="button"
                onClick={() => setActiveTheme("titanium-atelier")}
                className={`theme-seg-btn ${
                  activeTheme === "titanium-atelier" ? "is-selected" : ""
                }`}
                aria-pressed={activeTheme === "titanium-atelier"}
                title="Orange & White Daylight Glass (Default — Press 1)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4.5" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
                </svg>
                <span>Orange &amp; White</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTheme("aurum-quant")}
                className={`theme-seg-btn ${
                  activeTheme === "aurum-quant" ? "is-selected" : ""
                }`}
                aria-pressed={activeTheme === "aurum-quant"}
                title="Sovereign Gold Dark Glass (Press 2)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Gold Dark</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("shipped-projects")}
              className="taskbar-cta-pill"
            >
              <span>7 Shipped Works</span>
              <span className="cta-arrow-glyph" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>

          {/* Integrated Hairline Scroll Progress Laser Along Bottom Rim */}
          <div className="taskbar-scroll-laser" aria-hidden="true">
            <div
              ref={scrollLaserRef}
              className="taskbar-scroll-laser-fill"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </header>

      <main id="main" className="glass-main-flow">
        {/* ================================================================ */}
        {/* SECTION 01 OF 05: ABOUT KAELITHOR (WHO WE ARE & WHAT WE BUILD)   */}
        {/* ================================================================ */}
        <section
          id="about-kaelithor"
          className="glass-section section-about"
          aria-labelledby="about-heading"
        >
          <div className="container">
            {/* Top Hero Split: Studio Identity + Interactive 3D Glass Command Deck */}
            <div className="about-hero-grid">
              {/* Left Column: Who We Are & Client Value Proposition */}
              <div className="about-copy-column">
                <div className="glass-eyebrow-pill">
                  <span className="pulse-beacon" aria-hidden="true" />
                  <span>SECTION 01 OF 05 // ABOUT KAELITHOR</span>
                  <span className="eyebrow-sep" aria-hidden="true">
                    ·
                  </span>
                  <span>{currentThemeObj.shortLabel.toUpperCase()}</span>
                </div>

                <h1 id="about-heading" className="display-headline">
                  We engineer{" "}
                  <span className="text-gradient-accent">
                    99%+ accuracy AI models, executive BI command centers,
                  </span>{" "}
                  scalable web platforms, and iconic brands.
                </h1>

                <p className="about-lead">
                  <strong>Kaelithor</strong> is a senior 4-specialist software, AI, and
                  brand engineering studio built for ambitious{" "}
                  <strong>national and international clients</strong>. Instead of bloated
                  agency layers or disconnected freelancers, you work directly with our
                  four domain leads—uniting{" "}
                  <strong>
                    AI Data Analytics, RAG &amp; Power BI Dashboards (Ayan)
                  </strong>
                  ,{" "}
                  <strong>
                    Custom Model Training &amp; Accuracy Optimization (Arsalan)
                  </strong>
                  , <strong>Full-Stack Web &amp; Backend Systems (Hassan)</strong>, and{" "}
                  <strong>360° Brand &amp; Spatial Identity (Naveed)</strong> under one
                  glassmorphic execution roof.
                </p>

                {/* Who We Are / What We Offer Highlights in Frosted Glass */}
                <div className="about-mission-glass">
                  <div className="mission-col">
                    <span className="mission-kicker">WHO WE ARE</span>
                    <p className="mission-text">
                      A tightly integrated 4-founder technical &amp; creative collective
                      delivering Silicon Valley engineering rigor and enterprise visual
                      authority at rapid sprint velocity.
                    </p>
                  </div>
                  <div className="mission-divider" aria-hidden="true" />
                  <div className="mission-col">
                    <span className="mission-kicker">WHO WE SERVE</span>
                    <p className="mission-text">
                      Domestic market leaders and global enterprises (US, UK, EU, MENA)
                      seeking measurable ROI across AI automation, boardroom BI, web
                      platforms, and physical-to-digital branding.
                    </p>
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="about-cta-row">
                  <button
                    type="button"
                    onClick={() => scrollToSection("shipped-projects")}
                    className="btn-glass btn-glass-primary"
                  >
                    <span>Explore Our 7 Shipped Projects</span>
                    <span className="btn-arrow" aria-hidden="true">
                      ↓
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("capabilities-pipeline")}
                    className="btn-glass btn-glass-secondary"
                  >
                    <span>See How We Deliver</span>
                    <span className="btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive 3D Glassmorphic Studio Dossier Card */}
              <div className="about-3d-deck-wrap">
                <div
                  className="glass-command-card"
                  onMouseMove={handleHeroCardMove}
                  onMouseLeave={resetHeroCardTilt}
                >
                  <div className="glass-card-top-bar">
                    <div className="window-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="glass-card-code">
                      KAELITHOR // 4-PILLAR STUDIO MATRIX
                    </span>
                  </div>

                  {/* Interactive Specialist Selector Tabs */}
                  <div
                    className="glass-specialist-tabs"
                    role="tablist"
                    aria-label="Inspect Kaelithor's 4 core specialists"
                  >
                    {team.map((member) => {
                      const active = member.id === focusedMember;
                      return (
                        <button
                          key={member.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setFocusedMember(member.id)}
                          className={`glass-spec-tab ${active ? "active" : ""}`}
                        >
                          <span className="spec-tab-name">{member.name}</span>
                          <span className="spec-tab-role">
                            {member.pillarCode.split("·")[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Specialist Live Glass Panel */}
                  <div className="glass-specialist-body" role="tabpanel">
                    <div className="spec-profile-header">
                      <div className="spec-avatar-ring">
                        <Image
                          src={selectedMember.photo}
                          alt={selectedMember.name}
                          fill
                          sizes="96px"
                          priority
                          style={{
                            objectFit: "cover",
                            objectPosition: selectedMember.objectPosition,
                          }}
                        />
                      </div>
                      <div className="spec-profile-titles">
                        <span className="spec-pill-badge">{selectedMember.badge}</span>
                        <h2 className="spec-name">{selectedMember.name}</h2>
                        <p className="spec-role">{selectedMember.role}</p>
                      </div>
                    </div>

                    <p className="spec-bio">{selectedMember.bio}</p>

                    <div className="spec-offer-box">
                      <span className="spec-offer-kicker">
                        CLIENT DELIVERABLES LED BY {selectedMember.name.toUpperCase()}
                      </span>
                      <ul className="spec-offer-list">
                        {selectedMember.whatWeOffer.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="spec-footer-telemetry">
                      <div>
                        <span className="telem-label">{selectedMember.metricLabel}</span>
                        <strong className="telem-val">
                          {selectedMember.metricValue}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const catMap: Record<TeamMemberId, ProjectCategory> = {
                            ayan: "dashboard",
                            arsalan: "ml",
                            hassan: "all",
                            naveed: "graphics",
                          };
                          filterAndScrollToProjects(catMap[selectedMember.id]);
                        }}
                        className="spec-view-work-btn"
                      >
                        View {selectedMember.name}&apos;s Work ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Verified Agency Telemetry Stats Bar */}
            <div
              className="glass-stats-strip"
              role="region"
              aria-label="Verified studio metrics"
            >
              {aboutStats.map((stat) => (
                <div key={stat.label} className="glass-stat-tile">
                  <span className="stat-tile-value">{stat.value}</span>
                  <strong className="stat-tile-label">{stat.label}</strong>
                  <span className="stat-tile-detail">{stat.detail}</span>
                </div>
              ))}
            </div>

            {/* ============================================================== */}
            {/* WHAT WE BUILD & OFFER CLIENTS — 4 GLASSMORPHIC PILLARS GRID     */}
            {/* ============================================================== */}
            <div id="about-pillars-grid" className="about-pillars-block">
              <div className="subsection-header">
                <div>
                  <span className="subsection-eyebrow">
                    WHAT WE BUILD &amp; OFFER OUR CLIENTS
                  </span>
                  <h2 className="subsection-title">
                    Four specialized engineering &amp; creative practices under one roof.
                  </h2>
                </div>
                <p className="subsection-desc">
                  Whether you need a custom-trained deep learning model, an executive Power
                  BI &amp; RAG intelligence suite, a full-stack web platform, or a 360°
                  exhibition brand system, every Kaelithor engagement is engineered by a
                  dedicated domain lead.
                </p>
              </div>

              <div className="pillars-glass-bento">
                {team.map((member, index) => {
                  const categoryTarget: ProjectCategory =
                    member.id === "ayan"
                      ? "dashboard"
                      : member.id === "arsalan"
                        ? "ml"
                        : member.id === "naveed"
                          ? "graphics"
                          : "all";

                  return (
                    <article
                      key={member.id}
                      className="pillar-glass-card"
                      onMouseEnter={() => setFocusedMember(member.id)}
                    >
                      <div className="pillar-card-top">
                        <span className="pillar-num-tag">0{index + 1}</span>
                        <span className="pillar-lead-pill">
                          <span className="pillar-lead-dot" aria-hidden="true" />
                          {member.pillarCode}
                        </span>
                      </div>

                      <h3 className="pillar-card-title">{member.pillarTitle}</h3>
                      <p className="pillar-card-desc">{member.bio}</p>

                      <ul className="pillar-deliverables-list">
                        {member.whatWeOffer.map((offer) => (
                          <li key={offer}>{offer}</li>
                        ))}
                      </ul>

                      <div className="pillar-card-footer">
                        <div className="pillar-skill-tags">
                          {member.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="glass-micro-chip">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => filterAndScrollToProjects(categoryTarget)}
                          className="pillar-explore-link"
                        >
                          <span>
                            {member.id === "hassan"
                              ? "Explore Live Systems"
                              : `See ${member.name}'s Projects`}
                          </span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 02 OF 05: OUR SHIPPED PROJECTS & REAL PORTFOLIO          */}
        {/* ================================================================ */}
        <section
          id="shipped-projects"
          className="glass-section section-projects"
          aria-labelledby="projects-heading"
        >
          <div className="container">
            {/* Section 02 Header + Segmented Glass Category Filter Bar */}
            <div className="projects-section-header">
              <div className="projects-title-stack">
                <div className="glass-eyebrow-pill">
                  <span className="pulse-beacon" aria-hidden="true" />
                  <span>SECTION 02 OF 05 // SHIPPED CLIENT &amp; R&amp;D PORTFOLIO</span>
                </div>
                <h2 id="projects-heading" className="section-display-title">
                  Verified production deliverables across{" "}
                  <span className="text-gradient-accent">
                    Machine Learning, Executive BI &amp; Brand Systems.
                  </span>
                </h2>
                <p className="section-lead-copy">
                  Inspect our real shipped work below. Filter by engineering or creative
                  domain, or click any glass card to open the full-resolution visual and
                  architectural case study.
                </p>
              </div>

              {/* Segmented Glass Category Filter Track */}
              <div
                className="glass-filter-bar"
                role="tablist"
                aria-label="Filter projects by discipline"
              >
                {projectCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`glass-filter-tab ${isSelected ? "active" : ""}`}
                    >
                      <span className="filter-tab-label">{cat.label}</span>
                      <span className="filter-tab-count">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Glassmorphic Projects Bento Grid */}
            <div className="projects-glass-grid" role="region" aria-live="polite">
              {filteredProjects.map((project, idx) => {
                const isFeaturedWide = selectedCategory === "all" && idx === 0;
                return (
                  <article
                    key={project.id}
                    className={`project-glass-card ${isFeaturedWide ? "is-featured-wide" : ""}`}
                  >
                    {/* Visual Screenshot Frame with Glass Telemetry Overlay */}
                    <div
                      className="project-visual-frame"
                      onClick={() => setActiveModalProject(project)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect full case study for ${project.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveModalProject(project);
                        }
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes={
                          isFeaturedWide
                            ? "(min-width: 1080px) 66vw, 100vw"
                            : "(min-width: 1080px) 50vw, 100vw"
                        }
                        priority={idx < 2}
                        className="project-screenshot-img"
                      />
                      <div className="project-visual-gradient" aria-hidden="true" />

                      {/* Top Glass Badges over Image */}
                      <div className="project-visual-top-badges">
                        <span className="glass-badge-code">{project.code}</span>
                        <span className="glass-badge-category">
                          {project.categoryLabel}
                        </span>
                      </div>

                      {/* Bottom-Right Headline Metric Callout */}
                      <div className="project-headline-kpi">
                        <strong className="kpi-big-num">{project.headlineMetric}</strong>
                        <span className="kpi-sub-label">
                          {project.headlineMetricLabel}
                        </span>
                      </div>

                      <div className="project-zoom-hint" aria-hidden="true">
                        <span>Click to Inspect Full Resolution ↗</span>
                      </div>
                    </div>

                    {/* Glass Card Content Body */}
                    <div className="project-card-body">
                      <div className="project-sector-row">
                        <span className="project-sector-tag">{project.clientSector}</span>
                      </div>

                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-subtitle">{project.subtitle}</p>
                      <p className="project-card-summary">{project.summary}</p>

                      {/* 3-Column Glass Telemetry Metrics Strip */}
                      <div className="project-metrics-strip">
                        {project.metrics.map((m) => (
                          <div key={m.label} className="project-metric-cell">
                            <span className="pm-label">{m.label}</span>
                            <strong className="pm-value">{m.value}</strong>
                          </div>
                        ))}
                      </div>

                      {/* Key Deliverables Preview */}
                      <div className="project-tags-row">
                        {project.tags.map((tag) => (
                          <span key={tag} className="glass-micro-chip">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Lead Specialist Attribution + Inspect CTA */}
                      <div className="project-card-footer">
                        <div
                          className="project-lead-meta is-clickable-lead"
                          onClick={() => focusSpecialistAndScroll(project.leadId)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              focusSpecialistAndScroll(project.leadId);
                            }
                          }}
                          title={`Inspect ${project.leadName}'s Specialist Dossier in Section 04`}
                        >
                          <div className="project-lead-avatar">
                            <Image
                              src={project.leadPhoto}
                              alt={project.leadName}
                              fill
                              sizes="40px"
                              style={{ objectFit: "cover", objectPosition: "50% 25%" }}
                            />
                          </div>
                          <div>
                            <span className="lead-meta-name">
                              Led by {project.leadName} →
                            </span>
                            <span className="lead-meta-role">{project.leadRole}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveModalProject(project)}
                          className="btn-glass-inspect"
                        >
                          <span>Full Case Study</span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 03 OF 05: END-TO-END AI, BI, WEB & BRAND EXECUTION       */}
        {/* ================================================================ */}
        <section
          id="capabilities-pipeline"
          className="glass-section section-execution"
          aria-labelledby="execution-heading"
        >
          <div className="container">
            <div className="execution-header-row">
              <div className="projects-title-stack">
                <div className="glass-eyebrow-pill">
                  <span className="pulse-beacon" aria-hidden="true" />
                  <span>
                    SECTION 03 OF 05 // SYNCHRONIZED EXECUTION ARCHITECTURE
                  </span>
                </div>
                <h2 id="execution-heading" className="section-display-title">
                  How our four disciplines execute from{" "}
                  <span className="text-gradient-accent">
                    raw data to deployed production systems.
                  </span>
                </h2>
                <p className="section-lead-copy">
                  Select any execution stage below to inspect the live architectural
                  blueprint, input-to-output pipeline, and technical SLA engineered by
                  Ayan, Arsalan, Hassan, and Naveed.
                </p>
              </div>

              {/* 4-Stage Uiverse-Style Glass Stepper */}
              <div
                className="exec-stage-stepper"
                role="tablist"
                aria-label="Select execution stage"
              >
                {executionPipeline.map((stage, idx) => {
                  const isSelected = idx === activeExecIdx;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveExecIdx(idx)}
                      className={`exec-step-btn ${isSelected ? "active" : ""}`}
                    >
                      <span className="exec-step-num">STAGE {stage.stepNumber}</span>
                      <strong className="exec-step-lead">{stage.leadName}</strong>
                      <span className="exec-step-sla">{stage.slaBadge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive 2-Column Glass Execution Workbench */}
            <div className="exec-workbench-grid" role="tabpanel">
              {/* Left Column: Stage Dossier + Input/Process/Output Pipeline */}
              <div className="exec-dossier-card">
                <div className="exec-dossier-top">
                  <span className="glass-badge-code">{activeExecStage.code}</span>
                  <span className="exec-sla-pill">{activeExecStage.slaBadge}</span>
                </div>

                <h3 className="exec-stage-title">{activeExecStage.title}</h3>
                <p className="exec-stage-subtitle">{activeExecStage.subtitle}</p>
                <p className="exec-stage-summary">{activeExecStage.summary}</p>

                {/* 3-Node Input -> Engine -> Output Flow */}
                <div className="exec-io-flow">
                  <div className="exec-io-node">
                    <span className="io-node-kicker">01 // CLIENT INPUT</span>
                    <p>{activeExecStage.inputSpec}</p>
                  </div>
                  <div className="exec-io-node is-engine">
                    <span className="io-node-kicker">02 // KAELITHOR ENGINE</span>
                    <p>{activeExecStage.engineProcess}</p>
                  </div>
                  <div className="exec-io-node">
                    <span className="io-node-kicker">03 // PRODUCTION OUTPUT</span>
                    <p>{activeExecStage.clientOutput}</p>
                  </div>
                </div>

                {/* Capabilities Checklist */}
                <div className="exec-capabilities-box">
                  <span className="io-node-kicker">
                    CORE PRODUCTION CAPABILITIES ({activeExecStage.leadName.toUpperCase()})
                  </span>
                  <ul className="exec-capabilities-list">
                    {activeExecStage.capabilities.map((cap) => (
                      <li key={cap}>{cap}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-tags-row">
                  {activeExecStage.stackPills.map((pill) => (
                    <span key={pill} className="glass-micro-chip">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Code & Architecture Blueprint Terminal */}
              <div className="exec-terminal-card">
                <div className="glass-card-top-bar">
                  <div className="window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="glass-card-code">
                    {activeExecStage.architectureSnippetTitle}
                  </span>
                  <span className="terminal-lang-tag">
                    {activeExecStage.architectureSnippetLang}
                  </span>
                </div>

                <pre className="exec-code-pre">
                  <code>{activeExecStage.architectureSnippet}</code>
                </pre>

                {/* Specialist & Benchmark Readout inside Terminal */}
                <div className="exec-terminal-footer">
                  <div className="project-lead-meta">
                    <div className="project-lead-avatar">
                      <Image
                        src={activeExecStage.leadPhoto}
                        alt={activeExecStage.leadName}
                        fill
                        sizes="44px"
                        style={{ objectFit: "cover", objectPosition: "50% 25%" }}
                      />
                    </div>
                    <div>
                      <span className="lead-meta-name">
                        Stage Owner: {activeExecStage.leadName}
                      </span>
                      <span className="lead-meta-role">{activeExecStage.leadRole}</span>
                    </div>
                  </div>

                  <div className="exec-benchmark-callout">
                    <strong className="exec-bench-num">
                      {activeExecStage.primaryMetric}
                    </strong>
                    <span className="exec-bench-label">
                      {activeExecStage.primaryMetricLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Card Synchronized Pipeline Matrix Overview */}
            <div className="exec-overview-grid">
              {executionPipeline.map((stage, idx) => {
                const isCurrent = idx === activeExecIdx;
                return (
                  <article
                    key={stage.id}
                    className={`exec-mini-card ${isCurrent ? "is-active" : ""}`}
                    onClick={() => setActiveExecIdx(idx)}
                  >
                    <div className="exec-mini-head">
                      <span className="pillar-num-tag">{stage.stepNumber}</span>
                      <span className="exec-mini-metric">{stage.primaryMetric}</span>
                    </div>
                    <h4 className="exec-mini-title">{stage.title}</h4>
                    <p className="exec-mini-lead">
                      Led by <strong>{stage.leadName}</strong> · {stage.slaBadge}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 04 OF 05: THE 4 SENIOR SPECIALISTS (COMMAND ROSTER)      */}
        {/* ================================================================ */}
        <section
          id="senior-specialists"
          className="glass-section section-specialists"
          aria-labelledby="specialists-heading"
        >
          <div className="container">
            <div className="execution-header-row">
              <div>
                <div className="glass-eyebrow-pill">
                  <span className="pulse-beacon" aria-hidden="true" />
                  <span>SECTION 04 OF 05 // DIRECT-TO-BUILDER COMMAND ROSTER</span>
                  <span className="eyebrow-sep" aria-hidden="true">
                    ·
                  </span>
                  <span>ZERO JUNIOR HANDOFFS</span>
                </div>

                <h2 id="specialists-heading" className="section-headline">
                  Work directly with our{" "}
                  <span className="text-gradient-accent">
                    4 Senior Domain Leads
                  </span>{" "}
                  — from RAG &amp; 99.2% ML to Full-Stack Web &amp; 3D Brand.
                </h2>
              </div>

              <p className="execution-sublead">
                Every Kaelithor engagement is architected and shipped directly by{" "}
                <strong>Ayan (Founder · AI Analytics, RAG &amp; Power BI)</strong>,{" "}
                <strong>Arsalan (Principal AI &amp; ML Specialist)</strong>,{" "}
                <strong>Hassan (Full-Stack Web &amp; Cloud Architect)</strong>, and{" "}
                <strong>Naveed (Creative Director &amp; 3D Brand Lead)</strong>.
                Select any specialist node below to inspect their telemetry,
                shipped case studies, and execution stage.
              </p>
            </div>

            {/* Tier 1: Interactive Specialist Node Selector Bar */}
            <div
              className="specialist-node-tabs"
              role="tablist"
              aria-label="Select Kaelithor domain lead"
            >
              {team.map((member) => {
                const isSelected = member.id === selectedMember.id;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setFocusedMember(member.id)}
                    className={`specialist-node-tab ${
                      isSelected ? "is-active" : ""
                    }`}
                  >
                    <span className="node-tab-code">{member.nodeCode}</span>
                    <strong className="node-tab-name">{member.name}</strong>
                    <span className="node-tab-role">{member.shortRole}</span>
                  </button>
                );
              })}
            </div>

            {/* Tier 2: Active Specialist Master Telemetry Dossier Console */}
            <div className="specialist-spotlight-console">
              {/* Left Column: High-Res Editorial Portrait + Proficiency Telemetry */}
              <div className="spotlight-portrait-column">
                <div className="spotlight-portrait-frame">
                  <Image
                    src={selectedMember.photo}
                    alt={`${selectedMember.name} — ${selectedMember.role}`}
                    fill
                    sizes="(max-width: 960px) 100vw, 420px"
                    className="spotlight-portrait-img"
                    style={{
                      objectFit: "cover",
                      objectPosition: selectedMember.objectPosition,
                    }}
                  />
                  <div className="spotlight-portrait-overlay" />
                  <div className="spotlight-top-tags">
                    <span className="glass-badge-code">
                      {selectedMember.nodeCode}
                    </span>
                    <span className="glass-badge-category">
                      {selectedMember.sprintSla}
                    </span>
                  </div>
                  <div className="spotlight-bottom-kpi">
                    <span className="pm-label">{selectedMember.metricLabel}</span>
                    <strong className="kpi-big-num">
                      {selectedMember.metricValue}
                    </strong>
                  </div>
                </div>

                {/* 3 Domain Proficiency Telemetry Bars */}
                <div className="spotlight-telemetry-box">
                  <span className="mission-kicker">
                    VERIFIED SUBSYSTEM PROFICIENCY TELEMETRY
                  </span>
                  <div className="telemetry-bars-stack">
                    {selectedMember.proficiencyBars.map((bar) => (
                      <div key={bar.label} className="telemetry-bar-item">
                        <div className="telemetry-bar-meta">
                          <span>{bar.label}</span>
                          <strong>{bar.score}</strong>
                        </div>
                        <div className="telemetry-bar-track">
                          <div
                            className="telemetry-bar-fill"
                            style={{ width: `${bar.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Authority + Shipped Works + Pipeline Sync */}
              <div className="spotlight-dossier-column">
                <div className="spotlight-dossier-head">
                  <div>
                    <span className="pillar-badge-code">
                      {selectedMember.badge}
                    </span>
                    <h3 className="spotlight-member-name">
                      {selectedMember.name}{" "}
                      <span className="spotlight-role-inline">
                        — {selectedMember.role}
                      </span>
                    </h3>
                  </div>
                </div>

                <p className="spotlight-member-bio">{selectedMember.bio}</p>

                <div className="spotlight-synergy-banner">
                  <span className="io-node-tag">
                    CROSS-POD SYNERGY ROLE
                  </span>
                  <p>{selectedMember.synergyRole}</p>
                </div>

                <div className="exec-capabilities-box">
                  <span className="mission-kicker">
                    DIRECT CLIENT DELIVERABLES BY {selectedMember.name.toUpperCase()}
                  </span>
                  <ul className="exec-capabilities-list">
                    {selectedMember.whatWeOffer.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Verified Shipped Projects Cross-Linked to Lightbox Modal */}
                <div className="spotlight-shipped-links">
                  <span className="mission-kicker">
                    VERIFIED SHIPPED CASE STUDIES (CLICK TO INSPECT IN LIGHTBOX)
                  </span>
                  <div className="spotlight-project-pills">
                    {selectedMember.shippedProjectIds.map((pid) => {
                      const prj = projects.find((p) => p.id === pid);
                      if (!prj) return null;
                      return (
                        <button
                          key={prj.id}
                          type="button"
                          onClick={() => setActiveModalProject(prj)}
                          className="spotlight-project-pill"
                        >
                          <span className="pillar-num-tag">{prj.code}</span>
                          <span>{prj.title}</span>
                          <span className="cta-arrow-glyph" aria-hidden="true">
                            ↗
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Row: Sync with Execution Stage Terminal or Scope Directly */}
                <div className="about-cta-row">
                  <button
                    type="button"
                    onClick={() =>
                      scopeWithSpecialist(
                        selectedMember.id,
                        selectedMember.pillarTitle
                      )
                    }
                    className="btn-glass btn-glass-primary"
                  >
                    <span>
                      Scope Project with {selectedMember.name} ↓
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      inspectStageForSpecialist(selectedMember.execStageIndex)
                    }
                    className="btn-glass btn-glass-secondary"
                  >
                    <span>
                      Stage 0{selectedMember.execStageIndex + 1} Execution Terminal ↑
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tier 3: 4-Column All-Specialists Tactical Roster Grid */}
            <div className="specialists-4-grid">
              {team.map((member) => {
                const isCurrent = member.id === selectedMember.id;
                return (
                  <article
                    key={member.id}
                    className={`specialist-roster-card ${
                      isCurrent ? "is-focused" : ""
                    }`}
                    onClick={() => setFocusedMember(member.id)}
                  >
                    <div className="roster-card-top">
                      <span className="pillar-num-tag">{member.nodeCode}</span>
                      <span className="exec-step-sla">{member.sprintSla}</span>
                    </div>

                    <div className="roster-identity-row">
                      <div className="roster-avatar-wrap">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          sizes="64px"
                          style={{
                            objectFit: "cover",
                            objectPosition: member.objectPosition,
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="roster-name">{member.name}</h4>
                        <span className="roster-role">{member.shortRole}</span>
                      </div>
                    </div>

                    <div className="roster-kpi-proof">
                      <span className="pm-label">{member.metricLabel}</span>
                      <strong className="pm-value">{member.metricValue}</strong>
                    </div>

                    <p className="roster-synergy-text">{member.synergyRole}</p>

                    <div className="project-tags-row">
                      {member.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="glass-micro-chip">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="roster-card-footer">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          scopeWithSpecialist(member.id, member.pillarTitle);
                        }}
                        className="pillar-action-link"
                      >
                        Scope with {member.name} ↓
                      </button>
                      <span className="roster-focus-indicator">
                        {isCurrent ? "● Active Dossier" : "Inspect Lead →"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 05 — INITIATE PROJECT (WHATSAPP & GMAIL COMMAND PORTAL)  */}
        {/* ================================================================ */}
        <section
          id="initiate-project"
          className="glass-section section-contact"
        >
          <div className="glass-container">
            {/* Section 05 Header */}
            <div className="section-index-bar">
              <span className="section-index-pill">SECTION 05 / 05</span>
              <span className="section-index-divider" />
              <span className="section-index-label">
                INITIATE PROJECT — DIRECT WHATSAPP &amp; GMAIL EXECUTIVE PORTAL
              </span>
            </div>

            <div className="projects-header-grid">
              <div>
                <h2 className="projects-display-title">
                  Direct Senior Engineering Access.{" "}
                  <span className="hero-gradient-span">
                    Zero Account Managers.
                  </span>
                </h2>
                <p className="projects-subtitle">
                  Connect directly with Kaelithor&apos;s founding specialists via{" "}
                  <strong>WhatsApp ({site.whatsappDisplay})</strong> or{" "}
                  <strong>Official Gmail ({site.email})</strong>. Configure your
                  technical scope below to launch a pre-formatted project brief
                  in one click.
                </p>
              </div>

              <div className="contact-sla-pill-box">
                <span className="status-dot-pulse" aria-hidden="true" />
                <div>
                  <strong className="contact-sla-title">
                    {site.hours}
                  </strong>
                  <span className="contact-sla-sub">
                    Direct response from Ayan, Arsalan, Hassan &amp; Naveed
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Executive Contact & Brief Dispatch Workbench */}
            <div className="contact-workbench-grid">
              {/* Left Column: Direct Channels (WhatsApp + Gmail) + Lead Router + 6-Logo Emblem Switcher */}
              <div className="contact-channels-column">
                {/* Channel 01: Official WhatsApp Direct Line */}
                <div className="contact-channel-card is-whatsapp">
                  <div className="channel-card-top">
                    <span className="channel-badge-pill whatsapp-pill">
                      <span className="status-dot-pulse" aria-hidden="true" />
                      INSTANT WHATSAPP DISPATCH
                    </span>
                    <span className="channel-sla-tag">Fastest Response (&lt; 15 min)</span>
                  </div>

                  <div className="channel-identity-row">
                    <div className="channel-icon-orb whatsapp-orb" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="pm-label">OFFICIAL WHATSAPP HOTLINE</span>
                      <a
                        href={whatsappDispatchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="channel-value-link"
                      >
                        {site.whatsappDisplay}
                      </a>
                    </div>
                  </div>

                  <p className="channel-desc">
                    Opens a direct WhatsApp thread with Kaelithor&apos;s founding
                    team pre-loaded with your selected domain, specialist lead,
                    and project brief.
                  </p>

                  <div className="channel-actions-row">
                    <a
                      href={whatsappDispatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glass btn-glass-primary"
                    >
                      <span>Chat on WhatsApp ({site.whatsappDisplay}) ↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(site.whatsappDisplay, "whatsapp")
                      }
                      className="btn-glass btn-glass-secondary"
                    >
                      <span>
                        {copiedChannel === "whatsapp"
                          ? "✓ Number Copied"
                          : "Copy Number"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Channel 02: Official Agency Gmail Account */}
                <div className="contact-channel-card is-gmail">
                  <div className="channel-card-top">
                    <span className="channel-badge-pill gmail-pill">
                      OFFICIAL AGENCY GMAIL
                    </span>
                    <span className="channel-sla-tag">Verified Executive Desk</span>
                  </div>

                  <div className="channel-identity-row">
                    <div className="channel-logo-avatar">
                      <Image
                        src={activeLogoSrc}
                        alt="Kaelithor Agency Gmail Avatar"
                        width={52}
                        height={52}
                        className="channel-avatar-img"
                      />
                    </div>
                    <div>
                      <span className="pm-label">EXECUTIVE CLIENT &amp; RECRUITER INBOX</span>
                      <a
                        href={gmailDispatchUrl}
                        className="channel-value-link"
                      >
                        {site.email}
                      </a>
                    </div>
                  </div>

                  <p className="channel-desc">
                    Ideal for RFP documents, architecture specs, NDA
                    onboarding, and international enterprise retainers.
                  </p>

                  <div className="channel-actions-row">
                    <a
                      href={gmailDispatchUrl}
                      className="btn-glass btn-glass-primary"
                    >
                      <span>Send Email to {site.email} ↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(site.email, "email")}
                      className="btn-glass btn-glass-secondary"
                    >
                      <span>
                        {copiedChannel === "email"
                          ? "✓ Email Copied"
                          : "Copy Email"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* FAQ — how engagements work (intentionally no public pricing) */}
                <div className="contact-faq-card">
                  <span className="mission-kicker">HOW WE WORK</span>
                  <h3 className="contact-faq-title">Common questions</h3>
                  <div className="contact-faq-list">
                    {faqItems.map((item, idx) => (
                      <details key={item.q} className="contact-faq-item" open={idx === 0}>
                        <summary>{item.q}</summary>
                        <p>{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Uiverse-inspired (ClawHack1) Glass Contact Form */}
              <div className="contact-form">
                <span className="heading">Start Your Project</span>
                <p className="contact-form-sub">
                  Tell us about the problem you want solved. Your message goes
                  straight to our inbox ({site.email}) and a specialist replies
                  within 24 hours.
                </p>

                <form onSubmit={handleContactSubmit}>
                  {/* Honeypot field for spam bots (hidden from people) */}
                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    className="contact-form-honeypot"
                    aria-hidden="true"
                  />
                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label htmlFor="brief-client-name">Name</label>
                      <input
                        id="brief-client-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={briefName}
                        onChange={(e) => setBriefName(e.target.value)}
                        placeholder="Your name or company"
                        required
                      />
                    </div>

                    <div className="contact-form-field">
                      <label htmlFor="brief-client-email">Email</label>
                      <span id="brief-email-hint" className="contact-form-hint">
                        Format: name@company.com
                      </span>
                      <input
                        id="brief-client-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={briefEmail}
                        onChange={(e) => setBriefEmail(e.target.value)}
                        placeholder="name@company.com"
                        aria-describedby="brief-email-hint"
                        aria-errormessage="brief-email-error"
                        required
                      />
                      <span
                        id="brief-email-error"
                        className="field-error-msg"
                        aria-live="polite"
                      >
                        Please enter a valid email (e.g., name@company.com).
                      </span>
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label htmlFor="brief-domain">Service</label>
                      <select
                        id="brief-domain"
                        value={briefDomain}
                        onChange={(e) => {
                          const value = e.target.value;
                          setBriefDomain(value);
                          const owner = team.find((m) => m.pillarTitle === value);
                          if (owner) setBriefLeadId(owner.id);
                        }}
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="contact-form-field">
                      <label htmlFor="brief-lead">Specialist</label>
                      <select
                        id="brief-lead"
                        value={briefLeadId}
                        onChange={(e) =>
                          setBriefLeadId(e.target.value as TeamMemberId)
                        }
                      >
                        {team.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} — {member.shortRole}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="contact-form-field">
                    <label htmlFor="brief-timeline">Timeline</label>
                    <select
                      id="brief-timeline"
                      value={briefTimeline}
                      onChange={(e) => setBriefTimeline(e.target.value)}
                    >
                      {timelineOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-form-field">
                    <label htmlFor="brief-project-details">Message</label>
                    <textarea
                      id="brief-project-details"
                      name="message"
                      value={briefDetails}
                      onChange={(e) => setBriefDetails(e.target.value)}
                      placeholder="Goals, datasets, KPIs, or anything we should know…"
                    />
                  </div>

                  <button type="submit" disabled={formStatus === "sending"}>
                    {formStatus === "sending" ? "Sending…" : "Send Message"}
                  </button>

                  <div className="contact-form-status" role="status" aria-live="polite">
                    {formStatus === "sent" && (
                      <p className="is-success">
                        ✓ Thanks{briefName.trim() ? `, ${briefName.trim().split(" ")[0]}` : ""}!
                        Your message has been delivered. We&apos;ll reply to{" "}
                        {briefEmail.trim() || "your email"} within 24 hours.
                      </p>
                    )}
                    {formStatus === "activation" && (
                      <p className="is-info">
                        Almost ready — the inbox owner needs to confirm the one-time
                        activation email. Meanwhile, reach us on{" "}
                        <a href={whatsappDispatchUrl} target="_blank" rel="noopener noreferrer">
                          WhatsApp
                        </a>
                        .
                      </p>
                    )}
                    {formStatus === "error" && (
                      <p className="is-error">
                        Couldn&apos;t send right now.{" "}
                        <a href={gmailDispatchUrl}>Email us directly</a> or{" "}
                        <a href={whatsappDispatchUrl} target="_blank" rel="noopener noreferrer">
                          message us on WhatsApp
                        </a>
                        .
                      </p>
                    )}
                  </div>

                  <div className="contact-form-alt">
                    <a href={whatsappDispatchUrl} target="_blank" rel="noopener noreferrer">
                      Prefer chat? Send this on WhatsApp ↗
                    </a>
                    <button
                      type="button"
                      className="contact-form-copy"
                      onClick={() => handleCopyText(formattedBriefText, "brief")}
                    >
                      {copiedChannel === "brief" ? "✓ Brief copied" : "Copy brief"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Direct channels — adapted from Uiverse.io (david-mohseni) social tooltip icons */}
            <div className="contact-social-strip">
              <p className="contact-social-label">Or reach us directly</p>
              <ul className="social-icon-wrapper">
                <li className="social-icon gmail">
                  <a
                    href={`mailto:${site.email}`}
                    aria-label={`Email Kaelithor at ${site.email}`}
                  >
                    <span className="social-tooltip">{site.email}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.4 2L12 11.2 4.4 6h15.2ZM4 18V7.3l7.4 5.1a1 1 0 0 0 1.2 0L20 7.3V18H4Z"
                      />
                    </svg>
                    <span className="social-name">Gmail</span>
                  </a>
                </li>
                <li className="social-icon whatsapp">
                  <a
                    href={`https://wa.me/${site.whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chat with Kaelithor on WhatsApp at ${site.whatsappDisplay}`}
                  >
                    <span className="social-tooltip">{site.whatsappDisplay}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6Zm0-21.6A11.8 11.8 0 0 0 1.9 18l-1.7 6 6.2-1.6A11.8 11.8 0 1 0 12 .2Z"
                      />
                    </svg>
                    <span className="social-name">WhatsApp</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================ */}
      {/* EXECUTIVE GLASSMORPHIC FOOTER                                    */}
      {/* ================================================================ */}
      <footer className="kaelithor-glass-footer">
        <div className="glass-container">
          <div className="footer-glass-deck">
            <div className="footer-brand-col">
              <div className="footer-brand-lockup">
                <span className="kaelithor-prism-jewel" aria-hidden="true">
                  <Image
                    src={activeLogoSrc}
                    alt="Kaelithor Logo"
                    width={40}
                    height={40}
                    className="kaelithor-brand-avatar-img"
                  />
                </span>
                <div>
                  <strong className="footer-brand-name">
                    {site.name}
                  </strong>
                  <span className="footer-brand-tagline">{site.title}</span>
                </div>
              </div>
              <p className="footer-brand-copy">
                Principal-led AI, Machine Learning, Executive BI, Full-Stack
                Web, and 360° Spatial Brand Engineering Studio.
              </p>
            </div>

            <div className="footer-links-col">
              <span className="pm-label">NAVIGATE</span>
              <div className="footer-nav-pills">
                {masterSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className="footer-nav-link"
                  >
                    {sec.number}. {sec.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            <div className="footer-direct-col">
              <span className="pm-label">CONTACT</span>
              <a
                href={`https://wa.me/${site.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-pill"
              >
                <span>WhatsApp: {site.whatsappDisplay}</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${site.email}`} className="footer-contact-pill">
                <span>Gmail: {site.email}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* FLOATING GLASS WHATSAPP QUICK-DISPATCH PILL                      */}
      {/* ================================================================ */}
      <div className="floating-whatsapp-dock">
        <a
          href={whatsappDispatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp-pill"
          aria-label={`Chat with Kaelithor on WhatsApp (${site.whatsappDisplay})`}
        >
          <span className="floating-wa-dot" aria-hidden="true" />
          <span className="floating-wa-label">
            WhatsApp Kaelithor · <strong>{site.whatsappDisplay}</strong>
          </span>
        </a>
      </div>

      {/* ================================================================ */}
      {/* 2-TIER GLASSMORPHIC CASE-STUDY LIGHTBOX MODAL                    */}
      {/* ================================================================ */}
      {activeModalProject && (
        <div
          className="glass-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="glass-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="glass-modal-header">
              <div className="modal-header-meta">
                <span className="glass-badge-code">{activeModalProject.code}</span>
                <span className="glass-badge-category">
                  {activeModalProject.categoryLabel}
                </span>
                <span className="modal-sector-pill">{activeModalProject.clientSector}</span>
              </div>

              <div className="modal-header-actions">
                <button
                  type="button"
                  onClick={() => handleModalStep(-1)}
                  className="modal-nav-btn"
                  aria-label="Previous project"
                  title="Previous Project (←)"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => handleModalStep(1)}
                  className="modal-nav-btn"
                  aria-label="Next project"
                  title="Next Project (→)"
                >
                  Next →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="modal-close-btn"
                  aria-label="Close case study modal"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body: Full-Res Visual + ROI Case Study Breakdown */}
            <div className="glass-modal-content">
              <div className="modal-visual-showcase">
                <div className="modal-image-container">
                  <Image
                    src={activeModalProject.image}
                    alt={activeModalProject.title}
                    width={activeModalProject.imageWidth}
                    height={activeModalProject.imageHeight}
                    className="modal-full-image"
                    priority
                  />
                </div>

                {/* Metrics Strip Beneath Image */}
                <div className="modal-metrics-row">
                  {activeModalProject.metrics.map((m) => (
                    <div key={m.label} className="modal-metric-box">
                      <span className="pm-label">{m.label}</span>
                      <strong className="pm-value">{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-dossier-column">
                <h2 id="modal-project-title" className="modal-title">
                  {activeModalProject.title}
                </h2>
                <p className="modal-subtitle">{activeModalProject.subtitle}</p>

                {/* Lead Specialist Card */}
                <div className="modal-lead-banner">
                  <div className="project-lead-avatar">
                    <Image
                      src={activeModalProject.leadPhoto}
                      alt={activeModalProject.leadName}
                      fill
                      sizes="44px"
                      style={{ objectFit: "cover", objectPosition: "50% 25%" }}
                    />
                  </div>
                  <div>
                    <span className="lead-meta-name">
                      Architected &amp; Led by {activeModalProject.leadName}
                    </span>
                    <span className="lead-meta-role">{activeModalProject.leadRole}</span>
                  </div>
                </div>

                {/* 3-Step ROI Narrative: Challenge -> Solution -> Outcome */}
                <div className="modal-roi-stack">
                  <div className="modal-roi-block">
                    <span className="roi-step-kicker">01 // THE CLIENT BOTTLENECK</span>
                    <p>{activeModalProject.challenge}</p>
                  </div>
                  <div className="modal-roi-block">
                    <span className="roi-step-kicker">02 // KAELITHOR ARCHITECTURE</span>
                    <p>{activeModalProject.solution}</p>
                  </div>
                  <div className="modal-roi-block">
                    <span className="roi-step-kicker">03 // QUANTIFIED OUTCOME</span>
                    <p>{activeModalProject.outcome}</p>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="modal-deliverables-box">
                  <span className="roi-step-kicker">VERIFIED PRODUCTION DELIVERABLES</span>
                  <ul className="modal-deliverables-list">
                    {activeModalProject.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-tags-row">
                  {activeModalProject.tags.map((tag) => (
                    <span key={tag} className="glass-micro-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
