/**
 * Single source of truth for Kaelithor — 5-Section Glassmorphic Agency Architecture.
 * Phase 1 Live Build:
 *   - Section 01: About Kaelithor (Who We Are, What We Build & Our 4 Core Pillars)
 *   - Section 02: Shipped Projects Showcase (7 Real Projects across ML, Dashboards & Graphics)
 * Phase 2 Planned:
 *   - Section 03: Capabilities & End-to-End AI Execution Pipeline
 *   - Section 04: The 4 Senior Specialists (Direct-to-Builder Squad)
 *   - Section 05: Direct Client Initiation & Contact Portal
 */

export type ThemeId = "titanium-atelier" | "aurum-quant";

export type FontPresetId =
  | "urbanist-martian"
  | "barlow-plex"
  | "zilla-victor"
  | "recursive-fira";

export interface FontPresetSpec {
  id: FontPresetId;
  code: string;
  name: string;
  displayFont: string;
  sansFont: string;
  monoFont: string;
  awesomeFontsSource: string;
  character: string;
}

export const fontPresets: FontPresetSpec[] = [
  {
    id: "barlow-plex",
    code: "TYPE 01",
    name: "Barlow × IBM Plex",
    displayFont: "Barlow (Superfamily Grotesk)",
    sansFont: "Public Sans (USWDS)",
    monoFont: "IBM Plex Mono (IBM)",
    awesomeFontsSource: "jpt/barlow · uswds/public-sans · IBM/plex",
    character: "Aerospace Californian grotesk paired with institutional USWDS & IBM engineering type",
  },
  {
    id: "urbanist-martian",
    code: "TYPE 02",
    name: "Urbanist × Martian Mono",
    displayFont: "Urbanist (Variable Geometric)",
    sansFont: "Inter (UI Grotesk)",
    monoFont: "Martian Mono (Evil Martians)",
    awesomeFontsSource: "coreyhu/Urbanist · rsms/inter · evilmartians/mono",
    character: "High-precision geometric AI headlines with brutalist Evil Martians telemetry",
  },
  {
    id: "zilla-victor",
    code: "TYPE 03",
    name: "Zilla Slab × Victor Mono",
    displayFont: "Zilla Slab (Mozilla Editorial)",
    sansFont: "Work Sans (Grotesque)",
    monoFont: "Victor Mono (Cursive Ligatures)",
    awesomeFontsSource: "mozilla/zilla-slab · Work-Sans · Victor Mono",
    character: "Sovereign editorial slab authority with semi-connected cursive code ligatures",
  },
  {
    id: "recursive-fira",
    code: "TYPE 04",
    name: "Recursive × Fira Code",
    displayFont: "Recursive (Parametric CASL/MONO)",
    sansFont: "Libre Franklin (Benton Classic)",
    monoFont: "Fira Code (Programming Ligatures)",
    awesomeFontsSource: "Recursive Sans & Mono · impallari/Libre-Franklin · FiraCode",
    character: "Variable parametric display typography with native developer operator ligatures",
  },
];

export interface ThemeSpec {
  id: ThemeId;
  code: string;
  name: string;
  shortLabel: string;
  tagline: string;
  vibe: string;
  accentHex: string;
  secondaryHex: string;
  bgPreview: string;
  geometryLabel: string;
  defaultFontId: FontPresetId;
}

export const themes: ThemeSpec[] = [
  {
    id: "titanium-atelier",
    code: "THEME 01",
    name: "Titanium Atelier",
    shortLabel: "Orange & White Glass",
    tagline: "Daylight frosted quartz, brushed titanium & aerospace orange",
    vibe: "Daylight Spatial Glass",
    accentHex: "#ff4f00",
    secondaryHex: "#1d4ed8",
    bgPreview: "#f3f4f7",
    geometryLabel: "3D Geodesic Spatial Lattice",
    defaultFontId: "barlow-plex",
  },
  {
    id: "aurum-quant",
    code: "THEME 02",
    name: "Aurum Quantum",
    shortLabel: "Sovereign Gold Dark",
    tagline: "Sovereign onyx glass, liquid champagne gold & warm tungsten",
    vibe: "Sovereign Gold Glass",
    accentHex: "#e5b869",
    secondaryHex: "#f59e0b",
    bgPreview: "#080706",
    geometryLabel: "3D Quantum Astrolabe",
    defaultFontId: "zilla-victor",
  },
];

export const site = {
  name: "Kaelithor",
  url: "https://kaelithor.com",
  email: "kaelithor.agency@gmail.com",
  whatsappDisplay: "+92-283458038",
  whatsappDigits: "92283458038",
  location: "Pakistan · Serving Domestic & International Enterprises",
  hours: "Mon–Sat, 10:00–22:00 PKT (UTC+5) · Global Async Coverage",
  title: "Kaelithor — AI Analytics, Custom ML, Web Engineering & Brand Studio",
  description:
    "Kaelithor is a senior 4-specialist software & AI studio. We engineer 99%+ accuracy machine learning models, Power BI & RAG executive dashboards, scalable full-stack web platforms, and commanding brand identities.",
} as const;

export interface BrandLogoOption {
  id: string;
  code: string;
  name: string;
  src: string;
}

export const brandLogos: BrandLogoOption[] = [
  {
    id: "logo-01",
    code: "LOGO 01",
    name: "Titanium & Orange Prism",
    src: "/brand/kaelithor-logo-01-titanium-orange-prism.webp",
  },
  {
    id: "logo-02",
    code: "LOGO 02",
    name: "Obsidian & Orange Core",
    src: "/brand/kaelithor-logo-02-obsidian-orange-core.webp",
  },
  {
    id: "logo-03",
    code: "LOGO 03",
    name: "Minimal Vector Crest",
    src: "/brand/kaelithor-logo-03-minimal-vector-crest.webp",
  },
  {
    id: "logo-04",
    code: "LOGO 04",
    name: "Sovereign Gold Monogram",
    src: "/brand/kaelithor-logo-04-sovereign-gold-monogram.webp",
  },
  {
    id: "logo-05",
    code: "LOGO 05",
    name: "Liquid Glass Ribbon",
    src: "/brand/kaelithor-logo-05-liquid-glass-ribbon.webp",
  },
  {
    id: "logo-06",
    code: "LOGO 06",
    name: "AI Neural Nexus Emblem",
    src: "/brand/kaelithor-logo-06-neural-nexus-emblem.webp",
  },
];

