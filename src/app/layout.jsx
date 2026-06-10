import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { bricolageGrotesque, geist, inter } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata = {
  title: "Harsh Gogri - Product Manager",
  description: "Early-career Product Manager with a CS degree and 1.5 years leading product-design at a B2C startup. Experienced in roadmap prioritization, cross-functional collaboration, and shipping scalable features within Agile sprints. Strongest at discovery, PRD authoring, and bridging design and engineering backed by a design systems background and hands-on technical skills in APIs and front-end development."
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${bricolageGrotesque.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
