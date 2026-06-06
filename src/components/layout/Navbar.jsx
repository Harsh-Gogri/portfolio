"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROFILE_PHOTO_SRC } from "@/lib/profilePhoto";
import MagneticLink from "@/components/ui/MagneticLink";
import styles from "./Navbar.module.css";

const isExternal = (href) => href.startsWith("http://") || href.startsWith("https://");

const externalProps = (href) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

const centerLinks = [
  { label: "Works", href: "/work" },
  { label: "Resume", href: "https://drive.google.com/file/d/1CjndiUMJLbSS8YI1f-9T0NnA2BbJ_RFM/view" },
];

const rightLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harshgogri02/" },
  { label: "Email", href: "mailto:gogriharsh1@gmail.com" },
];

const overlayLinks = [...centerLinks, ...rightLinks];

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsHidden(false);
      } else {
        const diff = currentScrollY - lastScrollY.current;
        if (diff > 5) setIsHidden(true);
        else if (diff < -5) setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={`${styles.wrapper} ${isHidden ? styles.hidden : styles.visible}`}>
        <nav className={styles.nav}>
          <div className={styles.left}>
            <a href="/" className={styles.brand}>
              <Image src={PROFILE_PHOTO_SRC} alt="" width={28} height={28} className={styles.brandAvatar} sizes="28px" priority />
              <span className={styles.brandText}>Harsh Gogri</span>
            </a>
          </div>

          <div className={styles.center}>
            {centerLinks.map(({ label, href }) => (
              <MagneticLink key={label} href={href} {...externalProps(href)}>
                {label}
              </MagneticLink>
            ))}
          </div>

          <div className={styles.right}>
            {rightLinks.map(({ label, href }) => (
              <MagneticLink key={label} href={href} {...externalProps(href)}>
                {label}
              </MagneticLink>
            ))}
          </div>

          <button type="button" className={styles.hamburger} aria-label="Open menu" onClick={() => setIsMenuOpen(true)}>
            ☰
          </button>
        </nav>
      </header>

      <div className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : ""}`}>
        <button type="button" className={styles.closeButton} aria-label="Close menu" onClick={closeMenu}>
          ✕
        </button>

        <div className={styles.overlayLinks}>
          {overlayLinks.map(({ label, href }) => (
            <a key={label} href={href} onClick={closeMenu} {...externalProps(href)}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}