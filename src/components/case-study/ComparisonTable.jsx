import styles from "./ComparisonTable.module.css";

export default function ComparisonTable({ headers = [], rows = [] }) {
  if (!headers || headers.length === 0) return null;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {headers.slice(0, 3).map((header, idx) => (
              <th key={idx} className={styles.th}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={styles.bodyRow}>
              <td className={`${styles.td} ${styles.labelCell}`}>
                {row.label}
              </td>
              <td className={styles.td}>
                {row.a}
              </td>
              <td className={styles.td}>
                {row.b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
