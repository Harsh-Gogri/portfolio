"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./ReviewsSection.module.css";
import ReviewCard from "./ReviewCard";
import { reviews } from "@/data/reviews";

// Lazy-load the animated canvas background only when section is near viewport
const ReviewsBackground = dynamic(() => import("./ReviewsBackground"), {
  ssr: false,
});

const EXCERPTS = {
  "1": (
    <>
      What sets Harsh apart is his <em>reliability</em> and <em>professionalism</em> - he always shows up on time, and requires minimal guidance.
    </>
  ),
  "2": (
    <>
      Clear in communication, <em>thoughtful</em> in approach, and always brings a clean, <em>functional</em> design sense to the table.
    </>
  ),
  "3": (
    <>
      His <em>creativity</em>, commitment to continuous improvement and ability to <em>adapt</em> to changing requirements sets him apart
    </>
  )
};

const INTERVAL_MS   = 7000;
const CROSSFADE_MS  = 500; // both slides fade simultaneously on this duration

// Mobile scroll-progress constants (must match CSS 5.5 × 100dvh wrapper height)
const SEGMENT_MULTIPLIER = 1.5;
const FADE_FRACTION      = 0.2;

function computeOpacity(scrolledIn, windowH, i) {
  const segmentH  = windowH * SEGMENT_MULTIPLIER;
  const fadeZone  = segmentH * FADE_FRACTION;
  const segStart  = i * segmentH;
  const segEnd    = (i + 1) * segmentH;
  const fadeInEnd = segStart + fadeZone;
  const holdEnd   = segEnd   - fadeZone;
  const isLast    = i === reviews.length - 1;

  if (i === 0 && scrolledIn <= fadeInEnd) return 1;
  if (scrolledIn <= segStart)  return 0;
  if (scrolledIn <= fadeInEnd) return (scrolledIn - segStart) / fadeZone;
  if (scrolledIn <= holdEnd)   return 1;
  if (scrolledIn <= segEnd)    return isLast ? 1 : 1 - (scrolledIn - holdEnd) / fadeZone;
  return isLast ? 1 : 0;
}