export interface MasterSectionSpec {
  number: string;
  id: string;
  label: string;
  shortTitle: string;
  phase: "phase-1" | "phase-2";
  summary: string;
}

export const masterSections: MasterSectionSpec[] = [
  {
    number: "01",
    id: "about-kaelithor",
    label: "01. About & What We Build",
    shortTitle: "About",
    phase: "phase-1",
    summary:
      "Who we are, our 4-discipline glassmorphic architecture, and what we deliver to national & global clients.",
  },
  {
    number: "02",
    id: "shipped-projects",
    label: "02. Shipped Projects",
    shortTitle: "Projects",
    phase: "phase-1",
    summary:
      "7 verified production deliverables across Machine Learning, Executive BI Dashboards, and Brand & Spatial Design.",
  },
  {
    number: "03",
    id: "capabilities-pipeline",
    label: "03. AI & Web Execution",
    shortTitle: "Execution",
    phase: "phase-1",
    summary:
      "Interactive 4-stage execution pipeline: RAG & Power BI telemetry, 99.2% ML training, Next.js/FastAPI cloud backends, and 360° brand systems.",
  },
  {
    number: "04",
    id: "senior-specialists",
    label: "04. The 4 Specialists",
    shortTitle: "Team",
    phase: "phase-1",
    summary:
      "Direct access to Ayan (Founder/BI/RAG), Arsalan (AI/ML), Hassan (Full-Stack Web), and Naveed (Creative Director).",
  },
  {
    number: "05",
    id: "initiate-project",
    label: "05. Contact & WhatsApp",
    shortTitle: "Contact",
    phase: "phase-1",
    summary:
      "Direct project initiation via WhatsApp (+92-283458038) and official Gmail (kaelithor.agency@gmail.com) with pre-filled scope builder.",
  },
];

export type TeamMemberId = "ayan" | "arsalan" | "hassan" | "naveed";

export interface TeamProficiencyBar {
  label: string;
  score: string;
  percent: number;
}

export interface TeamMember {
  id: TeamMemberId;
  name: string;
  role: string;
  shortRole: string;
  badge: string;
  nodeCode: string;
  sprintSla: string;
  synergyRole: string;
  pillarTitle: string;
  pillarCode: string;
  bio: string;
  whatWeOffer: string[];
  skills: string[];
  proficiencyBars: TeamProficiencyBar[];
  shippedProjectIds: string[];
  execStageIndex: number;
  metricLabel: string;
  metricValue: string;
  photo: string;
  objectPosition: string;
}

