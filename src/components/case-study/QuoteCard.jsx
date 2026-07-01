import styles from "./QuoteCard.module.css";

export default function QuoteCard({ quote, author, role }) {
  return (
    <div className={styles.card}>
      <img src="/images/assets/icons/quote-1.svg" className={styles.quoteIcon} alt="" />
      <blockquote className={styles.blockquote}>
        <p className={styles.quoteText}>{quote}</p>
      </blockquote>
      {(author || role) && (
        <div className={styles.meta}>
          {author && <span className={styles.author}>{author}</span>}
          {role && <span className={styles.role}>{role}</span>}
        </div>
      )}
    </div>
  );
}