// Three position dots — rendered in both desktop and mobile branches.
// aria-hidden: the dots are a purely visual indicator; screen readers
// already get position context from the aria-label on each slide.
function Dots({ total, activeIndex }) {
  return (
    <div className={styles.dots} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [activeIndex,      setActiveIndex]      = useState(0);
  const [fadingOutIndex,   setFadingOutIndex]   = useState(null); // desktop simultaneous crossfade
  const [isMobile,         setIsMobile]         = useState(false);
  const [mobileActiveDot,  setMobileActiveDot]  = useState(0); // tracks dominant slide for mobile dots
  const [shouldLoadBg,     setShouldLoadBg]     = useState(false); // lazy load background near viewport

  const timerRef           = useRef(null);
  const crossfadeRef       = useRef(null);
  const activeIndexRef     = useRef(0); // ref copy avoids stale closure in advanceReview
  const scrollWrapperRef   = useRef(null);
  const desktopSectionRef  = useRef(null);
  const mobileStickyRef     = useRef(null);
  const slideRefs          = useRef(reviews.map(() => null));
  const rafRef             = useRef(null);
  const wrapperTopRef      = useRef(null); // cached absolute position; invalidated on resize
  const mobileActiveDotRef = useRef(0); // ref copy to avoid setState on unchanged value

  // ── Desktop simultaneous crossfade ──────────────────────────────────────
  // Both the outgoing slide (fadingOutIndex) and incoming slide (activeIndex)
  // transition simultaneously: one fades to 0, the other fades from 0 to 1.
  // There is no blank frame between them.
  const advanceReview = useCallback(() => {
    const current = activeIndexRef.current;
    const next    = (current + 1) % reviews.length;

    if (crossfadeRef.current) clearTimeout(crossfadeRef.current);

    setFadingOutIndex(current);
    setActiveIndex(next);
    activeIndexRef.current = next;

    crossfadeRef.current = setTimeout(() => {
      setFadingOutIndex(null);
      crossfadeRef.current = null;
    }, CROSSFADE_MS);
  }, []);

  // Detect mobile breakpoint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lazy-load the background only when the reviews section is near the viewport
  useEffect(() => {
    if (typeof window === "undefined" || shouldLoadBg) return;

    const target = isMobile ? scrollWrapperRef.current : desktopSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBg(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isMobile, shouldLoadBg]);

  // Desktop auto-advance timer (skipped on mobile).
  useEffect(() => {
    if (isMobile) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    timerRef.current = setInterval(advanceReview, INTERVAL_MS);
    const onMotionChange = (e) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!e.matches) timerRef.current = setInterval(advanceReview, INTERVAL_MS);
    };
    mq.addEventListener("change", onMotionChange);

    return () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (crossfadeRef.current) clearTimeout(crossfadeRef.current);
      mq.removeEventListener("change", onMotionChange);
    };
  }, [advanceReview, isMobile]);

  // ── Mobile scroll-progress animation ────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;

    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Disable CSS transitions — we drive opacity entirely via inline styles.
    slideRefs.current.forEach((el) => {
      if (el) el.style.transition = "none";
    });

    if (reducedMotion) {
      slideRefs.current.forEach((el) => {
        if (!el) return;
        el.style.opacity    = "1";
        el.style.visibility = "visible";
      });
      return;
    }

    const update = () => {
      rafRef.current = null;
      const windowH  = window.innerHeight;
      const scrolledIn = Math.max(0, -wrapper.getBoundingClientRect().top);

      let dominantIndex = 0;
      let maxOpacity    = -1;

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const opacity = Math.max(
          0,
          Math.min(1, computeOpacity(scrolledIn, windowH, i))
        );
        el.style.opacity    = String(opacity);
        el.style.visibility = opacity > 0.005 ? "visible" : "hidden";

        // Track which slide is most visible so the dot can follow.
        if (opacity > maxOpacity) {
          maxOpacity    = opacity;
          dominantIndex = i;
        }
      });

      // Only trigger a React state update when the dominant slide changes
      // (avoids re-renders on every scroll frame).
      if (dominantIndex !== mobileActiveDotRef.current) {
        mobileActiveDotRef.current = dominantIndex;
        setMobileActiveDot(dominantIndex);
      }
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    update(); // sync immediately on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  // ── Render: mobile ───────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="reviews"
        aria-label="Endorsements"
        aria-roledescription="carousel"
        className={styles.mobileScrollSection}
        ref={scrollWrapperRef}
      >
        <div className={styles.mobileSticky} ref={mobileStickyRef}>
          {shouldLoadBg && <ReviewsBackground containerRef={mobileStickyRef} />}
          <div className={styles.stage} aria-live="off">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                quote={EXCERPTS[review.id] || review.quote}
                reviewerName={review.reviewerName}
                company={review.company}
                isActive={index === 0}
                isFadingOut={false}
                index={index}
                total={reviews.length}
                slideRef={(el) => { slideRefs.current[index] = el; }}
                alwaysVisible
              />
            ))}
          </div>
          <Dots total={reviews.length} activeIndex={mobileActiveDot} />
        </div>
      </section>
    );
  }

  // ── Render: desktop ──────────────────────────────────────────────────────
  return (
    <section
      id="reviews"
      className={styles.reviewsSection}
      aria-label="Endorsements"
      aria-roledescription="carousel"
      ref={desktopSectionRef}
    >
      {shouldLoadBg && <ReviewsBackground containerRef={desktopSectionRef} />}
      <div className={styles.container}>
        <div className={styles.stage} aria-live="polite" aria-atomic="true">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              quote={EXCERPTS[review.id] || review.quote}
              reviewerName={review.reviewerName}
              company={review.company}
              isActive={index === activeIndex}
              isFadingOut={index === fadingOutIndex}
              index={index}
              total={reviews.length}
            />
          ))}
        </div>
        <Dots total={reviews.length} activeIndex={activeIndex} />
      </div>
    </section>
  );
}