export const team: TeamMember[] = [
  {
    id: "ayan",
    name: "Ayan",
    role: "Founder · AI Data Analyst, RAG & Power BI Dashboard Expert",
    shortRole: "Founder · AI Analytics, RAG & Power BI",
    badge: "PILLAR 01 // DATA, RAG & BI",
    nodeCode: "SYS_01 // FOUNDER & BI LEAD",
    sprintSla: "7–10 Day BI & RAG Sprint",
    synergyRole: "Architects RAG data intelligence, DAX financial models & C-suite KPI telemetry",
    pillarTitle: "AI Data Analytics, RAG Pipelines & Executive Power BI Dashboards",
    pillarCode: "AYAN · FOUNDER",
    bio: "Leads Kaelithor's client strategy, RAG intelligence systems, and executive business intelligence. Transforms raw operational and financial datasets into interactive Power BI command centers, automated KPI telemetry, and high-converting React/Next.js interfaces.",
    whatWeOffer: [
      "Executive C-Suite & P&L Power BI Command Centers",
      "Retrieval-Augmented Generation (RAG) over Private Enterprise Data",
      "Geospatial Sales Telemetry, eNPS & Inventory Analytics",
      "Interactive Next.js / React Data Applications",
    ],
    skills: [
      "AI Data Analytics",
      "RAG Pipelines",
      "Power BI Expert",
      "Executive Dashboards",
      "React / Next.js",
    ],
    proficiencyBars: [
      { label: "RAG & Agentic Data Pipelines", score: "99%", percent: 99 },
      { label: "Power BI & Executive DAX Modeling", score: "98%", percent: 98 },
      { label: "SQL Warehousing & React Telemetry", score: "96%", percent: 96 },
    ],
    shippedProjectIds: ["prj-dashboard-overview", "prj-dashboard-analytics"],
    execStageIndex: 0,
    metricLabel: "BI & Financial Scope",
    metricValue: "$3.28M+ P&L & 769M Sales Modeled",
    photo: "/team/ayan.webp",
    objectPosition: "50% 28%",
  },
  {
    id: "arsalan",
    name: "Arsalan",
    role: "Principal AI & Machine Learning Specialist",
    shortRole: "Principal AI & ML Engineer",
    badge: "PILLAR 02 // CUSTOM ML & ACCURACY",
    nodeCode: "SYS_02 // PRINCIPAL ML LEAD",
    sprintSla: "10–14 Day Model Optimization",
    synergyRole: "Trains custom PyTorch/vision models & pushes validation accuracy past 99.2%",
    pillarTitle: "Custom Model Training, Accuracy Optimization & Vision Pipelines",
    pillarCode: "ARSALAN · AI/ML LEAD",
    bio: "Engineers custom deep learning pipelines, curates high-signal multimodal and temporal video datasets, and fine-tunes neural architectures to eliminate overfitting and push production validation accuracy past 99%.",
    whatWeOffer: [
      "Model Accuracy Optimization & Overfitting Elimination (99%+ Val Accuracy)",
      "Custom Deep Learning Training, Confusion Matrix Diagnostics & Loss Tuning",
      "Temporal Video Action Segmentation & Computer Vision Dataset Curation",
      "Low-Latency Model Quantization (4ms/step Inference)",
    ],
    skills: [
      "Model Accuracy Tuning",
      "Dataset Curation",
      "Video Segmentation",
      "Deep Learning / PyTorch",
      "Confusion Matrix QA",
    ],
    proficiencyBars: [
      { label: "Deep Learning & Accuracy Tuning", score: "99.2%", percent: 99 },
      { label: "Temporal Video & Vision Datasets", score: "97%", percent: 97 },
      { label: "ONNX/TensorRT 4ms Inference QA", score: "96%", percent: 96 },
    ],
    shippedProjectIds: ["prj-ml-accuracy", "prj-ml-segmentation"],
    execStageIndex: 1,
    metricLabel: "Validated Model Peak",
    metricValue: "99.2% Accuracy · 4ms/step",
    photo: "/team/arsalan.webp",
    objectPosition: "50% 25%",
  },
  {
    id: "hassan",
    name: "Hassan",
    role: "Lead Full-Stack Web & Backend Architect",
    shortRole: "Lead Full-Stack & Backend Architect",
    badge: "PILLAR 03 // FULL-STACK WEB & API",
    nodeCode: "SYS_03 // CLOUD & WEB LEAD",
    sprintSla: "14-Day Full-Stack Production",
    synergyRole: "Wraps AI models & BI engines inside <40ms Next.js 15, FastAPI & PostgreSQL platforms",
    pillarTitle: "Scalable Web Platforms, Resilient Backends & Cloud Infrastructure",
    pillarCode: "HASSAN · WEB LEAD",
    bio: "Architects the production software backbone that turns AI models and dashboards into live client products—engineering fast Next.js frontends, secure Node.js/FastAPI backends, PostgreSQL schemas, and cloud deployments.",
    whatWeOffer: [
      "High-Craft Glassmorphic Web Platforms & SaaS Portals (Next.js / React)",
      "Scalable REST & GraphQL Backend APIs (Node.js, FastAPI, PostgreSQL)",
      "Authentication, Role-Based Access, Payment Rails & WebSockets",
      "Docker Containerization, CI/CD & Edge Cloud Deployment",
    ],
    skills: [
      "Full-Stack Web Apps",
      "Node.js & FastAPI",
      "PostgreSQL & Redis",
      "System Architecture",
      "Docker & Cloud",
    ],
    proficiencyBars: [
      { label: "Next.js 15 / React 19 Spatial Web", score: "99%", percent: 99 },
      { label: "FastAPI / Node.js & PostgreSQL", score: "98%", percent: 98 },
      { label: "Docker, Redis & Cloud Edge Infra", score: "96%", percent: 96 },
    ],
    shippedProjectIds: ["prj-ml-accuracy", "prj-dashboard-overview"],
    execStageIndex: 2,
    metricLabel: "Production SLA",
    metricValue: "< 40ms API P95 Latency",
    photo: "/team/hassan.webp",
    objectPosition: "45% 18%",
  },
  {
    id: "naveed",
    name: "Naveed",
    role: "Creative Director & Brand Identity Designer",
    shortRole: "Creative Director & Brand Architect",
    badge: "PILLAR 04 // BRAND & SPATIAL DESIGN",
    nodeCode: "SYS_04 // CREATIVE DIRECTOR",
    sprintSla: "7-Day Brand & 3D Expo Sprint",
    synergyRole: "Forges 360° brand systems, 3D exhibition architecture & luxury print authority",
    pillarTitle: "Iconic Brand Identities, 3D Exhibition Systems & Print Craft",
    pillarCode: "NAVEED · DESIGN LEAD",
    bio: "Forges visual authority across digital and physical touchpoints—from bespoke corporate logos and luxury print stationery to full-scale 3D trade show exhibition booths and outdoor brand activation kits.",
    whatWeOffer: [
      "360° Enterprise Trade Show Booths & Exhibition Architecture",
      "3D Outdoor Event Canopies, Feather Flags & Merchandising Mockups",
      "Bespoke Logo Marks, Typography & Complete Brand Identity Systems",
      "Luxury Executive Business Cards & Print-Ready Packaging Specs",
    ],
    skills: [
      "Brand Identity",
      "3D Expo & Tent Design",
      "Logo Architecture",
      "Print & Packaging",
      "UI Visual Systems",
    ],
    proficiencyBars: [
      { label: "360° Brand Systems & Logo Craft", score: "99%", percent: 99 },
      { label: "3D Trade Show Booth & Canopy CAD", score: "98%", percent: 98 },
      { label: "300 DPI CMYK Print & Design Tokens", score: "97%", percent: 97 },
    ],
    shippedProjectIds: [
      "prj-graphics-booth",
      "prj-graphics-tent",
      "prj-graphics-cards",
    ],
    execStageIndex: 3,
    metricLabel: "Brand Deliverables",
    metricValue: "360° Digital + Physical Craft",
    photo: "/team/naveed.webp",
    objectPosition: "45% 30%",
  },
];

export const aboutStats = [
  {
    value: "99.2%",
    label: "Peak Model Accuracy",
    detail: "Validated over 50 epochs at 4ms/step inference",
  },
  {
    value: "$3.28M+",
    label: "Executive P&L Modeled",
    detail: "Real-time CEO revenue, EBIT & inventory BI",
  },
  {
    value: "769M+",
    label: "Commerce Volume Tracked",
    detail: "Multi-city geospatial & SKU telemetry in Power BI",
  },
  {
    value: "4 Leads",
    label: "Direct Senior Builders",
    detail: "Zero junior handoffs · Domestic & global delivery",
  },
] as const;

