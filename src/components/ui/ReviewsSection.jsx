import styles from "./ReviewsSection.module.css";

export default function ReviewsSection() {
  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            <span className={styles.titleText}>They said it,</span>
            <span className={styles.titleMuted}>not me</span>
          </h2>
          <div className={styles.navigation}>
            <button className={styles.navButton} aria-label="Previous review">
              ←
            </button>
            <button className={styles.navButton} aria-label="Next review">
              →
            </button>
          </div>
        </div>
        <div className={styles.placeholderContent}>
          Reviews coming soon
        </div>
      </div>
    </section>
  );
}
