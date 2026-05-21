import Navbar from "@/components/layout/Navbar";
import { geist, instrumentSerif, inter } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata = {
  title: "Harsh Portfolio",
  description: "Portfolio website"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