export type ProjectCategory = "all" | "ml" | "dashboard" | "graphics";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, "all">;
  categoryLabel: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  leadId: TeamMemberId;
  leadName: string;
  leadRole: string;
  leadPhoto: string;
  clientSector: string;
  headlineMetric: string;
  headlineMetricLabel: string;
  metrics: ProjectMetric[];
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  deliverables: string[];
  tags: string[];
  featured?: boolean;
}

export const projectCategories: {
  id: ProjectCategory;
  label: string;
  sublabel: string;
  count: number;
}[] = [
  {
    id: "all",
    label: "All Shipped Work",
    sublabel: "Complete Multi-Disciplinary Portfolio",
    count: 7,
  },
  {
    id: "ml",
    label: "AI & Machine Learning",
    sublabel: "Model Accuracy & Vision Datasets",
    count: 2,
  },
  {
    id: "dashboard",
    label: "Executive Dashboards & BI",
    sublabel: "Power BI, CEO P&L & Geo-Analytics",
    count: 2,
  },
  {
    id: "graphics",
    label: "Brand & Spatial Graphics",
    sublabel: "3D Expo Booths, Event Tents & Identity",
    count: 3,
  },
];

export const projects: ProjectItem[] = [
  {
    id: "ml-accuracy-optimization",
    code: "PRJ-01 // DEEP LEARNING",
    title: "Neural Classifier — 99.2% Accuracy & Loss Convergence Pipeline",
    subtitle: "50-Epoch Regularized Training, Confusion Matrix Diagnostics & 4ms/step Inference",
    category: "ml",
    categoryLabel: "AI & Machine Learning",
    image: "/projects/ml-model-accuracy.webp",
    imageWidth: 1800,
    imageHeight: 1120,
    leadId: "arsalan",
    leadName: "Arsalan",
    leadRole: "Principal AI & ML Specialist",
    leadPhoto: "/team/arsalan.webp",
    clientSector: "Production AI · Predictive Classification",
    headlineMetric: "99.2%",
    headlineMetricLabel: "Peak Training & Validation Convergence",
    metrics: [
      { label: "Peak Accuracy", value: "99.2% (98.9% Val)" },
      { label: "Loss Reduction", value: "5.0 → < 0.28" },
      { label: "Inference Speed", value: "4ms / step (200s)" },
    ],
    summary:
      "Engineered a high-precision multi-class deep learning pipeline that eliminated validation drift across 50 epochs—driving loss from 5.0 down to <0.3 while achieving ~99% accuracy and 4ms/step execution.",
    challenge:
      "Baseline classification models suffered from severe class imbalance and mid-epoch validation divergence, causing costly false positives across closely related target classes.",
    solution:
      "Arsalan redesigned the training loop with dynamic learning-rate scheduling, stratified dataset rebalancing, and automated Seaborn/Matplotlib diagnostic hooks tracking per-epoch train/val loss alongside a normalized multi-class Confusion Matrix.",
    outcome:
      "Delivered a production-ready model weight checkpoint with tightly coupled train/validation curves (99.2% train / 98.9% val accuracy) and ultra-fast 4ms/step inference latency.",
    deliverables: [
      "50-Epoch Regularized Deep Learning Training Pipeline",
      "Real-Time Train vs. Validation Loss & Accuracy Telemetry",
      "Normalized Multi-Class Confusion Matrix Diagnostics",
      "Quantized 4ms/step Production Inference Checkpoint",
    ],
    tags: ["PyTorch / Keras", "Accuracy Tuning", "Confusion Matrix", "4ms Inference", "Matplotlib/Seaborn"],
    featured: true,
  },
  {
    id: "ceo-executive-command-dashboard",
    code: "PRJ-02 // EXECUTIVE BI",
    title: "CEO Executive P&L, eNPS & Inventory Command Center",
    subtitle: "YTD Financial Income Statement ($3.28M Revenue), Workforce eNPS & Live Stock Valuation",
    category: "dashboard",
    categoryLabel: "Executive Dashboards & BI",
    image: "/projects/dashboard-overview.webp",
    imageWidth: 972,
    imageHeight: 876,
    leadId: "ayan",
    leadName: "Ayan",
    leadRole: "Founder · AI Data Analyst & Power BI Expert",
    leadPhoto: "/team/ayan.webp",
    clientSector: "Enterprise C-Suite · Financial & Operations BI",
    headlineMetric: "$3.28M",
    headlineMetricLabel: "YTD Revenue Tracked (+12.6% vs Target)",
    metrics: [
      { label: "YTD Revenue", value: "$3,281,900 (+12.6%)" },
      { label: "EBIT Margin", value: "29.9% ($981,889)" },
      { label: "Live Stock Value", value: "$628,000 (6,100 Items)" },
    ],
    summary:
      "Unified C-suite executive dashboard consolidating full YTD Income Statement waterfalls, target-vs-actual KPI gauges, Employee & Customer NPS sentiment trends, Sales-to-Payroll ratios, and warehouse stock valuation.",
    challenge:
      "Executive leadership had to reconcile separate spreadsheets for P&L accounting, HR sentiment (eNPS), sales payroll efficiency, and warehouse inventory—delaying monthly board decisions.",
    solution:
      "Ayan architected a single-screen dark/light executive command center pairing a structured Income Statement sidebar ($3.28M Revenue, $1.75M Gross Profit, $658.8K Net Profit) with radial target gauges, 3-month eNPS/NPS trend indicators, and multi-group stock purchase/sales velocity.",
    outcome:
      "Gave the CEO instant visibility into the +12.6% revenue beat and +15.7% EBIT outperformance while flagging customer NPS shifts and optimizing $628,000 in active inventory.",
    deliverables: [
      "Automated YTD Income Statement & Margin Waterfall",
      "Radial Target-vs-Actual Gauges (Revenue, Gross Profit, EBIT, Net Profit)",
      "3-Month Employee eNPS (+23) & Customer NPS (+24) Sentiment Trackers",
      "Sales vs. Employee Cost Ratio & $628K Inventory Valuation Module",
    ],
    tags: ["Executive BI", "Financial P&L Modeling", "KPI Gauges", "Inventory Analytics", "Workforce eNPS"],
    featured: true,
  },
  {
    id: "cyber-shield-tradeshow-booth",
    code: "PRJ-03 // SPATIAL BRANDING",
    title: "Cyber Shield & SV3 — 360° Enterprise Expo Booth Architecture",
    subtitle: "Large-Format Illuminated Backwall, Reception Podium & Co-Branded Roll-Up Display Suite",
    category: "graphics",
    categoryLabel: "Brand & Spatial Graphics",
    image: "/projects/graphics-tradeshow-booth.webp",
    imageWidth: 1800,
    imageHeight: 1208,
    leadId: "naveed",
    leadName: "Naveed",
    leadRole: "Creative Director & Brand Identity Designer",
    leadPhoto: "/team/naveed.webp",
    clientSector: "Enterprise Cybersecurity & Building Intelligence",
    headlineMetric: "360°",
    headlineMetricLabel: "Modular Exhibition & Spatial Brand System",
    metrics: [
      { label: "Display Modules", value: "Backwall + Podium + 2 Banners" },
      { label: "Core Pillars", value: "Protect · Detect · Respond" },
      { label: "Print Spec", value: "300 DPI CMYK Large-Format" },
    ],
    summary:
      "Designed a commanding trade show exhibition environment for Cyber Shield ('Securing Your Digital Future') alongside co-branded Building Intelligence (SV3) retractable stands and an executive reception counter.",
    challenge:
      "At crowded enterprise security expos, generic booth backdrops fail to stop foot traffic or communicate technical capabilities within 3 seconds of visual contact.",
    solution:
      "Naveed crafted a cohesive teal-and-obsidian spatial identity featuring a custom shield emblem, glowing neural city-grid horizon artwork, iconographic capability callouts (24/7 Threat Protection, Data Privacy & Encryption, Instant Incident Response), and multi-angle 3D perspective renders.",
    outcome:
      "Provided the client with production-ready large-format print die-lines and photorealistic 3D staging views (Front View, Side & Banner Detail, Full Floorplan) ready for immediate fabrication.",
    deliverables: [
      "Widescreen Exhibition Backwall Artwork & Custom Shield Identity",
      "Branded Reception Podium & Literature Rack Visuals",
      "Cyber Shield & SV3 Building Intelligence Roll-Up Banner Pair",
      "Multi-Angle 3D Architectural Booth Mockups",
    ],
    tags: ["Trade Show Booth", "Spatial Branding", "3D Exhibition Render", "Large-Format Print", "Cybersecurity Identity"],
    featured: true,
  },
  {
    id: "retail-mobile-commerce-powerbi",
    code: "PRJ-04 // POWER BI ANALYTICS",
    title: "National Retail & Mobile Commerce Geo-Intelligence Suite",
    subtitle: "Power BI Dashboard Tracking 769M Total Sales Across 15+ Cities, Mobile SKUs & Payment Channels",
    category: "dashboard",
    categoryLabel: "Executive Dashboards & BI",
    image: "/projects/dashboard-analytics.webp",
    imageWidth: 1800,
    imageHeight: 1005,
    leadId: "ayan",
    leadName: "Ayan",
    leadRole: "Founder · AI Data Analyst & Power BI Expert",
    leadPhoto: "/team/ayan.webp",
    clientSector: "Retail & Mobile E-Commerce Analytics",
    headlineMetric: "769M",
    headlineMetricLabel: "Total Sales Volume Analyzed in Power BI",
    metrics: [
      { label: "Total Sales", value: "769M (40K Avg)" },
      { label: "Transactions", value: "4K Orders · 19K Units" },
      { label: "Top SKU", value: "iPhone SE (60M Sales)" },
    ],
    summary:
      "Interactive Microsoft Power BI retail intelligence dashboard featuring January–December dynamic slicers, Bing geospatial city bubble mapping, monthly unit velocity curves, mobile model rankings, and payment method telemetry.",
    challenge:
      "Regional retail managers lacked granular visibility into which metropolitan markets, mobile device SKUs, and digital payment rails were driving monthly order volume and 5-star customer ratings.",
    solution:
      "Ayan engineered an interactive Power BI report integrating a live Microsoft Bing geospatial map across 15+ major cities (Delhi, Mumbai, Bangalore, Hyderabad, Kolkata, etc.), a 12-month quantity trendline, top mobile model bar charts (iPhone SE 60M, OnePlus Nord 58M, Galaxy Note 20 56M), and payment split ring charts.",
    outcome:
      "Enabled instant single-click filtering by month, city, and payment channel (UPI 26.25%, Debit Card 25.89%, Cash 25.03%, Credit Card 22.83%) to optimize regional stock allocation.",
    deliverables: [
      "Interactive Power BI Report with 12-Month Slicer Navigation",
      "Microsoft Bing Geospatial Bubble Map (Total Sales by City)",
      "SKU Revenue Leaderboard & Monthly Unit Velocity Curve",
      "Payment Method Ring Telemetry & 5-Star Customer Rating Breakdown",
    ],
    tags: ["Microsoft Power BI", "Geospatial Bing Map", "Retail Telemetry", "DAX Modeling", "Interactive Slicers"],
  },
  {
    id: "ml-video-segmentation-pipeline",
    code: "PRJ-05 // COMPUTER VISION & DATA",
    title: "Egocentric Video Temporal Action Segmentation & QA Workbench",
    subtitle: "Dense Frame-Accurate Clip Slicing (95+ Segments/Stream) & Automated Boundary Realignment",
    category: "ml",
    categoryLabel: "AI & Machine Learning",
    image: "/projects/ml-video-segmentation.webp",
    imageWidth: 925,
    imageHeight: 781,
    leadId: "arsalan",
    leadName: "Arsalan",
    leadRole: "Principal AI & ML Specialist",
    leadPhoto: "/team/arsalan.webp",
    clientSector: "Computer Vision · Robotics & Multimodal AI Training",
    headlineMetric: "95+ Clips",
    headlineMetricLabel: "Dense Temporal Action Segments per Video",
    metrics: [
      { label: "Temporal Granularity", value: "Sub-2s (e.g. 03:25–03:27)" },
      { label: "Playback Control", value: "0.75x Precision Scrubbing" },
      { label: "Pipeline QA", value: "Auto-Realign + Slice Audit" },
    ],
    summary:
      "High-density temporal video segmentation and annotation workflow built for curating egocentric human-action datasets—featuring sub-2-second clip boundary slicing, automated temporal realignment, and multi-step QA submission.",
    challenge:
      "Training vision-language and robotics foundation models requires thousands of hours of first-person video segmented into exact micro-actions without frame drift or overlapping timestamps.",
    solution:
      "Arsalan and Ayan structured a precision temporal segmentation workflow supporting 95+ micro-clips per video stream, variable-speed (0.75x) frame inspection, single-click clip loop verification, and automated boundary realignment ('Realign Video') prior to dataset serialization.",
    outcome:
      "Produced clean, frame-accurate action-segmentation training slices that significantly improve downstream temporal action localization and multimodal model grounding.",
    deliverables: [
      "Dense Multi-Clip Temporal Timeline Segmentation (95+ Clips/Stream)",
      "First-Person Object Manipulation & Micro-Action Labeling Protocol",
      "Automated Temporal Boundary Realignment & Error Flagging",
      "Verified Training Slice Export for Vision-Language Models",
    ],
    tags: ["Video Segmentation", "Computer Vision", "Dataset Curation", "Temporal Action Labeling", "Multimodal AI"],
  },
  {
    id: "pepsi-3d-event-canopy",
    code: "PRJ-06 // 3D BRAND ACTIVATION",
    title: "Pepsi 'Thirsty For More' — 3D Event Canopy & Feather Flag Kit",
    subtitle: "Multi-Angle 3D Merchandising Visualization (Front, Side & Dual Feather Flag Configurations)",
    category: "graphics",
    categoryLabel: "Brand & Spatial Graphics",
    image: "/projects/graphics-tent-design.webp",
    imageWidth: 1800,
    imageHeight: 1800,
    leadId: "naveed",
    leadName: "Naveed",
    leadRole: "Creative Director & Brand Identity Designer",
    leadPhoto: "/team/naveed.webp",
    clientSector: "Beverage & Outdoor Consumer Brand Activation",
    headlineMetric: "3 Angles",
    headlineMetricLabel: "Photorealistic 3D Canopy & Flag Staging Suite",
    metrics: [
      { label: "3D Views", value: "Front-Side · Side · Flag Kit" },
      { label: "Hardware Spec", value: "10x20ft Pop-Up + 2 Flags" },
      { label: "Fabric Graphic", value: "Dye-Sublimated UV Vector" },
    ],
    summary:
      "High-impact outdoor promotional tent and feather flag system designed for Pepsi's 'Thirsty For More' campaign—rendered across three studio angles with dynamic red-and-blue ribbon waves and carbonated ice photography.",
    challenge:
      "Outdoor festival and retail activations require 360-degree brand visibility where canopy valances, interior backwalls, side skirts, and vertical flags align seamlessly across aluminum tent geometry.",
    solution:
      "Naveed engineered the complete vector print templates and photorealistic 3D aluminum-frame renders showing Front-Side View, Side View with full-bleed ice-splash side walls, and Front View flanked by dual curved feather flags.",
    outcome:
      "Delivered a manufacturing-ready dye-sublimation print package and presentation board that accelerated campaign sign-off and vendor production.",
    deliverables: [
      "Peak Canopy Roof & Valance Vector Artwork",
      "Full-Bleed Carbonated Ice-Splash Backwall & Sidewall Graphics",
      "Dual Vertical Feather Flag Templates",
      "3-Angle Studio 3D Presentation Render Sheet",
    ],
    tags: ["3D Merchandising", "Event Tent Design", "Outdoor Activation", "Brand Campaign", "Print Die-Lines"],
  },
  {
    id: "vista-vertex-executive-cards",
    code: "PRJ-07 // CORPORATE IDENTITY",
    title: "Vista Life & Vertex Homes — Luxury Corporate Print & Logo Systems",
    subtitle: "Bespoke Geometric Monograms, Tactile Linen & Matte Stock Specifications for Executive Leaders",
    category: "graphics",
    categoryLabel: "Brand & Spatial Graphics",
    image: "/projects/graphics-business-card.webp",
    imageWidth: 1800,
    imageHeight: 1344,
    leadId: "naveed",
    leadName: "Naveed",
    leadRole: "Creative Director & Brand Identity Designer",
    leadPhoto: "/team/naveed.webp",
    clientSector: "Wellness & Luxury Real Estate Identity",
    headlineMetric: "2 Brands",
    headlineMetricLabel: "Complete Logo Marks & Executive Print Systems",
    metrics: [
      { label: "Brand 01", value: "Vista Life (Lotus Gold/Teal)" },
      { label: "Brand 02", value: "Vertex Homes (Ribbon MV)" },
      { label: "Finish Spec", value: "Textured Linen & Matte Foil" },
    ],
    summary:
      "Dual executive brand identity and stationery showcase featuring Vista Life ('Find Your Centre') in deep emerald and brushed gold on woven linen stock, alongside Vertex Homes Real Estate in architectural terracotta and charcoal.",
    challenge:
      "Both founding teams needed tangible, high-trust corporate identities that immediately communicated luxury positioning during in-person investor and client meetings.",
    solution:
      "Naveed designed two distinct custom vector emblems—an interlocking sacred-geometry lotus for Vista Life and a 3D isometric 'MV' roofline monogram for Vertex Homes—paired with balanced typographic grids and custom icon badges.",
    outcome:
      "Established enduring visual identities across print stationery and digital profiles, elevating brand perception for both managing directors and senior consultants.",
    deliverables: [
      "Vista Life Custom Lotus Emblem & Two-Sided Linen Business Card System",
      "Vertex Homes 3D Architectural Monogram & Terracotta/Charcoal Stationery",
      "Custom Vector Contact Iconography & Typography Hierarchy",
      "Press-Ready CMYK + Metallic Foil Separation Files",
    ],
    tags: ["Logo Architecture", "Executive Stationery", "Brand Identity", "Print Typography", "Luxury Mockups"],
  },
];

