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

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Mobile scroll-driven state
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollFadingOut, setScrollFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const prevScrollIndexRef = useRef(0);
  const scrollFadeRef = useRef(null);

  // ── Desktop auto-advance ──────────────────────────────────────────────────
  const advanceReview = useCallback(() => {
    setIsFadingOut(true);

    fadeTimeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
      setIsFadingOut(false);
    }, FADE_OUT_DURATION_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);

    const onMQChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onMQChange);

    return () => mq.removeEventListener("change", onMQChange);
  }, []);

  useEffect(() => {
    if (isMobile) return; // mobile uses scroll; skip timer

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    timerRef.current = setInterval(advanceReview, INTERVAL_MS);

    const handleMotionChange = (e) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!e.matches) {
        timerRef.current = setInterval(advanceReview, INTERVAL_MS);
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [advanceReview, isMobile]);

  // ── Mobile scroll-driven logic ────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;

    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperTop = rect.top + window.scrollY;
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      // How far the user has scrolled into the wrapper beyond the pin point
      const scrolledIn = Math.max(0, scrollY - wrapperTop);

      // Each "page" of scroll corresponds to one review transition
      // The wrapper is 4 × windowH tall: 1 panel for pin entry + 3 panels for reviews
      const panel = windowH;
      const rawIndex = Math.min(
        reviews.length - 1,
        Math.floor(scrolledIn / panel)
      );

      if (rawIndex !== prevScrollIndexRef.current) {
        if (reducedMotion) {
          setScrollIndex(rawIndex);
          prevScrollIndexRef.current = rawIndex;
        } else {
          setScrollFadingOut(true);
          if (scrollFadeRef.current) clearTimeout(scrollFadeRef.current);
          scrollFadeRef.current = setTimeout(() => {
            setScrollIndex(rawIndex);
            prevScrollIndexRef.current = rawIndex;
            setScrollFadingOut(false);
          }, FADE_OUT_DURATION_MS);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollFadeRef.current) clearTimeout(scrollFadeRef.current);
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
        {/* Sticky panel — occupies full dvh, holds one review at a time */}
        <div className={styles.mobileSticky}>
          <div
            className={styles.stage}
            aria-live="polite"
            aria-atomic="true"
          >
            {reviews.map((review, index) => {
              const isActive = index === scrollIndex;
              return (
                <ReviewCard
                  key={review.id}
                  quote={EXCERPTS[review.id] || review.quote}
                  reviewerName={review.reviewerName}
                  company={review.company}
                  isActive={isActive}
                  isFadingOut={isActive && scrollFadingOut}
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

  // Desktop
  return (
    <section
      id="reviews"
      className={styles.reviewsSection}
      aria-label="Endorsements"
      aria-roledescription="carousel"
    >
      <div className={styles.container}>
        <div
          className={styles.stage}
          aria-live="polite"
          aria-atomic="true"
        >
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
