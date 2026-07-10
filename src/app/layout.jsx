import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { bricolageGrotesque, geist, inter } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://www.harshgogri.com"),

  title: "Harsh Gogri | Product Manager",
  description:
    "Portfolio featuring product case studies, UX design, product strategy, and end-to-end product thinking.",

  alternates: {
    canonical: "https://www.harshgogri.com",
  },

  openGraph: {
    title: "Harsh Gogri | Product Manager",
    description:
      "Portfolio featuring product case studies, UX design, product strategy, and end-to-end product thinking.",
    url: "https://www.harshgogri.com",
    siteName: "Harsh Gogri",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/assets/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harsh Gogri | Product Manager",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Harsh Gogri | Product Manager",
    description:
      "Portfolio featuring product case studies, UX design, product strategy, and end-to-end product thinking.",
    images: ["/images/assets/og/og-image.png"],
    creator: "@HarshGogri02",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${bricolageGrotesque.variable}`}
    >
      <head>
        {/*
          Anti-FOUC script: runs synchronously before React hydrates so the
          correct data-theme is applied before the first paint, preventing a
          flash of the wrong background/text color on reload.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                if (stored === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ThemeToggle />
      </body>
    </html>
  );
}

