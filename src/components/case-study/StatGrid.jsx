import styles from "./StatGrid.module.css";

export default function StatGrid({ items = [] }) {
  if (!items || items.length === 0) return null;

  const remainder = items.length % 3;
  const mainCount = items.length - remainder;
  const mainItems = items.slice(0, mainCount);
  const lastRowItems = items.slice(mainCount);

  return (
    <div className={styles.container}>
      {mainItems.length > 0 && (
        <div className={styles.grid}>
          {mainItems.map((item, idx) => (
            <div key={idx} className={styles.gridCell}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      {lastRowItems.length > 0 && (
        <div className={styles.flexRow}>
          {lastRowItems.map((item, idx) => (
            <div key={idx} className={styles.flexCell}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
