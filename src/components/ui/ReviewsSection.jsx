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

  const timerRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  const advanceReview = useCallback(() => {
    setIsFadingOut(true);

    fadeTimeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
      setIsFadingOut(false);
    }, FADE_OUT_DURATION_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    timerRef.current = setInterval(() => {
      advanceReview();
    }, INTERVAL_MS);

    const handleMotionChange = (e) => {
      if (e.matches) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(advanceReview, INTERVAL_MS);
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [advanceReview]);

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
