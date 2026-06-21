import styles from "./QuadrantGrid.module.css";

export default function QuadrantGrid({ items = [] }) {
  if (!items || items.length !== 4) return null;

  const positionClasses = [
    styles.topLeft,
    styles.topRight,
    styles.bottomLeft,
    styles.bottomRight,
  ];

  return (
    <div className={styles.grid}>
      {items.map((item, idx) => (
        <div key={idx} className={`${styles.cell} ${positionClasses[idx]}`}>
          <h4 className={styles.title}>{item.title}</h4>
          {typeof item.content === "string" ? (
            <p className={styles.content}>{item.content}</p>
          ) : (
            <div className={styles.content}>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
