"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./ProjectPage.module.css";
import "@/styles/casestudy.css";

function HeroImage({ src, alt }) {
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const img = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;

    // Step 2: setTimeout 100ms so paint has settled before GSAP takes over
    const timeout = setTimeout(() => {
      // Apply initial circle state
      gsap.set(img, { clipPath: "circle(8% at 50% 50%)" });

      // Step 3 & 4: Animate to full rect on scroll
      gsap.to(img, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
          end: "top 20%",
          scrub: 1.5,
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === wrapper) t.kill();
      });
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heroWrapper}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={styles.heroImage}
      />
    </div>
  );
}

export default function ProjectPage({ project, children }) {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
        <div className={styles.right}>
          <span className={styles.company}>{project.company}</span>
        </div>
      </header>

      {project.image ? (
        <HeroImage src={project.image} alt={project.title} />
      ) : (
        <div className={styles.heroWrapper}>
          <div className={styles.heroPlaceholder} />
        </div>
      )}

      <div className={`${styles.content} caseStudy`}>
        {children}
      </div>

      {(project.contributors || project.disclaimer) && (
        <footer className={styles.footer}>
          {project.contributors && <p>Contributors: {project.contributors}</p>}
          {project.disclaimer && <p>Disclaimer: {project.disclaimer}</p>}
        </footer>
      )}
    </article>
  );
}
