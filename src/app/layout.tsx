import type { Metadata, Viewport } from "next";
import { site } from "../content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  keywords: [
    "AI data analytics",
    "RAG pipelines",
    "Power BI dashboards",
    "AI model training",
    "machine learning agency",
    "full-stack web development",
    "brand identity design",
    "Kaelithor",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#eef1f6",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="titanium-atelier"
      data-font="barlow-plex"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,600;0,700;0,800;1,600&family=Fira+Code:wght@500;600;700&family=IBM+Plex+Mono:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=Libre+Franklin:wght@400;500;600;700&family=Martian+Mono:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,600..900,0..1,0..1,0..1&family=Urbanist:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Victor+Mono:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Work+Sans:wght@400;500;600;700&family=Zilla+Slab:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
