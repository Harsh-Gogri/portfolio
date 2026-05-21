"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "@/components/layout/Navbar.module.css";

export default function MagneticLink({ href, children, ...props }) {
  const linkRef = useRef(null);
  const dotRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const link = linkRef.current;
    const dot = dotRef.current;
    const text = textRef.current;
    if (!link || !dot || !text) return;

    const onMouseMove = (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle, refined magnetic pull for the text (max 2-3px)
      gsap.to(text, {
        x: x * 0.12,
        y: y * 0.08,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Subtle, refined magnetic pull for the dot (max 4-5px)
      gsap.to(dot, {
        x: x * 0.2,
        y: y * 0.12,
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseLeave = () => {
      gsap.killTweensOf([text, dot]);

      // Elastic spring-back ease for refined release feel
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });

      // Smoothly hide the dot
      gsap.to(dot, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onFocus = () => {
      gsap.killTweensOf(dot);

      // On keyboard focus, reveal the dot centered
      gsap.to(dot, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const onBlur = () => {
      gsap.killTweensOf(dot);

      // On losing focus, hide the dot
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    link.addEventListener("mousemove", onMouseMove);
    link.addEventListener("mouseleave", onMouseLeave);
    link.addEventListener("focus", onFocus);
    link.addEventListener("blur", onBlur);

    return () => {
      link.removeEventListener("mousemove", onMouseMove);
      link.removeEventListener("mouseleave", onMouseLeave);
      link.removeEventListener("focus", onFocus);
      link.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <a ref={linkRef} href={href} className={styles.magneticLink} {...props}>
      <span ref={textRef} className={styles.linkLabel}>
        {children}
      </span>
      <span ref={dotRef} className={styles.dot} />
    </a>
  );
}
