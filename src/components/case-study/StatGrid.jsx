import styles from "./StatGrid.module.css";

export default function StatGrid({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.grid}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.card}>
          <span className={styles.value}>{item.value}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}