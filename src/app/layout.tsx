import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: true,
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  adjustFontFallback: true,
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://mat.dev'),
  title: {
    default: "Mark Anthony Tantongco | Neo-Brutalist WebGPU Engineer",
    template: "%s | MAT.DEV"
  },
  description: "Mark Anthony Tantongco is a Neo-Brutalist WebGPU Engineer specializing in living digital organisms, bleeding-edge compute shaders, and sentient particle systems. Building interfaces that vote, broadcast, and physically react.",
  keywords: [
    "WebGPU Engineer",
    "Neo-Brutalist Design",
    "React Three Fiber",
    "TypeScript Developer",
    "Next.js Developer",
    "GPU Compute Shaders",
    "WGSL Developer",
    "Three.js Developer",
    "GSAP Animation",
    "Full-Stack Developer",
    "Portfolio",
    "Mark Anthony Tantongco"
  ],
  authors: [{ 
    name: "Mark Anthony Tantongco", 
    url: "https://mat.dev" 
  }],
  creator: "Mark Anthony Tantongco",
  publisher: "Mark Anthony Tantongco",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mat.dev",
    siteName: "MAT.DEV",
    title: "Mark Anthony Tantongco | Neo-Brutalist WebGPU Engineer",
    description: "Building living digital organisms with bleeding-edge WebGPU compute and Neo-Brutalist design. Sentient. Concrete. Electric.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MAT.DEV - Neo-Brutalist WebGPU Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@markytanky",
    creator: "@markytanky",
    title: "DEUS ACTIVE // Mark Anthony Tantongco",
    description: "Neo-Brutalist WebGPU Engineer. Living digital organisms that vote, broadcast, and react.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://mat.dev",
  },
  category: "technology",
  classification: "Portfolio",
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
};

// JSON-LD Structured Data for AI Searchability
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mat.dev/#person",
      name: "Mark Anthony Tantongco",
      givenName: "Mark",
      familyName: "Tantongco",
      alternateName: "DEUS ACTIVE",
      jobTitle: "WebGPU Engineer",
      description: "Neo-Brutalist WebGPU Engineer specializing in living digital organisms and GPU compute shaders",
      url: "https://mat.dev",
      image: "https://mat.dev/profile.png",
      sameAs: [
        "https://github.com/marktantongco",
        "https://twitter.com/markytanky",
        "https://linkedin.com/in/marktantongco1",
      ],
      knowsAbout: [
        "WebGPU",
        "WebGL",
        "WGSL",
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "React Three Fiber",
        "GSAP",
        "GPU Computing",
        "Neo-Brutalist Design",
        "Full-Stack Development"
      ],
      worksFor: {
        "@type": "Organization",
        name: "DEUS ACTIVE"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://mat.dev/#website",
      url: "https://mat.dev",
      name: "MAT.DEV",
      description: "Neo-Brutalist WebGPU Portfolio",
      publisher: {
        "@id": "https://mat.dev/#person"
      },
      inLanguage: "en-US"
    },
    {
      "@type": "PortfolioPage",
      "@id": "https://mat.dev/#portfolio",
      url: "https://mat.dev",
      name: "Mark Anthony Tantongco Portfolio",
      description: "Portfolio showcasing WebGPU projects, Neo-Brutalist design, and sentient particle systems",
      isPartOf: {
        "@id": "https://mat.dev/#website"
      },
      about: {
        "@id": "https://mat.dev/#person"
      },
      mainEntity: {
        "@id": "https://mat.dev/#person"
      }
    },
    {
      "@type": "SoftwareApplication",
      name: "AETHERDASH",
      applicationCategory: "AnalyticsApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      author: {
        "@id": "https://mat.dev/#person"
      }
    },
    {
      "@type": "SoftwareApplication",
      name: "NEURALRIFT",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      author: {
        "@id": "https://mat.dev/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD for AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mat.dev" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${bebasNeue.variable} ${spaceMono.variable} ${barlow.variable} antialiased`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--electric)] focus:text-[var(--void)] focus:font-bold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
