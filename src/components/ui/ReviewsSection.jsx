"use client";

import { useRef } from "react";
import styles from "./ReviewsSection.module.css";
import ReviewCard from "./ReviewCard";
import { reviews } from "@/data/reviews";

const ArrowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.8926 33.5758C21.8926 29.1349 24.3784 25.1426 28.2366 22.1818H2.30291C1.09793 22.1818 0.121094 21.205 0.121094 20C0.121094 18.795 1.09793 17.8182 2.30291 17.8182H28.2366C24.3784 14.8574 21.8926 10.8651 21.8926 6.42425C21.8926 5.21926 22.8695 4.24243 24.0745 4.24243C25.2794 4.24244 26.2563 5.21927 26.2563 6.42425C26.2563 10.8722 30.6454 15.8518 38.2616 17.8925C39.2154 18.1481 39.8787 19.0125 39.8787 20C39.8787 20.9875 39.2154 21.8519 38.2616 22.1075C30.6454 24.1482 26.2563 29.1278 26.2563 33.5758C26.2563 34.7807 25.2794 35.7576 24.0745 35.7576C22.8695 35.7576 21.8926 34.7808 21.8926 33.5758Z" fill="currentColor"/>
  </svg>
);

export default function ReviewsSection() {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      // Approximate card width + gap for a single card scroll
      // A more robust approach might query the card's actual width, but this works well for simple scrolling
      const scrollAmount = carouselRef.current.firstChild ? carouselRef.current.firstChild.offsetWidth + 12 : 300;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.firstChild ? carouselRef.current.firstChild.offsetWidth + 12 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            <span className={styles.titleText}>They said it,</span>
            <span className={styles.titleMuted}>not me</span>
          </h2>
          <div className={styles.navigation}>
            <button className={styles.navButton} aria-label="Previous review" onClick={scrollLeft}>
              <ArrowIcon className={`${styles.arrowIcon} ${styles.leftArrow}`} />
            </button>
            <button className={styles.navButton} aria-label="Next review" onClick={scrollRight}>
              <ArrowIcon className={styles.arrowIcon} />
            </button>
          </div>
        </div>
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel} ref={carouselRef}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
