"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./WorksSection.module.css";

export default function MagneticButton({ href, children }) {
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    const onMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(text, {
        x: Math.max(-8, Math.min(8, x * 0.12)),
        y: Math.max(-8, Math.min(8, y * 0.12)),
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseLeave = () => {
      gsap.killTweensOf(text);
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    };

    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className={styles.buttonWrapper}>
      <Link href={href} ref={btnRef} className={styles.viewAllButton}>
        <span ref={textRef} className={styles.viewAllText}>{children}</span>
      </Link>
    </div>
  );
}
