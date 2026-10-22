import styles from "./ReviewCard.module.css";

export default function ReviewCard({
  quote,
  reviewerName,
  company,
  isActive,
  isFadingOut,
  index,
  total,
  slideRef,      // optional callback ref — mobile branch writes opacity directly to the DOM node
  alwaysVisible, // optional — if true, never set aria-hidden so screen readers get all reviews
}) {
  const stateClass = isFadingOut
    ? styles.fadingOut
    : isActive
    ? styles.active
    : styles.inactive;

  return (
    <article
      ref={slideRef}
      className={`${styles.slide} ${stateClass}`}
      aria-hidden={alwaysVisible ? false : !isActive}
      tabIndex={isActive || alwaysVisible ? 0 : -1}
      aria-roledescription="slide"
      aria-label={`Review ${index + 1} of ${total} by ${reviewerName}`}
    >
      <blockquote className={styles.quoteCol}>
        <p className={styles.quoteText}>
          "{quote}"
        </p>
      </blockquote>

      <footer className={styles.attribution}>
        <cite className={styles.reviewerName}>{reviewerName}</cite>
        <span className={styles.company}>{company}</span>
      </footer>
    </article>
  );
}
