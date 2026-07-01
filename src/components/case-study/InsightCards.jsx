import styles from "./InsightCards.module.css";

const Asterisk = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function InsightCards({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.grid}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.card}>
          <Asterisk />
          <div className={styles.body}>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}