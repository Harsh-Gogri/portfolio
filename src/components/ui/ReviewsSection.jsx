"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ReviewsSection.module.css";
import ReviewCard from "./ReviewCard";
import { reviews } from "@/data/reviews";

const EXCERPTS = {
  "1": (
    <>
      What sets Harsh apart is his <b>reliability</b> and <b>professionalism</b> - he always shows up on time, and requires minimal guidance.
    </>
  ),
  "2": (
    <>
      Clear in communication, <b>thoughtful</b> in approach, and always brings a clean, <b>functional</b> design sense to the table.
    </>
  ),
  "3": (
    <>
      His <b>creativity</b>, commitment to continuous improvement and ability to <b>adapt</b> to changing requirements sets him apart
    </>
  )
};

const INTERVAL_MS = 7000;
const FADE_OUT_DURATION_MS = 350;

// Each review occupies SEGMENT_MULTIPLIER × windowH of scroll distance.
// FADE_FRACTION of that is fade-in, FADE_FRACTION is fade-out, the rest is hold.
const SEGMENT_MULTIPLIER = 1.5;
const FADE_FRACTION = 0.2;

/**
 * Compute the opacity [0,1] of review i given how far (px) the user has
 * scrolled into the pinned section (scrolledIn) and the current window height.
 */
function computeOpacity(scrolledIn, windowH, i) {
  const segmentH  = windowH * SEGMENT_MULTIPLIER;
  const fadeZone  = segmentH * FADE_FRACTION;
  const segStart  = i * segmentH;
  const segEnd    = (i + 1) * segmentH;
  const fadeInEnd = segStart + fadeZone;
  const holdEnd   = segEnd   - fadeZone;
  const isLast    = i === reviews.length - 1;

  // First review is fully visible from the moment the section pins.
  if (i === 0 && scrolledIn <= fadeInEnd) return 1;

  if (scrolledIn <= segStart)  return 0;
  if (scrolledIn <= fadeInEnd) return (scrolledIn - segStart) / fadeZone;
  if (scrolledIn <= holdEnd)   return 1;
  if (scrolledIn <= segEnd)    return isLast ? 1 : 1 - (scrolledIn - holdEnd) / fadeZone;
  return isLast ? 1 : 0;
}

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);

  const timerRef       = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const slideRefs      = useRef(reviews.map(() => null)); // DOM refs for mobile slides
  const rafRef         = useRef(null);
  const wrapperTopRef  = useRef(null); // cached absolute position, invalidated on resize

  // ── Desktop auto-advance ────────────────────────────────────────────────
  const advanceReview = useCallback(() => {
    setIsFadingOut(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
      setIsFadingOut(false);
    }, FADE_OUT_DURATION_MS);
  }, []);

  // Detect mobile breakpoint (mirrors the CSS breakpoint).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Desktop timer (skip on mobile).
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
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      mq.removeEventListener("change", onMotionChange);
    };
  }, [advanceReview, isMobile]);

  // ── Mobile scroll-progress animation ──────────────────────────────────────
  //
  // Opacity for each slide is a pure function of scroll position, evaluated
  // every animation frame. There are no timeouts, no discrete state jumps,
  // and no way for the animation to fall out of sync with the scroll position.
  //
  // Fast flick: the browser fires a scroll event, we schedule a rAF, the rAF
  // reads the current (already-settled) scrollY and writes the exact correct
  // opacity. The hold zone (60% of each review's scroll distance) guarantees
  // every review reaches opacity 1 even if the user never pauses.
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;

    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Remove CSS transitions from all slides — we own opacity from here on.
    slideRefs.current.forEach((el) => {
      if (el) el.style.transition = "none";
    });

    if (reducedMotion) {
      // No animation: show all reviews simultaneously so screen reader users
      // and users who prefer reduced motion get uninterrupted access.
      slideRefs.current.forEach((el) => {
        if (!el) return;
        el.style.opacity    = "1";
        el.style.visibility = "visible";
      });
      return;
    }

    const update = () => {
      rafRef.current = null;
      const scrollY  = window.scrollY;
      const windowH  = window.innerHeight;

      // Recompute wrapper position lazily; invalidated by onResize below.
      if (wrapperTopRef.current === null) {
        wrapperTopRef.current =
          wrapper.getBoundingClientRect().top + scrollY;
      }

      const scrolledIn = Math.max(0, scrollY - wrapperTopRef.current);

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const opacity = Math.max(
          0,
          Math.min(1, computeOpacity(scrolledIn, windowH, i))
        );
        el.style.opacity    = String(opacity);
        el.style.visibility = opacity > 0.005 ? "visible" : "hidden";
      });
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    // Toolbar show/hide on mobile fires resize; invalidate cached position.
    const onResize = () => {
      wrapperTopRef.current = null;
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Sync immediately so the first frame is correct.
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="reviews"
        aria-label="Endorsements"
        aria-roledescription="carousel"
        className={styles.mobileScrollSection}
        ref={scrollWrapperRef}
      >
        {/* Sticky viewport — holds one review at a time visually */}
        <div className={styles.mobileSticky}>
          {/*
            aria-live="off": we don't want screen readers interrupted by
            the visual scroll animation. All 3 slides are always in the DOM
            with aria-hidden=false so screen reader users can read them all.
          */}
          <div className={styles.stage} aria-live="off">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                quote={EXCERPTS[review.id] || review.quote}
                reviewerName={review.reviewerName}
                company={review.company}
                isActive={index === 0}   // initial CSS state; JS takes over immediately
                isFadingOut={false}
                index={index}
                total={reviews.length}
                slideRef={(el) => { slideRefs.current[index] = el; }}
                alwaysVisible             // never set aria-hidden on mobile
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <section
      id="reviews"
      className={styles.reviewsSection}
      aria-label="Endorsements"
      aria-roledescription="carousel"
    >
      <div className={styles.container}>
        <div className={styles.stage} aria-live="polite" aria-atomic="true">
          {reviews.map((review, index) => {
            const isActive = index === activeIndex;
            return (
              <ReviewCard
                key={review.id}
                quote={EXCERPTS[review.id] || review.quote}
                reviewerName={review.reviewerName}
                company={review.company}
                isActive={isActive}
                isFadingOut={isActive && isFadingOut}
                index={index}
                total={reviews.length}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