export interface ExecutionStageSpec {
  id: string;
  stepNumber: string;
  code: string;
  title: string;
  subtitle: string;
  leadId: TeamMemberId;
  leadName: string;
  leadRole: string;
  leadPhoto: string;
  slaBadge: string;
  primaryMetric: string;
  primaryMetricLabel: string;
  summary: string;
  inputSpec: string;
  engineProcess: string;
  clientOutput: string;
  architectureSnippetTitle: string;
  architectureSnippetLang: string;
  architectureSnippet: string;
  capabilities: string[];
  stackPills: string[];
}

export const executionPipeline: ExecutionStageSpec[] = [
  {
    id: "exec-stage-01",
    stepNumber: "01",
    code: "EXECUTION 01 // RAG & EXECUTIVE BI",
    title: "Data Ingestion, RAG Pipelines & Power BI Command Centers",
    subtitle: "Turning fragmented ERP, SQL & document silos into real-time boardroom intelligence",
    leadId: "ayan",
    leadName: "Ayan",
    leadRole: "Founder · AI Data Analyst, RAG & Power BI Expert",
    leadPhoto: "/team/ayan.webp",
    slaBadge: "REAL-TIME TELEMETRY",
    primaryMetric: "$3.28M+",
    primaryMetricLabel: "Executive P&L & 769M Retail Volume Modeled",
    summary:
      "Every engagement begins by unifying your raw operational datasets. Ayan architects hybrid Retrieval-Augmented Generation (RAG) indexes for private enterprise knowledge alongside interactive Microsoft Power BI & React executive dashboards.",
    inputSpec: "Raw SQL/ERP Tables, Financial Ledgers, Multi-City POS Feeds & PDF Knowledge Bases",
    engineProcess: "DAX Star-Schema Modeling, Semantic Vector Chunking (pgvector/Qdrant) & Automated KPI Triggers",
    clientOutput: "Live CEO P&L Command Center, Geospatial Sales Map & Citation-Backed RAG Assistant",
    architectureSnippetTitle: "kaelithor_rag_bi_pipeline.py",
    architectureSnippetLang: "PYTHON // RAG + DAX TELEMETRY",
    architectureSnippet: `# Kaelithor Stage 01: Hybrid RAG + Executive BI Sync
def sync_executive_telemetry(erp_stream, vector_index):
    clean_df = normalize_star_schema(erp_stream, currency="USD")
    kpis = {
        "ytd_revenue": "$3,281,900 (+12.6% vs Target)",
        "ebit_margin": "29.9% ($981,889)",
        "retail_geo_volume": "769M across 15+ Metro Nodes",
    }
    vector_index.upsert_semantic_chunks(clean_df, hybrid_alpha=0.78)
    return publish_powerbi_dataset(kpis, refresh_sla="realtime")`,
    capabilities: [
      "Executive C-Suite P&L, EBIT & Cashflow Waterfall Dashboards",
      "Microsoft Power BI Geospatial Mapping & Dynamic Slicer Ecosystems",
      "Hybrid RAG Pipelines (Dense + BM25 Lexical Search) with Zero Hallucination",
      "Workforce eNPS, Customer NPS & Live Warehouse Stock Valuation ($628K+)",
    ],
    stackPills: ["Power BI", "DAX & Power Query", "RAG Pipelines", "pgvector / Qdrant", "Python Pandas", "Next.js BI"],
  },
  {
    id: "exec-stage-02",
    stepNumber: "02",
    code: "EXECUTION 02 // CUSTOM ML & ACCURACY",
    title: "Custom Deep Learning, Accuracy Tuning & Vision Segmentation",
    subtitle: "Eliminating validation drift and pushing neural classifiers past 99% production accuracy",
    leadId: "arsalan",
    leadName: "Arsalan",
    leadRole: "Principal AI & Machine Learning Specialist",
    leadPhoto: "/team/arsalan.webp",
    slaBadge: "99.2% VAL ACCURACY",
    primaryMetric: "4ms/step",
    primaryMetricLabel: "Quantized Inference at 99.2% Peak Accuracy",
    summary:
      "When off-the-shelf AI wrappers fail on domain-specific accuracy or latency, Arsalan curates frame-accurate training datasets, rebalances class distributions, and fine-tunes custom neural weights verified by multi-class confusion matrices.",
    inputSpec: "Unlabeled Egocentric Video Streams, Imbalanced Tabular/Image Datasets & Baseline Weights",
    engineProcess: "50-Epoch Regularized Training, Sub-2s Temporal Video Slicing & Confusion-Matrix Diagnostics",
    clientOutput: "Quantized 99.2%-Accurate Production Model Checkpoint Running at 4ms/step Inference",
    architectureSnippetTitle: "arsalan_accuracy_optimizer.py",
    architectureSnippetLang: "PYTORCH // 50-EPOCH CONVERGENCE",
    architectureSnippet: `# Kaelithor Stage 02: 50-Epoch Convergence & Confusion Matrix QA
for epoch in range(1, 51):
    train_loss, train_acc = step_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader) # 98.9% -> 99.2%
    assert val_loss < 0.28, "Validation drift guardrail active"

conf_matrix = compute_confusion_matrix(y_true, y_pred, normalize=True)
export_quantized_onnx(model, target_latency="4ms/step")`,
    capabilities: [
      "Hyperparameter Optimization & Loss Convergence (5.0 -> <0.28 across 50 Epochs)",
      "Normalized Multi-Class Confusion Matrix Auditing to Eliminate False Positives",
      "Dense Egocentric Video Temporal Action Segmentation (95+ Clips/Stream, Sub-2s)",
      "LoRA / QLoRA Fine-Tuning & 4-Bit Quantized ONNX/TensorRT Deployment",
    ],
    stackPills: ["PyTorch", "TensorFlow / Keras", "LoRA Fine-Tuning", "Video Segmentation", "Seaborn Diagnostics", "ONNX 4ms"],
  },
  {
    id: "exec-stage-03",
    stepNumber: "03",
    code: "EXECUTION 03 // FULL-STACK WEB & CLOUD",
    title: "High-Concurrency Web Platforms, APIs & Cloud Infrastructure",
    subtitle: "Sub-40ms Next.js & FastAPI production systems that host your AI models and convert enterprise traffic",
    leadId: "hassan",
    leadName: "Hassan",
    leadRole: "Lead Full-Stack Web & Backend Architect",
    leadPhoto: "/team/hassan.webp",
    slaBadge: "< 40ms API P95",
    primaryMetric: "99.98%",
    primaryMetricLabel: "Production Uptime & Edge SSR Velocity",
    summary:
      "Hassan transforms our AI models, RAG pipelines, and visual systems into resilient, glassmorphic web applications and SaaS platforms—engineering clean React/Next.js frontends, typed FastAPI/Node.js backends, and Dockerized cloud infrastructure.",
    inputSpec: "Trained ML Checkpoints, BI Telemetry Streams, Figma Design Tokens & Enterprise Auth Specs",
    engineProcess: "Next.js 15 App Router SSR, Async FastAPI/Node Microservices, PostgreSQL + Redis Caching",
    clientOutput: "Live Production Web Platform, Secure REST/WebSocket APIs & Auto-Scaling Cloud Deployment",
    architectureSnippetTitle: "hassan_edge_gateway.ts",
    architectureSnippetLang: "TYPESCRIPT // NEXT.JS 15 + FASTAPI",
    architectureSnippet: `// Kaelithor Stage 03: Low-Latency AI & Telemetry Gateway
export async function POST(req: Request) {
  const payload = await validateClientSchema(req);
  const [biMetrics, mlPrediction] = await Promise.all([
    redisCache.getOrFetch("ceo:pnl:ytd", fetchPowerBiSnapshot),
    mlInferenceClient.predict({Input: payload, maxLatencyMs: 38 }),
  ]);
  return Response.json({ status: "ok", latencyP95: "34ms", biMetrics, mlPrediction });
}`,
    capabilities: [
      "Modern Next.js 15, React 19 & TypeScript Full-Stack Web Applications",
      "High-Throughput Node.js & Python FastAPI Backend Architecture",
      "PostgreSQL Relational Schemas, Redis Caching, RBAC Auth & Stripe Payment Rails",
      "Docker Containerization, CI/CD Pipelines & Zero-Downtime Cloud Hosting",
    ],
    stackPills: ["Next.js 15 / React 19", "TypeScript", "Node.js & FastAPI", "PostgreSQL & Redis", "Docker & CI/CD", "REST / WebSockets"],
  },
  {
    id: "exec-stage-04",
    stepNumber: "04",
    code: "EXECUTION 04 // 360° BRAND & SPATIAL",
    title: "Iconic Brand Identity, 3D Expo Architecture & Print Systems",
    subtitle: "Commanding visual authority from digital UI tokens to trade show booths and luxury print",
    leadId: "naveed",
    leadName: "Naveed",
    leadRole: "Creative Director & Brand Identity Designer",
    leadPhoto: "/team/naveed.webp",
    slaBadge: "300 DPI + 3D READY",
    primaryMetric: "360°",
    primaryMetricLabel: "Digital, Spatial Booth & Tactile Print Systems",
    summary:
      "Technology wins when it looks unmistakable. Naveed crafts cohesive brand ecosystems that dominate both screen and physical space—from geometric logo marks and tactile linen business cards to 360° enterprise trade show booths and 3D outdoor event canopies.",
    inputSpec: "Founder Vision, Market Positioning, Exhibition Floorplans & Product Packaging Dimensions",
    engineProcess: "Sacred-Geometry Vector Construction, 3D Spatial Booth Rendering & CMYK/Pantone Pre-Press",
    clientOutput: "Complete Brand Guidelines, 3D Trade Show/Canopy Render Suites & Press-Ready Print Files",
    architectureSnippetTitle: "naveed_brand_system.json",
    architectureSnippetLang: "DESIGN TOKENS // 3D + PRINT SPEC",
    architectureSnippet: `{
  "studioStandard": "Kaelithor 360° Visual Authority",
  "spatialExhibitions": ["Cyber Shield 360° Expo Booth", "SV3 Roll-Up Suite"],
  "outdoorActivations": ["Pepsi 10x20ft 3D Canopy", "Dual Feather Flags"],
  "corporateIdentity": ["Vista Life Gold/Teal Linen", "Vertex Homes MV Monogram"],
  "printSpecification": "300 DPI CMYK + Pantone Metallic Foil Die-Lines"
}`,
    capabilities: [
      "360° Enterprise Trade Show Booths, Backwalls, Podiums & Roll-Up Banner Systems",
      "Photorealistic 3D Outdoor Event Canopies, Pop-Up Tents & Feather Flag Kits",
      "Bespoke Logo Marks, Monograms & Complete Visual Identity Guidelines",
      "Luxury Executive Business Cards (Textured Linen, Matte Foil) & UI Design Systems",
    ],
    stackPills: ["Brand Identity", "3D Booth Architecture", "Event Canopy Renders", "Logo & Monograms", "300 DPI Pre-Press", "Figma UI Systems"],
  },
];

