"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROFILE_PHOTO_SRC } from "@/lib/profilePhoto";
import MagneticLink from "@/components/ui/MagneticLink";
import styles from "./Navbar.module.css";

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
        if (diff > 5) {
          setIsHidden(true);
        } else if (diff < -5) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
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
            <MagneticLink href="/work">Works</MagneticLink>
            <MagneticLink href="#">Resume</MagneticLink>
          </div>

          <div className={styles.right}>
            <MagneticLink href="https://www.linkedin.com/in/harshgogri02/" target="_blank" rel="noopener noreferrer">LinkedIn</MagneticLink>
            <MagneticLink href="mailto:gogriharsh1@gmail.com" target="_blank" rel="noopener noreferrer">Email</MagneticLink>
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
          <a href="/work" onClick={closeMenu}>
            Works
          </a>
          <a href="#" onClick={closeMenu}>
            Resume
          </a>
          <a href="https://www.linkedin.com/in/harshgogri02/" onClick={closeMenu}>
            LinkedIn
          </a>
          <a href="mailto:gogriharsh1@gmail.com" onClick={closeMenu}>
            Email
          </a>
        </div>
      </div>
    </>
  );
}
